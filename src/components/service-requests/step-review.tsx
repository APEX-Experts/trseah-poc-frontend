"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  useRequestsControllerCreateRequest,
  getRequestsControllerListRequestsQueryKey,
} from "@/lib/api/react-query/service-requests/service-requests";
import { useServiceRequestStore } from "@/store/useServiceRequestStore";
import { ArrowLeft, ArrowRight, Building2, FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ServiceRequestFooter } from "./service-request-footer";

export function StepReview() {
  const t = useTranslations("ServiceRequests");
  const tOnboarding = useTranslations("Onboarding");
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    prevStep,
    editedOrganizationInfo,
    selectedTender,
    rfpSourceType,
    rfpExternalDescription,
    rfpFile,
    additionalFiles,
    clearStore,
  } = useServiceRequestStore();

  const { mutateAsync: createRequest, isPending: isSubmitting } =
    useRequestsControllerCreateRequest();

  const handleSubmit = async () => {
    try {
      // Build DTO
      const data = {
        rfpSourceType: rfpSourceType,
        tenderId: rfpSourceType === "platform" ? selectedTender?.id : undefined,
        rfpExternalDescription:
          rfpSourceType === "external" ? rfpExternalDescription || undefined : undefined,
        file: rfpSourceType === "external" && rfpFile ? (rfpFile as unknown as Blob) : undefined,
        files: additionalFiles.length > 0 ? (additionalFiles as unknown as Blob[]) : undefined,
      };

      await createRequest(
        { data },
        {
          onSuccess: () => {
            toast.success(tOnboarding("Status.created"));
            clearStore();
            queryClient.invalidateQueries({
              queryKey: getRequestsControllerListRequestsQueryKey(),
            });
            router.push("/requests");
          },
          onError: () => {
            toast.error(tOnboarding("Status.submitFailed"));
          },
        },
      );
    } catch (e) {
      console.error(e);
      toast.error(tOnboarding("Status.submitFailed"));
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up-and-fade pb-24 space-y-8">
      <div className="text-center mb-8">
        <h1 className="h2 text-primary-900 mb-2">{t("reviewTitle")}</h1>
        <p className="p-md text-neutral-500">{t("reviewDesc")}</p>
      </div>

      {/* Step 1 Review: Organization details */}
      <div className="bg-white p-6 rounded-2xl border border-border card-shadow space-y-4">
        <div className="flex items-center gap-3 border-b pb-3">
          <Building2 className="w-5 h-5 text-primary-800" />
          <h3 className="font-bold text-primary-900 text-base">{t("orgSummary")}</h3>
        </div>

        {editedOrganizationInfo ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-400 block">{tOnboarding("Company.nameAr")}</span>
              <span className="font-semibold text-primary-900">
                {editedOrganizationInfo.nameAr}
              </span>
            </div>
            {editedOrganizationInfo.nameEn && (
              <div>
                <span className="text-neutral-400 block">{tOnboarding("Company.nameEn")}</span>
                <span className="font-semibold text-primary-900">
                  {editedOrganizationInfo.nameEn}
                </span>
              </div>
            )}
            <div>
              <span className="text-neutral-400 block">{tOnboarding("Company.crNumber")}</span>
              <span className="font-semibold text-primary-900">
                {editedOrganizationInfo.crNumber || "-"}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block">{tOnboarding("Company.crExpiry")}</span>
              <span className="font-semibold text-primary-900">
                {editedOrganizationInfo.crExpiry || "-"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            {locale === "ar"
              ? "تفاصيل المنشأة الحالية سيتم إرسالها كما هي."
              : "Current organization profile details will be submitted."}
          </p>
        )}
      </div>

      {/* Step 2 Review: Tender Details */}
      <div className="bg-white p-6 rounded-2xl border border-border card-shadow space-y-4">
        <div className="flex items-center gap-3 border-b pb-3">
          <FileText className="w-5 h-5 text-primary-800" />
          <h3 className="font-bold text-primary-900 text-base">
            {rfpSourceType === "platform" ? t("selectedTenderSummary") : t("externalTenderSummary")}
          </h3>
        </div>

        {rfpSourceType === "platform" && selectedTender ? (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-neutral-400">
              {selectedTender.externalId || selectedTender.referenceNumber}
            </span>
            <h4 className="font-bold text-primary-900 text-lg leading-snug">
              {locale === "en" && selectedTender.titleEn
                ? selectedTender.titleEn
                : selectedTender.titleAr}
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-500 pt-1">
              <div>
                <span className="font-medium">
                  {locale === "ar" ? "الجهة الحكومية: " : "Government Entity: "}
                </span>
                <span className="font-bold text-primary-900">
                  {locale === "en" && selectedTender.entityNameEn
                    ? selectedTender.entityNameEn
                    : selectedTender.entityNameAr}
                </span>
              </div>
            </div>
          </div>
        ) : rfpSourceType === "external" ? (
          <div className="space-y-4">
            {rfpExternalDescription && (
              <div>
                <span className="text-neutral-400 text-sm block">
                  {t("externalDescriptionLabel")}
                </span>
                <p className="text-primary-900 text-sm whitespace-pre-wrap mt-1">
                  {rfpExternalDescription}
                </p>
              </div>
            )}

            {rfpFile && (
              <div>
                <span className="text-neutral-400 text-sm block">{t("rfpDocumentLabel")}</span>
                <div className="flex items-center gap-2 mt-1.5 p-2 bg-neutral-50 rounded-lg border text-sm max-w-md">
                  <FileText className="w-4 h-4 text-primary-800 shrink-0" />
                  <span className="font-semibold text-primary-900 truncate">{rfpFile.name}</span>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Additional Files Review */}
        {additionalFiles.length > 0 && (
          <div className="pt-2 border-t">
            <span className="text-neutral-400 text-sm block mb-2">{t("additionalFilesLabel")}</span>
            <div className="flex flex-wrap gap-2">
              {additionalFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 border rounded-lg text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="font-medium text-neutral-700 truncate max-w-[180px]">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ServiceRequestFooter>
        <Button
          variant="outline"
          onClick={prevStep}
          className="border-neutral-300 text-neutral-600 gap-2"
        >
          {tOnboarding("Actions.back")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8 gap-2"
        >
          <span>{isSubmitting ? tOnboarding("Actions.submitting") : t("createNew")}</span>
          {locale === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </Button>
      </ServiceRequestFooter>
    </div>
  );
}

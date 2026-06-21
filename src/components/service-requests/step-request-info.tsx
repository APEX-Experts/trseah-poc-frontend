"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ServiceRequestFooter } from "./service-request-footer";
import { GenericForm } from "@/components/landing/layout/generic-form";
import { useServiceRequestStore } from "@/store/useServiceRequestStore";
import { createCompanySchema, CompanyInfoType } from "@/lib/schemas";
import {
  useOrganizationsControllerGetMe,
  useOrganizationsControllerUpdateMe,
} from "@/lib/api/react-query/organizations/organizations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function StepRequestInfo() {
  const t = useTranslations("ServiceRequests");
  const tOnboarding = useTranslations("Onboarding");

  const { nextStep, editedOrganizationInfo, setEditedOrganizationInfo } = useServiceRequestStore();
  const { data: org, isLoading, error } = useOrganizationsControllerGetMe();
  const { mutateAsync: updateOrganization, isPending: isUpdating } =
    useOrganizationsControllerUpdateMe();

  const companySchema = createCompanySchema(tOnboarding);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-800" />
        <span className="text-sm font-semibold text-neutral-500">
          {tOnboarding("Status.loading")}
        </span>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-2">
        <span className="text-lg font-bold text-destructive">{t("errors.loadFailed")}</span>
      </div>
    );
  }

  // Pre-fill mapping:
  const mappedOrg: CompanyInfoType = {
    nameAr: org.nameAr || "",
    nameEn: org.nameEn || "",
    crNumber: org.crNumber || "",
    crExpiry: org.crExpiry ? org.crExpiry.split("T")[0] : "",
    localContentScore: org.localContentScore ? parseFloat(org.localContentScore) : undefined,
    sector: org.sector || "",
    size: org.size as "micro" | "small" | "medium" | "large" | undefined,
  };

  const defaultValues: CompanyInfoType = {
    nameAr: editedOrganizationInfo?.nameAr || mappedOrg.nameAr,
    nameEn: editedOrganizationInfo?.nameEn ?? mappedOrg.nameEn,
    crNumber: editedOrganizationInfo?.crNumber ?? mappedOrg.crNumber,
    crExpiry: editedOrganizationInfo?.crExpiry ?? mappedOrg.crExpiry,
    localContentScore:
      editedOrganizationInfo?.localContentScore !== undefined
        ? editedOrganizationInfo.localContentScore
        : mappedOrg.localContentScore,
    sector: editedOrganizationInfo?.sector ?? mappedOrg.sector,
    size: editedOrganizationInfo?.size ?? mappedOrg.size,
  };

  const handleSubmit = async (values: CompanyInfoType) => {
    // Compare form values with the API values to see if there are edits
    const hasChanges = Object.keys(values).some((key) => {
      const k = key as keyof CompanyInfoType;
      const formVal = values[k];
      const apiVal = mappedOrg[k];

      if (formVal === undefined && apiVal === undefined) return false;
      if (!formVal && !apiVal) return false;
      return String(formVal) !== String(apiVal);
    });

    if (hasChanges) {
      try {
        await updateOrganization({
          data: {
            nameAr: values.nameAr,
            nameEn: values.nameEn || undefined,
            crNumber: values.crNumber || undefined,
            crExpiry: values.crExpiry || undefined,
            localContentScore: values.localContentScore,
            sector: values.sector || undefined,
            size: values.size || undefined,
          },
        });
        toast.success(t("success.patched"));
      } catch (e) {
        console.error(e);
        toast.error(t("errors.patchFailed"));
        return; // Don't proceed to next step if update fails
      }
    }

    setEditedOrganizationInfo(values);
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up-and-fade pb-24">
      <div className="text-center mb-10">
        <h1 className="h2 text-primary-900 mb-2">{t("organizationDataTitle")}</h1>
        <p className="p-md text-neutral-500">{t("organizationDataDesc")}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-border card-shadow">
        <GenericForm<CompanyInfoType>
          title=""
          schema={companySchema}
          defaultValues={defaultValues}
          submitText={tOnboarding("Actions.continue")}
          hideReset
          hideSubmit
          formId="company-request-info-form"
          fields={[
            {
              name: "nameAr",
              label: tOnboarding("Company.nameAr"),
              type: "text",
            },
            {
              name: "nameEn",
              label: tOnboarding("Company.nameEn"),
              type: "text",
            },
            {
              name: "crNumber",
              label: tOnboarding("Company.crNumber"),
              type: "text",
            },
            {
              name: "crExpiry",
              label: tOnboarding("Company.crExpiry"),
              type: "date",
            },
            {
              name: "localContentScore",
              label: tOnboarding("Company.localContentScore"),
              type: "number",
              max: 999.99,
              step: 0.01,
            },
            {
              name: "sector",
              label: tOnboarding("Company.sector"),
              type: "text",
            },
            {
              name: "size",
              label: tOnboarding("Company.size"),
              type: "select",
              options: [
                { label: tOnboarding("Company.sizes.micro"), value: "micro" },
                { label: tOnboarding("Company.sizes.small"), value: "small" },
                { label: tOnboarding("Company.sizes.medium"), value: "medium" },
                { label: tOnboarding("Company.sizes.large"), value: "large" },
              ],
            },
          ]}
          onSubmit={handleSubmit}
        />
      </div>

      <ServiceRequestFooter>
        <div /> {/* Spacer to align button to right */}
        <Button
          type="submit"
          form="company-request-info-form"
          disabled={isUpdating}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8"
        >
          {isUpdating ? tOnboarding("Actions.submitting") : tOnboarding("Actions.continue")}
        </Button>
      </ServiceRequestFooter>
    </div>
  );
}

"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  getRequestsControllerGetRequestDetailsQueryKey,
  requestsControllerDownloadInvoicePdf,
  useRequestsControllerGetRequestDetails,
  useRequestsControllerPayRequest,
} from "@/lib/api/react-query/service-requests/service-requests";
import { useTendersControllerGetTenderDetails } from "@/lib/api/react-query/tenders/tenders";
import { ServiceRequestResponseDtoStatus } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RequestStatusPage() {
  const { id } = useParams() as { id: string };
  const locale = useLocale();
  const t = useTranslations("ServiceRequests");
  const queryClient = useQueryClient();

  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch Request Details
  const {
    data: request,
    isLoading: isLoadingRequest,
    error: requestError,
  } = useRequestsControllerGetRequestDetails(id);

  // Fetch Tender Details if platform rfp
  const { data: tender, isLoading: isLoadingTender } = useTendersControllerGetTenderDetails(
    request?.tenderId || "",
    {
      query: {
        enabled: !!request?.tenderId,
      },
    },
  );

  // Simulated Payment Mutation
  const { mutateAsync: payRequest, isPending: isPaying } = useRequestsControllerPayRequest();

  const handlePayNow = async () => {
    try {
      await payRequest({ id });
      toast.success(t("statusPage.paymentSuccess"));
      // Invalidate query to refresh request details and timeline status
      queryClient.invalidateQueries({
        queryKey: getRequestsControllerGetRequestDetailsQueryKey(id),
      });
    } catch (err) {
      console.error(err);
      toast.error(t("statusPage.paymentError"));
    }
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const blob = await requestsControllerDownloadInvoicePdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id.substring(0, 8).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error(t("statusPage.downloadInvoiceError"));
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoadingRequest) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </PageContainer>
    );
  }

  if (requestError || !request) {
    return (
      <PageContainer>
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="w-12 h-12 text-error-foreground mx-auto" />
          <h2 className="text-xl font-bold text-primary-900 font-sans">
            {t("statusPage.notFoundTitle")}
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">{t("statusPage.notFoundDesc")}</p>
          <Button asChild className="bg-primary-800 hover:bg-primary-900 text-white mt-4">
            <Link href="/requests">{t("statusPage.backToList")}</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const isPlatform = request.rfpSourceType === "platform";
  const title = isPlatform
    ? (locale === "en" ? tender?.titleEn : tender?.titleAr) ||
      (isLoadingTender ? t("statusPage.loading") : t("statusPage.tenderNotFound"))
    : t("statusPage.externalTender");

  const entityName = isPlatform
    ? (locale === "en"
        ? tender?.entityNameEn || tender?.governmentEntityEn
        : tender?.entityNameAr || tender?.governmentEntityAr) || ""
    : "";

  const requestCode = `REQ-${new Date(request.createdAt).getFullYear()}-${request.id.substring(0, 8).toUpperCase()}`;

  const getStatusStyles = (status: ServiceRequestResponseDtoStatus) => {
    switch (status) {
      case "pending":
        return "bg-warning-background text-warning-foreground border-warning-foreground/20";
      case "under_review":
        return "bg-info-background text-info-foreground border-info-foreground/20";
      case "approved":
        return "bg-success-background text-success-foreground border-success-foreground/20";
      case "declined":
        return "bg-error-background text-error-foreground border-error-foreground/20";
      case "invoiced":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
      case "paid":
        return "bg-success-background text-success-foreground border-success-foreground/20";
      case "in_progress":
        return "bg-primary-50 text-primary-800 border-primary-800/20";
      case "delivered":
        return "bg-accent-100 text-accent-800 border-accent-200";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  // Status index mapping helper
  const stages: ServiceRequestResponseDtoStatus[] = [
    "pending",
    "under_review",
    "approved",
    "invoiced",
    "paid",
    "in_progress",
    "delivered",
  ];

  const currentStatus = request.status;
  const isDeclined = currentStatus === "declined";

  // Timeline Step Generator
  const timelineSteps = stages.map((stage) => {
    // If the request is declined and we are looking at the "approved" slot, show "declined"
    if (stage === "approved" && isDeclined) {
      return { id: "declined" as ServiceRequestResponseDtoStatus, labelKey: "declined" };
    }
    return { id: stage, labelKey: stage };
  });

  const getStepState = (stepId: ServiceRequestResponseDtoStatus, index: number) => {
    if (isDeclined) {
      if (stepId === "declined") return "active"; // active failed state
      if (index < 2) return "completed";
      return "disabled";
    }

    const currentActiveIndex = stages.indexOf(currentStatus);
    if (index < currentActiveIndex) return "completed";
    if (index === currentActiveIndex) return "active";
    return "upcoming";
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-6 py-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Button
            variant="ghost"
            asChild
            className="text-neutral-500 hover:text-neutral-900 gap-2 hover:bg-transparent border-none hover:border-none hover:ring-none"
          >
            <Link href="/requests">
              {locale === "ar" ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <ArrowLeft className="w-4 h-4" />
              )}
              <span>{t("statusPage.backToList")}</span>
            </Link>
          </Button>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-border p-6 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-neutral-400 font-bold tracking-wider">
                {requestCode}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${getStatusStyles(
                  request.status,
                )}`}
              >
                {t(`statuses.${request.status}`)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-primary-900 leading-tight">{title}</h1>
            {entityName && <p className="text-sm text-neutral-400 font-medium">{entityName}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-end hidden md:block">
              <p className="text-xs text-neutral-400">{t("date")}</p>
              <p className="text-sm font-semibold text-primary-900">
                {new Date(request.createdAt).toLocaleDateString(locale, {
                  dateStyle: "medium",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Proposal Generated Banner (Conditional) */}
        {request.proposalId && (
          <div className="bg-linear-to-r from-primary-800 to-primary-900 text-white rounded-3xl p-6 shadow-md border border-primary-800/10 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-300/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-700/20 rounded-full blur-3xl transform -translate-x-12 translate-y-12" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shrink-0 text-accent-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">{t("statusPage.proposalReady")}</h3>
                <p className="text-xs text-primary-100/80">{t("statusPage.proposalReadyDesc")}</p>
              </div>
            </div>

            <Button
              asChild
              className="bg-accent-300 hover:bg-accent-400 text-primary-900 font-bold px-6 py-5 rounded-xl transition-all shadow-lg shadow-accent-300/15 relative z-10 shrink-0"
            >
              <Link href={`/proposals/${request.proposalId}`}>{t("statusPage.viewProposal")}</Link>
            </Button>
          </div>
        )}

        {/* Invoice and Payment Section (Conditional) */}
        {request.status === "invoiced" && (
          <div className="bg-success-background/10 border border-success-foreground/15 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-background rounded-2xl flex items-center justify-center border border-success-foreground/20 text-success-foreground shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-primary-900">
                  {t("statusPage.invoiceReadyTitle")}
                </h3>
                <p className="text-sm text-neutral-500">{t("statusPage.invoiceReadyDesc")}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="flex-1 md:flex-none border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold gap-2 h-11 px-5"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {t("statusPage.downloadInvoice")}
              </Button>

              <Button
                onClick={handlePayNow}
                disabled={isPaying}
                className="flex-1 md:flex-none bg-primary-800 hover:bg-primary-900 text-white font-bold gap-2 h-11 px-6 shadow-md"
              >
                {isPaying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {t("statusPage.payNow")}
              </Button>
            </div>
          </div>
        )}

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tender Info / Description */}
            <div className="bg-white rounded-3xl border border-border p-6 card-shadow space-y-5">
              <h2 className="text-lg font-bold text-primary-800 border-b border-neutral-100 pb-3 font-sans">
                {t("statusPage.tenderDetails")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">{t("id")}</p>
                  <p className="text-sm font-semibold text-primary-900">
                    {request.tenderId ? request.tenderId.substring(0, 8).toUpperCase() : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">
                    {t("statusPage.rfpSource")}
                  </p>
                  <p className="text-sm font-semibold text-primary-900">
                    {request.rfpSourceType === "platform"
                      ? t("statusPage.platformTender")
                      : t("statusPage.externalUpload")}
                  </p>
                </div>
              </div>

              {/* Extended Tender details if Platform tender is loaded */}
              {isPlatform && tender && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-50">
                  {tender.referenceNumber && (
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-400 font-medium">
                        {t("statusPage.referenceNumber")}
                      </p>
                      <p className="text-sm font-semibold text-primary-900">
                        {tender.referenceNumber}
                      </p>
                    </div>
                  )}
                  {tender.estimatedBudget && (
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-400 font-medium">
                        {t("statusPage.estimatedBudget")}
                      </p>
                      <p className="text-sm font-semibold text-primary-900">
                        {tender.estimatedBudget.toLocaleString()} {t("statusPage.currency")}
                      </p>
                    </div>
                  )}
                  {tender.publishDate && (
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-400 font-medium">
                        {t("statusPage.publishDate")}
                      </p>
                      <p className="text-sm font-semibold text-primary-900">
                        {new Date(tender.publishDate).toLocaleDateString(locale, {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>
                  )}
                  {tender.submissionDeadline && (
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-400 font-medium">
                        {t("statusPage.submissionDeadline")}
                      </p>
                      <p className="text-sm font-semibold text-primary-900">
                        {new Date(tender.submissionDeadline).toLocaleDateString(locale, {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <p className="text-xs text-neutral-400 font-medium">
                  {t("statusPage.descriptionScope")}
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {isPlatform
                    ? tender?.descriptionAr || tender?.descriptionEn
                    : request.rfpExternalDescription}
                </p>
              </div>
            </div>

            {/* Admin decision details (Conditional Notes) */}
            {isDeclined && request.declineReason && (
              <div className="bg-error-background/10 border border-error-foreground/20 rounded-3xl p-6 space-y-3 card-shadow">
                <div className="flex items-center gap-2.5 text-error-foreground font-bold">
                  <XCircle className="w-5 h-5" />
                  <h3>{t("statusPage.declineReason")}</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{request.declineReason}</p>
              </div>
            )}

            {request.adminNotes &&
              (request.status === "approved" || stages.indexOf(request.status) > 2) && (
                <div className="bg-success-background/10 border border-success-foreground/20 rounded-3xl p-6 space-y-3 card-shadow">
                  <div className="flex items-center gap-2.5 text-success-foreground font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3>{t("statusPage.adminNotes")}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{request.adminNotes}</p>
                </div>
              )}

            {/* Uploaded Files Section */}
            <div className="bg-white rounded-3xl border border-border p-6 card-shadow space-y-4">
              <h2 className="text-lg font-bold text-primary-800 border-b border-neutral-100 pb-3 font-sans">
                {t("statusPage.uploadedFiles")}
              </h2>

              <div className="space-y-3">
                {/* Main RFP Booklet */}
                {request.rfpFileUrl && (
                  <div className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100 text-primary-800 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-primary-900 truncate">
                          {t("statusPage.mainRfpDocument")}
                        </p>
                        <p className="text-xs text-neutral-400">PDF / Document</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-primary-800 hover:text-primary-900 rounded-xl"
                    >
                      <a href={request.rfpFileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                )}

                {/* Additional Media Files */}
                {request.mediaUrls && request.mediaUrls.length > 0
                  ? request.mediaUrls.map((url, index) => {
                      const fileName = url.substring(url.lastIndexOf("/") + 1);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-200 text-neutral-600 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-primary-900 truncate">
                                {decodeURIComponent(fileName) ||
                                  t("statusPage.additionalFile", { index: index + 1 })}
                              </p>
                              <p className="text-xs text-neutral-400">Attachment</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="text-primary-800 hover:text-primary-900 rounded-xl"
                          >
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      );
                    })
                  : !request.rfpFileUrl && (
                      <p className="text-sm text-neutral-400 text-center py-4">
                        {t("statusPage.noFilesUploaded")}
                      </p>
                    )}
              </div>
            </div>
          </div>

          {/* Right Column: Status Tracker (Timeline) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-border p-6 card-shadow space-y-6">
              <h2 className="text-lg font-bold text-primary-800 border-b border-neutral-100 pb-3 font-sans">
                {t("statusPage.statusTimeline")}
              </h2>

              <div className="relative pl-1 pr-1 pb-4">
                {/* Connecting Line */}
                <div className="absolute top-4 bottom-4 inset-e-[17px] w-0.5 bg-neutral-100 -z-10" />

                <div className="space-y-8 relative">
                  {timelineSteps.map((step, idx) => {
                    const stepState = getStepState(step.id, idx);
                    const isStepActive = stepState === "active";
                    const isStepCompleted =
                      stepState === "completed" || (isStepActive && step.id === "delivered");
                    const isStepDisabled = stepState === "disabled";

                    // Node Icon & Styles
                    let nodeBg = "bg-neutral-100 text-neutral-400 border-neutral-200";
                    let nodeContent = <span className="text-xs font-semibold">{idx + 1}</span>;

                    if (isStepCompleted) {
                      nodeBg =
                        "bg-success-background text-success-foreground border-success-foreground/20";
                      nodeContent = <Check className="w-3.5 h-3.5 stroke-[3px]" />;
                    } else if (isStepActive) {
                      if (step.id === "declined") {
                        nodeBg =
                          "bg-error-background text-error-foreground border-error-foreground/20";
                        nodeContent = <X className="w-3.5 h-3.5 stroke-[3px]" />;
                      } else {
                        nodeBg =
                          "bg-primary-50 text-primary-800 border-primary-800/30 ring-4 ring-primary-100/50";
                        nodeContent = <Clock className="w-3.5 h-3.5 animate-pulse" />;
                      }
                    } else if (isStepDisabled) {
                      nodeBg = "bg-neutral-50 text-neutral-300 border-neutral-100 opacity-60";
                      nodeContent = <X className="w-3.5 h-3.5" />;
                    }

                    return (
                      <div
                        key={step.id}
                        className={`flex items-start gap-4 transition-all duration-200 ${
                          isStepDisabled ? "opacity-40" : ""
                        }`}
                      >
                        {/* Node icon */}
                        <div
                          className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 z-10 ${nodeBg}`}
                        >
                          {nodeContent}
                        </div>

                        {/* Text labels */}
                        <div className="pt-1.5 space-y-0.5">
                          <h3
                            className={`text-sm font-bold leading-none ${
                              isStepActive
                                ? step.id === "declined"
                                  ? "text-error-foreground"
                                  : "text-primary-900"
                                : isStepCompleted
                                  ? "text-primary-800"
                                  : "text-neutral-400"
                            }`}
                          >
                            {t(`statuses.${step.labelKey}`)}
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {isStepActive && step.id !== "delivered"
                              ? t("statusPage.currentStage")
                              : isStepCompleted
                                ? t("statusPage.completed")
                                : t("statusPage.upcoming")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

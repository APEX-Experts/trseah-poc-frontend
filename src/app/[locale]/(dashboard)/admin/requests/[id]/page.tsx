"use client";

import TenderDetailsTable from "@/components/dashboard/tenders/TenderDetailsTable";
import Forbidden from "@/components/error/forbidden";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserPermissions } from "@/hooks/use-permissions";
import { Link } from "@/i18n/navigation";
import {
  getAdminRequestsControllerGetRequestDetailQueryKey,
  getAdminRequestsControllerListRequestsQueryKey,
  useAdminRequestsControllerGetRequestDetail,
  useAdminRequestsControllerReviewRequest,
} from "@/lib/api/react-query/admin-—-service-requests/admin-—-service-requests";
import { useTendersControllerGetTenderDetails } from "@/lib/api/react-query/tenders/tenders";
import { useOrganizationsControllerGetById } from "@/lib/api/react-query/organizations/organizations";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  XCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/ui/pdf-viewer"), {
  ssr: false,
});

export default function AdminRequestDetailPage() {
  const { id } = useParams() as { id: string };
  const t = useTranslations("AdminRequests");
  const tStatus = useTranslations("ServiceRequests.statuses");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: permissionsLoading } = useUserPermissions();

  // Local State
  const [adminNotes, setAdminNotes] = useState("");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  // Fetch Request Detail
  const {
    data: requestData,
    isLoading: requestLoading,
    error: requestError,
  } = useAdminRequestsControllerGetRequestDetail(id, {
    query: {
      enabled: isAdmin && !!id,
    },
  });

  const request = requestData;

  // Fetch Organization Detail
  const { data: organizationData, isLoading: organizationLoading } =
    useOrganizationsControllerGetById(request?.organizationId || "", {
      query: {
        enabled: isAdmin && !!request?.organizationId,
      },
    });

  // Initialize Admin Notes from DB
  useEffect(() => {
    if (request?.adminNotes) {
      // eslint-disable-next-line react-hooks/immutability
      setNotesState(request.adminNotes);
    }
  }, [request?.adminNotes]);

  // Wrapper function to set both notes state if needed
  const setNotesState = (val: string) => {
    setAdminNotes(val);
  };

  // Fetch Fallback Tender details if needed
  const tenderId = request?.tenderId;
  const showTenderFallback = !request?.rfpFileUrl && !!tenderId;

  const { data: tenderData, isLoading: tenderLoading } = useTendersControllerGetTenderDetails(
    tenderId || "",
    {
      query: {
        enabled: isAdmin && showTenderFallback,
      },
    },
  );

  const tender = tenderData;

  // Mutations
  const reviewMutation = useAdminRequestsControllerReviewRequest({
    mutation: {
      onSuccess: async (res, variables) => {
        const isAccept = variables.data.decision === "accept";
        toast.success(isAccept ? t("successAccept") : t("successDecline"));
        setIsAcceptModalOpen(false);
        setIsDeclineModalOpen(false);
        setInvoiceAmount("");
        setDeclineReason("");

        // Invalidate queries to refresh detail and queue views
        await queryClient.invalidateQueries({
          queryKey: getAdminRequestsControllerListRequestsQueryKey(),
        });

        await queryClient.invalidateQueries({
          queryKey: getAdminRequestsControllerGetRequestDetailQueryKey(id),
        });
      },
      onError: () => {
        toast.error(t("errorAction"));
      },
    },
  });

  if (permissionsLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-300 border-t-primary-800" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Forbidden />;
  }

  if (requestLoading || (!!request?.organizationId && organizationLoading)) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-800" />
        <p className="text-sm font-semibold text-neutral-500">
          {locale === "ar" ? "جاري تحميل تفاصيل الطلب..." : "Loading request details..."}
        </p>
      </div>
    );
  }

  if (requestError || !request) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto mt-12">
        <h3 className="text-base font-bold text-red-800">
          {locale === "ar" ? "تعذر تحميل الطلب" : "Request Not Found"}
        </h3>
        <p className="text-xs text-red-600 mt-2">
          {locale === "ar"
            ? "لم يتم العثور على طلب الخدمة هذا أو تم إزالته."
            : "The service request could not be found or has been removed."}
        </p>
        <Link href="/admin/requests" className="mt-4 inline-block">
          <Button variant="outline" size="sm" className="cursor-pointer">
            {t("backToList")}
          </Button>
        </Link>
      </div>
    );
  }

  const company = organizationData;
  const companyName = locale === "ar" ? company?.nameAr : company?.nameEn || company?.nameAr;

  // Status Badge Styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "under_review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "invoiced":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "paid":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "in_progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "declined":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  const isPendingOrUnderReview = request.status === "pending" || request.status === "under_review";

  // Handle Accept Submit
  const handleAcceptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceAmount || isNaN(Number(invoiceAmount)) || Number(invoiceAmount) <= 0) {
      toast.error(
        locale === "ar" ? "يرجى إدخال مبلغ صحيح للفاتورة" : "Please enter a valid invoice amount",
      );
      return;
    }

    const halalas = Math.round(Number(invoiceAmount) * 100);

    reviewMutation.mutate({
      id: request.id,
      data: {
        decision: "accept",
        notes: adminNotes,
        invoiceAmount: halalas,
      },
    });
  };

  // Handle Decline Submit
  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineReason.trim()) {
      toast.error(locale === "ar" ? "يرجى تحديد سبب الرفض" : "Please provide a decline reason");
      return;
    }

    reviewMutation.mutate({
      id: request.id,
      data: {
        decision: "decline",
        notes: adminNotes,
        declineReason: declineReason,
      },
    });
  };

  return (
    <div className="space-y-6 p-1 pb-16 relative">
      {/* Top Header/Breadcrumb */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/requests">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-lg border-neutral-200 hover:bg-neutral-50 text-neutral-600 cursor-pointer shadow-xs"
            >
              {locale === "ar" ? (
                <ArrowRight className="h-4 w-4 me-1.5" />
              ) : (
                <ArrowLeft className="h-4 w-4 me-1.5" />
              )}
              <span>{t("backToList")}</span>
            </Button>
          </Link>
          <div className="h-5 w-px bg-neutral-200" />
          <h1 className="h3 text-primary-900 font-bold max-w-[200px] sm:max-w-none truncate">
            {companyName}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
              request.status,
            )}`}
          >
            {tStatus(request.status)}
          </span>
        </div>
      </div>

      {/* Main Grid Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Left Side: RFP PDF Embed OR Tender Details Fallback Table */}
        <div className="lg:col-span-7 space-y-6">
          {request.rfpFileUrl ? (
            <div className="bg-white rounded-2xl border border-border overflow-hidden card-shadow">
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-800" />
                  <h3 className="text-sm font-bold text-primary-900">{t("pdfViewer")}</h3>
                </div>
                <a
                  href={request.rfpFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-800 hover:underline font-bold"
                >
                  <span>{locale === "ar" ? "فتح في علامة تبويب جديدة" : "Open in new tab"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="p-1 bg-neutral-50">
                <PdfViewer url={request.rfpFileUrl} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200/50 text-amber-800 rounded-xl p-4 text-xs font-medium">
                {t("noPdfAvailable")}
              </div>
              {showTenderFallback && (
                <>
                  {tenderLoading ? (
                    <div className="flex h-48 flex-col items-center justify-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-800" />
                      <span className="text-xs text-neutral-500">
                        {locale === "ar"
                          ? "جاري تحميل تفاصيل المنافسة..."
                          : "Loading tender details..."}
                      </span>
                    </div>
                  ) : tender ? (
                    <TenderDetailsTable tender={tender} />
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Company Summary Profile */}
        <div className="lg:col-span-5 space-y-6 sticky top-20 self-start">
          <div className="bg-white rounded-2xl border border-border p-6 card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <Building2 className="h-5 w-5 text-primary-800" />
              <h3 className="text-base font-bold text-primary-900">{t("companyProfile")}</h3>
            </div>

            {/* Company Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-neutral-400 block">{t("sector")}</span>
                <span className="font-bold text-primary-900 capitalize">
                  {company?.sector || "-"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 block">{t("cr")}</span>
                <span className="font-bold text-primary-900">{company?.crNumber || "-"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 block">{t("employeeCount")}</span>
                <span className="font-bold text-primary-900 capitalize">
                  {company?.size ? t(`sizes.${company.size}`, { defaultValue: company.size }) : "-"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-neutral-400 block">{t("pastProjects")}</span>
                <span className="font-bold text-primary-900">
                  {request.pastProjects?.length || 0}
                </span>
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-primary-800 border-b border-neutral-100 pb-2">
                {t("documents")}
              </h4>
              {request.documents && request.documents.length > 0 ? (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {request.documents.map((doc) => {
                    const docName = locale === "ar" ? doc.nameAr : doc.nameEn || doc.nameAr;
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs transition-colors hover:bg-neutral-100/50"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-neutral-400 shrink-0" />
                          <span className="font-bold text-primary-900 truncate" title={docName}>
                            {docName}
                          </span>
                        </div>
                        <a
                          href={doc.fileUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-800 hover:text-primary-900 p-1 hover:bg-white rounded-lg transition-colors shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">{t("noDocuments")}</p>
              )}
            </div>

            {/* Past Projects List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-primary-800 border-b border-neutral-100 pb-2">
                {t("pastProjects")}
              </h4>
              {request.pastProjects && request.pastProjects.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {request.pastProjects.map((project) => {
                    const prName =
                      locale === "ar" ? project.titleAr : project.titleEn || project.titleAr;
                    const client =
                      locale === "ar"
                        ? project.clientNameAr
                        : project.clientNameEn || project.clientNameAr;
                    return (
                      <div
                        key={project.id}
                        className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-bold text-primary-900 line-clamp-1">{prName}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                            {project.value
                              ? `${Number(project.value).toLocaleString()} ${locale === "ar" ? "ريال" : "SAR"}`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="line-clamp-1">
                            {locale === "ar" ? `العميل: ${client}` : `Client: ${client}`}
                          </span>
                          <span className="shrink-0">
                            {project.startDate ? new Date(project.startDate).getFullYear() : "-"} -{" "}
                            {project.endDate
                              ? new Date(project.endDate).getFullYear()
                              : locale === "ar"
                                ? "الحاضر"
                                : "Present"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">{t("noProjects")}</p>
              )}
            </div>

            {/* Team Members List */}
            {request.teamMembers && request.teamMembers.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-primary-800 border-b border-neutral-100 pb-2">
                  {locale === "ar" ? "أعضاء الفريق" : "Team Members"}
                </h4>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {request.teamMembers.map((member) => {
                    const mName = locale === "ar" ? member.nameAr : member.nameEn || member.nameAr;
                    const mRole = locale === "ar" ? member.roleAr : member.roleEn || member.roleAr;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs"
                      >
                        <div>
                          <span className="block font-bold text-primary-900">{mName}</span>
                          <span className="text-[10px] text-neutral-400">{mRole}</span>
                        </div>
                        <div className="text-end">
                          <span className="block font-bold text-primary-800 text-[10px]">
                            {member.yearsOfExperience}{" "}
                            {locale === "ar" ? "سنوات خبرة" : "years exp"}
                          </span>
                          {member.cvFileUrl && (
                            <a
                              href={member.cvFileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-0.5 text-[9px] text-primary-800 hover:underline mt-0.5 font-bold"
                            >
                              <span>{locale === "ar" ? "السيرة الذاتية" : "CV"}</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Notes & Decision Actions */}
      <div className="bg-white rounded-2xl border border-border p-6 card-shadow space-y-6 mt-8">
        <div className="space-y-2">
          <Label htmlFor="admin-notes" className="text-sm font-bold text-primary-800 block">
            {t("adminNotes")} <span className="text-rose-500">*</span>
          </Label>
          <Textarea
            id="admin-notes"
            required
            placeholder={t("adminNotesPlaceholder")}
            value={adminNotes}
            onChange={(e) => setNotesState(e.target.value)}
            disabled={!isPendingOrUnderReview}
            className="min-h-[120px] rounded-xl border-neutral-200 focus-visible:border-accent-300 placeholder:text-neutral-400"
          />
        </div>

        {/* Display Decision Summary if already reviewed */}
        {!isPendingOrUnderReview && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              request.status === "approved" ||
              request.status === "invoiced" ||
              request.status === "paid" ||
              request.status === "in_progress" ||
              request.status === "delivered"
                ? "bg-emerald-50/60 border-emerald-200/50 text-emerald-800"
                : "bg-rose-50/60 border-rose-200/50 text-rose-800"
            }`}
          >
            {request.status === "declined" ? (
              <>
                <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="block font-bold">
                    {locale === "ar" ? "تم رفض الطلب" : "Request Declined"}
                  </span>
                  {request.declineReason && (
                    <p className="font-semibold text-neutral-600">
                      {locale === "ar"
                        ? `السبب: ${request.declineReason}`
                        : `Reason: ${request.declineReason}`}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="block font-bold">
                        {locale === "ar" ? "تم قبول الطلب" : "Request Approved"}
                      </span>
                      {request.invoiceId && (
                        <p className="font-semibold text-neutral-600 mt-0.5">
                          {locale === "ar"
                            ? `مرتبط بالفاتورة رقم: ${request.invoiceId.slice(0, 8)}`
                            : `Linked to Invoice: #${request.invoiceId.slice(0, 8)}`}
                        </p>
                      )}
                    </div>
                    {request.status === "paid" ||
                    request.status === "in_progress" ||
                    request.status === "delivered" ? (
                      <Link
                        href={`/admin/proposals/${request.proposalId || request.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors shrink-0"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {locale === "ar"
                          ? "فتح استوديو المقترحات الذكي"
                          : "Open Smart Proposal Studio"}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {isPendingOrUnderReview && (
          <div className="flex justify-end gap-4 border-t border-neutral-100 pt-5">
            <Button
              variant="destructive"
              disabled={reviewMutation.isPending}
              onClick={() => setIsDeclineModalOpen(true)}
              className="px-6 h-10 rounded-xl cursor-pointer font-bold shadow-xs bg-error-foreground text-error-background hover:bg-error-foreground/90"
            >
              {t("decline")}
            </Button>
            <Button
              variant="default"
              disabled={reviewMutation.isPending}
              onClick={() => setIsAcceptModalOpen(true)}
              className="px-6 h-10 rounded-xl cursor-pointer font-bold shadow-sm bg-primary-800 text-white hover:bg-primary-900"
            >
              {t("accept")}
            </Button>
          </div>
        )}
      </div>

      {/* Accept & Invoice Modal */}
      <Dialog open={isAcceptModalOpen} onOpenChange={setIsAcceptModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white border border-border p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-primary-900">
              {t("acceptModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              {t("acceptModalDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAcceptSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-amount" className="text-xs font-bold text-primary-800 block">
                {t("invoiceAmount")} <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="invoice-amount"
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="1500.00"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="h-10 border-neutral-200 focus-visible:border-accent-300 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-notes" className="text-xs font-bold text-primary-800 block">
                {t("invoiceNotes")} <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="invoice-notes"
                required
                placeholder={t("invoiceNotesPlaceholder")}
                className="min-h-[80px] rounded-xl border-neutral-200 focus-visible:border-accent-300 placeholder:text-neutral-400"
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-3 border-t border-neutral-100 -mx-6 -mb-6 p-6 bg-neutral-50/50 rounded-b-2xl">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAcceptModalOpen(false)}
                className="h-9 px-4 rounded-xl cursor-pointer text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-50"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={reviewMutation.isPending}
                className="h-9 px-4 rounded-xl cursor-pointer bg-primary-800 text-white hover:bg-primary-900 font-bold"
              >
                {reviewMutation.isPending ? "..." : t("submitAccept")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Decline Reason Modal */}
      <Dialog open={isDeclineModalOpen} onOpenChange={setIsDeclineModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white border border-border p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-primary-900">
              {t("declineModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              {t("declineModalDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeclineSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="decline-reason" className="text-xs font-bold text-primary-800 block">
                {t("declineReason")} <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="decline-reason"
                required
                placeholder={t("declineReasonPlaceholder")}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="min-h-[120px] rounded-xl border-neutral-200 focus-visible:border-accent-300 placeholder:text-neutral-400 font-medium"
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-3 border-t border-neutral-100 -mx-6 -mb-6 p-6 bg-neutral-50/50 rounded-b-2xl">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsDeclineModalOpen(false)}
                className="h-9 px-4 rounded-xl cursor-pointer text-neutral-600 border border-neutral-200 bg-white hover:bg-neutral-50"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={reviewMutation.isPending}
                className="h-9 px-4 rounded-xl cursor-pointer bg-error-foreground text-error-background hover:bg-error-foreground/80 font-bold"
              >
                {reviewMutation.isPending ? "..." : t("submitDecline")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

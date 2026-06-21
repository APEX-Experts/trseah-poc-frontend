"use client";

import { useQueryClient } from "@tanstack/react-query";
import TenderPagination from "@/components/dashboard/tenders/TenderPagination";
import { PageContainer } from "@/components/layout/PageContainer";
import { Link } from "@/i18n/navigation";
import {
  useRequestsControllerListRequests,
  useRequestsControllerDeleteRequest,
  getRequestsControllerListRequestsQueryKey,
} from "@/lib/api/react-query/service-requests/service-requests";
import { useTendersControllerGetTenderDetails } from "@/lib/api/react-query/tenders/tenders";
import { ServiceRequestResponseDto, ServiceRequestResponseDtoStatus } from "@/types/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ClipboardList,
  FileText,
  Loader2,
  MoreVertical,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface RequestCardProps {
  req: ServiceRequestResponseDto;
  onDelete: (id: string) => void;
  isDeletable: boolean;
}

function RequestCard({ req, onDelete, isDeletable }: RequestCardProps) {
  const { data: tender, isLoading: isLoadingTender } = useTendersControllerGetTenderDetails(
    req.tenderId || "",
    {
      query: {
        enabled: !!req.tenderId,
      },
    },
  );

  const locale = useLocale();
  const t = useTranslations("ServiceRequests");

  const isPlatform = req.rfpSourceType === "platform";

  const title = isPlatform
    ? (locale === "en" ? tender?.titleEn : tender?.titleAr) ||
      (isLoadingTender ? "Loading..." : "Tender not found")
    : locale === "ar"
      ? "منافسة خارجية"
      : "External Tender";

  const entityName = isPlatform
    ? (locale === "en"
        ? tender?.entityNameEn || tender?.governmentEntityEn
        : tender?.entityNameAr || tender?.governmentEntityAr) || ""
    : "";

  const subtitle = isPlatform
    ? `${entityName}${entityName ? " · " : ""}${locale === "en" ? tender?.titleEn : tender?.titleAr}`
    : locale === "ar"
      ? "طلب خارجي"
      : "External RFP";

  const description = isPlatform
    ? (locale === "en" ? tender?.descriptionEn : tender?.descriptionAr) || ""
    : req.rfpExternalDescription || "";

  const requestCode = `REQ-${new Date(req.createdAt).getFullYear()}-${req.id.substring(0, 8).toUpperCase()}`;

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

  return (
    <div className="bg-white rounded-2xl border border-border p-6 card-shadow flex items-start gap-4 relative transition-all duration-200 hover:border-primary-200 hover:shadow-lg group">
      {/* Icon Container */}
      <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-primary-50 rounded-xl border border-primary-100/50 text-primary-800">
        <ClipboardList className="w-6 h-6" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-neutral-400">
          <span className="font-mono tracking-wider">{requestCode}</span>
          <span
            className={`px-3 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${getStatusStyles(
              req.status,
            )}`}
          >
            {t(`statuses.${req.status}`)}
          </span>
        </div>

        <h3 className="text-base font-bold text-primary-900 mt-2 truncate">{title}</h3>

        {subtitle && <p className="text-xs text-neutral-400 mt-1 truncate">{subtitle}</p>}

        {description && (
          <p className="text-sm text-neutral-500 mt-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Footer Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-300" />
            <span>
              {new Date(req.createdAt).toLocaleDateString(locale, {
                dateStyle: "medium",
              })}
            </span>
          </div>

          {req.reviewedById && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-300" />
              <span>{locale === "ar" ? "تمت المراجعة" : "Reviewed"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-6 inset-e-6">
        <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg hover:bg-neutral-50 text-neutral-400 hover:text-neutral-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 bg-white border border-border rounded-xl shadow-md p-1"
          >
            <DropdownMenuItem
              disabled={!isDeletable}
              onClick={() => onDelete(req.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                isDeletable
                  ? "text-error-foreground hover:bg-error-background/10 hover:text-error-foreground font-semibold"
                  : "text-neutral-300 cursor-not-allowed"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t("delete")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function MyRequestsPage() {
  const t = useTranslations("ServiceRequests");
  const tOnboarding = useTranslations("Onboarding");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useRequestsControllerListRequests({
    page,
    limit: 10,
  });

  const { mutateAsync: deleteRequest } = useRequestsControllerDeleteRequest();

  const confirmDelete = async (id: string) => {
    try {
      await deleteRequest({ id });
      toast.success(t("success.deleted"));
      queryClient.invalidateQueries({
        queryKey: getRequestsControllerListRequestsQueryKey(),
      });
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      toast.error(t("errors.deleteFailed"));
    }
  };

  const requests = response?.data || [];
  const totalPages = response?.meta?.totalPages || 1;

  return (
    <PageContainer>
      <div className="min-h-screen bg-background animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="h2 text-primary-900">{t("myRequestsTitle")}</h1>
              <p className="text-neutral-500">{t("myRequestsSubtitle")}</p>
            </div>
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white rounded-xl py-3 px-5 text-sm font-bold transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{t("createNew")}</span>
            </Link>
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary-800" />
              <span className="text-sm font-semibold text-neutral-500">
                {tOnboarding("Status.loading")}
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-2">
              <span className="text-lg font-bold text-destructive">{t("errors.loadFailed")}</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-12 text-center card-shadow">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                <FileText className="h-7 w-7 text-primary-800" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900">{t("myRequestsTitle")}</h3>
              <p className="mt-2 max-w-md text-sm text-neutral-500 leading-relaxed">
                {t("noRequests")}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {requests.map((req) => {
                  const isDeletable = !(
                    req.status === "paid" ||
                    req.status === "in_progress" ||
                    req.status === "delivered"
                  );
                  return (
                    <RequestCard
                      key={req.id}
                      req={req}
                      onDelete={setDeleteId}
                      isDeletable={isDeletable}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-4">
                  <TenderPagination page={page} setPage={setPage} totalPages={totalPages} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md" dir={locale === "ar" ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-primary-900">{t("delete")}</DialogTitle>
            <DialogDescription className="text-neutral-500">{t("deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 flex flex-col sm:flex-row pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deleteId && confirmDelete(deleteId)}
              className="w-full sm:w-auto font-semibold"
            >
              {locale === "ar" ? "حذف" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

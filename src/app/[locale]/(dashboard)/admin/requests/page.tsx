"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAdminRequestsControllerListRequests } from "@/lib/api/react-query/admin-—-service-requests/admin-—-service-requests";
import { useUserPermissions } from "@/hooks/use-permissions";
import Forbidden from "@/components/error/forbidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";
import { AdminRequestsControllerListRequestsStatus, ServiceRequestResponseDto } from "@/types/api";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminRequestsPage() {
  const t = useTranslations("AdminRequests");
  const tStatus = useTranslations("ServiceRequests.statuses");
  const locale = useLocale();
  const { isAdmin, isLoading: permissionsLoading } = useUserPermissions();

  // Filter, Sort, Pagination, Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "status">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch Requests
  const params = {
    page,
    limit,
    search: searchTerm || undefined,
    status:
      statusFilter === "all"
        ? undefined
        : (statusFilter as AdminRequestsControllerListRequestsStatus),
    sortBy,
    sortOrder,
  };

  const { data, isLoading: dataLoading } = useAdminRequestsControllerListRequests(
    isAdmin ? params : undefined,
    {
      query: {
        enabled: isAdmin,
      },
    },
  );

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

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  // Handle Status Filter Change
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Toggle Sort Order
  const handleSortToggle = (field: "createdAt" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const requests: ServiceRequestResponseDto[] = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  // Status List for filters
  const statusOptions = [
    { key: "all", label: t("allStatus") },
    { key: "pending", label: tStatus("pending") },
    { key: "under_review", label: tStatus("under_review") },
    { key: "approved", label: tStatus("approved") },
    { key: "declined", label: tStatus("declined") },
    { key: "invoiced", label: tStatus("invoiced") },
    { key: "paid", label: tStatus("paid") },
    { key: "in_progress", label: tStatus("in_progress") },
    { key: "delivered", label: tStatus("delivered") },
  ];

  // Get Initials for Avatar Fallback
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Get Status Badge Styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "under_review":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "invoiced":
        return "bg-cyan-50 text-cyan-700 border-cyan-200/60";
      case "paid":
        return "bg-teal-50 text-teal-700 border-teal-200/60";
      case "in_progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "delivered":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "declined":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="h2 text-primary-900 font-bold">{t("title")}</h1>
          <p className="p-sm text-neutral-500">{t("subtitle")}</p>
        </div>
      </div>

      {/* Controls: Search, Filters, Sort */}
      <div className="bg-white rounded-2xl border border-border p-5 card-shadow space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="ps-10 h-11 border-neutral-200 hover:border-neutral-300 focus-visible:border-accent-300 rounded-xl"
            />
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 whitespace-nowrap">
              {t("sortBy")}:
            </span>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(val) => {
                const [field, order] = val.split("-");
                setSortBy(field as "createdAt" | "status");
                setSortOrder(order as "asc" | "desc");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] h-10 border-neutral-200 rounded-xl">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="createdAt-desc">{t("sortByNewest")}</SelectItem>
                <SelectItem value="createdAt-asc">{t("sortByOldest")}</SelectItem>
                <SelectItem value="status-asc">{t("sortByStatus")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="border-t border-neutral-100 pt-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 max-w-full">
            {statusOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleStatusFilter(opt.key)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === opt.key
                    ? "bg-primary-800 border-primary-800 text-white shadow-sm"
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-primary-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Request Queue Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          {dataLoading ? (
            <div className="flex h-[350px] flex-col items-center justify-center gap-4 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-800" />
              <p className="text-sm font-semibold text-neutral-500">{t("noRequests")}</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-center p-8">
              <Layers className="h-12 w-12 text-neutral-300" />
              <div>
                <h3 className="text-base font-bold text-primary-900">{t("noRequests")}</h3>
              </div>
            </div>
          ) : (
            <table className="w-full text-sm text-start border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="px-6 py-4 text-start font-bold text-neutral-500 w-[140px]">
                    {t("requestId")}
                  </th>
                  <th className="px-6 py-4 text-start font-bold text-neutral-500">
                    {t("company")}
                  </th>
                  <th className="px-6 py-4 text-start font-bold text-neutral-500 w-[150px]">
                    {t("sourceType")}
                  </th>
                  <th className="px-6 py-4 text-start font-bold text-neutral-500 w-[180px]">
                    {t("dateSubmitted")}
                  </th>
                  <th className="px-6 py-4 text-start font-bold text-neutral-500 w-[140px]">
                    <button
                      onClick={() => handleSortToggle("status")}
                      className="inline-flex items-center gap-1.5 hover:text-primary-800 font-bold"
                    >
                      <span>{t("status")}</span>
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-neutral-500 w-[120px]">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {requests.map((request) => {
                  const companyName =
                    locale === "ar"
                      ? request.organization?.nameAr
                      : request.organization?.nameEn || request.organization?.nameAr;
                  const fallbackInitials = getInitials(
                    request.organization?.nameEn || request.organization?.nameAr || "",
                  );

                  return (
                    <tr key={request.id} className="transition-colors hover:bg-neutral-50/30">
                      {/* Request ID */}
                      <td className="px-6 py-4 font-mono font-bold text-neutral-500">
                        <span className="inline-block max-w-[100px] truncate" title={request.id}>
                          {request.id.slice(0, 8)}
                        </span>
                      </td>

                      {/* Company Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`relative size-10 rounded-full overflow-hidden border border-border bg-primary-800 text-primary-50 flex items-center justify-center font-bold text-xs shrink-0`}
                          >
                            {request.organization?.logoUrl ? (
                              <Image
                                src={request.organization.logoUrl}
                                alt={companyName || ""}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span>{fallbackInitials}</span>
                            )}
                          </div>
                          <div>
                            <span className="block font-bold text-primary-900 line-clamp-1">
                              {companyName || "-"}
                            </span>
                            {request.tenderId && (
                              <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="inline-flex items-center gap-1 text-[10px] text-neutral-600 mt-0.5 p-1 bg-neutral-100 rounded-md cursor-pointer"
                                title={t("copyTenderId")}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(request.tenderId!);
                                  toast.success(t("tenderIdCopied"));
                                }}
                              >
                                <FileText className="h-3 w-3" />
                                {t("tenderId")}: {request.tenderId}
                              </Button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source Type */}
                      <td className="px-6 py-4 font-medium text-neutral-600">
                        <span className="capitalize">
                          {request.rfpSourceType.toLowerCase() === "platform"
                            ? t("sourceTypeValues.platform")
                            : t("sourceTypeValues.external")}
                        </span>
                      </td>

                      {/* Date Submitted */}
                      <td className="px-6 py-4 text-neutral-500">
                        <div className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                          <span>
                            {new Date(request.createdAt).toLocaleDateString(
                              locale === "ar" ? "ar-SA" : "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Status Chip */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                            request.status,
                          )}`}
                        >
                          {tStatus(request.status)}
                        </span>
                      </td>

                      {/* Action View Button */}
                      <td className="px-6 py-4 text-center">
                        <Link href={`/admin/requests/${request.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{t("viewDetails")}</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-neutral-50/30">
            <span className="text-xs font-semibold text-neutral-500">
              {locale === "ar"
                ? `صفحة ${meta.page} من ${meta.totalPages} (إجمالي ${meta.total})`
                : `Page ${meta.page} of ${meta.totalPages} (Total ${meta.total})`}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0 rounded-lg cursor-pointer border border-neutral-200 hover:bg-neutral-50"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="h-8 w-8 p-0 rounded-lg cursor-pointer border border-neutral-200 hover:bg-neutral-50"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

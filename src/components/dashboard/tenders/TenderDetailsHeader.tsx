"use client";

import { TenderResponseDto } from "@/types/api";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, Download, Send } from "lucide-react";

interface TenderDetailsHeaderProps {
  tender: TenderResponseDto;
}

export default function TenderDetailsHeader({ tender }: TenderDetailsHeaderProps) {
  const t = useTranslations("TenderDetails");
  const tTenders = useTranslations("TendersList");
  const locale = useLocale();

  const title = locale === "en" && tender.titleEn ? tender.titleEn : tender.titleAr;
  const entityName =
    locale === "en" && tender.entityNameEn ? tender.entityNameEn : tender.entityNameAr;

  const sector = locale === "en" && tender.sectorEn ? tender.sectorEn : tender.sectorAr;
  const region = locale === "en" && tender.regionEn ? tender.regionEn : tender.regionAr;
  const tenderType =
    locale === "en" && tender.tenderTypeEn ? tender.tenderTypeEn : tender.tenderTypeAr;

  // Helper to map statuses to dynamic design system color styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "open":
        return "bg-success-background text-success-foreground border-success-foreground/20";
      case "under_review":
        return "bg-warning-background text-warning-foreground border-warning-foreground/20";
      case "closed":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
      case "awarded":
        return "bg-info-background text-info-foreground border-info-foreground/20";
      case "canceled":
        return "bg-error-background text-error-foreground border-error-foreground/20";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-6">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-primary-800 transition-colors"
        >
          {locale === "ar" ? (
            <ChevronRight className="w-4.5 h-4.5" />
          ) : (
            <ChevronLeft className="w-4.5 h-4.5" />
          )}
          <span>{t("back")}</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Title, Entity, Badges */}
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-neutral-400">
              {tender.externalId || tender.referenceNumber || tender.tenderNumber}
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(
                tender.status || "open",
              )}`}
            >
              {tTenders(`card.status.${tender.status}`)}
            </span>
          </div>

          <h1 className="h2 text-primary-900 leading-tight">{title}</h1>

          <div className="flex items-center gap-2 text-neutral-600 flex-wrap">
            <span className="text-sm font-medium text-neutral-500">{t("governmentEntity")}:</span>
            <span className="text-sm font-bold text-primary-900">{entityName}</span>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {sector && (
              <span className="px-3 py-1 bg-info-background text-info-foreground rounded-full text-xs font-semibold">
                {sector}
              </span>
            )}
            {region && (
              <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold">
                {region}
              </span>
            )}
            {tenderType && (
              <span className="px-3 py-1 bg-accent-50 text-accent-800 rounded-full text-xs font-semibold">
                {tenderType}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row lg:flex-col gap-3 min-w-[200px] w-full lg:w-auto">
          {tender.rfpFileUrl && (
            <a
              href={tender.rfpFileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl py-3 px-4 text-sm font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{t("downloadRfp")}</span>
            </a>
          )}
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary-800 hover:bg-primary-700 text-white rounded-xl py-3 px-4 text-sm font-bold transition-all shadow-md">
            <Send className="w-4 h-4" />
            <span>{t("applyToTender")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

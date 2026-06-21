"use client";

import { TenderResponseDto } from "@/types/api";
import { Building2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import DaysLeftProgress from "./DaysLeftProgress";

interface TenderCardProps {
  tender: TenderResponseDto;
}

export default function TenderCard({ tender }: TenderCardProps) {
  const t = useTranslations("TendersList");
  const locale = useLocale();

  // Helper to calculate days remaining (returning 0 if the deadline has passed)
  const calculateRemainingDays = (deadline?: string | null) => {
    if (!deadline) return 0;
    const diffTime = new Date(deadline).getTime() - new Date().getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper to map statuses to dynamic design system color styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "open":
        return {
          bg: "bg-success-background text-success-foreground",
          dot: "bg-success-foreground",
        };
      case "under_review":
        return {
          bg: "bg-warning-background text-warning-foreground",
          dot: "bg-warning-foreground",
        };
      case "closed":
        return {
          bg: "bg-neutral-100 text-neutral-600",
          dot: "bg-neutral-400",
        };
      case "awarded":
        return {
          bg: "bg-info-background text-info-foreground",
          dot: "bg-info-foreground",
        };
      case "canceled":
        return {
          bg: "bg-error-background text-error-foreground",
          dot: "bg-error-foreground",
        };
      default:
        return {
          bg: "bg-neutral-100 text-neutral-600",
          dot: "bg-neutral-400",
        };
    }
  };

  const remainingDays = calculateRemainingDays(tender.submissionDeadline);
  const title = locale === "en" && tender.titleEn ? tender.titleEn : tender.titleAr;
  const description =
    locale === "en" && tender.descriptionEn ? tender.descriptionEn : tender.descriptionAr;
  const entityName =
    locale === "en" && tender.entityNameEn ? tender.entityNameEn : tender.entityNameAr;

  const sector = locale === "en" && tender.sectorEn ? tender.sectorEn : tender.sectorAr;
  const region = locale === "en" && tender.regionEn ? tender.regionEn : tender.regionAr;
  const tenderType =
    locale === "en" && tender.tenderTypeEn ? tender.tenderTypeEn : tender.tenderTypeAr;

  const statusStyles = getStatusStyles(tender.status || "open");

  // Calculate remaining days percentage relative to total duration
  const publishTime = tender.publishDate ? new Date(tender.publishDate).getTime() : null;
  const deadlineTime = tender.submissionDeadline
    ? new Date(tender.submissionDeadline).getTime()
    : null;
  const nowTime = new Date().getTime();
  let remainingDaysPercent = 0;
  if (deadlineTime && deadlineTime > nowTime) {
    const totalDuration = publishTime ? deadlineTime - publishTime : 30 * 24 * 60 * 60 * 1000;
    const remainingDuration = deadlineTime - nowTime;
    remainingDaysPercent =
      totalDuration > 0 ? Math.min(100, Math.max(0, (remainingDuration / totalDuration) * 100)) : 0;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-border card-shadow flex flex-col lg:flex-row gap-6 hover:border-primary-300 transition-colors">
      {/* Right Side: Main Content (RTL naturally handles layout ordering) */}
      <div className="flex-1 space-y-4">
        {/* Top Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-neutral-500 font-medium">
            {tender.externalId || tender.referenceNumber || tender.tenderNumber}
          </span>
          <span
            className={`px-3 py-1 ${statusStyles.bg} rounded-full text-xs font-medium flex items-center gap-1.5`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
            {t(`card.status.${tender.status}`)}
          </span>
          {sector && (
            <span className="px-3 py-1 bg-info-background text-info-foreground rounded-full text-xs font-medium">
              {sector}
            </span>
          )}
          {region && (
            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
              {region}
            </span>
          )}
          {tenderType && (
            <span className="px-3 py-1 bg-accent-50 text-accent-800 rounded-full text-xs font-medium">
              {tenderType}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="h3 text-primary-900">{title}</h3>
          <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">{description}</p>
        </div>

        {/* Meta Footer */}
        <div className="flex items-center gap-8 pt-4 mt-2 border-t border-border">
          <div className="flex items-center gap-2 text-neutral-600">
            <Building2 className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-medium">{entityName}</span>
          </div>
          {tender.estimatedBudget && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <div className="text-sm">
                <span className="text-neutral-500">{t("card.projectBudget")}</span>
                <span className="font-bold text-primary-900 ms-2">
                  {t("card.sar")} {Number(tender.estimatedBudget).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Left Side: Actions & Days Remaining Donut */}
      <div className="w-full lg:w-[200px] flex flex-col items-center justify-between border-t lg:border-t-0 lg:border-s border-border pt-6 lg:pt-0 lg:ps-6 gap-6">
        <div className="flex flex-col items-center gap-3 w-full text-center">
          <p className="text-xs font-semibold text-primary-800">{t("card.remainingTime")}</p>
          <DaysLeftProgress
            remainingDays={remainingDays}
            percent={remainingDaysPercent}
            locale={locale}
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button className="w-full bg-primary-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
            {t("card.viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
}

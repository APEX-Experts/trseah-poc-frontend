"use client";

import { TenderResponseDto } from "@/types/api";
import { useLocale, useTranslations } from "next-intl";
import DaysLeftProgress from "./DaysLeftProgress";

interface TenderDetailsSidebarProps {
  tender: TenderResponseDto;
}

export default function TenderDetailsSidebar({ tender }: TenderDetailsSidebarProps) {
  const t = useTranslations("TenderDetails");
  const locale = useLocale();

  // Helper to calculate days remaining
  const calculateRemainingDays = (deadline?: string | null) => {
    if (!deadline) return 0;
    const diffTime = new Date(deadline).getTime() - new Date().getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const remainingDays = calculateRemainingDays(tender.submissionDeadline);

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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Time Remaining Card */}
      <div className="bg-white rounded-2xl p-6 border border-border card-shadow flex flex-col items-center text-center space-y-4">
        <h3 className="text-sm font-bold text-primary-800">{t("timeline")}</h3>
        <DaysLeftProgress
          remainingDays={remainingDays}
          percent={remainingDaysPercent}
          locale={locale}
        />
        <div className="text-xs text-neutral-400 font-medium">
          {t("submissionDeadline")}: {formatDate(tender.submissionDeadline)}
        </div>
      </div>

      {/* Financial Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-5">
        <h3 className="text-sm font-bold text-primary-800 border-b border-border pb-3">
          {t("financialDetails")}
        </h3>

        {/* Estimated Budget */}
        <div className="space-y-1">
          <span className="text-xs text-neutral-400 block font-medium">{t("budget")}</span>
          <div className="flex items-baseline gap-1 text-primary-900">
            <span className="text-2xl font-black">
              {tender.estimatedBudget ? Number(tender.estimatedBudget).toLocaleString() : "-"}
            </span>
            <span className="text-xs font-bold text-neutral-500">{t("sar")}</span>
          </div>
        </div>

        {/* Document Price */}
        <div className="space-y-1 pt-1">
          <span className="text-xs text-neutral-400 block font-medium">{t("documentPrice")}</span>
          <div className="flex items-baseline gap-1 text-primary-900">
            {tender.documentPrice && Number(tender.documentPrice) > 0 ? (
              <>
                <span className="text-xl font-extrabold">
                  {Number(tender.documentPrice).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-neutral-500">{t("sar")}</span>
              </>
            ) : (
              <span className="text-sm font-bold text-success-foreground bg-success-background px-2.5 py-0.5 rounded-lg border border-success-foreground/10">
                {t("free")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Key Dates Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-5">
        <h3 className="text-sm font-bold text-primary-800 border-b border-border pb-3">
          {t("dates")}
        </h3>

        <div className="relative border-s border-neutral-200 ms-2.5 space-y-6 text-sm">
          {/* Publish Date */}
          <div className="relative ps-6">
            <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-neutral-300 border border-white" />
            <span className="text-xs text-neutral-400 block font-medium">{t("publishDate")}</span>
            <span className="font-semibold text-primary-900">{formatDate(tender.publishDate)}</span>
          </div>

          {/* Inquiries Deadline */}
          <div className="relative ps-6">
            <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-neutral-300 border border-white" />
            <span className="text-xs text-neutral-400 block font-medium">
              {t("inquiriesDeadline")}
            </span>
            <span className="font-semibold text-primary-900">
              {formatDate(tender.inquiriesDeadline)}
            </span>
          </div>

          {/* Submission Deadline */}
          <div className="relative ps-6">
            <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-primary-800 border border-white" />
            <span className="text-xs text-neutral-400 block font-medium">
              {t("submissionDeadline")}
            </span>
            <span className="font-semibold text-primary-900">
              {formatDate(tender.submissionDeadline)}
            </span>
          </div>

          {/* Bids Opening Date */}
          <div className="relative ps-6">
            <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-neutral-300 border border-white" />
            <span className="text-xs text-neutral-400 block font-medium">
              {t("bidsOpeningDate")}
            </span>
            <span className="font-semibold text-primary-900">
              {formatDate(tender.bidsOpeningDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

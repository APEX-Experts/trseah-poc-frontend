"use client";

import { TenderResponseDto } from "@/types/api";
import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface TenderDetailsTableProps {
  tender: TenderResponseDto;
}

export default function TenderDetailsTable({ tender }: TenderDetailsTableProps) {
  const t = useTranslations("TenderDetails");
  const locale = useLocale();

  const purpose =
    locale === "en" && tender.tenderPurposeEn ? tender.tenderPurposeEn : tender.tenderPurposeAr;
  const description =
    locale === "en" && tender.descriptionEn ? tender.descriptionEn : tender.descriptionAr;
  const activity =
    locale === "en" && tender.tenderActivityEn ? tender.tenderActivityEn : tender.tenderActivityAr;

  const govEntity =
    locale === "en" && tender.governmentEntityEn
      ? tender.governmentEntityEn
      : tender.governmentEntityAr;
  const competentAuthority =
    locale === "en" && tender.competentAuthorityEn
      ? tender.competentAuthorityEn
      : tender.competentAuthorityAr;
  const executionLocation =
    locale === "en" && tender.executionLocationEn
      ? tender.executionLocationEn
      : tender.executionLocationAr;

  const contractDuration =
    locale === "en" && tender.contractDurationEn
      ? tender.contractDurationEn
      : tender.contractDurationAr;
  const initialGuaranteeAddress =
    locale === "en" && tender.initialGuaranteeAddressEn
      ? tender.initialGuaranteeAddressEn
      : tender.initialGuaranteeAddressAr;

  const bidsOpeningLocation =
    locale === "en" && tender.bidsOpeningLocationEn
      ? tender.bidsOpeningLocationEn
      : tender.bidsOpeningLocationAr;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBoolean = (val?: boolean | null) => {
    return val ? t("yes") : t("no");
  };

  const bookletUrl = tender.rfpFileUrl;
  const localContentTermsUrl = tender.localContentTermsPdfUrl;

  // Define details table items dynamically
  const detailsItems = [
    { label: t("tenderNumber"), value: tender.tenderNumber },
    { label: t("referenceNumber"), value: tender.referenceNumber },
    { label: t("governmentEntity"), value: govEntity },
    { label: t("competentAuthority"), value: competentAuthority },
    { label: t("executionLocation"), value: executionLocation },
    {
      label: t("contractDuration"),
      value: contractDuration
        ? contractDuration
        : tender.contractDurationMonths
          ? `${tender.contractDurationMonths} ${t("months")}`
          : undefined,
    },
    { label: t("targetSme"), value: formatBoolean(tender.targetSme) },
    { label: t("localContentRequired"), value: formatBoolean(tender.localContentRequired) },
    { label: t("insuranceRequired"), value: formatBoolean(tender.insuranceRequired) },
    { label: t("initialGuaranteeRequired"), value: formatBoolean(tender.initialGuaranteeRequired) },
    { label: t("initialGuaranteeAddress"), value: initialGuaranteeAddress },
    {
      label: t("finalGuarantee"),
      value: !!tender.finalGuarantee ? `${tender.finalGuarantee}%` : undefined,
    },
    { label: t("bidsOpeningLocation"), value: bidsOpeningLocation },
    { label: t("bidsOpeningDate"), value: formatDate(tender.bidsOpeningDate) },
    { label: t("bidsEvaluationDate"), value: formatDate(tender.bidsEvaluationDate) },
    { label: t("expectedAwardDate"), value: formatDate(tender.expectedAwardDate) },
    { label: t("workStartDate"), value: formatDate(tender.workStartDate) },
    { label: t("inquiriesStartDate"), value: formatDate(tender.inquiriesStartDate) },
    {
      label: t("suspensionPeriod"),
      value: tender.suspensionPeriod ? `${tender.suspensionPeriod} ${t("days")}` : undefined,
    },
    {
      label: t("bookletFile"),
      value: bookletUrl ? (
        <a
          href={bookletUrl}
          target="_blank"
          rel="noreferrer"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 hover:bg-primary-100/80 text-primary-800 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{locale === "ar" ? "تحميل كراسة الشروط" : "Download Booklet"}</span>
        </a>
      ) : null,
    },
    {
      label: t("localContentTerms"),
      value: localContentTermsUrl ? (
        <a
          href={localContentTermsUrl}
          target="_blank"
          rel="noreferrer"
          download
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-200 hover:bg-primary-100/80 text-primary-800 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>
            {locale === "ar" ? "تحميل شروط المحتوى المحلي" : "Download Local Content Terms"}
          </span>
        </a>
      ) : null,
    },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== "");

  return (
    <div className="space-y-6">
      {/* Narrative Info Card */}
      {(purpose || description || activity) && (
        <div className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-6">
          <h3 className="text-lg font-bold text-primary-900 border-b border-border pb-3">
            {t("aboutTender")}
          </h3>

          {/* Purpose */}
          {purpose && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary-800">{t("purpose")}</h4>
              <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50/60 p-4 rounded-xl border border-neutral-100">
                {purpose}
              </p>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary-800">{t("description")}</h4>
              <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50/60 p-4 rounded-xl border border-neutral-100">
                {description}
              </p>
            </div>
          )}

          {/* Activity */}
          {activity && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-primary-800">{t("activity")}</h4>
              <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50/60 p-4 rounded-xl border border-neutral-100">
                {activity}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Structured Details Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-4">
        <h3 className="text-lg font-bold text-primary-900 border-b border-border pb-3">
          {t("additionalInfo")}
        </h3>

        <div className="overflow-hidden border border-neutral-200 rounded-xl">
          <table className="w-full text-sm text-start border-collapse">
            <tbody>
              {detailsItems.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-neutral-200 last:border-0 transition-colors hover:bg-neutral-50/40 ${
                    index % 2 === 0 ? "bg-white" : "bg-neutral-50/40"
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-neutral-500 w-1/3 border-e border-neutral-100">
                    {item.label}
                  </td>
                  <td className="px-6 py-4 font-bold text-primary-900 leading-relaxed">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

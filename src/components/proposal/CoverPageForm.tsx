/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CoverPageData, parseCoverPageData, ProposalDto } from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface CoverPageFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
  formattedDate: string;
  isDisabled?: boolean;
}

export default function CoverPageForm({
  content,
  onChange,
  isRtl,
  proposalData,
  formattedDate,
  isDisabled,
}: CoverPageFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // Cover Page State
  const [coverPageData, setCoverPageData] = useState<CoverPageData | null>(null);

  // Parse initial content
  useEffect(() => {
    if (proposalData) {
      const parsed = parseCoverPageData(content, isRtl, proposalData, formattedDate);
      setCoverPageData(parsed);
    }
  }, [content, isRtl, proposalData, formattedDate]);

  // Handle Cover Page updates
  const updateCoverPageField = (key: keyof CoverPageData, value: string) => {
    if (!coverPageData) return;
    const updated = { ...coverPageData, [key]: value };
    setCoverPageData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!coverPageData) return null;

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Document Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.coverPage.coreTitle")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.coverPage.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.title}
              onChange={(e) => updateCoverPageField("title", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverPage.presentedTo")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.presentedTo}
              onChange={(e) => updateCoverPageField("presentedTo", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("form.coverPage.description")}</label>
          <MarkdownEditor
            markdown={coverPageData.description || ""}
            onChange={(value) => updateCoverPageField("description", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
            disabled={isDisabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t("form.coverPage.reference")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.reference}
              onChange={(e) => updateCoverPageField("reference", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverPage.date")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.date}
              onChange={(e) => updateCoverPageField("date", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverPage.orgName")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.orgName}
              onChange={(e) => updateCoverPageField("orgName", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.coverPage.footerTitle")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>{t("form.coverPage.vision")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.vision}
              onChange={(e) => updateCoverPageField("vision", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverPage.specialists")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.specialists}
              onChange={(e) => updateCoverPageField("specialists", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverPage.duration")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.duration}
              onChange={(e) => updateCoverPageField("duration", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverPage.value")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverPageData.value}
              onChange={(e) => updateCoverPageField("value", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

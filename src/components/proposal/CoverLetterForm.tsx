/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { CoverLetterData, parseCoverLetterData, ProposalDto } from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface CoverLetterFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
  requestData?: ProposalDto["request"] | null;
  tenderData?: ProposalDto["tender"] | null;
  formattedDate: string;
  isDisabled?: boolean;
}

export default function CoverLetterForm({
  content,
  onChange,
  isRtl,
  proposalData,
  requestData,
  tenderData,
  formattedDate,
  isDisabled,
}: CoverLetterFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // Cover Letter State
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);

  // Parse initial content
  useEffect(() => {
    if (proposalData && requestData && tenderData) {
      const parsed = parseCoverLetterData(
        content,
        isRtl,
        proposalData,
        requestData,
        tenderData,
        formattedDate,
      );
      setCoverLetterData(parsed);
    }
  }, [content, isRtl, proposalData, requestData, tenderData, formattedDate]);

  // Handle Cover Letter updates
  const updateCoverLetterField = (key: keyof CoverLetterData, value: string) => {
    if (!coverLetterData) return;
    const updated = { ...coverLetterData, [key]: value };
    setCoverLetterData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!coverLetterData) return null;

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Recipient and Subject Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.coverLetter.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t("form.coverLetter.companyName")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.companyName}
              onChange={(e) => updateCoverLetterField("companyName", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverLetter.entityName")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.entityName}
              onChange={(e) => updateCoverLetterField("entityName", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverLetter.reference")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.reference}
              onChange={(e) => updateCoverLetterField("reference", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t("form.coverLetter.recipientTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.recipientTitle}
              onChange={(e) => updateCoverLetterField("recipientTitle", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverLetter.recipientName")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.recipientName}
              onChange={(e) => updateCoverLetterField("recipientName", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverLetter.recipientLocation")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.recipientLocation}
              onChange={(e) => updateCoverLetterField("recipientLocation", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("form.coverLetter.tenderTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={coverLetterData.tenderTitle}
            onChange={(e) => updateCoverLetterField("tenderTitle", e.target.value)}
            disabled={isDisabled}
          />
        </div>

        <div>
          <label className={labelClass}>{t("form.coverLetter.subject")}</label>
          <input
            type="text"
            className={inputClass}
            value={coverLetterData.subject}
            onChange={(e) => updateCoverLetterField("subject", e.target.value)}
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Letter Body */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.coverLetter.bodyTitle")}
        </h3>

        <div>
          <label className={labelClass}>{t("form.coverLetter.body")}</label>
          <MarkdownEditor
            markdown={coverLetterData.body || ""}
            onChange={(value) => updateCoverLetterField("body", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Signatory Info */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.coverLetter.signatoryTitle")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>{t("form.coverLetter.signatoryName")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.signatoryName}
              onChange={(e) => updateCoverLetterField("signatoryName", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverLetter.signatoryRole")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.signatoryTitle}
              onChange={(e) => updateCoverLetterField("signatoryTitle", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.coverLetter.signatoryDate")}</label>
            <input
              type="text"
              className={inputClass}
              value={coverLetterData.date}
              onChange={(e) => updateCoverLetterField("date", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

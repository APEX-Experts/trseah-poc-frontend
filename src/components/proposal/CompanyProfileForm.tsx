/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  CompanyCertificate,
  CompanyMetric,
  CompanyProfileData,
  parseCompanyProfileData,
  ProposalDto,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface CompanyProfileFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
  isDisabled?: boolean;
}

export default function CompanyProfileForm({
  content,
  onChange,
  isRtl,
  proposalData,
  isDisabled,
}: CompanyProfileFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [profileData, setProfileData] = useState<CompanyProfileData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseCompanyProfileData(content, isRtl, proposalData);
    setProfileData(parsed);
  }, [content, isRtl, proposalData]);

  // Update field and serialize to JSON
  const updateProfileField = (
    key: keyof CompanyProfileData,
    value: CompanyProfileData[keyof CompanyProfileData],
  ) => {
    if (!profileData) return;
    const updated = { ...profileData, [key]: value };
    setProfileData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";
  const selectClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start appearance-none";

  if (!profileData) return null;

  const metrics = profileData.metrics || [];
  const certificates = profileData.certificates || [];

  // Metric operations
  const handleAddMetric = () => {
    const updatedMetrics = [...metrics, { value: "", label: "" }];
    updateProfileField("metrics", updatedMetrics);
  };

  const handleRemoveMetric = (index: number) => {
    const updatedMetrics = metrics.filter((_, i) => i !== index);
    updateProfileField("metrics", updatedMetrics);
  };

  const handleUpdateMetric = (index: number, key: keyof CompanyMetric, val: string) => {
    const updatedMetrics = metrics.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateProfileField("metrics", updatedMetrics);
  };

  // Certificate operations
  const handleAddCertificate = () => {
    const updatedCerts = [...certificates, { name: "", authority: "", theme: "blue" as const }];
    updateProfileField("certificates", updatedCerts);
  };

  const handleRemoveCertificate = (index: number) => {
    const updatedCerts = certificates.filter((_, i) => i !== index);
    updateProfileField("certificates", updatedCerts);
  };

  const handleUpdateCertificate = (index: number, key: keyof CompanyCertificate, val: string) => {
    const updatedCerts = certificates.map((item, i) =>
      i === index ? { ...item, [key]: val } : item,
    );
    updateProfileField("certificates", updatedCerts);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title & Subtitle */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.companyProfile.coreContent")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>{t("form.companyProfile.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={profileData.title}
              onChange={(e) => updateProfileField("title", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.companyProfile.subtitle")}</label>
            <MarkdownEditor
              markdown={profileData.subtitle || ""}
              onChange={(value) => updateProfileField("subtitle", value)}
              dir={locale === "ar" ? "rtl" : "ltr"}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {/* Metrics Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.companyProfile.metrics")}
          </h3>
          <button
            type="button"
            onClick={handleAddMetric}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
            disabled={isDisabled}
          >
            + {t("form.companyProfile.addMetric")}
          </button>
        </div>

        <div className="space-y-3">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-end border border-neutral-100 p-3 rounded-xl bg-neutral-50/20"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("form.companyProfile.metricVal")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={metric.value}
                    onChange={(e) => handleUpdateMetric(idx, "value", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.companyProfile.metricLabel")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={metric.label}
                    onChange={(e) => handleUpdateMetric(idx, "label", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMetric(idx)}
                disabled={isDisabled}
                className="text-xs px-2.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end mb-0.5"
              >
                {t("form.companyProfile.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.companyProfile.certificates")}
          </h3>
          <button
            type="button"
            onClick={handleAddCertificate}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.companyProfile.addCert")}
          </button>
        </div>

        <div className="space-y-3">
          {certificates.map((cert, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-end border border-neutral-100 p-3 rounded-xl bg-neutral-50/20"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-start">
                <div>
                  <label className={labelClass}>{t("form.companyProfile.certName")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={cert.name}
                    onChange={(e) => handleUpdateCertificate(idx, "name", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.companyProfile.certAuthority")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={cert.authority}
                    onChange={(e) => handleUpdateCertificate(idx, "authority", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.companyProfile.certTheme")}</label>
                  <select
                    className={selectClass}
                    value={cert.theme}
                    onChange={(e) =>
                      handleUpdateCertificate(idx, "theme", e.target.value as "blue" | "green")
                    }
                    disabled={isDisabled}
                  >
                    <option value="blue">{t("form.companyProfile.themeBlue")}</option>
                    <option value="green">{t("form.companyProfile.themeGreen")}</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCertificate(idx)}
                disabled={isDisabled}
                className="text-xs px-2.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end mb-0.5"
              >
                {t("form.companyProfile.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.companyProfile.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.companyProfile.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={profileData.additionalContent || ""}
            onChange={(value) => updateProfileField("additionalContent", value)}
            disabled={isDisabled}
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>
    </div>
  );
}

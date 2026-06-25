/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  parseQualityAndRiskData,
  QualityAndRiskData,
  RiskItem,
  QualityStandard,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface QualityAndRiskFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  isDisabled?: boolean;
}

export default function QualityAndRiskForm({
  content,
  onChange,
  isRtl,
  isDisabled,
}: QualityAndRiskFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [dataState, setDataState] = useState<QualityAndRiskData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseQualityAndRiskData(content, isRtl);
    setDataState(parsed);
  }, [content, isRtl]);

  // Update field and serialize to JSON
  const updateField = (
    key: keyof QualityAndRiskData,
    value: QualityAndRiskData[keyof QualityAndRiskData],
  ) => {
    if (!dataState) return;
    const updated = { ...dataState, [key]: value };
    setDataState(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!dataState) return null;

  const risks = dataState.risks || [];
  const standards = dataState.standards || [];

  // Risk operations
  const handleAddRisk = () => {
    const newRisk: RiskItem = {
      title: "",
      likelihood: isRtl ? "متوسط" : "Medium",
      impact: isRtl ? "متوسط" : "Medium",
      mitigation: "",
    };
    updateField("risks", [...risks, newRisk]);
  };

  const handleRemoveRisk = (index: number) => {
    const updated = risks.filter((_, i) => i !== index);
    updateField("risks", updated);
  };

  const handleUpdateRisk = (index: number, key: keyof RiskItem, val: string) => {
    const updated = risks.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("risks", updated);
  };

  // Standard operations
  const handleAddStandard = () => {
    const newStd: QualityStandard = {
      standard: "",
      method: "",
      frequency: "",
    };
    updateField("standards", [...standards, newStd]);
  };

  const handleRemoveStandard = (index: number) => {
    const updated = standards.filter((_, i) => i !== index);
    updateField("standards", updated);
  };

  const handleUpdateStandard = (index: number, key: keyof QualityStandard, val: string) => {
    const updated = standards.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("standards", updated);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.quality_and_risk.coreContent")}
        </h3>

        <div>
          <label className={labelClass}>{t("form.quality_and_risk.mainTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={dataState.title}
            onChange={(e) => updateField("title", e.target.value)}
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Risks Register Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.quality_and_risk.risksTitleLabel")}
          </h3>
          <button
            type="button"
            onClick={handleAddRisk}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.quality_and_risk.addRisk")}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t("form.quality_and_risk.matrixTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={dataState.risksTitle}
            disabled={isDisabled}
            onChange={(e) => updateField("risksTitle", e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {risks.map((risk, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-5 rounded-2xl  page-bg bg-neutral-50/10 space-y-4 relative text-start"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-800 bg-primary-800/5 px-2.5 py-1 rounded-md">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveRisk(idx)}
                  disabled={isDisabled}
                  className="text-xs px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.quality_and_risk.remove")}
                </button>
              </div>

              {/* Title & Mitigation */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>{t("form.quality_and_risk.riskTitle")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={risk.title}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateRisk(idx, "title", e.target.value)}
                  />
                </div>
              </div>

              {/* Likelihood & Impact Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("form.quality_and_risk.likelihood")}</label>
                  <select
                    className={inputClass}
                    value={risk.likelihood}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateRisk(idx, "likelihood", e.target.value)}
                  >
                    <option value={isRtl ? "منخفض" : "Low"}>{isRtl ? "منخفض" : "Low"}</option>
                    <option value={isRtl ? "متوسط" : "Medium"}>{isRtl ? "متوسط" : "Medium"}</option>
                    <option value={isRtl ? "عالي" : "High"}>{isRtl ? "عالي" : "High"}</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t("form.quality_and_risk.impact")}</label>
                  <select
                    className={inputClass}
                    value={risk.impact}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateRisk(idx, "impact", e.target.value)}
                  >
                    <option value={isRtl ? "منخفض" : "Low"}>{isRtl ? "منخفض" : "Low"}</option>
                    <option value={isRtl ? "متوسط" : "Medium"}>{isRtl ? "متوسط" : "Medium"}</option>
                    <option value={isRtl ? "عالي" : "High"}>{isRtl ? "عالي" : "High"}</option>
                  </select>
                </div>
              </div>

              {/* Mitigation Strategy */}
              <div>
                <label className={labelClass}>{t("form.quality_and_risk.mitigation")}</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={risk.mitigation}
                  disabled={isDisabled}
                  onChange={(e) => handleUpdateRisk(idx, "mitigation", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Standards Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.quality_and_risk.standardsTitleLabel")}
          </h3>
          <button
            type="button"
            onClick={handleAddStandard}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.quality_and_risk.addStandard")}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t("form.quality_and_risk.standardsSectionTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={dataState.standardsTitle}
            disabled={isDisabled}
            onChange={(e) => updateField("standardsTitle", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {standards.map((std, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-3 items-end border border-neutral-100 p-4 rounded-xl bg-neutral-50/5 relative text-start"
            >
              <div className="flex-1 w-full">
                <label className={labelClass}>{t("form.quality_and_risk.standardName")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={std.standard}
                  disabled={isDisabled}
                  onChange={(e) => handleUpdateStandard(idx, "standard", e.target.value)}
                />
              </div>
              <div className="flex-[2] w-full">
                <label className={labelClass}>{t("form.quality_and_risk.standardMethod")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={std.method}
                  disabled={isDisabled}
                  onChange={(e) => handleUpdateStandard(idx, "method", e.target.value)}
                />
              </div>
              <div className="w-full sm:w-40">
                <label className={labelClass}>{t("form.quality_and_risk.standardFrequency")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={std.frequency}
                  disabled={isDisabled}
                  onChange={(e) => handleUpdateStandard(idx, "frequency", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStandard(idx)}
                className="text-xs p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end sm:mb-0.5"
              >
                {t("form.quality_and_risk.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Markdown Content */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.quality_and_risk.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.quality_and_risk.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={dataState.additionalContent || ""}
            onChange={(value) => updateField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}

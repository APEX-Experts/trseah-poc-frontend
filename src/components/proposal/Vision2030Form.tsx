/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { parseVision2030Data, Vision2030Data, VisionPillar } from "@/lib/proposal-utils";
import MarkdownEditor from "../ui/markdown-editor";

interface Vision2030FormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
}

export default function Vision2030Form({ content, onChange, isRtl }: Vision2030FormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [visionData, setVisionData] = useState<Vision2030Data | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseVision2030Data(content, isRtl);
    setVisionData(parsed);
  }, [content, isRtl]);

  // Update field and serialize to JSON
  const updateVisionField = (
    key: keyof Vision2030Data,
    value: Vision2030Data[keyof Vision2030Data],
  ) => {
    if (!visionData) return;
    const updated = { ...visionData, [key]: value };
    setVisionData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!visionData) return null;

  const pillars = visionData.pillars || [];

  // Pillar operations
  const handleAddPillar = () => {
    const updatedPillars = [
      ...pillars,
      { title: "", metric: "", nationalTarget: "", projectContribution: "" },
    ];
    updateVisionField("pillars", updatedPillars);
  };

  const handleRemovePillar = (index: number) => {
    const updatedPillars = pillars.filter((_, i) => i !== index);
    updateVisionField("pillars", updatedPillars);
  };

  const handleUpdatePillar = (index: number, key: keyof VisionPillar, val: string) => {
    const updatedPillars = pillars.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateVisionField("pillars", updatedPillars);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title & Subtitle */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.vision30.coreContent")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>{t("form.vision30.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={visionData.title}
              onChange={(e) => updateVisionField("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.vision30.subtitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={visionData.subtitle}
              onChange={(e) => updateVisionField("subtitle", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Vision Alignment Pillars Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.vision30.pillars")}
          </h3>
          <button
            type="button"
            onClick={handleAddPillar}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.vision30.addPillar")}
          </button>
        </div>

        <div className="space-y-4">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="border border-neutral-100 p-4 rounded-xl bg-neutral-50/20 space-y-4 relative"
            >
              {/* Header row with removal button */}
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-primary-800">
                  {t("form.vision30.pillarTitle", { num: idx + 1 })}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePillar(idx)}
                  className="text-xs px-2 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.vision30.remove")}
                </button>
              </div>

              {/* Title & Metric Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("form.vision30.pillarTitle", { num: idx + 1 })}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={pillar.title}
                    onChange={(e) => handleUpdatePillar(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("form.vision30.pillarMetric", { num: idx + 1 })}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={pillar.metric}
                    onChange={(e) => handleUpdatePillar(idx, "metric", e.target.value)}
                  />
                </div>
              </div>

              {/* National Target using MarkdownEditor */}
              <div>
                <label className={labelClass}>{t("form.vision30.nationalTarget")}</label>
                <MarkdownEditor
                  markdown={pillar.nationalTarget || ""}
                  onChange={(val) => handleUpdatePillar(idx, "nationalTarget", val)}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
              </div>

              {/* Project Contribution using MarkdownEditor */}
              <div>
                <label className={labelClass}>{t("form.vision30.projectContribution")}</label>
                <MarkdownEditor
                  markdown={pillar.projectContribution || ""}
                  onChange={(val) => handleUpdatePillar(idx, "projectContribution", val)}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.vision30.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.vision30.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={visionData.additionalContent || ""}
            onChange={(value) => updateVisionField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>
    </div>
  );
}

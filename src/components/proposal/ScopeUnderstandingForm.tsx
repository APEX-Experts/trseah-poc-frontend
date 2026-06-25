/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { parseScopeUnderstandingData, ScopeUnderstandingData } from "@/lib/proposal-utils";
import MarkdownEditor from "../ui/markdown-editor";

interface ScopeUnderstandingFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  isDisabled?: boolean;
}

export default function ScopeUnderstandingForm({
  content,
  onChange,
  isRtl,
  isDisabled = false,
}: ScopeUnderstandingFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [scopeData, setScopeData] = useState<ScopeUnderstandingData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseScopeUnderstandingData(content, isRtl);
    setScopeData(parsed);
  }, [content, isRtl]);

  // Update field and serialize to JSON
  const updateScopeField = (
    key: keyof ScopeUnderstandingData,
    value: ScopeUnderstandingData[keyof ScopeUnderstandingData],
  ) => {
    if (!scopeData) return;
    const updated = { ...scopeData, [key]: value };
    setScopeData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!scopeData) return null;

  const requirements = scopeData.requirements || [];
  const goals = scopeData.goals || [];

  // Requirements operations
  const handleAddRequirement = () => {
    const updatedReqs = [...requirements, { requirement: "", classification: "", alignment: "" }];
    updateScopeField("requirements", updatedReqs);
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedReqs = requirements.filter((_, i) => i !== index);
    updateScopeField("requirements", updatedReqs);
  };

  const handleUpdateRequirement = (
    index: number,
    key: "requirement" | "classification" | "alignment",
    val: string,
  ) => {
    const updatedReqs = requirements.map((item, i) =>
      i === index ? { ...item, [key]: val } : item,
    );
    updateScopeField("requirements", updatedReqs);
  };

  // Goals operations
  const handleAddGoal = () => {
    const updatedGoals = [...goals, ""];
    updateScopeField("goals", updatedGoals);
  };

  const handleRemoveGoal = (index: number) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    updateScopeField("goals", updatedGoals);
  };

  const handleUpdateGoal = (index: number, val: string) => {
    const updatedGoals = goals.map((item, i) => (i === index ? val : item));
    updateScopeField("goals", updatedGoals);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title & Subtitle */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.scopeUnderstanding.coreContent")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>{t("form.scopeUnderstanding.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={scopeData.title}
              onChange={(e) => updateScopeField("title", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.scopeUnderstanding.subtitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={scopeData.subtitle}
              onChange={(e) => updateScopeField("subtitle", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {/* Core Requirements Table Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.scopeUnderstanding.requirements")}
          </h3>
          <button
            type="button"
            onClick={handleAddRequirement}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.scopeUnderstanding.addRequirement")}
          </button>
        </div>

        <div className="space-y-3">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-end border border-neutral-100 p-3 rounded-xl bg-neutral-50/20"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className={labelClass}>
                    {t("form.scopeUnderstanding.requirementTitle", { num: idx + 1 })}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={req.requirement}
                    onChange={(e) => handleUpdateRequirement(idx, "requirement", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("form.scopeUnderstanding.requirementClass")}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={req.classification}
                    onChange={(e) => handleUpdateRequirement(idx, "classification", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("form.scopeUnderstanding.requirementAlign")}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={req.alignment}
                    onChange={(e) => handleUpdateRequirement(idx, "alignment", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(idx)}
                disabled={isDisabled}
                className="text-xs px-2.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end mb-0.5"
              >
                {t("form.scopeUnderstanding.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Goals Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.scopeUnderstanding.goals")}
          </h3>
          <button
            type="button"
            onClick={handleAddGoal}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.scopeUnderstanding.addGoal")}
          </button>
        </div>

        <div className="space-y-3">
          {goals.map((goal, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-end border border-neutral-100 p-3 rounded-xl bg-neutral-50/20"
            >
              <div className="flex-1">
                <label className={labelClass}>
                  {t("form.scopeUnderstanding.goalText", { num: idx + 1 })}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={goal}
                  disabled={isDisabled}
                  onChange={(e) => handleUpdateGoal(idx, e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveGoal(idx)}
                disabled={isDisabled}
                className="text-xs px-2.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end mb-0.5"
              >
                {t("form.scopeUnderstanding.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.scopeUnderstanding.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.scopeUnderstanding.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={scopeData.additionalContent || ""}
            onChange={(value) => updateScopeField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}

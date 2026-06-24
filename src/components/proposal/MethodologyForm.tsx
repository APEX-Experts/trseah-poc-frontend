/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  parseMethodologyData,
  MethodologyData,
  MethodologyStep,
  MethodologyDeliverable,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface MethodologyFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
}

export default function MethodologyForm({ content, onChange, isRtl }: MethodologyFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [dataState, setDataState] = useState<MethodologyData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseMethodologyData(content, isRtl);
    setDataState(parsed);
  }, [content, isRtl]);

  // Update field and serialize to JSON
  const updateField = (
    key: keyof MethodologyData,
    value: MethodologyData[keyof MethodologyData],
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

  const steps = dataState.steps || [];
  const deliverables = dataState.deliverables || [];

  // Step operations
  const handleAddStep = () => {
    const nextNumber = steps.length > 0 ? Math.max(...steps.map((s) => s.number)) + 1 : 1;
    const newStep: MethodologyStep = {
      number: nextNumber,
      title: "",
      duration: "",
      description: "",
    };
    updateField("steps", [...steps, newStep]);
  };

  const handleRemoveStep = (index: number) => {
    const updated = steps
      .filter((_, i) => i !== index)
      .map((step, idx) => ({ ...step, number: idx + 1 }));
    updateField("steps", updated);
  };

  const handleUpdateStep = (
    index: number,
    key: keyof MethodologyStep,
    val: MethodologyStep[keyof MethodologyStep],
  ) => {
    const updated = steps.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("steps", updated);
  };

  // Deliverable operations
  const handleAddDeliverable = () => {
    const newDeliv: MethodologyDeliverable = {
      phase: "",
      deliverable: "",
      criterion: "",
    };
    updateField("deliverables", [...deliverables, newDeliv]);
  };

  const handleRemoveDeliverable = (index: number) => {
    const updated = deliverables.filter((_, i) => i !== index);
    updateField("deliverables", updated);
  };

  const handleUpdateDeliverable = (
    index: number,
    key: keyof MethodologyDeliverable,
    val: string,
  ) => {
    const updated = deliverables.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("deliverables", updated);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title & Subtitle */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.methodology.coreContent")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>{t("form.methodology.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={dataState.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.methodology.subtitle")}</label>
            <MarkdownEditor
              markdown={dataState.subtitle || ""}
              onChange={(value) => updateField("subtitle", value)}
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </div>
      </div>

      {/* Steps List Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.methodology.stepsList")}
          </h3>
          <button
            type="button"
            onClick={handleAddStep}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.methodology.addStep")}
          </button>
        </div>

        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-5 rounded-2xl bg-neutral-50/10 space-y-4 relative text-start"
            >
              {/* Step Header */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-800 bg-primary-800/5 px-2.5 py-1 rounded-md">
                  #{step.number}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveStep(idx)}
                  className="text-xs px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.methodology.remove")}
                </button>
              </div>

              {/* Title & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("form.methodology.stepTitle")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={step.title}
                    onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.methodology.duration")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={step.duration}
                    onChange={(e) => handleUpdateStep(idx, "duration", e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>{t("form.methodology.stepDesc")}</label>
                <MarkdownEditor
                  markdown={step.description || ""}
                  onChange={(val) => handleUpdateStep(idx, "description", val)}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverables Acceptance Table Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.methodology.deliverables")}
          </h3>
          <button
            type="button"
            onClick={handleAddDeliverable}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.methodology.addDeliverable")}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t("form.methodology.matrixTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={dataState.deliverablesTitle}
            onChange={(e) => updateField("deliverablesTitle", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {deliverables.map((deliv, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-3 items-end border border-neutral-100 p-4 rounded-xl bg-neutral-50/5 relative"
            >
              <div className="flex-1 w-full">
                <label className={labelClass}>{t("form.methodology.phase")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={deliv.phase}
                  onChange={(e) => handleUpdateDeliverable(idx, "phase", e.target.value)}
                />
              </div>
              <div className="flex-2 w-full">
                <label className={labelClass}>{t("form.methodology.deliverable")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={deliv.deliverable}
                  onChange={(e) => handleUpdateDeliverable(idx, "deliverable", e.target.value)}
                />
              </div>
              <div className="flex-1 w-full">
                <label className={labelClass}>{t("form.methodology.criterion")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={deliv.criterion}
                  onChange={(e) => handleUpdateDeliverable(idx, "criterion", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDeliverable(idx)}
                className="text-xs p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end sm:mb-0.5"
              >
                {t("form.methodology.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.methodology.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.methodology.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={dataState.additionalContent || ""}
            onChange={(value) => updateField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { parseExecutiveSummaryData, ExecutiveSummaryData } from "@/lib/proposal-utils";
import MarkdownEditor from "../ui/markdown-editor";

interface ExecutiveSummaryFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  isDisabled?: boolean;
}

export default function ExecutiveSummaryForm({
  content,
  onChange,
  isRtl,
  isDisabled,
}: ExecutiveSummaryFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // Executive Summary State
  const [executiveSummaryData, setExecutiveSummaryData] = useState<ExecutiveSummaryData | null>(
    null,
  );

  // Parse initial content
  useEffect(() => {
    const parsed = parseExecutiveSummaryData(content, isRtl);
    setExecutiveSummaryData(parsed);
  }, [content, isRtl]);

  // Handle Executive Summary updates
  const updateExecutiveSummaryField = (
    key: keyof ExecutiveSummaryData,
    value: ExecutiveSummaryData[keyof ExecutiveSummaryData],
  ) => {
    if (!executiveSummaryData) return;
    const updated = { ...executiveSummaryData, [key]: value };
    setExecutiveSummaryData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!executiveSummaryData) return null;

  const roadmap = executiveSummaryData.roadmap || [];
  const features = executiveSummaryData.features || [];

  const handleAddPhase = () => {
    const updatedRoadmap = [...roadmap, { title: "", duration: "" }];
    updateExecutiveSummaryField("roadmap", updatedRoadmap);
  };

  const handleRemovePhase = (index: number) => {
    const updatedRoadmap = roadmap.filter((_, i) => i !== index);
    updateExecutiveSummaryField("roadmap", updatedRoadmap);
  };

  const handleUpdatePhase = (index: number, key: "title" | "duration", val: string) => {
    const updatedRoadmap = roadmap.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateExecutiveSummaryField("roadmap", updatedRoadmap);
  };

  const handleAddFeature = () => {
    const updatedFeatures = [...features, { title: "", desc: "" }];
    updateExecutiveSummaryField("features", updatedFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    updateExecutiveSummaryField("features", updatedFeatures);
  };

  const handleUpdateFeature = (index: number, key: "title" | "desc", val: string) => {
    const updatedFeatures = features.map((item, i) =>
      i === index ? { ...item, [key]: val } : item,
    );
    updateExecutiveSummaryField("features", updatedFeatures);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Core Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.executiveSummary.coreContent")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.executiveSummary.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={executiveSummaryData.title}
              onChange={(e) => updateExecutiveSummaryField("title", e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.executiveSummary.subtitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={executiveSummaryData.subtitle}
              onChange={(e) => updateExecutiveSummaryField("subtitle", e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("form.executiveSummary.description")}</label>
          <MarkdownEditor
            markdown={executiveSummaryData.description || ""}
            onChange={(value) => updateExecutiveSummaryField("description", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
            disabled={isDisabled}
          />
        </div>
      </div>

      {/* Core Metrics */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.executiveSummary.metrics")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>{t("form.executiveSummary.contractValue")}</label>
                <button
                  type="button"
                  onClick={() => {
                    updateExecutiveSummaryField("contractValue", "");
                    updateExecutiveSummaryField("contractValueSub", "");
                  }}
                  disabled={isDisabled}
                  className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded transition-all"
                >
                  ✕ {t("form.executiveSummary.remove")}
                </button>
              </div>
              <input
                type="text"
                className={inputClass}
                value={executiveSummaryData.contractValue}
                onChange={(e) => updateExecutiveSummaryField("contractValue", e.target.value)}
                disabled={isDisabled}
              />
              <div className="mt-2">
                <label className="text-[10px] font-bold text-neutral-400 block text-start">
                  {t("form.executiveSummary.subLabel")}
                </label>
                <input
                  type="text"
                  className="w-full border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-800 bg-white text-start mt-0.5"
                  value={executiveSummaryData.contractValueSub}
                  onChange={(e) => updateExecutiveSummaryField("contractValueSub", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>{t("form.executiveSummary.endUsers")}</label>
                <button
                  type="button"
                  onClick={() => {
                    updateExecutiveSummaryField("usersCount", "");
                    updateExecutiveSummaryField("usersCountSub", "");
                  }}
                  disabled={isDisabled}
                  className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded transition-all"
                >
                  ✕ {t("form.executiveSummary.remove")}
                </button>
              </div>
              <input
                type="text"
                className={inputClass}
                value={executiveSummaryData.usersCount}
                onChange={(e) => updateExecutiveSummaryField("usersCount", e.target.value)}
                disabled={isDisabled}
              />
              <div className="mt-2">
                <label className="text-[10px] font-bold text-neutral-400 block text-start">
                  {t("form.executiveSummary.subLabel")}
                </label>
                <input
                  type="text"
                  className="w-full border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-800 bg-white text-start mt-0.5"
                  value={executiveSummaryData.usersCountSub}
                  onChange={(e) => updateExecutiveSummaryField("usersCountSub", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>{t("form.executiveSummary.executionDuration")}</label>
                <button
                  type="button"
                  onClick={() => {
                    updateExecutiveSummaryField("duration", "");
                    updateExecutiveSummaryField("durationSub", "");
                  }}
                  disabled={isDisabled}
                  className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded transition-all"
                >
                  ✕ {t("form.executiveSummary.remove")}
                </button>
              </div>
              <input
                type="text"
                className={inputClass}
                value={executiveSummaryData.duration}
                onChange={(e) => updateExecutiveSummaryField("duration", e.target.value)}
                disabled={isDisabled}
              />
              <div className="mt-2">
                <label className="text-[10px] font-bold text-neutral-400 block text-start">
                  {t("form.executiveSummary.subLabel")}
                </label>
                <input
                  type="text"
                  className="w-full border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-800 bg-white text-start mt-0.5"
                  value={executiveSummaryData.durationSub}
                  onChange={(e) => updateExecutiveSummaryField("durationSub", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="border border-neutral-100 rounded-xl p-3 bg-neutral-50/50 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={labelClass}>{t("form.executiveSummary.matchRate")}</label>
                <button
                  type="button"
                  onClick={() => {
                    updateExecutiveSummaryField("matchRate", "");
                    updateExecutiveSummaryField("matchRateSub", "");
                  }}
                  disabled={isDisabled}
                  className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded transition-all"
                >
                  ✕ {t("form.executiveSummary.remove")}
                </button>
              </div>
              <input
                type="text"
                className={inputClass}
                value={executiveSummaryData.matchRate}
                onChange={(e) => updateExecutiveSummaryField("matchRate", e.target.value)}
                disabled={isDisabled}
              />
              <div className="mt-2">
                <label className="text-[10px] font-bold text-neutral-400 block text-start">
                  {t("form.executiveSummary.subLabel")}
                </label>
                <input
                  type="text"
                  className="w-full border border-neutral-200 rounded-lg px-2.5 py-1 text-xs text-neutral-800 bg-white text-start mt-0.5"
                  value={executiveSummaryData.matchRateSub}
                  onChange={(e) => updateExecutiveSummaryField("matchRateSub", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.executiveSummary.roadmap")}
          </h3>
          <button
            type="button"
            onClick={handleAddPhase}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.executiveSummary.addPhase")}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t("form.executiveSummary.roadmapTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={executiveSummaryData.roadmapTitle}
            onChange={(e) => updateExecutiveSummaryField("roadmapTitle", e.target.value)}
            disabled={isDisabled}
          />
        </div>

        <div className="space-y-3">
          {roadmap.map((phase, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-end border border-neutral-100 p-3 rounded-xl bg-neutral-50/20"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>
                    {t("form.executiveSummary.phase", { num: idx + 1 })} -{" "}
                    {t("form.executiveSummary.phaseTitle")}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={phase.title}
                    onChange={(e) => handleUpdatePhase(idx, "title", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.executiveSummary.phaseDuration")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={phase.duration}
                    onChange={(e) => handleUpdatePhase(idx, "duration", e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePhase(idx)}
                disabled={isDisabled}
                className="text-xs px-2.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end mb-0.5"
              >
                {t("form.executiveSummary.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.executiveSummary.pillars")}
          </h3>
          <button
            type="button"
            onClick={handleAddFeature}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.executiveSummary.addPillar")}
          </button>
        </div>

        <div className="space-y-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="border border-neutral-100 rounded-xl p-4 bg-neutral-50/30 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveFeature(idx)}
                disabled={isDisabled}
                className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} text-xs px-2 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold`}
              >
                {t("form.executiveSummary.remove")}
              </button>
              <div className="max-w-[80%]">
                <label className={labelClass}>
                  {t("form.executiveSummary.pillarTitle", { num: idx + 1 })}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={feature.title}
                  disabled={isDisabled}
                  onChange={(e) => handleUpdateFeature(idx, "title", e.target.value)}
                />
              </div>
              <div className="mt-3">
                <label className={labelClass}>
                  {t("form.executiveSummary.pillarDesc", { num: idx + 1 })}
                </label>
                <MarkdownEditor
                  markdown={feature.desc || ""}
                  onChange={(value) => handleUpdateFeature(idx, "desc", value)}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  disabled={isDisabled}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.executiveSummary.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.executiveSummary.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={executiveSummaryData.additionalContent || ""}
            onChange={(value) => updateExecutiveSummaryField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}

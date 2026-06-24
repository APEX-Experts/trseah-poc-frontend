/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  parseTimelineData,
  TimelineData,
  TimelinePhase,
  TimelineMilestone,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface TimelineFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
}

export default function TimelineForm({ content, onChange, isRtl }: TimelineFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [dataState, setDataState] = useState<TimelineData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseTimelineData(content, isRtl);
    setDataState(parsed);
  }, [content, isRtl]);

  // Update field and serialize to JSON
  const updateField = (key: keyof TimelineData, value: TimelineData[keyof TimelineData]) => {
    if (!dataState) return;
    const updated = { ...dataState, [key]: value };
    setDataState(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!dataState) return null;

  const phases = dataState.phases || [];
  const milestones = dataState.milestones || [];

  // Phase operations
  const handleAddPhase = () => {
    const newPhase: TimelinePhase = {
      title: "",
      duration: isRtl ? "الشهر 1 - 3" : "Month 1 - 3",
      durationLabel: isRtl ? "3 أشهر" : "3 Months",
      startMonth: 1,
      endMonth: 3,
    };
    updateField("phases", [...phases, newPhase]);
  };

  const handleRemovePhase = (index: number) => {
    const updated = phases.filter((_, i) => i !== index);
    updateField("phases", updated);
  };

  const handleUpdatePhase = (index: number, key: keyof TimelinePhase, val: string | number) => {
    const updated = phases.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("phases", updated);
  };

  // Milestone operations
  const handleAddMilestone = () => {
    const nextNum = milestones.length + 1;
    const newMilestone: TimelineMilestone = {
      code: `M${nextNum}`,
      description: "",
      targetDate: "",
      owner: "",
    };
    updateField("milestones", [...milestones, newMilestone]);
  };

  const handleRemoveMilestone = (index: number) => {
    const updated = milestones.filter((_, i) => i !== index);
    updateField("milestones", updated);
  };

  const handleUpdateMilestone = (index: number, key: keyof TimelineMilestone, val: string) => {
    const updated = milestones.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("milestones", updated);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.timeline.coreContent")}
        </h3>

        <div>
          <label className={labelClass}>{t("form.timeline.mainTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={dataState.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>
      </div>

      {/* Phases Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.timeline.phasesList")}
          </h3>
          <button
            type="button"
            onClick={handleAddPhase}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.timeline.addPhase")}
          </button>
        </div>

        <div className="space-y-6">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-5 rounded-2xl bg-neutral-50/10 space-y-4 relative text-start"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-800 bg-primary-800/5 px-2.5 py-1 rounded-md">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemovePhase(idx)}
                  className="text-xs px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.timeline.remove")}
                </button>
              </div>

              {/* Title & Duration Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("form.timeline.phaseTitle")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={phase.title}
                    onChange={(e) => handleUpdatePhase(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.timeline.duration")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={phase.duration}
                    onChange={(e) => handleUpdatePhase(idx, "duration", e.target.value)}
                  />
                </div>
              </div>

              {/* Label, Start & End Month */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>{t("form.timeline.durationLabel")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={phase.durationLabel}
                    onChange={(e) => handleUpdatePhase(idx, "durationLabel", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.timeline.startMonth")}</label>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={phase.startMonth}
                    onChange={(e) =>
                      handleUpdatePhase(idx, "startMonth", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.timeline.endMonth")}</label>
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={phase.endMonth}
                    onChange={(e) =>
                      handleUpdatePhase(idx, "endMonth", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.timeline.milestones")}
          </h3>
          <button
            type="button"
            onClick={handleAddMilestone}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.timeline.addMilestone")}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t("form.timeline.matrixTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={dataState.milestonesTitle}
            onChange={(e) => updateField("milestonesTitle", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-3 items-end border border-neutral-100 p-4 rounded-xl bg-neutral-50/5 relative"
            >
              <div className="w-16">
                <label className={labelClass}>{t("form.timeline.code")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={milestone.code}
                  onChange={(e) => handleUpdateMilestone(idx, "code", e.target.value)}
                />
              </div>
              <div className="flex-1 w-full">
                <label className={labelClass}>{t("form.timeline.description")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={milestone.description}
                  onChange={(e) => handleUpdateMilestone(idx, "description", e.target.value)}
                />
              </div>
              <div className="w-full sm:w-36">
                <label className={labelClass}>{t("form.timeline.targetDate")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={milestone.targetDate}
                  onChange={(e) => handleUpdateMilestone(idx, "targetDate", e.target.value)}
                />
              </div>
              <div className="w-full sm:w-36">
                <label className={labelClass}>{t("form.timeline.owner")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={milestone.owner}
                  onChange={(e) => handleUpdateMilestone(idx, "owner", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMilestone(idx)}
                className="text-xs p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end sm:mb-0.5"
              >
                {t("form.timeline.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Markdown Content */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.timeline.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.timeline.additionalContentDesc")}
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

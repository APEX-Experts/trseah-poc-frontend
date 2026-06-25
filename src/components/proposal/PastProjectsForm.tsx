/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  parsePastProjectsData,
  PastProjectsData,
  PastProjectItem,
  ProposalDto,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface PastProjectsFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
  isDisabled?: boolean;
}

export default function PastProjectsForm({
  content,
  onChange,
  isRtl,
  proposalData,
  isDisabled = false,
}: PastProjectsFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [dataState, setDataState] = useState<PastProjectsData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parsePastProjectsData(content, isRtl, proposalData);
    setDataState(parsed);
  }, [content, isRtl, proposalData]);

  // Update field and serialize to JSON
  const updateField = (
    key: keyof PastProjectsData,
    value: PastProjectsData[keyof PastProjectsData],
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

  const projects = dataState.projects || [];

  // Project operations
  const handleAddProject = () => {
    const newProject: PastProjectItem = {
      title: "",
      clientName: "",
      value: "",
      year: new Date().getFullYear().toString(),
      description: "",
      metrics: [],
    };
    updateField("projects", [...projects, newProject]);
  };

  const handleRemoveProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    updateField("projects", updated);
  };

  const handleUpdateProject = (
    index: number,
    key: keyof PastProjectItem,
    val: PastProjectItem[keyof PastProjectItem],
  ) => {
    const updated = projects.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateField("projects", updated);
  };

  // Metric operations per project
  const handleAddMetric = (projIdx: number) => {
    const updatedMetrics = [...(projects[projIdx].metrics || []), ""];
    handleUpdateProject(projIdx, "metrics", updatedMetrics);
  };

  const handleRemoveMetric = (projIdx: number, metricIdx: number) => {
    const updatedMetrics = (projects[projIdx].metrics || []).filter((_, i) => i !== metricIdx);
    handleUpdateProject(projIdx, "metrics", updatedMetrics);
  };

  const handleUpdateMetric = (projIdx: number, metricIdx: number, val: string) => {
    const updatedMetrics = (projects[projIdx].metrics || []).map((m, i) =>
      i === metricIdx ? val : m,
    );
    handleUpdateProject(projIdx, "metrics", updatedMetrics);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title & Subtitle */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.pastProjects.coreContent")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>{t("form.pastProjects.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={dataState.title}
              disabled={isDisabled}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.pastProjects.subtitle")}</label>
            <MarkdownEditor
              markdown={dataState.subtitle || ""}
              onChange={(value) => updateField("subtitle", value)}
              dir={locale === "ar" ? "rtl" : "ltr"}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {/* Projects List Editor */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.pastProjects.projectsList")}
          </h3>
          <button
            type="button"
            onClick={handleAddProject}
            disabled={isDisabled}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.pastProjects.addProject")}
          </button>
        </div>

        <div className="space-y-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-5 rounded-2xl  page-bg bg-neutral-50/10 space-y-4 relative text-start"
            >
              {/* Remove Project Button */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-800 bg-primary-800/5 px-2.5 py-1 rounded-md">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(idx)}
                  disabled={isDisabled}
                  className="text-xs px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.pastProjects.remove")}
                </button>
              </div>

              {/* Title, Client, Value, Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("form.pastProjects.projectTitle")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={project.title}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateProject(idx, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.pastProjects.clientName")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={project.clientName}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateProject(idx, "clientName", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.pastProjects.contractValue")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={project.value}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateProject(idx, "value", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.pastProjects.completionYear")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={project.year}
                    disabled={isDisabled}
                    onChange={(e) => handleUpdateProject(idx, "year", e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>{t("form.pastProjects.projectDesc")}</label>
                <MarkdownEditor
                  markdown={project.description || ""}
                  onChange={(val) => handleUpdateProject(idx, "description", val)}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  disabled={isDisabled}
                />
              </div>

              {/* Project Metrics / Badges */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-700">
                    {t("form.pastProjects.metricsTitle")}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddMetric(idx)}
                    disabled={isDisabled}
                    className="text-[10px] px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg transition-all"
                  >
                    + {t("form.pastProjects.addMetric")}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.metrics &&
                    project.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className={inputClass}
                          value={metric}
                          disabled={isDisabled}
                          onChange={(e) => handleUpdateMetric(idx, mIdx, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMetric(idx, mIdx)}
                          disabled={isDisabled}
                          className="text-xs p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.pastProjects.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.pastProjects.additionalContentDesc")}
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

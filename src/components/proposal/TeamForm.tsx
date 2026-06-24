/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  parseTeamGovernanceData,
  TeamGovernanceData,
  TeamMemberCard,
  TeamDivision,
  ProposalDto,
  TEAM_ICONS,
  TeamIconType,
  TEAM_ICON_MAP,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";
import { User } from "lucide-react";

interface TeamFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
}

export default function TeamForm({ content, onChange, isRtl, proposalData }: TeamFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [teamData, setTeamData] = useState<TeamGovernanceData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parseTeamGovernanceData(content, isRtl, proposalData);
    setTeamData(parsed);
  }, [content, isRtl, proposalData]);

  // Update field and serialize to JSON
  const updateTeamField = (
    key: keyof TeamGovernanceData,
    value: TeamGovernanceData[keyof TeamGovernanceData],
  ) => {
    if (!teamData) return;
    const updated = { ...teamData, [key]: value };
    setTeamData(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!teamData) return null;

  const members = teamData.members || [];
  const divisions = teamData.divisions || [];

  // Member operations
  const handleAddMember = () => {
    const newMember: TeamMemberCard = {
      icon: "User",
      name: "",
      role: "",
      bio: "",
    };
    updateTeamField("members", [...members, newMember]);
  };

  const handleRemoveMember = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    updateTeamField("members", updated);
  };

  const handleUpdateMember = (index: number, key: keyof TeamMemberCard, val: string) => {
    const updated = members.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateTeamField("members", updated);
  };

  // Division operations
  const handleAddDivision = () => {
    const newDiv: TeamDivision = {
      department: "",
      responsibility: "",
      count: "",
      location: "",
    };
    updateTeamField("divisions", [...divisions, newDiv]);
  };

  const handleRemoveDivision = (index: number) => {
    const updated = divisions.filter((_, i) => i !== index);
    updateTeamField("divisions", updated);
  };

  const handleUpdateDivision = (index: number, key: keyof TeamDivision, val: string) => {
    const updated = divisions.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    updateTeamField("divisions", updated);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title & Subtitle */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.team.coreContent")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>{t("form.team.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={teamData.title}
              onChange={(e) => updateTeamField("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.team.subtitle")}</label>
            <MarkdownEditor
              markdown={teamData.subtitle || ""}
              onChange={(value) => updateTeamField("subtitle", value)}
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </div>
      </div>

      {/* Leadership Members */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.team.membersList")}
          </h3>
          <button
            type="button"
            onClick={handleAddMember}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.team.addMember")}
          </button>
        </div>

        <div className="space-y-4">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-4 rounded-xl bg-neutral-50/10 space-y-4 relative text-start"
            >
              {/* Header row with delete */}
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <span className="text-xs font-bold text-primary-800">
                  {t("form.team.name")} #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(idx)}
                  className="text-xs px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.team.remove")}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className={labelClass}>{t("form.team.initials")}</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-600 flex items-center justify-center shrink-0">
                      {(() => {
                        const IconComponent = TEAM_ICON_MAP[member.icon as TeamIconType] ?? User;
                        return <IconComponent className="w-5 h-5" />;
                      })()}
                    </div>
                    <select
                      className={inputClass}
                      value={member.icon || "User"}
                      onChange={(e) => handleUpdateMember(idx, "icon", e.target.value)}
                    >
                      {TEAM_ICONS.map((ico) => (
                        <option key={ico} value={ico}>
                          {t(`form.team.icons.${ico}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{t("form.team.name")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={member.name}
                    onChange={(e) => handleUpdateMember(idx, "name", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("form.team.role")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={member.role}
                    onChange={(e) => handleUpdateMember(idx, "role", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.team.bio")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={member.bio}
                    onChange={(e) => handleUpdateMember(idx, "bio", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allocation Matrix Table */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.team.divisions")}
          </h3>
          <button
            type="button"
            onClick={handleAddDivision}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.team.addDivision")}
          </button>
        </div>

        <div>
          <label className={labelClass}>{t("form.team.matrixTitle")}</label>
          <input
            type="text"
            className={inputClass}
            value={teamData.divisionsTitle}
            onChange={(e) => updateTeamField("divisionsTitle", e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {divisions.map((div, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-3 items-end border border-neutral-100 p-4 rounded-xl bg-neutral-50/5 relative"
            >
              <div className="flex-2 w-full text-start">
                <label className={labelClass}>{t("form.team.department")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={div.department}
                  onChange={(e) => handleUpdateDivision(idx, "department", e.target.value)}
                />
              </div>
              <div className="flex-3 w-full text-start">
                <label className={labelClass}>{t("form.team.responsibility")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={div.responsibility}
                  onChange={(e) => handleUpdateDivision(idx, "responsibility", e.target.value)}
                />
              </div>
              <div className="flex-1 w-full text-start">
                <label className={labelClass}>{t("form.team.count")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={div.count}
                  onChange={(e) => handleUpdateDivision(idx, "count", e.target.value)}
                />
              </div>
              <div className="flex-2 w-full text-start">
                <label className={labelClass}>{t("form.team.location")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={div.location}
                  onChange={(e) => handleUpdateDivision(idx, "location", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDivision(idx)}
                className="text-xs p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end sm:mb-0.5"
              >
                {t("form.team.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Content (Optional Markdown) */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.team.additionalContent")}</label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.team.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={teamData.additionalContent || ""}
            onChange={(value) => updateTeamField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>
    </div>
  );
}

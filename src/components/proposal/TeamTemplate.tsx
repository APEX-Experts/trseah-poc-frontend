import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseTeamGovernanceData, TEAM_ICON_MAP, TeamIconType } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { User } from "lucide-react";

function TeamTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseTeamGovernanceData(content, isRtl, proposalData);

  const companyName = isRtl
    ? proposalData?.organization?.nameAr || "شركة الراشد للحلول الرقمية"
    : proposalData?.organization?.nameEn ||
      proposalData?.organization?.nameAr ||
      "Al-Rashed Digital Solutions Company";

  const entityName = isRtl
    ? tenderData?.entityNameAr || "وزارة الاتصالات وتقنية المعلومات"
    : tenderData?.entityNameEn ||
      tenderData?.entityNameAr ||
      "Ministry of Communications and Information Technology";

  const projectTitle = isRtl
    ? tenderData?.titleAr || requestData?.rfpExternalDescription || "منصة التحول الرقمي"
    : tenderData?.titleEn ||
      tenderData?.titleAr ||
      requestData?.rfpExternalDescription ||
      "Digital Transformation Platform";

  const hasTitle = data.title && data.title.trim() !== "";
  const hasSubtitle = data.subtitle && data.subtitle.trim() !== "";

  return (
    <div className="flex-1 overflow-y-auto p-2 bg-neutral-100/50">
      <div
        className="w-full aspect-[1/1.414] bg-white text-neutral-800 rounded-2xl shadow-xl overflow-y-auto border border-neutral-200/50 flex flex-col justify-between relative p-8 sm:p-10 select-none"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary-500" />

        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{isRtl ? "الفريق والحوكمة" : "Team & Governance"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-5 flex-1 min-h-0">
          {/* Section Title with Vertical Accent Line */}
          {(hasTitle || hasSubtitle) && (
            <div
              className={`${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"} border-primary-500`}
            >
              {hasTitle && (
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-primary-800">
                  {data.title}
                </h1>
              )}
              {hasSubtitle && (
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  {data.subtitle}
                </p>
              )}
            </div>
          )}

          {/* 4 Leadership cards */}
          {data.members && data.members.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {data.members.map((member, idx) => {
                const IconComponent = TEAM_ICON_MAP[member.icon as TeamIconType] ?? User;
                return (
                  <div
                    key={idx}
                    className="bg-primary-800 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md relative border border-white/5"
                  >
                    {/* Icon Circle */}
                    <div className="w-12 h-12 rounded-full bg-primary-500 text-primary-800 flex items-center justify-center border-2 border-white/10 shadow-inner mb-3">
                      <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    {member.name && (
                      <span className="text-xs sm:text-sm font-extrabold text-white block truncate w-full">
                        {member.name}
                      </span>
                    )}
                    {member.role && (
                      <span className="text-[9px] sm:text-[10px] text-primary-500 font-bold mt-1 block truncate w-full">
                        {member.role}
                      </span>
                    )}
                    {member.bio && (
                      <span className="text-[8px] sm:text-[9px] text-neutral-300 mt-2 block w-full leading-normal">
                        {member.bio}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Allocation Table */}
          {data.divisions && data.divisions.length > 0 && (
            <div className="space-y-3 mt-2">
              {data.divisionsTitle && (
                <h3 className="text-xs sm:text-sm font-extrabold text-start text-primary-800">
                  {data.divisionsTitle}
                </h3>
              )}
              <div className="overflow-hidden border border-neutral-200/85 rounded-xl">
                <table className="w-full text-start border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-1/4`}>
                        {isRtl ? "الفريق / القسم" : "Team / Department"}
                      </th>
                      <th className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-1/2`}>
                        {isRtl ? "المسؤولية الرئيسية" : "Key Responsibility"}
                      </th>
                      <th className={`p-2.5 font-bold text-center w-1/12`}>
                        {isRtl ? "العدد" : "Count"}
                      </th>
                      <th className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-1/6`}>
                        {isRtl ? "الموقع" : "Location"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.divisions.map((item, dIdx) => (
                      <tr
                        key={dIdx}
                        className={`${dIdx % 2 === 1 ? "bg-neutral-50" : "bg-white"} border-t border-neutral-100`}
                      >
                        <td className="p-2.5 font-bold text-primary-800">{item.department}</td>
                        <td className="p-2.5 text-neutral-600 font-medium">
                          {item.responsibility}
                        </td>
                        <td className="p-2.5 text-center text-neutral-600 font-bold">
                          {item.count}
                        </td>
                        <td className="p-2.5 text-neutral-600 font-medium">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Additional Markdown Content */}
          {data.additionalContent && (
            <div className="prose prose-neutral max-w-none text-xs leading-relaxed text-justify border-t border-neutral-100 pt-3 mt-1">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {data.additionalContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-4 text-[9px] text-neutral-400">
          <div>{isRtl ? "سري وخاص" : "Confidential & Private"}</div>
          <div className="font-mono font-bold">8</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default TeamTemplate;

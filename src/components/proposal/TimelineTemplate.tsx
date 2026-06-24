import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseTimelineData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function TimelineTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseTimelineData(content, isRtl);

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

  // Calculate total months for the Gantt timeline bar
  const maxEndMonth =
    data.phases && data.phases.length > 0
      ? Math.max(...data.phases.map((p) => p.endMonth || 1))
      : 18;
  const totalMonths = Math.max(maxEndMonth, 18); // Default to at least 18 months

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
          <div>{isRtl ? "الخطة الزمنية" : "Project Timeline"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-5 flex-1 min-h-0">
          {/* Section Title with Vertical Accent Line */}
          {data.title && (
            <div
              className={`${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"} border-primary-500`}
            >
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-primary-800">
                {data.title}
              </h1>
            </div>
          )}

          {/* Timeline Phases Gantt Chart */}
          {data.phases && data.phases.length > 0 && (
            <div className="space-y-4">
              {data.phases.map((phase, idx) => {
                const startMonth = Math.max(1, phase.startMonth || 1);
                const endMonth = Math.max(startMonth, phase.endMonth || 1);

                return (
                  <div key={idx} className="space-y-1 text-start">
                    {/* Phase Info Row */}
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                      <span className="text-primary-800 font-black">{phase.title}</span>
                      <span className="text-neutral-400">{phase.duration}</span>
                    </div>

                    {/* Gantt Bar Container */}
                    <div className="w-full bg-neutral-100 rounded-lg p-1">
                      <div
                        className="w-full h-7 relative grid"
                        style={{
                          gridTemplateColumns: `repeat(${totalMonths}, minmax(0, 1fr))`,
                        }}
                      >
                        <div
                          className="h-full bg-primary-800 text-white text-[10px] font-bold flex items-center justify-center rounded-md"
                          style={{
                            gridColumnStart: startMonth,
                            gridColumnEnd: endMonth + 1,
                          }}
                        >
                          {phase.durationLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Key Milestones Section */}
          {data.milestones && data.milestones.length > 0 && (
            <div className="space-y-3 mt-2 text-start">
              {data.milestonesTitle && (
                <h3 className="text-xs sm:text-sm font-extrabold text-primary-800">
                  {data.milestonesTitle}
                </h3>
              )}
              <div className="overflow-hidden border border-neutral-200/85 rounded-xl">
                <table className="w-full text-start border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[15%]`}
                      >
                        {isRtl ? "المعلم" : "Milestone"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[45%]`}
                      >
                        {isRtl ? "الوصف" : "Description"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[20%]`}
                      >
                        {isRtl ? "الموعد المستهدف" : "Target Date"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[20%]`}
                      >
                        {isRtl ? "المسؤول" : "Owner"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.milestones.map((milestone, mIdx) => (
                      <tr
                        key={mIdx}
                        className={`${mIdx % 2 === 1 ? "bg-neutral-50" : "bg-white"} border-t border-neutral-100`}
                      >
                        <td className="p-2.5 font-bold text-primary-800">{milestone.code}</td>
                        <td className="p-2.5 text-neutral-600 font-medium">
                          {milestone.description}
                        </td>
                        <td className="p-2.5 text-neutral-600 font-medium">
                          {milestone.targetDate}
                        </td>
                        <td className="p-2.5 text-neutral-600 font-medium">{milestone.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Additional Markdown Content */}
          {data.additionalContent && (
            <div className="prose prose-neutral max-w-none text-xs leading-relaxed text-justify border-t border-neutral-100 pt-3 mt-1 text-neutral-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {data.additionalContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-4 text-[9px] text-neutral-400">
          <div>{isRtl ? "سري وخاص" : "Confidential & Private"}</div>
          <div className="font-mono font-bold">9</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default TimelineTemplate;

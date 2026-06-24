import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseExecutiveSummaryData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function ExecutiveSummaryTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseExecutiveSummaryData(content, isRtl);

  const companyName = isRtl
    ? proposalData?.organization?.nameAr || "شركة الحلول الرقمية"
    : proposalData?.organization?.nameEn ||
      proposalData?.organization?.nameAr ||
      "Digital Solutions Company";

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
  const hasDescription = data.description && data.description.trim() !== "";

  const hasContractValue = data.contractValue && data.contractValue.trim() !== "";
  const hasUsersCount = data.usersCount && data.usersCount.trim() !== "";
  const hasDuration = data.duration && data.duration.trim() !== "";
  const hasMatchRate = data.matchRate && data.matchRate.trim() !== "";

  return (
    <div className="flex-1 overflow-y-auto p-2 bg-neutral-100/50">
      <div
        className="w-full aspect-[1/1.414] bg-white text-neutral-800 rounded-2xl shadow-xl overflow-y-auto border border-neutral-200/50 flex flex-col justify-between relative p-8 sm:p-10 select-none"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-accent-500" />

        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{isRtl ? "الملخص التنفيذي" : "Executive Summary"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-5 mt-6 flex-1 min-h-0">
          {/* Section Title with Vertical Accent Line */}
          {(hasTitle || hasSubtitle) && (
            <div
              className={`border-accent-500 ${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"}`}
            >
              {hasTitle && (
                <h1 className="text-xl sm:text-2xl font-black text-primary-800 tracking-tight leading-tight">
                  {data.title}
                </h1>
              )}
              {hasSubtitle && (
                <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">{data.subtitle}</p>
              )}
            </div>
          )}

          {/* Metrics Grid */}
          {(hasContractValue || hasUsersCount || hasDuration || hasMatchRate) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              {/* Card 1: Contract Value (Dark Green) */}
              {hasContractValue && (
                <div className="rounded-xl p-4 flex flex-col justify-between shadow-xs border border-white/5 min-h-[90px] text-white bg-primary-800">
                  <span className="text-xl sm:text-2xl font-black text-accent-300">
                    {data.contractValue}
                  </span>
                  <div className="mt-2">
                    {data.contractValueSub && (
                      <span className="text-[10px] font-bold text-neutral-200 block truncate">
                        {data.contractValueSub}
                      </span>
                    )}
                    <span className="text-[9px] text-neutral-400 block truncate">
                      {isRtl ? "ريال سعودي" : "Saudi Riyal"}
                    </span>
                  </div>
                </div>
              )}

              {/* Card 2: End Users (Light Gray) */}
              {hasUsersCount && (
                <div className="bg-neutral-50/80 border border-neutral-200/50 rounded-xl p-4 flex flex-col justify-between shadow-2xs min-h-[90px]">
                  <span className="text-xl sm:text-2xl font-black text-primary-800">
                    {data.usersCount}
                  </span>
                  <div className="mt-2">
                    {data.usersCountSub && (
                      <>
                        <span className="text-[10px] font-bold text-neutral-700 block truncate">
                          {data.usersCountSub.split(" ").slice(0, 2).join(" ")}
                        </span>
                        <span className="text-[9px] text-neutral-500 block truncate">
                          {data.usersCountSub.split(" ").slice(2).join(" ")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Card 3: Duration (Light Gray) */}
              {hasDuration && (
                <div className="bg-neutral-50/80 border border-neutral-200/50 rounded-xl p-4 flex flex-col justify-between shadow-2xs min-h-[90px]">
                  <span className="text-xl sm:text-2xl font-black text-primary-800">
                    {data.duration}
                  </span>
                  <div className="mt-2">
                    {data.durationSub && (
                      <span className="text-[10px] font-bold text-neutral-700 block truncate">
                        {data.durationSub}
                      </span>
                    )}
                    <span className="text-[9px] text-neutral-500 block truncate">
                      {isRtl ? "مدة التنفيذ" : "Execution period"}
                    </span>
                  </div>
                </div>
              )}

              {/* Card 4: Match Rate (Dark Green) */}
              {hasMatchRate && (
                <div className="rounded-xl p-4 flex flex-col justify-between shadow-xs border border-white/5 min-h-[90px] bg-primary-800 text-white">
                  <span className="text-xl sm:text-2xl font-black text-accent-300">
                    {data.matchRate}
                  </span>
                  <div className="mt-2">
                    {data.matchRateSub && (
                      <span className="text-[10px] font-bold text-neutral-200 block truncate">
                        {data.matchRateSub}
                      </span>
                    )}
                    <span className="text-[9px] text-neutral-400 block truncate">
                      {isRtl ? "مطابقة تامة للمواصفات" : "Fully compliant"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description Paragraph */}
          {hasDescription && (
            <div className="prose prose-neutral max-w-none text-xs leading-relaxed text-justify border-t border-neutral-100 pt-3 mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {data.description}
              </ReactMarkdown>
            </div>
          )}

          {/* Roadmap Section */}
          {data.roadmap && data.roadmap.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              {data.roadmapTitle && (
                <span className="text-xs sm:text-sm font-extrabold text-primary-800">
                  {data.roadmapTitle}
                </span>
              )}

              {/* Horizontal Timeline Segments */}
              <div
                className="grid gap-1.5 text-center mt-1 select-none"
                style={{ gridTemplateColumns: `repeat(${data.roadmap.length}, minmax(0, 1fr))` }}
              >
                {data.roadmap.map((phase, idx) => {
                  const colors = [
                    "bg-primary-800 text-white",
                    "bg-primary-700 text-white",
                    "bg-primary-600 text-white",
                    "bg-primary-500 text-white",
                    "bg-accent-500 text-primary-800 font-black",
                  ];
                  const colorClass = colors[idx % colors.length];
                  return (
                    <div
                      key={idx}
                      className={`${colorClass} p-2.5 rounded-lg flex flex-col justify-center min-h-[50px] shadow-sm`}
                    >
                      {phase.title && (
                        <span className="text-[10px] sm:text-xs font-black block truncate">
                          {phase.title}
                        </span>
                      )}
                      {phase.duration && (
                        <span className="text-[8px] sm:text-[9px] font-bold block mt-0.5 truncate opacity-90">
                          {phase.duration}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Highlights Grid */}
          {data.features && data.features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
              {data.features.map((feature, idx) => {
                const bulletColors = ["bg-primary-800", "bg-accent-500", "bg-primary-400"];
                const bulletColor = bulletColors[idx % bulletColors.length];
                return (
                  <div
                    key={idx}
                    className="bg-neutral-50/60 border border-neutral-200/40 rounded-xl p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-2 h-2 rounded-full ${bulletColor} shrink-0`} />
                      {feature.title && (
                        <span className="text-xs sm:text-sm font-extrabold text-primary-800 truncate">
                          {feature.title}
                        </span>
                      )}
                    </div>
                    {feature.desc && (
                      <p className="text-[10px] sm:text-xs text-neutral-500 leading-relaxed text-justify line-clamp-3">
                        {feature.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Additional Markdown Content */}
          {data.additionalContent && (
            <div className="prose prose-neutral max-w-none text-xs leading-relaxed text-justify border-t border-neutral-100 pt-3 mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {data.additionalContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-4 text-[9px] text-neutral-400">
          <div>{isRtl ? "سري وخاص" : "Confidential & Private"}</div>
          <div className="font-mono font-bold">2</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveSummaryTemplate;

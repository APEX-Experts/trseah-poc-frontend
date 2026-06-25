import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parsePastProjectsData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function PastProjectsTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parsePastProjectsData(content, isRtl, proposalData);

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

  return (
    <div className="flex-1 overflow-y-auto ">
      <div
        className="w-full aspect-[1/1.414] bg-white text-neutral-800 rounded-2xl  page-bg overflow-y-auto border border-neutral-200/50 flex flex-col justify-between relative p-8 sm:p-10 select-none"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{data.title}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-5 mt-5 flex-1 min-h-0">
          {/* Section Title with Vertical Accent Line */}
          {(data.title || data.subtitle) && (
            <div
              className={`${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"} border-primary-500`}
            >
              {data.title && (
                <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-primary-800">
                  {data.title}
                </h1>
              )}
              {data.subtitle && (
                <p className="text-[10px] sm:text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  {data.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Projects List */}
          <div className="space-y-4 overflow-y-auto flex-1 pr-1 pl-1">
            {data.projects &&
              data.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-3xs flex flex-col gap-2.5 relative hover:border-neutral-300 transition-all text-start"
                >
                  {/* Top Row: Title, Year, and Value Badges */}
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <h3 className="text-xs sm:text-sm font-extrabold leading-snug text-primary-800">
                      {project.title}
                      {project.clientName && ` — ${project.clientName}`}
                    </h3>

                    {/* Value Badge and Year */}
                    <div className="flex items-center gap-2">
                      {project.value && (
                        <span className="bg-primary-800 text-primary-500 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md">
                          {project.value}
                        </span>
                      )}
                      {project.year && (
                        <span className="text-neutral-400 text-[10px] sm:text-xs font-semibold">
                          {project.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-[10px] sm:text-xs text-neutral-500 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Metrics Badges Row */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.metrics.map((metric, mIdx) => (
                        <span
                          key={mIdx}
                          className="bg-neutral-50 border border-neutral-100 text-neutral-600 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

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
          <div className="font-mono font-bold">6</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default PastProjectsTemplate;

import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseVision2030Data } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function Vision2030Template({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseVision2030Data(content, isRtl);

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
    <div className="flex-1 overflow-y-auto p-2 bg-neutral-100/50">
      <div
        className="w-full aspect-[1/1.414] bg-white text-neutral-800 rounded-2xl shadow-xl overflow-y-auto border border-neutral-200/50 flex flex-col justify-between relative p-8 sm:p-10 select-none"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Top Accent Line (Vision 2030 Green) */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary-500" />

        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{isRtl ? "مواءمة المشروع مع رؤية السعودية 2030" : "Vision 2030 Alignment"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-5 mt-6 flex-1 min-h-0">
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

          {/* Vision Pillars List */}
          <div className="space-y-4 flex-1 min-h-0">
            {data.pillars &&
              data.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-neutral-200/60 shadow-3xs bg-white p-4"
                >
                  {/* Card Header (Split Style) */}
                  <div className="flex justify-between items-stretch text-xs">
                    <div className="text-white py-2 px-4 font-bold flex-1 flex items-center justify-start rounded-s-xl bg-primary-800">
                      {pillar.title}
                    </div>
                    <div className="text-white py-2 px-4 font-extrabold flex items-center justify-center text-[10px] sm:text-xs whitespace-nowrap rounded-e-xl bg-primary-500">
                      {pillar.metric}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-2.5">
                    {/* National Target */}
                    <div className="flex items-start text-[11px] sm:text-xs gap-3">
                      <div className="text-neutral-400 font-bold w-24 shrink-0 text-start">
                        {isRtl ? "المستهدف الوطني:" : "National Target:"}
                      </div>
                      <div className="text-neutral-700 font-medium text-start">
                        {pillar.nationalTarget}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-100" />

                    {/* Project Contribution */}
                    <div className="flex items-start text-[11px] sm:text-xs gap-3">
                      <div className="text-neutral-400 font-bold w-24 shrink-0 text-start">
                        {isRtl ? "مساهمة المشروع:" : "Project Contribution:"}
                      </div>
                      <div className="text-neutral-800 font-semibold text-start">
                        {pillar.projectContribution}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Additional Markdown Content */}
          {data.additionalContent && (
            <div className="prose prose-neutral max-w-none text-xs leading-relaxed text-justify border-t border-neutral-100 pt-4 mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {data.additionalContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-4 text-[9px] text-neutral-400">
          <div>{isRtl ? "سري وخاص" : "Confidential & Private"}</div>
          <div className="font-mono font-bold">4</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default Vision2030Template;

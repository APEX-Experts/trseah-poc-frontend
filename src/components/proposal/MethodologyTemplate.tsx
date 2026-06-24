import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseMethodologyData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function MethodologyTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseMethodologyData(content, isRtl);

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
          <div>{data.title}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-5 flex-1 min-h-0">
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

          {/* Timeline Layout */}
          <div className="space-y-4 pr-1 pl-1">
            {data.steps &&
              data.steps.map((step, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === data.steps.length - 1;

                return (
                  <div
                    key={idx}
                    className={`flex items-stretch gap-4 ${isRtl ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Card Content Column */}
                    <div className="flex-1 bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex justify-between items-center gap-3 relative hover:border-neutral-300 transition-all text-start">
                      {/* Left: Date Badge Pill (opposite of circle) */}
                      <span className="text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1.5 rounded-md whitespace-nowrap bg-primary-800">
                        {step.duration}
                      </span>

                      {/* Right: Title & Description */}
                      <div className={`flex-1 ${isRtl ? "text-right" : "text-left"}`}>
                        <h4 className="text-xs sm:text-sm font-extrabold leading-snug text-primary-800">
                          {step.title}
                        </h4>
                        <p className="text-[9px] sm:text-[11px] text-neutral-500 leading-relaxed mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Line and Circle Column */}
                    <div className="flex flex-col items-center relative w-10">
                      {/* Connector Line */}
                      <div
                        className={`absolute w-0.5 bg-neutral-200/80`}
                        style={{
                          top: isFirst ? "50%" : "0px",
                          bottom: isLast ? "50%" : "0px",
                        }}
                      />
                      {/* Circle Number Badge */}
                      <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-sm z-10 my-auto bg-primary-800">
                        {step.number}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Key Deliverables Matrix Table */}
          {data.deliverables && data.deliverables.length > 0 && (
            <div className="space-y-2 mt-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-start text-primary-800">
                {data.deliverablesTitle}
              </h3>
              <div className="overflow-hidden border border-neutral-200/85 rounded-xl">
                <table className="w-full text-start border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-1/4`}>
                        {isRtl ? "المرحلة" : "Phase"}
                      </th>
                      <th className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-1/2`}>
                        {isRtl ? "المخرج الرئيسي" : "Key Deliverable"}
                      </th>
                      <th className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-1/4`}>
                        {isRtl ? "معيار القبول" : "Acceptance Criterion"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.deliverables.map((item, dIdx) => (
                      <tr
                        key={dIdx}
                        className={`${dIdx % 2 === 1 ? "bg-neutral-50" : "bg-white"} border-t border-neutral-100`}
                      >
                        <td className="p-2.5 font-bold text-primary-800">{item.phase}</td>
                        <td className="p-2.5 text-neutral-600 font-medium">{item.deliverable}</td>
                        <td className="p-2.5 text-neutral-600 font-medium">{item.criterion}</td>
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
          <div className="font-mono font-bold">7</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default MethodologyTemplate;

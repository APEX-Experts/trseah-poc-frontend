import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseScopeUnderstandingData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function ScopeUnderstandingTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseScopeUnderstandingData(content, isRtl);

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
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary-800" />

        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{isRtl ? "فهم نطاق العمل ومتطلبات المنافسة" : "Scope & Requirements"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-6 flex-1 min-h-0">
          {/* Section Title with Vertical Accent Line */}
          {(hasTitle || hasSubtitle) && (
            <div
              className={`${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"} border-primary-800`}
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

          {/* Core Requirements Table */}
          {data.requirements && data.requirements.length > 0 && (
            <div className="mt-2">
              {data.requirementsTitle && (
                <h2 className="text-xs sm:text-sm font-extrabold mb-3 text-primary-800">
                  {data.requirementsTitle}
                </h2>
              )}
              <div className="overflow-hidden rounded-xl border border-neutral-200/60 shadow-2xs">
                <table className="w-full text-start text-[11px] sm:text-xs border-collapse">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th className="py-2.5 px-4 font-bold text-start w-[55%]">
                        {isRtl ? "المتطلب" : "Requirement"}
                      </th>
                      <th className="py-2.5 px-4 font-bold text-center w-[20%]">
                        {isRtl ? "التصنيف" : "Classification"}
                      </th>
                      <th className="py-2.5 px-4 font-bold text-center w-[25%]">
                        {isRtl ? "مدى التوافق" : "Compatibility"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data.requirements.map((req, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}>
                        <td className="py-2.5 px-4 text-start font-medium text-neutral-800">
                          {req.requirement}
                        </td>
                        <td className="py-2.5 px-4 text-center text-neutral-500 font-semibold">
                          {req.classification}
                        </td>
                        <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">
                          <span className="inline-flex items-center gap-1">
                            <span>✓</span>
                            <span>{req.alignment}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Strategic Goals Cards */}
          {data.goals && data.goals.length > 0 && (
            <div className="mt-2">
              {data.goalsTitle && (
                <h2 className="text-xs sm:text-sm font-extrabold mb-3 text-primary-800">
                  {data.goalsTitle}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.goals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-50/50 border border-neutral-200/50 rounded-xl p-4 flex items-center justify-center text-center shadow-3xs min-h-[80px]"
                  >
                    <p className="text-[10px] sm:text-xs font-bold leading-relaxed text-primary-800">
                      {goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          <div className="font-mono font-bold">3</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default ScopeUnderstandingTemplate;

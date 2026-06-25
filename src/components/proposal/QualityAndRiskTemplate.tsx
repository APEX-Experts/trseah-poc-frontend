import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseQualityAndRiskData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function QualityAndRiskTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseQualityAndRiskData(content, isRtl);

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

  const getBadgeStyles = (val?: string) => {
    const v = val?.trim().toLowerCase();
    if (v === "high" || v === "عالي") {
      return "bg-red-50 text-red-700 border-red-200/60";
    }
    if (v === "medium" || v === "متوسط") {
      return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
    if (v === "low" || v === "منخفض") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    }
    return "bg-neutral-50 text-neutral-600 border-neutral-200/60";
  };

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
          <div>{isRtl ? "إدارة المخاطر وضمان الجودة" : "Risk & Quality Management"}</div>
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

          {/* Risks & Mitigation Section */}
          {data.risks && data.risks.length > 0 && (
            <div className="space-y-3 text-start">
              {data.risksTitle && (
                <h3 className="text-xs sm:text-sm font-extrabold text-primary-800">
                  {data.risksTitle}
                </h3>
              )}
              <div className="overflow-hidden border border-neutral-200/85 rounded-xl">
                <table className="w-full text-start border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[30%]`}
                      >
                        {isRtl ? "الخطر المحتمل" : "Potential Risk"}
                      </th>
                      <th className={`p-2.5 font-bold text-center w-[12%]`}>
                        {isRtl ? "الاحتمالية" : "Likelihood"}
                      </th>
                      <th className={`p-2.5 font-bold text-center w-[12%]`}>
                        {isRtl ? "الأثر" : "Impact"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[46%]`}
                      >
                        {isRtl ? "خطة التخفيف والوقاية" : "Mitigation & Contingency Plan"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.risks.map((risk, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`${rIdx % 2 === 1 ? "bg-neutral-50" : "bg-white"} border-t border-neutral-100`}
                      >
                        <td className="p-2.5 font-bold text-neutral-800">{risk.title}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${getBadgeStyles(risk.likelihood)}`}
                          >
                            {risk.likelihood}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${getBadgeStyles(risk.impact)}`}
                          >
                            {risk.impact}
                          </span>
                        </td>
                        <td className="p-2.5 text-neutral-600 font-medium leading-relaxed">
                          {risk.mitigation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quality Standards Section */}
          {data.standards && data.standards.length > 0 && (
            <div className="space-y-3 mt-2 text-start">
              {data.standardsTitle && (
                <h3 className="text-xs sm:text-sm font-extrabold text-primary-800">
                  {data.standardsTitle}
                </h3>
              )}
              <div className="overflow-hidden border border-neutral-200/85 rounded-xl">
                <table className="w-full text-start border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[30%]`}
                      >
                        {isRtl ? "معيار الجودة" : "Quality Standard"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[50%]`}
                      >
                        {isRtl ? "منهجية التحقق والقياس" : "Verification Methodology"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[20%]`}
                      >
                        {isRtl ? "التكرار / الدورية" : "Frequency"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.standards.map((std, sIdx) => (
                      <tr
                        key={sIdx}
                        className={`${sIdx % 2 === 1 ? "bg-neutral-50" : "bg-white"} border-t border-neutral-100`}
                      >
                        <td className="p-2.5 font-bold text-neutral-800">{std.standard}</td>
                        <td className="p-2.5 text-neutral-600 font-medium leading-relaxed">
                          {std.method}
                        </td>
                        <td className="p-2.5 text-neutral-600 font-medium">{std.frequency}</td>
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
          <div className="font-mono font-bold">10</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default QualityAndRiskTemplate;

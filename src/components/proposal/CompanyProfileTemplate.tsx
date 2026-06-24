import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseCompanyProfileData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function CompanyProfileTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parseCompanyProfileData(content, isRtl, proposalData);

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
        {/* Top Accent Line (Vision 2030 Green) */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-primary-500" />

        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{isRtl ? "نبذة عن الشركة" : "Company Profile"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-6 flex-1 min-h-0">
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

          {/* Metrics Row (4 Cards) */}
          {data.metrics && data.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              {data.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-neutral-200/80 rounded-xl py-4 px-3 flex flex-col items-center justify-center text-center shadow-3xs"
                >
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-primary-800">
                    {metric.value}
                  </span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 font-bold mt-1">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications & Accreditations */}
          {data.certificates && data.certificates.length > 0 && (
            <div className="mt-2">
              {data.certificatesTitle && (
                <h2 className="text-xs sm:text-sm font-extrabold mb-3 text-primary-800">
                  {data.certificatesTitle}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.certificates.map((cert, idx) => {
                  const themeClasses =
                    cert.theme === "green"
                      ? "bg-emerald-50/20 border-emerald-200/50 text-emerald-800"
                      : "bg-sky-50/20 border-sky-200/50 text-sky-800";

                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl p-3.5 flex justify-between items-center text-xs font-semibold shadow-3xs ${themeClasses}`}
                    >
                      <div className="text-neutral-800 text-start">{cert.authority}</div>
                      <div className="font-bold whitespace-nowrap">{cert.name}</div>
                    </div>
                  );
                })}
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
          <div className="font-mono font-bold">5</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfileTemplate;

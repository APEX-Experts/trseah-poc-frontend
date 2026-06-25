import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parsePricingData } from "@/lib/proposal-utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function PricingTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const data = parsePricingData(content, isRtl);

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isRtl ? "ar-EG" : "en-US").format(val);
  };

  return (
    <div className="flex-1 overflow-y-auto ">
      <div
        className="w-full aspect-[1/1.414] bg-white text-neutral-800 rounded-2xl  page-bg overflow-y-auto border border-neutral-200/50 flex flex-col justify-between relative p-8 sm:p-10 select-none"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-3 mt-1 text-[10px] sm:text-xs text-neutral-400 font-medium z-10">
          <div>{isRtl ? "العرض المالي والتسعير" : "Financial Proposal & Pricing"}</div>
          <div className="truncate max-w-[70%]">
            {projectTitle} — {entityName}
          </div>
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-5 flex-1 min-h-0">
          {/* Section Title with Vertical Accent Line */}
          <div className="flex justify-between items-start">
            <div
              className={`${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"} border-primary-500`}
            >
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-primary-800">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold mt-1">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Metric Cards Row */}
          {data.metrics && data.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {data.metrics.map((metric, mIdx) => {
                if (metric.highlighted) {
                  return (
                    <div
                      key={mIdx}
                      className="bg-primary-800 text-white p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-md border border-primary-950/20"
                    >
                      <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                        {metric.value}
                      </span>
                      <span className="text-[10px] sm:text-xs font-extrabold mt-2 opacity-95">
                        {metric.label}
                      </span>
                      <span className="text-[8px] sm:text-[9px] mt-0.5 opacity-75">
                        {metric.sublabel}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={mIdx}
                      className="bg-neutral-50/50 text-neutral-800 p-4 rounded-2xl border border-neutral-200/70 flex flex-col items-center justify-center text-center shadow-sm"
                    >
                      <span className="text-xl sm:text-2xl font-black tracking-tight text-primary-800 leading-none">
                        {metric.value}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-neutral-600 mt-2">
                        {metric.label}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-neutral-400 mt-0.5 font-medium">
                        {metric.sublabel}
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {/* Main Pricing Table */}
          {data.items && data.items.length > 0 && (
            <div className="space-y-3 text-start">
              <div className="overflow-hidden border border-neutral-200/80 rounded-2xl shadow-sm">
                <table className="w-full text-start border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr className="text-white bg-primary-800">
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[25%]`}
                      >
                        {isRtl ? "البند" : "Item"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-right" : "text-left"} w-[45%]`}
                      >
                        {isRtl ? "الوصف التفصيلي" : "Detailed Description"}
                      </th>
                      <th className="p-2.5 font-bold text-center w-[15%]">
                        {isRtl ? "المدة/الوحدة" : "Duration/Unit"}
                      </th>
                      <th
                        className={`p-2.5 font-bold ${isRtl ? "text-left" : "text-right"} w-[15%]`}
                      >
                        {isRtl ? "المبلغ (ر.س)" : "Amount (SAR)"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((pricingItem, pIdx) => (
                      <tr
                        key={pIdx}
                        className={`${pIdx % 2 === 1 ? "bg-neutral-50" : "bg-white"} border-t border-neutral-100`}
                      >
                        <td className="p-2.5 font-bold text-neutral-800 leading-snug">
                          {pricingItem.item}
                        </td>
                        <td className="p-2.5 text-neutral-500 font-medium leading-relaxed">
                          {pricingItem.description}
                        </td>
                        <td className="p-2.5 text-center text-neutral-600 font-medium">
                          {pricingItem.unit}
                        </td>
                        <td
                          className={`p-2.5 font-bold text-neutral-800 ${isRtl ? "text-left" : "text-right"}`}
                        >
                          {formatCurrency(pricingItem.amount)}
                        </td>
                      </tr>
                    ))}

                    {/* Grand Total Row inside table body as a highlighted row */}
                    <tr className="bg-neutral-100/70 border-t border-neutral-200">
                      <td
                        colSpan={3}
                        className={`p-3 font-extrabold text-primary-800 ${isRtl ? "text-right" : "text-left"}`}
                      >
                        {data.totalLabel}
                      </td>
                      <td
                        className={`p-3 font-black text-primary-800 ${isRtl ? "text-left" : "text-right"} text-xs sm:text-sm`}
                      >
                        {formatCurrency(data.totalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Terms Row */}
          {data.paymentTerms && data.paymentTerms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              {data.paymentTerms.map((term, tIdx) => (
                <div
                  key={tIdx}
                  className="border border-neutral-200 bg-neutral-50/40 py-2.5 px-4 rounded-xl text-center text-[10px] sm:text-xs text-neutral-600 font-bold shadow-sm"
                >
                  {term.text}
                </div>
              ))}
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
          <div className="font-mono font-bold">11</div>
          <div>© 2025 {companyName}</div>
        </div>
      </div>
    </div>
  );
}

export default PricingTemplate;

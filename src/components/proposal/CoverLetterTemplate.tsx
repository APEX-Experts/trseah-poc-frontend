import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { parseCoverLetterData } from "@/lib/proposal-utils";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

function CoverLetterTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
  formattedDate,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const parsedLetter = parseCoverLetterData(
    content,
    isRtl,
    proposalData,
    requestData,
    tenderData,
    formattedDate,
  );

  const hasRecipient =
    (parsedLetter.recipientTitle && parsedLetter.recipientTitle.trim() !== "") ||
    (parsedLetter.recipientName && parsedLetter.recipientName.trim() !== "") ||
    (parsedLetter.recipientLocation && parsedLetter.recipientLocation.trim() !== "");

  const hasSubject = parsedLetter.subject && parsedLetter.subject.trim() !== "";
  const hasBody = parsedLetter.body && parsedLetter.body.trim() !== "";
  const hasSignatory =
    (parsedLetter.signatoryName && parsedLetter.signatoryName.trim() !== "") ||
    (parsedLetter.signatoryTitle && parsedLetter.signatoryTitle.trim() !== "");

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
          <div>{isRtl ? "خطاب التغطية" : "Cover Letter"}</div>
          {parsedLetter.entityName && (
            <div>
              {parsedLetter.entityName} —{" "}
              {isRtl ? "منصة التحول الرقمي" : "Digital Transformation Platform"}
            </div>
          )}
        </div>

        {/* Main Content Body Container */}
        <div className="flex flex-col gap-6 mt-6 flex-1 min-h-0">
          {/* Cover Letter Title with Vertical Accent Line */}
          <div className="flex justify-between items-start">
            <div
              className={`border-accent-500 ${isRtl ? "border-r-4 pr-3 text-right" : "border-l-4 pl-3 text-left"}`}
            >
              <h1 className="text-xl sm:text-2xl font-black text-primary-800 tracking-tight leading-tight">
                {isRtl ? "خطاب التغطية" : "Cover Letter"}
              </h1>
              <p className="text-[10px] sm:text-xs text-neutral-400 mt-0.5">
                {isRtl ? "الرياض، المملكة العربية السعودية" : "Riyadh, Kingdom of Saudi Arabia"}
              </p>
            </div>

            {/* Logo / Initials */}
            {parsedLetter.companyName && (
              <>
                {requestData?.organization?.logoUrl ? (
                  <Image
                    src={requestData.organization.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 rounded-xl object-cover shadow-sm border border-neutral-200"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-50 text-primary-800 font-black text-sm flex items-center justify-center rounded-xl shadow-sm border border-primary-100">
                    {getInitials(parsedLetter.companyName)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Recipient details */}
          {hasRecipient && (
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2 space-y-1">
              {parsedLetter.recipientTitle && (
                <div className="font-extrabold text-primary-800">{parsedLetter.recipientTitle}</div>
              )}
              {parsedLetter.recipientName && <div>{parsedLetter.recipientName}</div>}
              {parsedLetter.recipientLocation && (
                <div className="text-neutral-500">{parsedLetter.recipientLocation}</div>
              )}
              <div className="pt-3 font-bold text-primary-800">
                {isRtl ? "معاليكم المحترم،" : "Dear Excellency,"}
              </div>
            </div>
          )}

          {/* Subject Block */}
          {hasSubject && (
            <div className="bg-neutral-50/80 border border-neutral-200/50 rounded-xl p-3 text-xs sm:text-sm leading-relaxed text-primary-900 font-extrabold shadow-2xs">
              {parsedLetter.subject}
            </div>
          )}

          {/* Body Paragraphs */}
          {hasBody && (
            <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-justify border-t border-neutral-100 pt-3 mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {parsedLetter.body}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Signatures & Contact Info Row */}
        <div className="flex justify-between items-end border-t border-neutral-200/40 pt-4 mt-auto text-[10px] sm:text-xs z-10 gap-4">
          {/* Contact Details */}
          <div className="space-y-1 text-neutral-500">
            <div>
              {isRtl ? "البريد: " : "Email: "}
              <span className="font-mono">
                {isRtl ? "proposals@alrashed-digital.sa" : "proposals@example.com"}
              </span>
            </div>
            <div>
              {isRtl ? "الهاتف: " : "Phone: "}
              <span className="font-mono">{isRtl ? "+966 11 XXX XXXX" : "+966 11 XXX XXXX"}</span>
            </div>
            <div>
              {isRtl ? "الرياض، المملكة العربية السعودية" : "Riyadh, Kingdom of Saudi Arabia"}
            </div>
          </div>

          {/* Signature block */}
          {hasSignatory && (
            <div className="flex flex-col items-center min-w-[180px]">
              <span className="text-[10px] font-extrabold text-primary-800">
                {isRtl ? "التاريخ والختم الرسمي" : "Official Date & Stamp"}
              </span>
              <div className="w-full border-t border-neutral-300 my-2" />
              {parsedLetter.date && (
                <span className="text-[9px] text-neutral-400 mb-2">
                  {isRtl ? `التاريخ: ${parsedLetter.date}` : `Date: ${parsedLetter.date}`}
                </span>
              )}
              <span className="text-[9px] text-neutral-400 mb-4">
                {isRtl ? "التوقيع والختم" : "Signature & Seal"}
              </span>
              {parsedLetter.signatoryName && (
                <span className="font-extrabold text-primary-900 text-xs">
                  {parsedLetter.signatoryName}
                </span>
              )}
              {parsedLetter.signatoryTitle && (
                <span className="text-[9px] text-neutral-500 mt-0.5 text-center font-bold">
                  {parsedLetter.signatoryTitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-4 text-[9px] text-neutral-400">
          <div>{isRtl ? "سري وخاص" : "Confidential & Private"}</div>
          <div className="font-mono font-bold">1</div>
          {parsedLetter.companyName && <div>© 2025 {parsedLetter.companyName}</div>}
        </div>
      </div>
    </div>
  );
}

export default CoverLetterTemplate;

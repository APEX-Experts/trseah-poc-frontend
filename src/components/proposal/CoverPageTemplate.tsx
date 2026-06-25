import React from "react";
import { SectionTemplateProps } from "./SectionTemplate";
import { useTranslations } from "next-intl";
import { parseCoverPageData } from "@/lib/proposal-utils";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function CoverPageTemplate({
  content,
  isRtl,
  proposalData,
  requestData,
  formattedDate,
}: Omit<SectionTemplateProps, "sectionId" | "locale">) {
  const t = useTranslations("AdminProposals");

  const parsedCover = parseCoverPageData(content, isRtl, proposalData, formattedDate);

  const hasTitle = parsedCover.title && parsedCover.title.trim() !== "";
  const hasDesc = parsedCover.description && parsedCover.description.trim() !== "";
  const hasPresentedTo = parsedCover.presentedTo && parsedCover.presentedTo.trim() !== "";
  const hasReference = parsedCover.reference && parsedCover.reference.trim() !== "";
  const hasDate = parsedCover.date && parsedCover.date.trim() !== "";

  const stats = [
    parsedCover.vision && parsedCover.vision.trim() !== ""
      ? { label: t("vision2030"), val: parsedCover.vision, color: "text-emerald-400" }
      : null,
    parsedCover.specialists && parsedCover.specialists.trim() !== ""
      ? { label: t("specialists"), val: parsedCover.specialists, color: "text-neutral-100" }
      : null,
    parsedCover.duration && parsedCover.duration.trim() !== ""
      ? { label: t("executionDuration"), val: parsedCover.duration, color: "text-neutral-100" }
      : null,
    parsedCover.value && parsedCover.value.trim() !== ""
      ? { label: t("projectValue"), val: parsedCover.value, color: "text-neutral-100" }
      : null,
  ].filter(Boolean) as Array<{ label: string; val: string; color: string }>;

  return (
    <div className="flex-1 overflow-y-auto">
      <div
        className="w-full aspect-[1/1.414] bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 text-white rounded-2xl  page-bg overflow-hidden relative flex flex-col justify-between p-8 sm:p-10 lg:p-12 select-none"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Decorative circular shapes */}
        <div className="absolute -top-40 -inset-e-40 w-96 h-96 rounded-full bg-accent-300/10 pointer-events-none" />
        <div className="absolute top-1/2 -inset-s-48 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent-300/10 pointer-events-none" />
        <div className="absolute -bottom-40 -inset-e-32 w-80 h-80 rounded-full bg-accent-300/10 pointer-events-none" />

        {/* Top Row: Company Info Container */}
        {parsedCover.orgName && (
          <div className="flex justify-start z-10 w-full shrink-0">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 shadow-sm">
              {requestData?.organization?.logoUrl ? (
                <Image
                  src={requestData.organization.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 rounded-xl object-cover shadow-md border border-white/10"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 bg-accent-300 font-black text-sm flex items-center justify-center rounded-xl shadow-md text-primary-800">
                  {getInitials(parsedCover.orgName)}
                </div>
              )}
              <span className="text-sm font-bold tracking-wide text-white">
                {parsedCover.orgName}
              </span>
            </div>
          </div>
        )}

        {/* Center Content: Title & Description */}
        {(hasTitle || hasDesc) && (
          <div className="flex flex-col justify-center py-6 z-10 min-h-0">
            {hasTitle && (
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3 lg:mb-4 line-clamp-4">
                {parsedCover.title}
              </h1>
            )}
            {hasDesc && (
              <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-justify border-t border-neutral-100 pt-3 text-neutral-300 mb-4 lg:mb-6 line-clamp-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {parsedCover.description}
                </ReactMarkdown>
              </div>
            )}
            <div className="w-12 lg:w-16 h-1 rounded-full shrink-0 bg-accent-300" />
          </div>
        )}

        {/* Meta details list */}
        {(hasPresentedTo || hasReference || hasDate) && (
          <div className="space-y-3 lg:space-y-4 mb-6 z-10 ps-4 py-2 shrink-0 border-s border-accent-300/20">
            {hasPresentedTo && (
              <div className="flex items-center gap-4 text-xs">
                <span className="text-neutral-400 w-24 shrink-0 font-semibold font-bold">
                  {t("presentedTo")}:
                </span>
                <span className="text-neutral-100 font-bold line-clamp-1">
                  {parsedCover.presentedTo}
                </span>
              </div>
            )}
            {hasReference && (
              <div className="flex items-center gap-4 text-xs">
                <span className="text-neutral-400 w-24 shrink-0 font-semibold font-bold">
                  {t("reference")}:
                </span>
                <span className="text-neutral-100 font-mono">{parsedCover.reference}</span>
              </div>
            )}
            {hasDate && (
              <div className="flex items-center gap-4 text-xs">
                <span className="text-neutral-400 w-24 shrink-0 font-semibold font-bold">
                  {t("date")}:
                </span>
                <span className="text-neutral-100">{parsedCover.date}</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Stats Grid */}
        {stats.length > 0 && (
          <div className="border-t border-white/10 pt-4 lg:pt-6 flex justify-between items-center text-center z-10 shrink-0">
            {stats.reduce<React.ReactNode[]>((acc, item, idx) => {
              if (idx > 0) {
                acc.push(<div key={`divider-${idx}`} className="h-6 w-px bg-white/10" />);
              }
              acc.push(
                <div key={idx}>
                  <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                    {item.label}
                  </span>
                  <span className={`text-xs font-bold ${item.color} mt-1 block`}>{item.val}</span>
                </div>,
              );
              return acc;
            }, [])}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoverPageTemplate;

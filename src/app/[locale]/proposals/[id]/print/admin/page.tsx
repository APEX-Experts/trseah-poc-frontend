"use client";

import SectionTemplate from "@/components/proposal/SectionTemplate";
import { useAdminProposalsControllerGetProposalDetail } from "@/lib/api/react-query/admin-—-proposals/admin-—-proposals";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

export default function ProposalPrintPage() {
  const { id } = useParams() as { id: string };
  const locale = useLocale();
  const { data: proposalData, isLoading } = useAdminProposalsControllerGetProposalDetail(id);
  console.log(proposalData);

  if (isLoading || !proposalData) return <div>Loading PDF...</div>;

  const sortedSections = [...(proposalData.sections || [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const formattedDate = new Date(proposalData.createdAt).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white min-h-screen w-full max-w-none text-black">
      {/* This style block forces all web-specific UI constraints 
        to behave like a continuous document for Puppeteer 
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
  /* 1. Disable scrollbars so long content can grow freely */
  .overflow-y-auto, .overflow-auto {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }

  /* 2. Remove all outer border radiuses so backgrounds touch the PDF corners */
  .page-bg {
    border-radius: 0 !important;
  }
  
  /* Remove borders that might look weird at the page edge */
  .border, .border-neutral-200\\/50 {
    border: none !important;
  }

  /* 3. FIX: Enforce a minimum height of exactly ONE A4 page. 
     100vh in Puppeteer equals the exact paper height. */
  .aspect-\\[1\\/1\\.414\\] {
    aspect-ratio: auto !important;
    height: auto !important;
    min-height: 100vh !important; 
  }

  /* 4. FIX: Allow the body to grow and push the footer to the bottom, 
     but prevent it from shrinking and squashing text on long pages */
  .flex-1 {
    flex-grow: 1 !important;
    flex-shrink: 0 !important;
    flex-basis: auto !important;
  }
  .min-h-0 {
    min-height: min-content !important;
  }
`,
        }}
      />

      {sortedSections.map((section) => (
        // REMOVED `p-8` from here so the template touches the absolute edge of the A4 page
        <div key={section.id} className="break-after-page">
          <SectionTemplate
            sectionId={section.sectionType}
            content={
              locale === "ar"
                ? section.contentAr || section.contentEn || ""
                : section.contentEn || section.contentAr || ""
            }
            isRtl={locale === "ar"}
            proposalData={proposalData}
            requestData={proposalData.request}
            tenderData={proposalData.tender}
            locale={locale}
            formattedDate={formattedDate}
          />
        </div>
      ))}
    </div>
  );
}

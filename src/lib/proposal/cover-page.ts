import { parseCoverPageMarkdown } from "@/lib/markdown-utils";
import type { ProposalDto } from "../proposal-utils";

export interface CoverPageData {
  title: string;
  description: string;
  presentedTo: string;
  reference: string;
  date: string;
  orgName: string;
  vision: string;
  specialists: string;
  duration: string;
  value: string;
}

export function parseCoverPageData(
  content: string,
  isRtl: boolean,
  proposalData: ProposalDto,
  formattedDate: string,
): CoverPageData {
  try {
    if (content && content.trim().startsWith("{")) {
      return JSON.parse(content);
    }
  } catch (_e) {
    // Ignore and fallback
  }

  // Fallback to markdown parsing
  const title = isRtl
    ? proposalData?.tender?.titleAr ||
      proposalData?.request?.rfpExternalDescription ||
      "عرض فني ومالي"
    : proposalData?.tender?.titleEn ||
      proposalData?.tender?.titleAr ||
      proposalData?.request?.rfpExternalDescription ||
      "Technical & Financial Proposal";

  const desc = isRtl
    ? proposalData?.tender?.descriptionAr ||
      "رؤية متكاملة لبناء وتطوير البنية التحتية والأنظمة الرقمية."
    : proposalData?.tender?.descriptionEn ||
      proposalData?.tender?.descriptionAr ||
      "Integrated vision for building and developing digital infrastructure and systems.";

  const entity = isRtl
    ? proposalData?.tender?.entityNameAr || "الجهة الحكومية المختصة"
    : proposalData?.tender?.entityNameEn ||
      proposalData?.tender?.entityNameAr ||
      "Competent Government Entity";

  const orgName = isRtl
    ? proposalData?.organization?.nameAr || ""
    : proposalData?.organization?.nameEn || proposalData?.organization?.nameAr || "";

  const parsed = parseCoverPageMarkdown(
    content || "",
    title,
    desc,
    entity,
    orgName,
    formattedDate,
    isRtl ? "متوافق" : "Vision 2030 Compliant",
  );

  return {
    title: parsed.title,
    description: parsed.description,
    presentedTo: parsed.presentedTo,
    reference: parsed.reference,
    date: parsed.date,
    orgName: parsed.orgName,
    vision: parsed.vision,
    specialists: parsed.specialists,
    duration: parsed.duration,
    value: parsed.value,
  };
}

import type { ProposalDto } from "../proposal-utils";

export interface CoverLetterData {
  companyName: string;
  tenderTitle: string;
  entityName: string;
  reference: string;
  recipientTitle: string;
  recipientName: string;
  recipientLocation: string;
  subject: string;
  body: string;
  signatoryName: string;
  signatoryTitle: string;
  date: string;
}

export function parseCoverLetterData(
  content: string,
  isRtl: boolean,
  proposalData: ProposalDto,
  requestData: ProposalDto["request"],
  tenderData: ProposalDto["tender"],
  formattedDate: string,
): CoverLetterData {
  try {
    if (content && content.trim().startsWith("{")) {
      return JSON.parse(content);
    }
  } catch (_e) {
    // Ignore and fallback
  }

  // Fallback if not JSON
  const companyName = isRtl
    ? proposalData?.organization?.nameAr || "شركة الحلول الرقمية"
    : proposalData?.organization?.nameEn ||
      proposalData?.organization?.nameAr ||
      "Digital Solutions Company";

  const tenderTitle = isRtl
    ? tenderData?.titleAr ||
      requestData?.rfpExternalDescription ||
      "مشروع منصة التحول الرقمي الموحدة"
    : tenderData?.titleEn ||
      tenderData?.titleAr ||
      requestData?.rfpExternalDescription ||
      "Unified Digital Transformation Platform Project";

  const entityName = isRtl
    ? tenderData?.entityNameAr || "وزارة الاتصالات وتقنية المعلومات"
    : tenderData?.entityNameEn ||
      tenderData?.entityNameAr ||
      "Ministry of Communications and Information Technology";

  const reference = tenderData?.tenderNumber || tenderData?.referenceNumber || "MCIT-2025-DT-047";

  return {
    companyName,
    tenderTitle,
    entityName,
    reference,
    recipientTitle: isRtl ? `معالي رئيس ${entityName}` : `His Excellency the Head of ${entityName}`,
    recipientName: isRtl ? "المهندس / [اسم المسؤول الأول]" : "Eng. [First Officer Name]",
    recipientLocation: isRtl
      ? "المملكة العربية السعودية — الرياض"
      : "Kingdom of Saudi Arabia — Riyadh",
    subject: isRtl
      ? `تقديم العرض الفني والتجاري لمشروع ${tenderTitle} — رقم المنافسة ${reference}`
      : `Subject: Submission of Technical and Commercial Proposal for the Project: ${tenderTitle} — Competition No. ${reference}`,
    body: content || "",
    signatoryName: isRtl ? "محمد بن عبدالله الراشد" : "John Doe",
    signatoryTitle: isRtl
      ? `الرئيس التنفيذي — ${companyName}`
      : `Chief Executive Officer — ${companyName}`,
    date: formattedDate,
  };
}

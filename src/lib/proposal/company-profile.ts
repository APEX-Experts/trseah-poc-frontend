import type { ProposalDto } from "../proposal-utils";

export interface CompanyMetric {
  value: string;
  label: string;
}

export interface CompanyCertificate {
  name: string;
  authority: string;
  theme: "blue" | "green";
}

export interface CompanyProfileData {
  title: string;
  subtitle: string;
  metrics: CompanyMetric[];
  certificatesTitle: string;
  certificates: CompanyCertificate[];
  additionalContent?: string;
}

export function parseCompanyProfileData(
  content: string,
  isRtl: boolean,
  proposalData?: ProposalDto | null,
): CompanyProfileData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.metrics && !Array.isArray(parsed.metrics)) {
        parsed.metrics = [];
      }
      if (parsed.certificates && !Array.isArray(parsed.certificates)) {
        parsed.certificates = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const nameAr = proposalData?.organization?.nameAr || "شركة الراشد للحلول الرقمية";
  const nameEn =
    proposalData?.organization?.nameEn ||
    proposalData?.organization?.nameAr ||
    "Al-Rashed Digital Solutions Company";
  const sectorAr = proposalData?.organization?.sector || "تقنية المعلومات والتحول الرقمي";
  const sectorEn = proposalData?.organization?.sector || "IT and digital transformation";

  const defaultTitle = isRtl ? "نبذة عن الشركة" : "Company Profile";
  const defaultSubtitle = isRtl
    ? `شركة ${nameAr} شركة سعودية متخصصة في ${sectorAr}، تأسست لتقديم الحلول الرقمية المتكاملة للقطاعين الحكومي والخاص في المملكة العربية السعودية.`
    : `${nameEn} is a Saudi company specializing in ${sectorEn}, established to provide integrated digital solutions to both government and private sectors in Saudi Arabia.`;

  // Calculate numbers dynamically from proposalData
  const yearsExp = Math.max(
    ...(proposalData?.teamMembers?.map((m) => m.yearsOfExperience || 0) || []),
    10,
  );
  const projectsCount = proposalData?.pastProjects?.length || 0;
  const teamCount = proposalData?.teamMembers?.length || 0;
  const localContent = proposalData?.organization?.localContentScore;

  const defaultMetrics: CompanyMetric[] = isRtl
    ? [
        { value: `${yearsExp}+`, label: "سنة خبرة" },
        { value: `${projectsCount}`, label: "مشروع منفذ" },
        { value: `${teamCount}`, label: "موظف متخصص" },
        {
          value: localContent ? `${localContent}%` : "98%",
          label: localContent ? "مساهمة المحتوى المحلي" : "رضا العملاء",
        },
      ]
    : [
        { value: `${yearsExp}+`, label: "Years of Experience" },
        { value: `${projectsCount}`, label: "Executed Projects" },
        { value: `${teamCount}`, label: "Specialized Employees" },
        {
          value: localContent ? `${localContent}%` : "98%",
          label: localContent ? "Local Content Score" : "Client Satisfaction",
        },
      ];

  const defaultCertificatesTitle = isRtl
    ? "الشهادات والاعتمادات"
    : "Certifications & Accreditations";
  const defaultCertificates: CompanyCertificate[] = []; // Left blank as requested

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    metrics: defaultMetrics,
    certificatesTitle: defaultCertificatesTitle,
    certificates: defaultCertificates,
    additionalContent: content || "",
  };
}

export interface ScopeRequirement {
  requirement: string;
  classification: string;
  alignment: string;
}

export interface ScopeUnderstandingData {
  title: string;
  subtitle: string;
  requirementsTitle: string;
  requirements: ScopeRequirement[];
  goalsTitle: string;
  goals: string[];
  additionalContent?: string;
}

export function parseScopeUnderstandingData(
  content: string,
  isRtl: boolean,
): ScopeUnderstandingData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.requirements && !Array.isArray(parsed.requirements)) {
        parsed.requirements = [];
      }
      if (parsed.goals && !Array.isArray(parsed.goals)) {
        parsed.goals = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultTitle = isRtl
    ? "فهم نطاق العمل ومتطلبات المنافسة"
    : "Understanding of Scope and Competition Requirements";
  const defaultSubtitle = isRtl
    ? "استناداً إلى الدراسة المعمقة لوثائق المنافسة وكراسة الشروط والمتطلبات الصادرة من الوزارة، تقدم شركة الراشد للحلول الرقمية فهمها الشامل لنطاق المشروع على النحو الآتي:"
    : "Based on the in-depth study of the competition documents, RFP, and requirements issued by the Ministry, Al-Rashed Digital Solutions Company presents its comprehensive understanding of the project scope as follows:";

  const defaultRequirementsTitle = isRtl ? "المتطلبات الأساسية" : "Core Requirements";
  const defaultRequirements: ScopeRequirement[] = isRtl
    ? [
        {
          requirement: "1. بناء بوابة موحدة للخدمات الحكومية الرقمية",
          classification: "أساسي",
          alignment: "متوافق كلياً",
        },
        {
          requirement: "2. تطوير نظام إدارة الهوية الرقمية الموحدة",
          classification: "أساسي",
          alignment: "متوافق كلياً",
        },
        {
          requirement: "3. تكامل مع منصة نفاذ والبنية التحتية الوطنية",
          classification: "أساسي",
          alignment: "متوافق كلياً",
        },
        {
          requirement: "4. دعم اللغة العربية والإمكانية الوصولية WCAG 2.1",
          classification: "إلزامي",
          alignment: "متوافق كلياً",
        },
        {
          requirement: "5. حوسبة سحابية معتمدة لدى هيئة الاتصالات",
          classification: "إلزامي",
          alignment: "متوافق كلياً",
        },
        {
          requirement: "6. اشتراطات الأمن السيبراني وفق NCA ECC",
          classification: "تكميلي",
          alignment: "متوافق كلياً",
        },
        {
          requirement: "7. تحليلات البيانات ولوحات متابعة تنفيذية",
          classification: "تكميلي",
          alignment: "متوافق كلياً",
        },
      ]
    : [
        {
          requirement: "1. Building a unified portal for digital government services",
          classification: "Core",
          alignment: "Fully Compliant",
        },
        {
          requirement: "2. Developing a unified digital identity management system",
          classification: "Core",
          alignment: "Fully Compliant",
        },
        {
          requirement: "3. Integration with Nafath platform and national infrastructure",
          classification: "Core",
          alignment: "Fully Compliant",
        },
        {
          requirement: "4. Support for Arabic language and accessibility WCAG 2.1",
          classification: "Mandatory",
          alignment: "Fully Compliant",
        },
        {
          requirement: "5. Cloud computing certified by the Communications Commission",
          classification: "Mandatory",
          alignment: "Fully Compliant",
        },
        {
          requirement: "6. Cybersecurity requirements according to NCA ECC",
          classification: "Supplementary",
          alignment: "Fully Compliant",
        },
        {
          requirement: "7. Data analytics and executive dashboards",
          classification: "Supplementary",
          alignment: "Fully Compliant",
        },
      ];

  const defaultGoalsTitle = isRtl ? "أهداف المشروع الاستراتيجية" : "Strategic Project Goals";
  const defaultGoals = isRtl
    ? [
        "توحيد نقطة الوصول لجميع الخدمات الإلكترونية الحكومية عبر منصة واحدة متكاملة",
        "تخفيض وقت تسليم الخدمة الحكومية من أيام إلى دقائق",
        "رفع مؤشر تجربة المستفيد في الخدمات الحكومية الرقمية إلى 4.8 من 5",
      ]
    : [
        "Unifying the access point for all government e-services through a single integrated platform",
        "Reducing government service delivery time from days to minutes",
        "Raising the beneficiary experience index in digital government services to 4.8 out of 5",
      ];

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    requirementsTitle: defaultRequirementsTitle,
    requirements: defaultRequirements,
    goalsTitle: defaultGoalsTitle,
    goals: defaultGoals,
    additionalContent: content || "",
  };
}

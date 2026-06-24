export interface RoadmapPhase {
  title: string;
  duration: string;
}

export interface HighlightFeature {
  title: string;
  desc: string;
}

export interface ExecutiveSummaryData {
  title: string;
  subtitle: string;
  contractValue: string;
  contractValueSub: string;
  usersCount: string;
  usersCountSub: string;
  duration: string;
  durationSub: string;
  matchRate: string;
  matchRateSub: string;
  description: string;
  roadmapTitle: string;
  roadmap: RoadmapPhase[];
  features: HighlightFeature[];
  additionalContent?: string;
}

export function parseExecutiveSummaryData(content: string, isRtl: boolean): ExecutiveSummaryData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.roadmap && !Array.isArray(parsed.roadmap)) {
        parsed.roadmap = [];
      }
      if (parsed.features && !Array.isArray(parsed.features)) {
        parsed.features = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultDesc =
    content ||
    (isRtl
      ? "يقدم هذا المقترح رؤية تقنية وتنفيذية متكاملة لإنشاء منصة التحول الرقمي الحكومية الموحدة لوزارة الاتصالات وتقنية المعلومات, بوصفها ركيزة جوهرية في مسيرة تحقيق أهداف رؤية المملكة 2030 في التحول الرقمي وتطوير الخدمات الحكومية. تستند المنصة المقترحة إلى بنية سحابية حديثة وقابلة للتوسع، مع ضمان أعلى معايير الأمن السيبراني والامتثال التنظيمي."
      : "This proposal provides an integrated technical and execution vision to meet the requirements, serving as a core pillar in the digital transformation and services development journey. The proposed platform is built on a modern, scalable architecture, ensuring the highest standards of cybersecurity and compliance.");

  const defaultTitle = isRtl ? "الملخص التنفيذي المرئي" : "Visual Executive Summary";
  const defaultSubtitle = isRtl
    ? "نظرة سريعة على أبرز محاور المقترح ومؤشراته الرئيسية"
    : "A quick look at the main pillars of the proposal and its key indicators";

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    contractValue: isRtl ? "8.3م ر.س" : "8.3M SAR",
    contractValueSub: isRtl ? "قيمة العقد الإجمالية" : "Total Contract Value",
    usersCount: isRtl ? "+500" : "+500",
    usersCountSub: isRtl ? "مستخدم نهائي عبر 12 وزارة" : "End Users across 12 Ministries",
    duration: isRtl ? "24 شهراً" : "24 Months",
    durationSub: isRtl ? "من أغسطس 2025" : "From August 2025",
    matchRate: isRtl ? "98%" : "98%",
    matchRateSub: isRtl ? "نسبة مطابقة المتطلبات الفنية" : "Technical Requirements Match Rate",
    description: defaultDesc,
    roadmapTitle: isRtl ? "خارطة تنفيذ المشروع:" : "Project Execution Roadmap:",
    roadmap: [
      { title: isRtl ? "التأسيس" : "Foundation", duration: isRtl ? "3 أشهر" : "3 Months" },
      { title: isRtl ? "التطوير" : "Development", duration: isRtl ? "10 أشهر" : "10 Months" },
      { title: isRtl ? "التكامل" : "Integration", duration: isRtl ? "5 أشهر" : "5 Months" },
      { title: isRtl ? "الإطلاق" : "Launch", duration: isRtl ? "3 أشهر" : "3 Months" },
      { title: isRtl ? "الدعم" : "Support", duration: isRtl ? "3 أشهر" : "3 Months" },
    ],
    features: [
      {
        title: isRtl ? "الأمان السيبراني" : "Cybersecurity",
        desc: isRtl
          ? "بنية أمنية متعددة الطبقات معتمدة من NCA مع مركز عمليات أمان 24/7"
          : "Multi-layered security architecture certified by NCA with 24/7 SOC",
      },
      {
        title: isRtl ? "التكامل الوطني" : "National Integration",
        desc: isRtl
          ? "ربط كامل مع Nafath وأبشر ونظام المدفوعات ومنظومة البيانات الوطنية"
          : "Full integration with Nafath, Absher, payment gateway, and national data platform",
      },
      {
        title: isRtl ? "قابلية التوسع" : "Scalability",
        desc: isRtl
          ? "بنية microservices سحابية تتسع من 500 إلى 50,000 مستخدم دون تعديل"
          : "Cloud microservices architecture scaling from 500 to 50,000 users without modification",
      },
    ],
    additionalContent: "",
  };
}

export interface MethodologyStep {
  number: number;
  title: string;
  duration: string;
  description: string;
}

export interface MethodologyDeliverable {
  phase: string;
  deliverable: string;
  criterion: string;
}

export interface MethodologyData {
  title: string;
  subtitle: string;
  steps: MethodologyStep[];
  deliverablesTitle: string;
  deliverables: MethodologyDeliverable[];
  additionalContent?: string;
}

export function parseMethodologyData(content: string, isRtl: boolean): MethodologyData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.steps && !Array.isArray(parsed.steps)) {
        parsed.steps = [];
      }
      if (parsed.deliverables && !Array.isArray(parsed.deliverables)) {
        parsed.deliverables = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultTitle = isRtl ? "المنهجية وآلية التنفيذ" : "Methodology & Implementation";
  const defaultSubtitle = isRtl
    ? "مسار التنفيذ على مدى 24 شهراً وفق منهجية Agile الحكومية"
    : "Implementation track over 24 months according to Agile government methodology";

  const defaultSteps: MethodologyStep[] = isRtl
    ? [
        {
          number: 1,
          title: "التأسيس والتخطيط",
          duration: "أغسطس — أكتوبر 2025",
          description:
            "ورش العمل التأسيسية، إعداد بيئة التطوير، توثيق المتطلبات التفصيلية، بناء نماذج أولية Prototypes",
        },
        {
          number: 2,
          title: "تطوير النواة الأساسية",
          duration: "نوفمبر 2025 — أغسطس 2026",
          description:
            "تطوير خدمات إدارة الهوية والمعاملات الإلكترونية والسير الوظيفي والإشعارات الموحدة",
        },
        {
          number: 3,
          title: "التكامل الوطني",
          duration: "سبتمبر — يناير 2026",
          description:
            "ربط المنصة بـ Nafath وأبشر وSADAD وجميع الخدمات الحكومية المشتركة واختبار التكامل",
        },
        {
          number: 4,
          title: "التجريب والإطلاق",
          duration: "فبراير — أبريل 2026",
          description:
            "برنامج تجريبي مع 3 وزارات، قياس الأداء، إصلاح الأخطاء، الإطلاق التدريجي Rolling Launch",
        },
        {
          number: 5,
          title: "التوسع والاستقرار",
          duration: "مايو — يوليو 2026",
          description:
            "توسيع نطاق التغطية لـ 12 جهة حكومية، تشغيل مركز الدعم، قياس مؤشرات الأداء وتقارير الأثر",
        },
      ]
    : [
        {
          number: 1,
          title: "Foundation & Planning",
          duration: "August — October 2025",
          description:
            "Inception workshops, setting up dev environment, detailed requirements gathering, and building initial Prototypes",
        },
        {
          number: 2,
          title: "Core Development",
          duration: "November 2025 — August 2026",
          description:
            "Developing unified identity management, electronic transactions, business workflows, and unified notifications",
        },
        {
          number: 3,
          title: "National Integration",
          duration: "September — January 2026",
          description:
            "Connecting the platform with Nafath, Absher, SADAD, and shared government entities, and verifying integration",
        },
        {
          number: 4,
          title: "Pilot & Launch",
          duration: "February — April 2026",
          description:
            "Pilot program with 3 ministries, measuring performance, fixing bugs, and starting a Rolling Launch",
        },
        {
          number: 5,
          title: "Scale & Stabilization",
          duration: "May — July 2026",
          description:
            "Expanding coverage to 12 government entities, operating support services, and publishing impact reports",
        },
      ];

  const defaultDeliverablesTitle = isRtl
    ? "مصفوفة المخرجات الرئيسية ومعايير القبول"
    : "Key Deliverables & Acceptance Criteria Matrix";

  const defaultDeliverables: MethodologyDeliverable[] = isRtl
    ? [
        {
          phase: "التأسيس",
          deliverable: "وثيقة التصميم المعماري المعتمدة",
          criterion: "اعتماد لجنة الإشراف الوزارية",
        },
        {
          phase: "التطوير",
          deliverable: "نظام قابل للتشغيل UAT-Ready",
          criterion: "اجتياز 95% من حالات الاختبار",
        },
        {
          phase: "التكامل",
          deliverable: "ربط 8 خدمات وطنية",
          criterion: "تدفق بيانات ناجح لـ 30 يوماً متواصلاً",
        },
        {
          phase: "الإطلاق",
          deliverable: "3 وزارات تجريبية مفعلة",
          criterion: "معدل رضا مستخدم >= 80%",
        },
      ]
    : [
        {
          phase: "Foundation",
          deliverable: "Approved Architectural Design Document",
          criterion: "Sign-off from Ministerial Steering Committee",
        },
        {
          phase: "Development",
          deliverable: "UAT-Ready Executable System",
          criterion: "Passing 95% of test scenarios",
        },
        {
          phase: "Integration",
          deliverable: "Integration of 8 National Services",
          criterion: "Successful data flow for 30 consecutive days",
        },
        {
          phase: "Launch",
          deliverable: "3 Pilot Ministries Activated",
          criterion: "User satisfaction rate >= 80%",
        },
      ];

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    steps: defaultSteps,
    deliverablesTitle: defaultDeliverablesTitle,
    deliverables: defaultDeliverables,
    additionalContent: content || "",
  };
}

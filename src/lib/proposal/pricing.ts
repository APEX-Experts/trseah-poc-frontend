export interface PricingMetric {
  value: string;
  label: string;
  sublabel: string;
  highlighted?: boolean;
}

export interface PricingItem {
  item: string;
  description: string;
  unit: string;
  amount: number;
}

export interface PaymentTerm {
  text: string;
}

export interface PricingData {
  title: string;
  subtitle?: string;
  metrics: PricingMetric[];
  items: PricingItem[];
  totalLabel: string;
  totalAmount: number;
  paymentTerms: PaymentTerm[];
  additionalContent?: string;
}

export function parsePricingData(content: string, isRtl: boolean): PricingData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.metrics && !Array.isArray(parsed.metrics)) {
        parsed.metrics = [];
      }
      if (parsed.items && !Array.isArray(parsed.items)) {
        parsed.items = [];
      }
      if (parsed.paymentTerms && !Array.isArray(parsed.paymentTerms)) {
        parsed.paymentTerms = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultTitle = isRtl ? "العرض المالي والتسعير" : "Financial Proposal & Pricing";
  const defaultSubtitle = isRtl
    ? "هيكل تسعير شفاف مرتبط بقيمة العائد وضمانات الأداء"
    : "Transparent pricing structure tied to ROI and performance guarantees";

  const defaultMetrics: PricingMetric[] = isRtl
    ? [
        {
          value: "8.3م",
          label: "إجمالي قيمة العقد",
          sublabel: "ر.س شامل الضريبة",
          highlighted: true,
        },
        {
          value: "24",
          label: "شهر مدة التنفيذ",
          sublabel: "مع 12 شهراً دعم",
          highlighted: false,
        },
        {
          value: "3.2x",
          label: "العائد على الاستثمار",
          sublabel: "خلال 5 سنوات",
          highlighted: false,
        },
        {
          value: "30%",
          label: "تخفيض التكاليف التشغيلية",
          sublabel: "خلال السنة الأولى",
          highlighted: false,
        },
      ]
    : [
        {
          value: "8.3M",
          label: "Total Contract Value",
          sublabel: "SAR incl. VAT",
          highlighted: true,
        },
        {
          value: "24",
          label: "Months Delivery Duration",
          sublabel: "With 12 months support",
          highlighted: false,
        },
        {
          value: "3.2x",
          label: "Return on Investment",
          sublabel: "Within 5 years",
          highlighted: false,
        },
        {
          value: "30%",
          label: "Operational Cost Reduction",
          sublabel: "During first year",
          highlighted: false,
        },
      ];

  const defaultItems: PricingItem[] = isRtl
    ? [
        {
          item: "تطوير المنصة الأساسية",
          description: "تطوير جميع طبقات المنصة وخدمات API وواجهات المستخدم",
          unit: "مقطوعة",
          amount: 3200000,
        },
        {
          item: "البنية التحتية السحابية",
          description: "استضافة AWS GCC + STC Cloud لمدة 3 سنوات (Prepaid)",
          unit: "36 شهراً",
          amount: 1800000,
        },
        {
          item: "الأمن السيبراني الشامل",
          description: "ISO اختبارات الاختراق + شهادات + SOC 24/7",
          unit: "مقطوعة",
          amount: 950000,
        },
        {
          item: "التكامل مع الأنظمة الوطنية",
          description: "فاتورة + 4 أنظمة إضافية + SADAD + أبشر + Nafath",
          unit: "مقطوعة",
          amount: 680000,
        },
        {
          item: "الذكاء الاصطناعي والتحليلات",
          description: "نماذج ML, NLP بالعربية، لوحات BI التنفيذية",
          unit: "مقطوعة",
          amount: 520000,
        },
        {
          item: "التدريب وإدارة التغيير",
          description: "500 مستخدم × 3 مستويات + مواد التدريب",
          unit: "مقطوعة",
          amount: 420000,
        },
        {
          item: "الدعم الفني (السنة 1)",
          description: "تحديثات + إصلاح عيوب + L1+L2+L3",
          unit: "12 شهراً",
          amount: 780000,
        },
        {
          item: "احتياطي المخاطر والطوارئ (10%)",
          description: "غطاء التغييرات غير المتوقعة وإدارة المخاطر",
          unit: "—",
          amount: 577000,
        },
      ]
    : [
        {
          item: "Core Platform Development",
          description: "Development of all platform layers, API services, and user interfaces",
          unit: "Lump Sum",
          amount: 3200000,
        },
        {
          item: "Cloud Infrastructure",
          description: "AWS GCC + STC Cloud hosting for 3 years (Prepaid)",
          unit: "36 Months",
          amount: 1800000,
        },
        {
          item: "Comprehensive Cybersecurity",
          description: "Penetration tests + ISO certificates + 24/7 SOC",
          unit: "Lump Sum",
          amount: 950000,
        },
        {
          item: "National Integration Hub",
          description: "Fatoora + 4 additional integrations + SADAD + Absher + Nafath",
          unit: "Lump Sum",
          amount: 680000,
        },
        {
          item: "AI & Analytics Engine",
          description: "Arabic ML/NLP models, executive BI dashboards",
          unit: "Lump Sum",
          amount: 520000,
        },
        {
          item: "Training & Change Management",
          description: "500 users x 3 levels + training materials",
          unit: "Lump Sum",
          amount: 420000,
        },
        {
          item: "Technical Support (Year 1)",
          description: "Updates + bug fixes + L1/L2/L3 SLA support",
          unit: "12 Months",
          amount: 780000,
        },
        {
          item: "Risk & Contingency (10%)",
          description: "Unforeseen changes cover & risk management buffer",
          unit: "—",
          amount: 577000,
        },
      ];

  const defaultTotalLabel = isRtl
    ? "الإجمالي الكلي شامل ضريبة القيمة المضافة 15%"
    : "Grand Total inclusive of 15% VAT";

  const defaultPaymentTerms: PaymentTerm[] = isRtl
    ? [
        { text: "دفعة مقدمة 20% عند التوقيع" },
        { text: "دفعات مرحلية مرتبطة بالمعالم" },
        { text: "دفعة نهائية 15% عند الإطلاق" },
      ]
    : [
        { text: "20% Advance Payment upon signing" },
        { text: "Milestone-based progress payments" },
        { text: "15% Final Payment upon launch" },
      ];

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    metrics: defaultMetrics,
    items: defaultItems,
    totalLabel: defaultTotalLabel,
    totalAmount: 8927000,
    paymentTerms: defaultPaymentTerms,
    additionalContent: content && !content.trim().startsWith("{") ? content : "",
  };
}

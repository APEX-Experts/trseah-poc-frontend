export interface RiskItem {
  title: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

export interface QualityStandard {
  standard: string;
  method: string;
  frequency: string;
}

export interface QualityAndRiskData {
  title: string;
  risksTitle: string;
  risks: RiskItem[];
  standardsTitle: string;
  standards: QualityStandard[];
  additionalContent?: string;
}

export function parseQualityAndRiskData(content: string, isRtl: boolean): QualityAndRiskData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.risks && !Array.isArray(parsed.risks)) {
        parsed.risks = [];
      }
      if (parsed.standards && !Array.isArray(parsed.standards)) {
        parsed.standards = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultTitle = isRtl ? "إدارة المخاطر وضمان الجودة" : "Quality Assurance & Risk Management";
  const defaultRisksTitle = isRtl
    ? "سجل المخاطر وخطط التخفيف"
    : "Project Risk Register & Mitigation Plans";
  const defaultStandardsTitle = isRtl
    ? "معايير الجودة والتحقق"
    : "Quality Standards & Verification";

  const defaultRisks: RiskItem[] = isRtl
    ? [
        {
          title: "تأخر هجرة قاعدة البيانات وتكامل البيانات",
          likelihood: "متوسط",
          impact: "عالي",
          mitigation: "تشغيل عمليات هجرة تجريبية في بيئة الاستعداد واستخدام سيناريوهات التحقق.",
        },
        {
          title: "عدم توفر أو دوران الكوادر البشرية الرئيسية",
          likelihood: "منخفض",
          impact: "عالي",
          mitigation: "تأهيل وتدريب كوادر بديلة وتوثيق كافة العمليات بشكل دوري.",
        },
        {
          title: "توسع نطاق العمل أو تغيير المتطلبات",
          likelihood: "متوسط",
          impact: "متوسط",
          mitigation: "تطبيق إجراءات صارمة لإدارة التغيير تتطلب موافقة اللجنة التوجيهية.",
        },
      ]
    : [
        {
          title: "Database migration & data integration delay",
          likelihood: "Medium",
          impact: "High",
          mitigation:
            "Perform dry-run migrations in staging environment and run validation scripts.",
        },
        {
          title: "Key personnel turnover or unavailability",
          likelihood: "Low",
          impact: "High",
          mitigation: "Maintain cross-trained backup resources for all critical project roles.",
        },
        {
          title: "Scope creep or shifting requirements",
          likelihood: "Medium",
          impact: "Medium",
          mitigation:
            "Enforce a formal change management process with client steering committee approvals.",
        },
      ];

  const defaultStandards: QualityStandard[] = isRtl
    ? [
        {
          standard: "جاهزية واستمرارية المنصة",
          method: "مراقبة مستمرة للمنصة مع تفعيل أنظمة النسخ الاحتياطي التلقائي",
          frequency: "فوري / مستمر",
        },
        {
          standard: "أمن وجودة الكود البرمجي",
          method: "التحليل الساكن للكود عبر SonarQube وفحوصات أمنية أسبوعية",
          frequency: "مع كل دمج / أسبوعياً",
        },
        {
          standard: "قبول اختبارات المستخدم النهائي UAT",
          method: "تنفيذ سيناريوهات الاختبار المعتمدة؛ يشترط نسبة نجاح لا تقل عن 95% للإطلاق",
          frequency: "قبل الإطلاق",
        },
      ]
    : [
        {
          standard: "Platform Uptime & Availability",
          method: "Continuous synthetic monitoring & automatic failover verification",
          frequency: "Real-time",
        },
        {
          standard: "Code Quality & Security Compliance",
          method: "SonarQube static analysis and weekly automated vulnerability scans",
          frequency: "Per commit / Weekly",
        },
        {
          standard: "User Acceptance Testing (UAT) Pass Rate",
          method: "Execution of pre-approved test cases; minimum 95% pass rate required for launch",
          frequency: "Before release",
        },
      ];

  return {
    title: defaultTitle,
    risksTitle: defaultRisksTitle,
    risks: defaultRisks,
    standardsTitle: defaultStandardsTitle,
    standards: defaultStandards,
    additionalContent: content && !content.trim().startsWith("{") ? content : "",
  };
}

export interface TimelinePhase {
  title: string;
  duration: string;
  durationLabel: string;
  startMonth: number;
  endMonth: number;
}

export interface TimelineMilestone {
  code: string;
  description: string;
  targetDate: string;
  owner: string;
}

export interface TimelineData {
  title: string;
  phases: TimelinePhase[];
  milestonesTitle: string;
  milestones: TimelineMilestone[];
  additionalContent?: string;
}

export function parseTimelineData(content: string, isRtl: boolean): TimelineData {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.phases && !Array.isArray(parsed.phases)) {
        parsed.phases = [];
      }
      if (parsed.milestones && !Array.isArray(parsed.milestones)) {
        parsed.milestones = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultTitle = isRtl ? "الخطة الزمنية" : "Project Timeline";
  const defaultMilestonesTitle = isRtl ? "المعالم الرئيسية" : "Key Milestones";

  const defaultPhases: TimelinePhase[] = isRtl
    ? [
        {
          title: "المرحلة الاولى: التخطيط والتصميم",
          duration: "الشهر 1 - 3",
          durationLabel: "3 أشهر",
          startMonth: 1,
          endMonth: 3,
        },
        {
          title: "المرحلة الثانية: التطوير والبناء",
          duration: "الشهر 4 - 10",
          durationLabel: "3 أشهر",
          startMonth: 4,
          endMonth: 10,
        },
        {
          title: "المرحلة الثالثة: التخطيط والاختبار والتدريب",
          duration: "الشهر 11 - 14",
          durationLabel: "3 أشهر",
          startMonth: 11,
          endMonth: 14,
        },
        {
          title: "المرحلة الرابعة: الاطلاق والدعم",
          duration: "الشهر 15 - 18",
          durationLabel: "3 أشهر",
          startMonth: 15,
          endMonth: 18,
        },
      ]
    : [
        {
          title: "Phase 1: Planning & Design",
          duration: "Month 1 - 3",
          durationLabel: "3 Months",
          startMonth: 1,
          endMonth: 3,
        },
        {
          title: "Phase 2: Development & Build",
          duration: "Month 4 - 10",
          durationLabel: "7 Months",
          startMonth: 4,
          endMonth: 10,
        },
        {
          title: "Phase 3: Testing & Training",
          duration: "Month 11 - 14",
          durationLabel: "4 Months",
          startMonth: 11,
          endMonth: 14,
        },
        {
          title: "Phase 4: Launch & Support",
          duration: "Month 15 - 18",
          durationLabel: "4 Months",
          startMonth: 15,
          endMonth: 18,
        },
      ];

  const defaultMilestones: TimelineMilestone[] = isRtl
    ? [
        {
          code: "M1",
          description: "اعتماد وثيقة المتطلبات",
          targetDate: "مارس 2026",
          owner: "مدير المشروع",
        },
        {
          code: "M2",
          description: "اطلاق البنية التحتية السحابية",
          targetDate: "يونيو 2026",
          owner: "مهندس الحلول",
        },
        {
          code: "M3",
          description: "استكمال تطوير المنصة الاساسية",
          targetDate: "اكتوبر 2026",
          owner: "قائد التطوير",
        },
        {
          code: "M4",
          description: "اعتماد نتائج اختبار القبول UAT",
          targetDate: "فبراير 2026",
          owner: "قائد الجودة",
        },
        {
          code: "M5",
          description: "الاطلاق الوطني الكامل",
          targetDate: "سبتمبر 2026",
          owner: "مدير المشروع",
        },
      ]
    : [
        {
          code: "M1",
          description: "Approval of Requirements Document",
          targetDate: "March 2026",
          owner: "Project Manager",
        },
        {
          code: "M2",
          description: "Cloud Infrastructure Launch",
          targetDate: "June 2026",
          owner: "Solutions Architect",
        },
        {
          code: "M3",
          description: "Core Platform Development Completion",
          targetDate: "October 2026",
          owner: "Development Lead",
        },
        {
          code: "M4",
          description: "UAT Acceptance Results Approval",
          targetDate: "February 2026",
          owner: "QA Lead",
        },
        {
          code: "M5",
          description: "Full National Launch",
          targetDate: "September 2026",
          owner: "Project Manager",
        },
      ];

  return {
    title: defaultTitle,
    phases: defaultPhases,
    milestonesTitle: defaultMilestonesTitle,
    milestones: defaultMilestones,
    additionalContent: content && !content.trim().startsWith("{") ? content : "",
  };
}

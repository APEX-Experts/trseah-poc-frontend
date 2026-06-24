export interface VisionPillar {
  title: string;
  metric: string;
  nationalTarget: string;
  projectContribution: string;
}

export interface Vision2030Data {
  title: string;
  subtitle: string;
  pillars: VisionPillar[];
  additionalContent?: string;
}

export function parseVision2030Data(content: string, isRtl: boolean): Vision2030Data {
  try {
    if (content && content.trim().startsWith("{")) {
      const parsed = JSON.parse(content);
      if (parsed.pillars && !Array.isArray(parsed.pillars)) {
        parsed.pillars = [];
      }
      return parsed;
    }
  } catch (_e) {
    // Ignore and fallback
  }

  const defaultTitle = isRtl
    ? "مواءمة المشروع مع رؤية السعودية 2030"
    : "Aligning the Project with Saudi Vision 2030";

  const defaultSubtitle = isRtl
    ? "تنبثق منصة التحول الرقمي الموحدة مباشرة من أولويات برنامج التحول الوطني وتطلعات رؤية المملكة 2030، وتُسهم إسهاماً مباشراً في تحقيق مستهدفاتها الكمية والنوعية كما هو مفصل أدناه:"
    : "The Unified Digital Transformation Platform stems directly from the priorities of the National Transformation Program and the aspirations of Saudi Vision 2030, contributing directly to achieving its quantitative and qualitative targets as detailed below:";

  const defaultPillars: VisionPillar[] = isRtl
    ? [
        {
          title: "التحول الرقمي",
          metric: "+5.2% في مساهمة الاقتصاد الرقمي",
          nationalTarget: "رفع مساهمة الاقتصاد الرقمي في الناتج المحلي إلى 19.9% بحلول 2030",
          projectContribution:
            "المنصة تُسرّع رقمنة الخدمات الحكومية وتفتح آفاقاً جديدة للاقتصاد الرقمي",
        },
        {
          title: "رفع كفاءة الخدمات الحكومية",
          metric: "تقليص وقت الإجراءات الحكومية بنسبة 60%",
          nationalTarget: "الوصول بمؤشر e-Government إلى المراكز العشرة الأولى عالمياً",
          projectContribution:
            "توحيد الخدمات وتحسين تجربة المستفيد يرفعان ترتيب المملكة في المؤشرات الدولية",
        },
        {
          title: "تحسين تجربة المستفيد",
          metric: "رضا مستفيد مستهدف 93%",
          nationalTarget: "رفع مؤشر رضا المستفيد عن الخدمات الحكومية إلى 90%",
          projectContribution: "واجهة موحدة وسهلة تُقلل التعقيد وتوفر الوصول اللحظي للخدمات",
        },
        {
          title: "الابتكار التقني",
          metric: "إطلاق 3 مبادرات ذكاء اصطناعي حكومية",
          nationalTarget: "تحويل المملكة إلى مركز تقني عالمي وبيئة جاذبة للشركات الرقمية",
          projectContribution:
            "تبني الذكاء الاصطناعي وتحليل البيانات الضخمة في منظومة الخدمات الحكومية",
        },
      ]
    : [
        {
          title: "Digital Transformation",
          metric: "+5.2% in Digital Economy Contribution",
          nationalTarget: "Raising the digital economy contribution to GDP to 19.9% by 2030",
          projectContribution:
            "The platform accelerates the digitization of government services and opens new horizons for the digital economy",
        },
        {
          title: "Enhancing the Efficiency of Government Services",
          metric: "Reducing government procedure times by 60%",
          nationalTarget: "Reaching the top 10 globally in the e-Government index",
          projectContribution:
            "Unifying services and improving beneficiary experience raise the Kingdom's ranking in international indices",
        },
        {
          title: "Improving Beneficiary Experience",
          metric: "Target beneficiary satisfaction of 93%",
          nationalTarget:
            "Raising the beneficiary satisfaction index for government services to 90%",
          projectContribution:
            "A unified and simple interface reduces complexity and provides instant access to services",
        },
        {
          title: "Technical Innovation",
          metric: "Launching 3 government AI initiatives",
          nationalTarget:
            "Transforming the Kingdom into a global tech hub and an attractive environment for digital companies",
          projectContribution:
            "Adopting AI and big data analytics in the government services ecosystem",
        },
      ];

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    pillars: defaultPillars,
    additionalContent: content || "",
  };
}

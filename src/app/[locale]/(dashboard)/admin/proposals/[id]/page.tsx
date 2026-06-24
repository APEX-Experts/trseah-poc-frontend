/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import SectionTemplate from "@/components/proposal/SectionTemplate";
import SectionForm from "@/components/proposal/SectionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";
import {
  useAdminProposalsControllerDeliverProposal,
  useAdminProposalsControllerGetProposalDetail,
} from "@/lib/api/react-query/admin-—-proposals/admin-—-proposals";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Import MDXEditor dynamically to prevent SSR failures
const MarkdownEditor = dynamic(() => import("@/components/ui/markdown-editor"), { ssr: false });

interface Section {
  id: string;
  sectionType: string;
  contentAr: string;
  contentEn: string;
  aiGenerated: boolean;
  humanApproved: boolean;
  status: "empty" | "generating" | "completed" | "failed";
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: "create" | "save" | "approve" | "generate" | "send";
  sectionTitle: string;
  details: string;
}

// parseCoverPageMarkdown moved to SectionTemplate

const MOCK_AI_RESPONSES: Record<string, { en: string; ar: string }> = {
  cover_letter: {
    en: `Dear Partners,\n\nWe are pleased to submit our technical proposal in response to your Request for Proposal (RFP). Our team brings over 10 years of experience in technical development and systems integration.\n\nWe are committed to delivering the highest quality solution on time and within budget.\n\nSincerely,\nProposal Team`,
    ar: `السادة الكرام،\n\nيسرنا تقديم هذا المقترح الفني استجابة لطلب تقديم العروض الخاص بكم. يمتلك فريقنا خبرة تزيد عن 10 سنوات في التطوير التقني وتكامل الأنظمة.\n\nنحن ملتزمون بتقديم الحل بأعلى جودة وفي الوقت المحدد وضمن الميزانية المعتمدة.\n\nوتقبلوا وافر التحية والتقدير،\nفريق العمل`,
  },
  executive_summary: {
    en: `## Executive Summary\n\nThis proposal outlines our approach to implementing the digital transformation system. Our solution focuses on:\n\n- Modern Microservices Architecture\n- High availability & security compliance\n- Seamless integration with existing platforms\n\nWe aim to complete the execution phase within 6 months.`,
    ar: `## الملخص التنفيذي\n\nيوضح هذا المقترح منهجيتنا في تنفيذ نظام التحول الرقمي. يركز حلنا على:\n\n- بنية الخدمات المصغرة الحديثة\n- التوفر العالي والامتثال الأمني\n- التكامل السلس مع المنصات الحالية\n\nنهدف إلى إكمال مرحلة التنفيذ خلال 6 أشهر.`,
  },
  scope_understanding: {
    en: `## Understanding of Scope\n\nWe have thoroughly reviewed the RFP scope. The project requires a secure portal for document submission, administrative workflow automation, and dashboard reporting.\n\n### Key Deliverables:\n1. Vendor Registration Portal\n2. Admin Review Dashboard\n3. Integration API Suite`,
    ar: `## فهم نطاق العمل\n\nلقد قمنا بمراجعة نطاق العمل الوارد في كراسة الشروط بدقة. يتطلب المشروع بوابة آمنة لتقديم المستندات، وأتمتة سير العمل الإداري، ولوحة تقارير تفاعلية.\n\n### المخرجات الرئيسية:\n1. بوابة تسجيل الموردين\n2. لوحة تحكم المراجعة الإدارية\n3. مجموعة واجهات برمجة التطبيقات للتكامل`,
  },
  vision_2030: {
    en: `## Saudi Vision 2030 & Local Content\n\nOur implementation team is 100% local, contributing directly to the digital economy goals of Saudi Vision 2030. We source all hosting and infrastructure components from local certified providers.`,
    ar: `## رؤية المملكة 2030 والمحتوى المحلي\n\nإن فريق التنفيذ لدينا محلي بنسبة 100%، مما يساهم بشكل مباشر في أهداف الاقتصاد الرقمي لرؤية السعودية 2030. نقوم بتوريد جميع مكونات الاستضافة والبنية التحتية من مزودين محليين معتمدين.`,
  },
  company_profile: {
    en: `## Company Profile\n\nEstablished in 2015, APEX Experts has been at the forefront of digital transformation in the region. We specialize in enterprise software development, cloud migration, and IT consulting.`,
    ar: `## ملف تعريف الشركة\n\nتأسست شركة خبراء APEX في عام 2015، وكانت في طليعة شركات التحول الرقمي في المنطقة. نحن متخصصون في تطوير برمجيات المؤسسات، وهجرة الحوسبة السحابية، واستشارات تقنية المعلومات.`,
  },
  past_projects: {
    en: `## Past Experience\n\nWe have successfully delivered over 40 digital transformation projects. Notable clients include:\n\n- Ministry of Municipal and Rural Affairs\n- Saudi Tourism Authority\n- Riyadh Municipality`,
    ar: `## سوابق الأعمال والخبرات\n\nلقد قمنا بتسليم أكثر من 40 مشروع تحول رقمي بنجاح. تشمل قائمة عملائنا البارزين:\n\n- وزارة الشؤون البلدية والقروية والإسكان\n- الهيئة السعودية للسياحة\n- أمانة منطقة الرياض`,
  },
  methodology: {
    en: `## Technical Methodology\n\nWe employ the Agile Scrum methodology, organizing development into 2-week sprints. Regular sprint reviews ensure transparency and prompt feedback incorporation.\n\n### Key Stages:\n- Discovery & UX Design\n- Sprint Development & Testing\n- Deployment & UAT`,
    ar: `## المنهجية الفنية وخطة التنفيذ\n\nنحن نتبع منهجية العمل الرشيقة (Agile Scrum)، مع تنظيم عملية التطوير في دورات عمل مدتها أسبوعان. تضمن مراجعات دورة العمل الدورية الشفافية ودمج الملاحظات الفورية.\n\n### المراحل الرئيسية:\n- الاكتشاف وتصميم تجربة المستخدم\n- تطوير دورات العمل والاختبار\n- النشر واختبار قبول المستخدم`,
  },
  team: {
    en: `## Project Team & Organization\n\nOur team structure ensures clear communication and specialized focus:\n\n- **Project Sponsor**: Executive oversight\n- **Project Manager**: Daily coordination & delivery\n- **Lead Architect**: Technical direction\n- **Senior Developers (x3)**: Frontend & Backend execution`,
    ar: `## فريق العمل والهيكل التنظيمي\n\nيضمن الهيكل التنظيمي لفريقنا التواصل الواضح والتركيز المتخصص:\n\n- **راعي المشروع**: الإشراف التنفيذي\n- **مدير المشروع**: التنسيق اليومي والتسليم\n- **المهندس المعماري الرئيسي**: التوجيه الفني\n- **المطورون الأقدمون (عدد 3)**: التنفيذ للواجهات الأمامية والخلفية`,
  },
  timeline: {
    en: `## Timeline & Schedule\n\n| Phase | Description | Duration |\n|---|---|---|\n| Phase 1 | Mobilization & Design | Weeks 1-4 |\n| Phase 2 | Core Development | Weeks 5-16 |\n| Phase 3 | Testing & Launch | Weeks 17-20 |`,
    ar: `## الجدول الزمني ومراحل العمل\n\n| المرحلة | الوصف | المدة |\n|---|---|---|\n| المرحلة 1 | الحشد والتصميم | الأسائيع 1-4 |\n| المرحلة 2 | التطوير الأساسي | الأسابيع 5-16 |\n| المرحلة 3 | الاختبار والإطلاق | الأسابيع 17-20 |`,
  },
  quality_and_risk: {
    en: `## Risk Management & Quality Assurance\n\nWe utilize automated testing pipelines and static analysis tools. Risks are monitored weekly via our project register.\n\n- **Risk**: Database migration delay. **Mitigation**: Run dry-run migrations in staging.`,
    ar: `## إدارة المخاطر وضمان الجودة\n\nنحن نستخدم خطوط اختبار مؤتمتة وأدوات التحليل الساكن للكود. يتم مراقبة المخاطر أسبوعياً عبر سجل المشروع.\n\n- **الخطر**: تأخر هجرة قاعدة البيانات. **التخفيف**: تشغيل عمليات هجرة تجريبية في بيئة الاستعداد.`,
  },
  pricing: {
    en: `## Financial Proposal\n\nOur financial pricing model is milestone-based, matching the key project deliverables:\n\n- **Milestone 1**: Project Kickoff & Design Approval (20%)\n- **Milestone 2**: Core Platform Delivery (50%)\n- **Milestone 3**: Final Acceptance & Handover (30%)`,
    ar: `## العرض المالي والتسعير\n\nيعتمد نموذج التسعير المالي لدينا على تحقيق المعالم الرئيسية، بما يتوافق مع مخرجات المشروع الأساسية:\n\n- **المعلم 1**: انطلاق المشروع واعتماد التصاميم (20%)\n- **المعلم 2**: تسليم المنصة الأساسية (50%)\n- **المعلم 3**: القبول النهائي والتسليم (30%)`,
  },
};

export default function AdminProposalWorkspacePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("AdminProposals");

  // Fetch proposal details using admin endpoint
  const { data: proposalData } = useAdminProposalsControllerGetProposalDetail(id);

  const requestData = proposalData?.request
    ? {
        ...proposalData.request,
        organization: proposalData.organization,
      }
    : undefined;

  const tenderData = proposalData?.tender;

  const deliverProposalMutation = useAdminProposalsControllerDeliverProposal();

  // States
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("cover_page");
  const [editingContent, setEditingContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [markdownContentKey, setMarkdownContentKey] = useState(0);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const allSectionsGenerated = sections
    .filter((sec) => sec.id !== "cover_page")
    .every((sec) => sec.status === "completed");

  // Formatted date
  const formattedDate = new Date(
    requestData?.createdAt || new Date().toISOString(),
  ).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isExternalTender = !requestData?.tenderId;

  const getProposalTitle = () => {
    if (isExternalTender) {
      return isRtl
        ? "العرض الفني والمالي - [اسم المشروع الافتراضي]"
        : "Technical & Financial Proposal - [Project Name Placeholder]";
    }
    const title = isRtl ? tenderData?.titleAr : tenderData?.titleEn || tenderData?.titleAr;
    return (
      title ||
      requestData?.rfpExternalDescription ||
      (isRtl ? "عرض فني ومالي" : "Technical & Financial Proposal")
    );
  };

  const getInitialCoverPageMarkdown = useCallback(
    (isRtlLocale: boolean, date: string) => {
      const orgName = isRtlLocale
        ? proposalData?.organization?.nameAr
        : proposalData?.organization?.nameEn || proposalData?.organization?.nameAr;
      const title = isRtlLocale
        ? proposalData?.tender?.titleAr ||
          proposalData?.request?.rfpExternalDescription ||
          "عرض فني ومالي"
        : proposalData?.tender?.titleEn ||
          proposalData?.tender?.titleAr ||
          proposalData?.request?.rfpExternalDescription ||
          "Technical & Financial Proposal";
      const desc = isRtlLocale
        ? proposalData?.tender?.descriptionAr ||
          "رؤية متكاملة لبناء وتطوير البنية التحتية والأنظمة الرقمية."
        : proposalData?.tender?.descriptionEn ||
          proposalData?.tender?.descriptionAr ||
          "Integrated vision for building and developing digital infrastructure and systems.";
      const entity = isRtlLocale
        ? proposalData?.tender?.entityNameAr || "الجهة الحكومية المختصة"
        : proposalData?.tender?.entityNameEn ||
          proposalData?.tender?.entityNameAr ||
          "Competent Government Entity";
      const ref = proposalData?.tender?.referenceNumber || proposalData?.tender?.tenderNumber || "";

      if (isRtlLocale) {
        return `# ${title}\n\n## وصف المشروع\n${desc}\n\n---\n\n**مقدم إلى:** ${entity}\n${ref ? `**الرقم المرجعي:** ${ref}\n` : ""}**التاريخ:** ${date}\n\n---\n\n**المنظمة:** ${orgName || ""}\n**رؤية 2030:** متوافق\n**المتخصصين:** --\n**مدة التنفيذ:** --\n**قيمة المشروع:** --`;
      } else {
        return `# ${title}\n\n## Project Description\n${desc}\n\n---\n\n**Presented To:** ${entity}\n${ref ? `**Reference:** ${ref}\n` : ""}**Date:** ${date}\n\n---\n\n**Organization:** ${orgName || ""}\n**Vision 2030:** Vision 2030 Compliant\n**Specialists:** --\n**Execution Duration:** --\n**Project Value:** --`;
      }
    },
    [
      proposalData?.organization?.nameAr,
      proposalData?.organization?.nameEn,
      proposalData?.request?.rfpExternalDescription,
      proposalData?.tender?.descriptionAr,
      proposalData?.tender?.descriptionEn,
      proposalData?.tender?.entityNameAr,
      proposalData?.tender?.entityNameEn,
      proposalData?.tender?.referenceNumber,
      proposalData?.tender?.tenderNumber,
      proposalData?.tender?.titleAr,
      proposalData?.tender?.titleEn,
    ],
  );

  const getInitialCoverLetterMarkdown = useCallback(
    (isRtlLocale: boolean) => {
      const orgName = isRtlLocale
        ? proposalData?.organization?.nameAr
        : proposalData?.organization?.nameEn || proposalData?.organization?.nameAr;
      const entity = isRtlLocale
        ? proposalData?.tender?.entityNameAr || "الجهة الحكومية المختصة"
        : proposalData?.tender?.entityNameEn ||
          proposalData?.tender?.entityNameAr ||
          "Competent Government Entity";

      if (isRtlLocale) {
        return `يسعد ${orgName || "[اسم الشركة]"} تقديم عرضها الفني والتجاري الشامل للمنافسة المشار إليها أعلاه، استجابةً للطلب الصادر عن ${entity || "الجهة الموقرة"}.

تُدرك شركتنا الأهمية الاستراتيجية البالغة لهذا المشروع في تعزيز منظومة التحول الرقمي الحكومي، وتحقيق أهداف رؤية المملكة 2030 المتعلقة برفع كفاءة الخدمات الحكومية وتحسين تجربة المستفيدين. وبناءً على خبرتنا الممتدة في تنفيذ المشاريع الحكومية الكبرى، نؤكد استعدادنا التام لتقديم حل متكامل يلبي جميع المتطلبات الواردة في وثائق المنافسة.

يتضمن هذا العرض المقاربة الفنية الشاملة، وخطة التنفيذ المفضلة، وتأهيل الفريق المقترح، إضافةً إلى العرض المالي التنافسي. ونتعهد بالالتزام الكامل بالجداول الزمنية والمواصفات التقنية والمعايير النوعية المعتمدة.

نرجو التكرم بقبول عرضنا، ونحن على أتم الاستعداد لتقديم أي توضيحات أو معلومات إضافية ترونها ضرورية. ونسأل الله أن يوفقنا لما فيه خدمة هذا الوطن العزيز وتحقيق طموحات قيادته الرشيدة.`;
      } else {
        return `${orgName || "[Company Name]"} is pleased to submit its comprehensive technical and commercial proposal for the aforementioned project, in response to the request issued by ${entity || "the respected government entity"}.

Our company recognizes the critical strategic importance of this project in strengthening the government digital transformation ecosystem and achieving the goals of Saudi Vision 2030 related to enhancing the efficiency of government services and improving the beneficiary experience. Based on our extensive experience in executing major government projects, we confirm our full readiness to provide an integrated solution that meets all requirements specified in the competition documents.

This proposal includes the comprehensive technical approach, preferred execution plan, qualifications of the proposed team, and our competitive financial proposal. We pledge our full commitment to the schedules, technical specifications, and quality standards approved by the entity.

We kindly request you to accept our proposal, and we remain fully prepared to provide any clarifications or additional information you may deem necessary. We pray to God to guide us in serving this dear nation and achieving the aspirations of its wise leadership.`;
      }
    },
    [
      proposalData?.organization?.nameAr,
      proposalData?.organization?.nameEn,
      proposalData?.tender?.entityNameAr,
      proposalData?.tender?.entityNameEn,
    ],
  );

  // parsedCover moved to SectionTemplate

  // Initialize Sections & Logs
  useEffect(() => {
    const defaultSections: Section[] = [
      {
        id: "cover_page",
        sectionType: "cover_page",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: true,
        status: "completed",
      },
      {
        id: "cover_letter",
        sectionType: "cover_letter",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "executive_summary",
        sectionType: "executive_summary",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "scope_understanding",
        sectionType: "scope_understanding",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "vision_2030",
        sectionType: "vision_2030",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "company_profile",
        sectionType: "company_profile",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "past_projects",
        sectionType: "past_projects",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "methodology",
        sectionType: "methodology",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "team",
        sectionType: "team",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "timeline",
        sectionType: "timeline",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "quality_and_risk",
        sectionType: "quality_and_risk",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
      {
        id: "pricing",
        sectionType: "pricing",
        contentAr: "",
        contentEn: "",
        aiGenerated: false,
        humanApproved: false,
        status: "empty",
      },
    ];

    // Cover Letter starts empty and is seeded dynamically when proposalData loads

    defaultSections[5].contentAr = MOCK_AI_RESPONSES.company_profile.ar;
    defaultSections[5].contentEn = MOCK_AI_RESPONSES.company_profile.en;
    defaultSections[5].status = "completed";
    defaultSections[5].humanApproved = true;

    setSections(defaultSections);

    setActivityLogs([
      {
        id: "1",
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "create",
        sectionTitle: "",
        details: t("activityLogCreated"),
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "generate",
        sectionTitle: t("sections.cover_letter"),
        details: t("activityLogGenerated", {
          section: t("sections.cover_letter"),
        }),
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 600000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "approve",
        sectionTitle: t("sections.company_profile"),
        details: t("activityLogApproved", {
          section: t("sections.company_profile"),
        }),
      },
    ]);
  }, [locale, t]);

  // Sync editor content when selected section or locale changes
  useEffect(() => {
    if (selectedSection) {
      setEditingContent(locale === "ar" ? selectedSection.contentAr : selectedSection.contentEn);
    }
  }, [selectedSectionId, locale, selectedSection]);

  // Seed cover page and cover letter content from data once available
  useEffect(() => {
    if (proposalData && sections.length > 0) {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id === "cover_page" && !s.contentAr && !s.contentEn) {
            return {
              ...s,
              contentAr: getInitialCoverPageMarkdown(true, formattedDate),
              contentEn: getInitialCoverPageMarkdown(false, formattedDate),
            };
          }
          if (s.id === "cover_letter" && !s.contentAr && !s.contentEn) {
            return {
              ...s,
              contentAr: getInitialCoverLetterMarkdown(true),
              contentEn: getInitialCoverLetterMarkdown(false),
              status: "completed",
              aiGenerated: true,
            };
          }
          return s;
        }),
      );
    }
  }, [
    proposalData,
    sections.length,
    getInitialCoverPageMarkdown,
    getInitialCoverLetterMarkdown,
    formattedDate,
  ]);

  // Helper: Append Activity Log
  const addLog = (action: ActivityLog["action"], sectionTitle: string, details: string) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action,
      sectionTitle,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Action: Save Section
  const handleSave = () => {
    if (!selectedSection) return;

    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              contentAr: locale === "ar" ? editingContent : s.contentAr,
              contentEn: locale === "en" ? editingContent : s.contentEn,
              status: editingContent ? "completed" : "empty",
            }
          : s,
      ),
    );

    const title = t(`sections.${selectedSection.id}`);
    toast.success(t("successSave"));
    addLog("save", title, t("activityLogSaved", { section: title }));

    if (allSectionsGenerated) {
      deliverProposalMutation.mutate(
        {
          id,
          data: {
            rfpFileUrl: proposalData?.rfpFileUrl || "https://test.com/proposal.pdf",
            titleAr: getProposalTitle(),
            titleEn: getProposalTitle(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Proposal successfully saved to backend!");
          },
          onError: () => {
            toast.error("Failed to save proposal to backend");
          },
        },
      );
    }
  };

  // Action: Reset Current Section
  const handleResetSection = () => {
    if (!selectedSectionId) return;

    let initialContent = "";
    if (selectedSectionId === "cover_page") {
      initialContent = getInitialCoverPageMarkdown(locale === "ar", formattedDate);
    } else if (selectedSectionId === "cover_letter") {
      initialContent = getInitialCoverLetterMarkdown(locale === "ar");
    } else if (selectedSectionId === "company_profile") {
      initialContent = MOCK_AI_RESPONSES.company_profile[locale as "ar" | "en"] || "";
    }

    setEditingContent(initialContent);

    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              contentAr: locale === "ar" ? initialContent : s.contentAr,
              contentEn: locale === "en" ? initialContent : s.contentEn,
              status: initialContent ? "completed" : "empty",
            }
          : s,
      ),
    );
    setMarkdownContentKey((prev) => prev + 1);

    const title = t(`sections.${selectedSectionId}`);
    addLog("save", title, t("activityLogResetSection", { section: title }));
    toast.success("Section content reset successfully!");
  };

  // Action: Approve Section
  const handleApprove = () => {
    if (!selectedSection) return;

    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              humanApproved: true,
              status: "completed",
            }
          : s,
      ),
    );

    const title = t(`sections.${selectedSection.id}`);
    toast.success(t("successApprove"));
    addLog("approve", title, t("activityLogApproved", { section: title }));
  };

  // Action: Generate with AI (Simulated SSE Streaming)
  const handleAiGeneration = () => {
    if (!selectedSection) return;

    setIsGenerating(true);
    setEditingContent("");

    // Set section status to generating
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId ? { ...s, status: "generating", aiGenerated: true } : s,
      ),
    );

    const fullResponse =
      selectedSectionId === "cover_page"
        ? getInitialCoverPageMarkdown(locale === "ar", formattedDate)
        : selectedSectionId === "cover_letter"
          ? getInitialCoverLetterMarkdown(locale === "ar")
          : MOCK_AI_RESPONSES[selectedSectionId]?.[locale as "ar" | "en"] || t("generatedFallback");
    const words = fullResponse.split(" ");
    let currentWordIndex = 0;
    let accumulatedText = "";

    // Simulated Server-Sent Events interval
    const streamInterval = setInterval(() => {
      if (currentWordIndex < words.length) {
        accumulatedText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];
        setEditingContent(accumulatedText);
        currentWordIndex++;
      } else {
        clearInterval(streamInterval);
        setIsGenerating(false);

        // Update the section contents in memory
        setSections((prev) =>
          prev.map((s) =>
            s.id === selectedSectionId
              ? {
                  ...s,
                  contentAr: locale === "ar" ? accumulatedText : s.contentAr,
                  contentEn: locale === "en" ? accumulatedText : s.contentEn,
                  status: "completed",
                }
              : s,
          ),
        );

        const title = t(`sections.${selectedSection.id}`);
        toast.success(t("successGenerate"));
        addLog("generate", title, t("activityLogGenerated", { section: title }));
      }
    }, 45); // Typing speed
  };

  // Action: Final Send to Client
  const handleSendToClient = () => {
    deliverProposalMutation.mutate(
      {
        id,
        data: {
          rfpFileUrl: proposalData?.rfpFileUrl || "https://test.com/proposal.pdf",
          titleAr: getProposalTitle(),
          titleEn: getProposalTitle(),
        },
      },
      {
        onSuccess: () => {
          setIsSendDialogOpen(false);
          toast.success(t("successSend"));
          setTimeout(() => {
            router.push(`/admin/requests/${proposalData?.request?.id || requestData?.id || id}`);
          }, 1500);
        },
        onError: () => {
          toast.error("Failed to deliver proposal");
        },
      },
    );
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-64px)] md:overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Studio Header */}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-xl border border-neutral-100 hover:bg-neutral-50"
          >
            <Link href={`/admin/requests/${proposalData?.request?.id || requestData?.id || id}`}>
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-neutral-900 tracking-tight">
                {t("title")}
              </h1>
              <Badge
                variant="secondary"
                className="max-md:hidden bg-primary-50 text-primary-800 text-[10px] font-bold py-0.5 px-2 rounded-md"
              >
                {requestData?.organization
                  ? t("proposalForOrganization", {
                      org: isRtl
                        ? requestData.organization.nameAr
                        : requestData.organization.nameEn || requestData.organization.nameAr,
                    })
                  : t("fallbackWorkspaceName")}
              </Badge>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{t("subtitleDescription")}</p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-neutral-200 text-neutral-700 font-bold h-9 px-4 rounded-xl gap-2 hover:bg-neutral-50 transition-colors cursor-pointer"
            onClick={handleResetSection}
            disabled={isGenerating || deliverProposalMutation.isPending}
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t("reset")}</span>
          </Button>

          <Button
            variant="default"
            className="bg-primary-800 hover:bg-primary-900 text-white font-bold h-9 px-4 rounded-xl gap-2 shadow-sm disabled:opacity-50"
            onClick={() => setIsSendDialogOpen(true)}
            disabled={!allSectionsGenerated || deliverProposalMutation.isPending}
          >
            <Send className="h-4 w-4" />
            <span>{t("sendToClient")}</span>
          </Button>
        </div>
      </header>

      {/* Main Studio Workspace Columns */}
      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden bg-neutral-50/40">
        {/* Left Column: Sections Sidebar */}
        <aside className="md:w-72 bg-white md:border-r md:border-neutral-100 flex flex-col shrink-0 md:overflow-y-auto">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/20">
            <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider block">
              {t("sectionsSidebarTitle")}
            </span>
          </div>
          <nav className="p-2 space-y-1 flex-1">
            {sections.map((sec, idx) => {
              const isActive = sec.id === selectedSectionId;
              const sectionTitle = t(`sections.${sec.id}`);

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    setEditingContent(locale === "ar" ? sec.contentAr : sec.contentEn);
                    setActiveTab("editor");
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary-50/60 border border-primary-100 text-primary-900 font-bold shadow-xs"
                      : "text-neutral-600 hover:bg-neutral-50/80 border border-transparent font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full shrink-0 font-extrabold ${
                        isActive ? "bg-primary-800 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs truncate text-start block w-full">{sectionTitle}</span>
                  </div>

                  {/* Section Status Badge */}
                  <div className="shrink-0 ms-2">
                    {sec.humanApproved ? (
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 text-[9px] py-0.5 px-1.5 font-bold rounded-md flex items-center gap-1">
                        <CheckCircle className="h-2.5 w-2.5" />
                        <span>{t("approved")}</span>
                      </Badge>
                    ) : sec.status === "generating" ? (
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100 text-[9px] py-0.5 px-1.5 font-bold rounded-md flex items-center gap-1 animate-pulse">
                        <Clock className="h-2.5 w-2.5 animate-spin" />
                        <span>{t("statusGenerating")}</span>
                      </Badge>
                    ) : sec.aiGenerated ? (
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-100 text-[9px] py-0.5 px-1.5 font-bold rounded-md flex items-center gap-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>{t("aiDraft")}</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-neutral-50 text-neutral-400 hover:bg-neutral-50 border-neutral-200 text-[9px] py-0.5 px-1.5 font-bold rounded-md">
                        {t("empty")}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Center Column: Interactive Editor / Preview Panel */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white border-r border-neutral-100">
          {/* Tab Selector & Section Metadata */}
          <div className="px-6 py-3 border-b border-neutral-100 bg-neutral-50/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold text-neutral-800">
                {selectedSection ? t(`sections.${selectedSection.id}`) : ""}
              </h2>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/60">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === "editor"
                    ? "bg-white text-neutral-800 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {t("editor")}
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === "preview"
                    ? "bg-white text-neutral-800 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {t("preview")}
              </button>
            </div>
          </div>

          {/* Workspace Area: Editor vs Preview */}
          {activeTab === "editor" ? (
            <div className="flex-1 p-6 flex flex-col min-h-128 bg-neutral-50/10">
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="flex-1 relative flex flex-col min-h-0">
                  {selectedSectionId ? (
                    <SectionForm
                      key={selectedSectionId + "_" + locale + "_" + markdownContentKey}
                      sectionId={selectedSectionId}
                      content={editingContent}
                      onChange={setEditingContent}
                      isRtl={isRtl}
                      proposalData={proposalData}
                      requestData={requestData}
                      tenderData={tenderData}
                      formattedDate={formattedDate}
                    />
                  ) : (
                    <MarkdownEditor
                      key={selectedSectionId + "_" + locale + "_" + markdownContentKey}
                      markdown={editingContent}
                      onChange={setEditingContent}
                      disabled={isGenerating}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    />
                  )}
                  {isGenerating && (
                    <div className="absolute bottom-4 inset-e-4 bg-indigo-50 border border-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold shadow-sm animate-pulse z-10">
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                      <span>{t("generatingAI")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            proposalData && (
              /* Preview Mode */
              <SectionTemplate
                sectionId={selectedSectionId}
                content={editingContent}
                isRtl={isRtl}
                locale={locale}
                proposalData={proposalData}
                requestData={requestData}
                tenderData={tenderData}
                formattedDate={formattedDate}
              />
            )
          )}

          {/* Action Bar Footer */}
          <footer className="px-6 py-4 bg-white border-t border-neutral-100 flex items-center justify-between shrink-0">
            <Button
              variant="outline"
              disabled={isGenerating}
              onClick={handleAiGeneration}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-100 hover:border-indigo-200 font-bold px-4 h-10 rounded-xl gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t("generateWithAI")}</span>
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={
                  isGenerating || !allSectionsGenerated || deliverProposalMutation.isPending
                }
                className="border-neutral-200 text-neutral-700 font-bold px-4 h-10 rounded-xl gap-2 hover:bg-neutral-50 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{t("save")}</span>
              </Button>
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={isGenerating || selectedSection?.humanApproved}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 h-10 rounded-xl gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{selectedSection?.humanApproved ? t("approved") : t("approve")}</span>
              </Button>
            </div>
          </footer>
        </main>

        {/* Right Column: Activity Timeline */}
        <aside className="w-60 bg-white hidden md:flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/20 flex items-center gap-2">
            <Activity className="h-4 w-4 text-neutral-500" />
            <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider block">
              {t("activityLog")}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">{t("noActivities")}</p>
            ) : (
              activityLogs.map((log) => {
                let badgeColor = "bg-neutral-100 text-neutral-600";
                if (log.action === "approve")
                  badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                if (log.action === "generate")
                  badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
                if (log.action === "save") badgeColor = "bg-blue-50 text-blue-700 border-blue-100";

                return (
                  <div key={log.id} className="relative flex gap-3 text-xs">
                    {/* Activity Icon Circle */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${badgeColor}`}
                    >
                      {log.action === "approve" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : log.action === "generate" ? (
                        <Sparkles className="h-3 w-3" />
                      ) : log.action === "save" ? (
                        <Save className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-neutral-800">
                          {log.action === "approve"
                            ? t("logActionApprove")
                            : log.action === "generate"
                              ? t("logActionGenerate")
                              : log.action === "save"
                                ? t("logActionSave")
                                : t("logActionSystem")}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-neutral-500 leading-normal text-[11px]">{log.details}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>

      {/* Confirmation Dialog: Send to Client */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white border border-border p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              {t("confirmSend")}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              {t("confirmSendDescription")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSendDialogOpen(false)}
              className="border-neutral-200 text-neutral-700 font-bold px-4 rounded-xl"
            >
              {t("cancel")}
            </Button>
            <Button
              variant="default"
              onClick={handleSendToClient}
              className="bg-primary-800 hover:bg-primary-900 text-white font-bold px-4 rounded-xl"
            >
              {t("confirmSendButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

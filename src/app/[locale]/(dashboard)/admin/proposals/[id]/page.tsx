/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import SectionForm from "@/components/proposal/SectionForm";
import SectionTemplate from "@/components/proposal/SectionTemplate";
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
  useAdminProposalsControllerUpdateProposalSection,
} from "@/lib/api/react-query/admin-—-proposals/admin-—-proposals";
import { ProposalSectionResponseDto } from "@/types/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  RotateCcw,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Import MDXEditor dynamically to prevent SSR failures
const MarkdownEditor = dynamic(() => import("@/components/ui/markdown-editor"), { ssr: false });

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
  const proposalSections: ProposalSectionResponseDto[] = proposalData?.sections || [];
  const { mutateAsync: updateSection } = useAdminProposalsControllerUpdateProposalSection({
    mutation: {
      onSuccess: () => {
        toast.success(t("successSave"));
      },
      onError: () => {
        toast.error(t("error"));
      },
    },
  });
  const [sections, setSections] = useState<ProposalSectionResponseDto[]>(proposalSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
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

  useEffect(() => {
    if (sections.length === 0 && proposalData?.sections) {
      setSections(proposalData.sections);
      setSelectedSectionId(
        proposalData?.sections.find((s) => s.sectionType === "cover_page")?.id || "",
      );
    }
  }, [proposalData?.sections, sections.length]);

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

  // Sync editor content when selected section or locale changes
  useEffect(() => {
    if (selectedSection) {
      setEditingContent(
        locale === "ar" ? selectedSection.contentAr || "" : selectedSection.contentEn || "",
      );
    }
  }, [selectedSectionId, locale, selectedSection]);

  // Action: Save Section
  const handleSave = async () => {
    if (!selectedSection || !selectedSectionId) return;

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
    await updateSection({
      id,
      sectionId: selectedSectionId,
      data: {
        contentAr: locale === "ar" ? editingContent : selectedSection.contentAr,
        contentEn: locale === "en" ? editingContent : selectedSection.contentEn,
        status: editingContent ? "completed" : "empty",
      },
    });
    toast.success(t("successSave"));

    if (allSectionsGenerated) {
      await deliverProposalMutation.mutateAsync(
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

    const initialContent = "";

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
  };

  // Action: Approve Section
  const handleApprove = async () => {
    if (!selectedSection || !selectedSectionId) return;

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

    await updateSection({
      id,
      sectionId: selectedSectionId,
      data: {
        contentAr: selectedSection.contentAr,
        contentEn: selectedSection.contentEn,
        humanApproved: true,
        status: "completed",
      },
    });
    toast.success(t("successApprove"));
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

    const fullResponse = "";
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

        toast.success(t("successGenerate"));
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
              const sectionTitleFallback = t(`sections.${sec.sectionType}`);
              const sectionTitle =
                locale === "ar"
                  ? sec.titleAr || sectionTitleFallback
                  : sec.titleEn || sectionTitleFallback;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    setEditingContent(locale === "ar" ? sec.contentAr || "" : sec.contentEn || "");
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
                {selectedSection
                  ? locale === "ar"
                    ? selectedSection.titleAr
                    : selectedSection.titleEn
                  : ""}
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
                      sectionId={selectedSection?.sectionType || selectedSectionId}
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
                sectionId={selectedSection?.sectionType || selectedSectionId || ""}
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
              disabled={
                isGenerating ||
                !!selectedSection?.humanApproved ||
                selectedSection?.sectionType === "cover_page"
              }
              onClick={handleAiGeneration}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-100 hover:border-indigo-200 font-bold px-4 h-10 rounded-xl gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t("generateWithAI")}</span>
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isGenerating || deliverProposalMutation.isPending}
                className="font-bold px-4 h-10 rounded-xl gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{t("save")}</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleApprove}
                disabled={isGenerating || selectedSection?.humanApproved}
                className=" font-bold px-5 h-10 rounded-xl gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{selectedSection?.humanApproved ? t("approved") : t("approve")}</span>
              </Button>
            </div>
          </footer>
        </main>
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

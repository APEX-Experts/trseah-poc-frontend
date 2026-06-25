"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, FileText, Loader2, Sparkles, Download } from "lucide-react";
import { useProposalsControllerGetProposalDetails } from "@/lib/api/react-query/proposals/proposals";
import SectionTemplate from "@/components/proposal/SectionTemplate";

export default function ProposalDetailSkeletonPage() {
  const { id } = useParams() as { id: string };
  const locale = useLocale();
  const t = useTranslations("Proposals");
  const { data: proposalData, isLoading, isError } = useProposalsControllerGetProposalDetails(id);

  // State to track the currently visible section index
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Calling the API route triggers the download
      window.open(`/api/proposals/${id}/export`, "_blank");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 mx-auto py-8 min-h-screen">
            <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
            <span>{t("loading")}</span>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 mx-auto py-8 min-h-screen">
            <span>{t("error")}</span>
          </div>
        </div>
      </PageContainer>
    );
  }

  const isCompleted = proposalData?.status === "submitted";

  if (!isCompleted) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
          {/* Navigation Breadcrumb */}
          <div>
            <Button
              variant="ghost"
              asChild
              className="text-neutral-500 hover:text-neutral-900 gap-2"
            >
              <Link href="/requests">
                {locale === "ar" ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                <span>{t("backToRequests")}</span>
              </Link>
            </Button>
          </div>

          {/* Outer card styled with the theme's colors */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm flex flex-col items-center justify-center text-center gap-6 min-h-[400px]">
            <div className="relative">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-800 border border-primary-100/50">
                <FileText className="w-8 h-8" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-300 rounded-full flex items-center justify-center text-white border-2 border-white animate-pulse">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary-900">{t("generatingTitle")}</h2>
              <p className="text-neutral-500 max-w-md text-sm leading-relaxed">
                {t("generatingDesc")}
              </p>
            </div>

            {/* Skeleton Loaders for Preview */}
            <div className="w-full max-w-lg border border-neutral-100 rounded-2xl p-6 bg-neutral-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="h-4 w-1/3 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-1/6 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-neutral-200/70 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-neutral-200/70 rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-neutral-200/70 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
              <span>{t("generatingProgress")}</span>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const formattedDate = new Date(
    proposalData?.createdAt || new Date().toISOString(),
  ).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Sort sections safely and extract the current one
  const sortedSections = proposalData?.sections
    ? [...proposalData.sections].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];

  const currentSection = sortedSections[currentIndex];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {sortedSections.length > 0 ? (
          <>
            <div className="flex flex-col w-full justify-between gap-4">
              <div className="flex justify-end">
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="gap-2"
                  variant={"outline"}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{locale === "ar" ? "تصدير إلى PDF" : "Export to PDF"}</span>
                </Button>
              </div>
              {/* Carousel Controls */}
              <div className="flex items-center justify-between rounded-xl flex-1">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="gap-2"
                >
                  {locale === "ar" ? (
                    <ArrowRight className="w-4 h-4" />
                  ) : (
                    <ArrowLeft className="w-4 h-4" />
                  )}
                  {/* Fallback added in case t("previous") is undefined in your en/ar files */}
                  <span>
                    {t("previous") !== "previous"
                      ? t("previous")
                      : locale === "ar"
                        ? "السابق"
                        : "Previous"}
                  </span>
                </Button>

                <span className="text-sm font-medium text-neutral-500">
                  {currentIndex + 1} / {sortedSections.length}
                </span>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(sortedSections.length - 1, prev + 1))
                  }
                  disabled={currentIndex === sortedSections.length - 1}
                  className="gap-2"
                >
                  <span>
                    {t("next") !== "next" ? t("next") : locale === "ar" ? "التالي" : "Next"}
                  </span>
                  {locale === "ar" ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Current Section Display */}
            <div className="transition-all duration-300 ease-in-out">
              <SectionTemplate
                key={currentSection.id}
                sectionId={currentSection.sectionType}
                content={
                  locale === "ar"
                    ? currentSection.contentAr || currentSection.contentEn || "لا يوجد محتوى"
                    : currentSection.contentEn || currentSection.contentAr || "No content"
                }
                isRtl={locale === "ar"}
                proposalData={proposalData}
                requestData={proposalData?.request}
                tenderData={proposalData?.tender}
                locale={locale}
                formattedDate={formattedDate}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            {locale === "ar" ? "لا توجد أقسام متاحة" : "No sections available"}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

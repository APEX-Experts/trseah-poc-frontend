"use client";

import { useParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, FileText, Loader2, Sparkles } from "lucide-react";

export default function ProposalDetailSkeletonPage() {
  const { id } = useParams() as { id: string };
  const locale = useLocale();
  const t = useTranslations("Proposals");

  return (
    <PageContainer>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Button variant="ghost" asChild className="text-neutral-500 hover:text-neutral-900 gap-2">
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
              {t("generatingDesc", { id: id.substring(0, 8).toUpperCase() })}
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

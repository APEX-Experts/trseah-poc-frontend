// components/onboarding/step-review.tsx
"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { OnboardingFooter } from "./onboarding-footer";
import { toast } from "sonner";
import { Building2, Users, Briefcase, FileText, Loader2, User } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/apiClient";
import type { OnboardingResponseDto } from "@/types/api";

export function StepReview() {
  const t = useTranslations("Onboarding");
  const router = useRouter();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { companyInfo, teamMembers, projects, documents, prevStep, clearStore } =
    useOnboardingStore();

  const { mutateAsync: onboard } = useMutation({
    mutationFn: (data: FormData) =>
      api<OnboardingResponseDto>({
        url: `/api/organizations/onboard`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data,
      }),
  });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!companyInfo || !teamMembers || !projects) {
        toast.error(t("Status.validationError", { fallback: "Please fill in all fields" }));
        return;
      }

      const formData = new FormData();
      formData.append("organization", JSON.stringify(companyInfo));

      // Build team members payload without the file property inside JSON, and append files separately
      const teamMembersPayload = teamMembers.map(({ file: _, ...rest }) => rest);
      formData.append("teamMembers", JSON.stringify(teamMembersPayload));

      teamMembers.forEach((member, index) => {
        if (member.file) {
          formData.append(`team_member_${index}`, member.file);
        }
      });

      // Build projects payload
      formData.append("projects", JSON.stringify(projects));

      // Build documents payload without the file property inside JSON, and append files separately
      const documentsPayload = documents.map(({ file: _file, id: _id, ...rest }) => rest);
      formData.append("documents", JSON.stringify(documentsPayload));

      documents.forEach((doc, index) => {
        if (doc.file) {
          formData.append(`document_${index}`, doc.file);
        }
      });

      await onboard(formData);

      toast.success(t("Actions.completeMessage"));
      clearStore(); // Wipe local storage
      router.push("/");
    } catch (error) {
      console.error("Submission failed", error);
      toast.error(t("Status.submitError", { fallback: "An error occurred during submission." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-up-and-fade pb-24">
      <div className="text-center mb-8">
        <h1 className="h2 text-primary-900 mb-2">
          {t("Review.title", { fallback: "Review & Submit" })}
        </h1>
        <p className="p-md text-neutral-500">
          {t("Review.description", { fallback: "Review your information before sending." })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Overview */}
        {companyInfo && (
          <div className="bg-white p-6 rounded-2xl border border-border card-shadow flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary-800" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-lg text-primary-900">{t("Company.title")}</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {Object.keys(companyInfo).map((key) => (
                  <div key={key}>
                    <p className="text-xs text-neutral-500">{t(`Company.${key}`)}</p>
                    <p className="font-medium">
                      {key === "size"
                        ? t(`Company.sizes.${companyInfo[key as keyof typeof companyInfo]}`)
                        : companyInfo[key as keyof typeof companyInfo]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Overview */}
        {teamMembers && (
          <div className="bg-white p-6 rounded-2xl border border-border card-shadow flex gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-accent-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary-900">{t("Team.title")}</h3>
              <p className="text-neutral-600 mt-1">
                {teamMembers.length} {t("Review.membersAdded", { fallback: "Members added" })}
              </p>
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <User className="text-primary-800 w-4 h-4" />
                  <span>{`${locale === "ar" ? member.nameAr : (member.nameEn ?? member.nameAr)} | ${locale === "ar" ? member.roleAr : (member.roleEn ?? member.roleAr)}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Overview */}
        <div className="bg-white p-6 rounded-2xl border border-border card-shadow flex gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary-900">{t("Projects.title")}</h3>
            <p className="text-neutral-600 mt-1">
              {projects.length} {t("Review.projectsAdded", { fallback: "Projects added" })}
            </p>
          </div>
        </div>

        {/* Documents Overview */}
        <div className="bg-white p-6 rounded-2xl border border-border card-shadow flex gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-primary-900">{t("Documents.title")}</h3>
            <p className="text-neutral-600 mt-1">
              {documents.length} {t("Review.filesUploaded", { fallback: "Files attached" })}
            </p>
          </div>
        </div>
      </div>

      <OnboardingFooter>
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
          className="border-neutral-300 text-neutral-600"
        >
          {t("Actions.back")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8 flex gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting
            ? t("Actions.saving")
            : t("Actions.complete", { fallback: "Submit & Create" })}
        </Button>
      </OnboardingFooter>
    </div>
  );
}

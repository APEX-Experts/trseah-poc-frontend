// app/onboarding/page.tsx
"use client";

import { OnboardingLayout } from "@/components/onboarding/onboarding-layout";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { StepCompanyInfo } from "@/components/onboarding/step-company-info";
import { StepDocuments } from "@/components/onboarding/step-documents";
import { StepPastProjects } from "@/components/onboarding/step-past-projects";
import { StepTeamMembers } from "@/components/onboarding/step-team-members";
import { StepReview } from "@/components/onboarding/step-review";

export default function OnboardingPage() {
  const { currentStep, isHydrated } = useOnboardingStore();

  if (!isHydrated) return <div className="min-h-screen bg-neutral-50" />;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <StepCompanyInfo />;
      case 2:
        return <StepTeamMembers />;
      case 3:
        return <StepPastProjects />;
      case 4:
        return <StepDocuments />;
      case 5:
        return <StepReview />;
      default:
        return <StepCompanyInfo />;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep}>
      <div key={`step-${currentStep}`} className="w-full h-full">
        {renderCurrentStep()}
      </div>
    </OnboardingLayout>
  );
}

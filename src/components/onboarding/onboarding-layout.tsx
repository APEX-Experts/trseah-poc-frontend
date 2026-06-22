// components/onboarding/onboarding-layout.tsx
"use client";

import { CheckCircle2, Bookmark, Briefcase, Users, Building2, ClipboardCheck } from "lucide-react";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export function OnboardingLayout({ children, currentStep }: OnboardingLayoutProps) {
  const t = useTranslations("Onboarding");

  // Map 5 steps now
  const steps = [
    { id: 1, label: t("Company.title"), icon: Building2 },
    { id: 2, label: t("Team.title"), icon: Users },
    { id: 3, label: t("Projects.title"), icon: Briefcase },
    { id: 4, label: t("Documents.title", { fallback: "Documents" }), icon: Bookmark },
    { id: 5, label: t("Review.title", { fallback: "Review" }), icon: ClipboardCheck },
  ];

  const getStepStatus = (stepId: number) => {
    if (currentStep > stepId) return "completed";
    if (currentStep === stepId) return "active";
    return "upcoming";
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-neutral-50 overflow-hidden">
      {/* ... (Keep your existing Header logic, just update the width/layout if 5 steps overflow) ... */}
      <div className="bg-white border-b border-border py-6 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex w-full max-w-5xl mx-auto items-center justify-between relative">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 relative z-10 bg-white px-2 md:px-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    status === "completed"
                      ? "bg-primary-800 border-primary-800 text-white"
                      : status === "active"
                        ? "bg-neutral-50 border-primary-800 text-primary-800 ring-4 ring-primary-100"
                        : "bg-neutral-50 border-neutral-300 text-neutral-400"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs md:text-sm font-medium hidden md:block ${status === "upcoming" ? "text-neutral-400" : "text-primary-800"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
          {/* Connecting line: logical inset-x so it works in RTL & LTR */}
          <div className="absolute top-5 inset-x-10 h-[2px] bg-neutral-200 -z-10">
            {/* Active progress line fill */}
            <div
              className="h-full bg-primary-800 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 w-full min-h-0">
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-10 pb-32">{children}</main>

        <aside className="hidden lg:flex w-[280px] shrink-0 bg-white border-s border-border p-8 flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-primary-900 mb-2">
              {t("Actions.progress", { fallback: "Progress" })}
            </h2>
            <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
              <span>
                {t("progress", { currentStep, maxSteps: steps.length })} —{" "}
                {steps[currentStep - 1]?.label}
              </span>
            </div>
            {/* Progress Bar chunks */}
            <div className="flex gap-1 h-1.5 w-full">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    step.id <= currentStep ? "bg-primary-800" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                    status === "active" ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 bg-primary-800 rounded-full text-primary-200 shrink-0" />
                  ) : status === "active" ? (
                    <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-primary-800 shrink-0">
                      {step.id}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-300 shrink-0" />
                  )}
                  <span
                    className={`font-medium text-sm ${
                      status === "active"
                        ? "text-primary-900"
                        : status === "completed"
                          ? "text-primary-500"
                          : "text-neutral-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </nav>
        </aside>
      </div>

      <div
        id="onboarding-footer"
        className="fixed bottom-0 inset-x-0 bg-white border-t border-border px-10 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-0"
      />
    </div>
  );
}

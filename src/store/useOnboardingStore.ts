import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompanyInfoType, TeamMemberType, ProjectType } from "@/lib/schemas";

export interface LocalDoc {
  id: string;
  nameAr: string;
  nameEn: string;
  documentType: string;
  file: File;
}

interface OnboardingState {
  currentStep: number;
  isHydrated: boolean;

  // Stored Data uses the perfectly DRY types
  companyInfo: CompanyInfoType | null;
  teamMembers: TeamMemberType[];
  projects: ProjectType[];
  documents: LocalDoc[];

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setHydrated: (value: boolean) => void;

  setCompanyInfo: (data: CompanyInfoType) => void;
  setTeamMembers: (data: TeamMemberType[]) => void;
  setProjects: (data: ProjectType[]) => void;
  setDocuments: (data: LocalDoc[]) => void;
  clearStore: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      isHydrated: false,

      // Initial Data States
      companyInfo: null,
      teamMembers: [],
      projects: [],
      documents: [],

      setStep: (step) => set({ currentStep: step }),
      // Updated the max boundary to 5 to include the new Review Step
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      setHydrated: (value) => set({ isHydrated: value }),

      // Data Setters
      setCompanyInfo: (data) => set({ companyInfo: data }),
      setTeamMembers: (data) => set({ teamMembers: data }),
      setProjects: (data) => set({ projects: data }),
      setDocuments: (data) => set({ documents: data }),

      // Wipe the store after successful submission
      clearStore: () =>
        set({
          currentStep: 1,
          companyInfo: null,
          teamMembers: [],
          projects: [],
          documents: [],
        }),
    }),
    {
      name: "onboarding-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      // CRITICAL: Exclude 'documents' from localStorage.
      // File objects cannot be stringified to JSON.
      // Excluding them prevents serialization crashes.
      partialize: (state) => ({
        currentStep: state.currentStep,
        companyInfo: state.companyInfo,
        teamMembers: state.teamMembers,
        projects: state.projects,
      }),
    },
  ),
);

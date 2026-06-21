import { create } from "zustand";
import type { CompanyInfoType } from "@/lib/schemas";
import type { TenderResponseDto } from "@/types/api";

export interface ServiceRequestState {
  currentStep: number;
  editedOrganizationInfo: Partial<CompanyInfoType> | null;
  selectedTender: TenderResponseDto | null;
  rfpSourceType: "platform" | "external";
  rfpExternalDescription: string;
  rfpFile: File | null;
  additionalFiles: File[];

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setEditedOrganizationInfo: (info: Partial<CompanyInfoType> | null) => void;
  setSelectedTender: (tender: TenderResponseDto | null) => void;
  setRfpSourceType: (type: "platform" | "external") => void;
  setRfpExternalDescription: (desc: string) => void;
  setRfpFile: (file: File | null) => void;
  setAdditionalFiles: (files: File[]) => void;
  clearStore: () => void;
}

export const useServiceRequestStore = create<ServiceRequestState>((set) => ({
  currentStep: 1,
  editedOrganizationInfo: null,
  selectedTender: null,
  rfpSourceType: "platform",
  rfpExternalDescription: "",
  rfpFile: null,
  additionalFiles: [],

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setEditedOrganizationInfo: (info) => set({ editedOrganizationInfo: info }),
  setSelectedTender: (tender) => set({ selectedTender: tender }),
  setRfpSourceType: (type) => set({ rfpSourceType: type }),
  setRfpExternalDescription: (desc) => set({ rfpExternalDescription: desc }),
  setRfpFile: (file) => set({ rfpFile: file }),
  setAdditionalFiles: (files) => set({ additionalFiles: files }),
  clearStore: () =>
    set({
      currentStep: 1,
      editedOrganizationInfo: null,
      selectedTender: null,
      rfpSourceType: "platform",
      rfpExternalDescription: "",
      rfpFile: null,
      additionalFiles: [],
    }),
}));

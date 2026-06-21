"use client";

import { Button } from "@/components/ui/button";
import { LocalDoc, useOnboardingStore } from "@/store/useOnboardingStore";
import { AlertCircle, FileText, Trash2, Upload, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { OnboardingFooter } from "./onboarding-footer";
import { formatBytes } from "@/lib/utils";
import { AutoNamedDocumentType, DOCUMENT_TYPE_LABELS } from "@/constants";

const DOCUMENT_TYPES = [
  "companyProfile",
  "commercialRegistration", // CR
  "taxCertificate", // ZATCA
  "saudizationCertificate", // Nitaqat
  "gosiCertificate", // GOSI
  "chamberOfCommerce", // CoC
  "financialStatements", // Audited Financials
  "previousExperience", // Previous Contracts/Projects
  "isoCertificate", // Quality/ISO
  "technicalMethodology", // Approach Templates
  "other",
] as const;

export function StepDocuments() {
  const t = useTranslations("Onboarding");
  const { nextStep, prevStep, documents, setDocuments } = useOnboardingStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  // store document type keys (mapped to translations)
  const [activeUploadType, setActiveUploadType] = useState<LocalDoc["documentType"]>("other");

  // Keep state local until continuing
  const [localDocs, setLocalDocs] = useState<LocalDoc[]>(documents || []);

  const triggerFileInput = (type: LocalDoc["documentType"]) => {
    setActiveUploadType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error(t("Documents.fileSizeError"));
      return;
    }

    const labels =
      activeUploadType !== "other"
        ? DOCUMENT_TYPE_LABELS[activeUploadType as AutoNamedDocumentType]
        : null;

    const newDoc: LocalDoc = {
      id: crypto.randomUUID(),
      file,
      documentType: activeUploadType,
      nameAr: labels?.ar ?? "",
      nameEn: labels?.en ?? "",
    };

    setLocalDocs((prev) => [...prev, newDoc]);
    toast.success(t("Status.uploaded"));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    setLocalDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleContinue = () => {
    const hasMissingArabicNames = localDocs.some((doc) => !doc.nameAr.trim());
    if (hasMissingArabicNames) {
      toast.error(t("Documents.missingArabicNameError"));
      return;
    }
    // Save to Zustand (Note: won't persist to LocalStorage, memory only)
    setDocuments(localDocs);
    nextStep();
  };

  const handleTypeChange = (id: string, newType: string) => {
    const labels =
      newType !== "other" ? DOCUMENT_TYPE_LABELS[newType as AutoNamedDocumentType] : null;
    setLocalDocs((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, documentType: newType, nameAr: labels?.ar ?? "", nameEn: labels?.en ?? "" }
          : doc,
      ),
    );
  };

  const handleNameChange = (id: string, field: "nameAr" | "nameEn", value: string) => {
    setLocalDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc)));
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-up-and-fade pb-24">
      {/* Hidden file input for triggering uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.xlsx"
        className="hidden"
      />

      <div className="text-center mb-8">
        <h1 className="h2 text-primary-900 mb-2">{t("Documents.title")}</h1>
        <p className="p-md text-neutral-500">{t("Documents.description")}</p>
      </div>

      {/* Warning Alert (Shows if no documents are uploaded) */}
      {(!documents || documents.length === 0) && (
        <div className="flex items-center gap-3 bg-warning-background border border-warning-foreground/20 text-warning-foreground p-4 rounded-xl mb-8">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium text-sm">{t("Documents.warning")}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="space-y-4 mb-8">
        {localDocs?.map((doc) => (
          <div
            key={doc.id}
            className="flex items-start justify-between p-4 border border-neutral-200 bg-white rounded-xl card-shadow gap-4"
          >
            <div className="flex flex-col items-start gap-4 w-full max-w-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-neutral-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500">{doc.file.name}</span>
                  <span className="text-sm text-neutral-400 self-start" dir="ltr">
                    {formatBytes(doc.file.size)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {/* Required Arabic Name Input */}
                <input
                  type="text"
                  value={doc.nameAr}
                  onChange={(e) => handleNameChange(doc.id, "nameAr", e.target.value)}
                  placeholder={t("Documents.nameArPlaceholder")}
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-neutral-400"
                  required
                />

                {/* Optional English Name Input */}
                <input
                  type="text"
                  value={doc.nameEn}
                  onChange={(e) => handleNameChange(doc.id, "nameEn", e.target.value)}
                  placeholder={t("Documents.nameEnPlaceholder")}
                  className="w-full text-sm bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-neutral-400"
                />

                <select
                  value={doc.documentType}
                  onChange={(e) => handleTypeChange(doc.id, e.target.value)}
                  className="w-fit text-sm bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`Documents.types.${type}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold border bg-accent-50 border-accent-200 text-accent-500">
                {t("Status.uploaded")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-error-foreground hover:bg-error-background/50"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Required Document Placeholders (Matches Figma) */}
        {localDocs?.length === 0 && (
          <div className="flex items-center justify-between p-4 border border-error-foreground/30 bg-error-background/10 rounded-xl card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-neutral-500" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 text-base">
                  {t("Documents.requiredProfileTitle")}
                </h3>
                <p className="text-sm text-neutral-500 mt-0.5">{t("Documents.requiredTemplate")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold border bg-error-background border-error-foreground/20 text-error-foreground">
                {t("Status.required")}
              </span>
              <Button
                onClick={() => triggerFileInput("companyProfile")}
                className="bg-primary-800 hover:bg-primary-900 text-white gap-2 rounded-lg"
              >
                <Upload className="w-4 h-4" />
                {t("Actions.upload")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Drag & Drop Area */}
      <div
        onClick={() => triggerFileInput("other")}
        className="border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-100 transition-colors"
      >
        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mb-4">
          <UploadCloud className="w-6 h-6 text-neutral-500" />
        </div>
        <h4 className="h5 text-primary-900 mb-1">{t("Dropzone.title")}</h4>
        <p className="text-sm text-neutral-400">{t("Dropzone.subtitle")}</p>
      </div>

      {/* Standard Footer */}
      <OnboardingFooter>
        <Button
          variant="outline"
          onClick={prevStep}
          className="border-neutral-300 text-neutral-600 gap-2"
        >
          {t("Actions.back")}
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8"
        >
          {t("Actions.continue")}
        </Button>
      </OnboardingFooter>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useTendersControllerListTenders } from "@/lib/api/react-query/tenders/tenders";
import { useServiceRequestStore } from "@/store/useServiceRequestStore";
import { FileText, Loader2, Search, Trash2, UploadCloud, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ServiceRequestFooter } from "./service-request-footer";

export function StepTenderSelection() {
  const t = useTranslations("ServiceRequests");
  const tOnboarding = useTranslations("Onboarding");
  const locale = useLocale();

  const {
    prevStep,
    nextStep,
    selectedTender,
    setSelectedTender,
    rfpSourceType,
    setRfpSourceType,
    rfpExternalDescription,
    setRfpExternalDescription,
    rfpFile,
    setRfpFile,
    additionalFiles,
    setAdditionalFiles,
  } = useServiceRequestStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const rfpInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch listed tenders matching debounced query
  const { data: tendersData, isLoading: isLoadingTenders } = useTendersControllerListTenders(
    {
      keyword: debouncedQuery || undefined,
    },
    {
      query: {
        enabled: rfpSourceType === "platform" && debouncedQuery.length >= 2,
      },
    },
  );

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        file.type !== "application/pdf" &&
        !file.name.endsWith(".docx") &&
        !file.name.endsWith(".doc")
      ) {
        toast.error(t("errors.pdfDocxOnly", { fallback: "PDF or Word documents only." }));
        return;
      }
      setRfpFile(file);
    }
  };

  const handleAdditionalFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        validFiles.push(files[i]);
      }
      setAdditionalFiles([...additionalFiles, ...validFiles]);
    }
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles(additionalFiles.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (rfpSourceType === "platform") {
      if (!selectedTender) {
        toast.error(t("errors.tenderRequired"));
        return;
      }
    } else {
      if (!rfpExternalDescription.trim() && !rfpFile) {
        toast.error(t("errors.externalRequired"));
        return;
      }
    }
    nextStep();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-up-and-fade pb-24 space-y-8">
      <div className="text-center mb-8">
        <h1 className="h2 text-primary-900 mb-2">{t("selectTenderTitle")}</h1>
        <p className="p-md text-neutral-500">{t("selectTenderDesc")}</p>
      </div>

      {/* Switch RFP Source */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setRfpSourceType("platform");
          }}
          className={`flex flex-col text-start p-5 rounded-2xl border transition-all cursor-pointer ${
            rfpSourceType === "platform"
              ? "bg-primary-50 border-primary-800 ring-2 ring-primary-100"
              : "bg-white border-border hover:bg-neutral-50"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="font-bold text-primary-900">{t("listedTenderOption")}</span>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                rfpSourceType === "platform"
                  ? "border-primary-800 bg-primary-800 text-white"
                  : "border-neutral-300"
              }`}
            >
              {rfpSourceType === "platform" && (
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              )}
            </div>
          </div>
          <span className="text-sm text-neutral-500">
            {locale === "ar"
              ? "اختر منافسة حكومية مطروحة مسبقاً على المنصة"
              : "Select an existing government tender listed on our platform"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRfpSourceType("external");
          }}
          className={`flex flex-col text-start p-5 rounded-2xl border transition-all cursor-pointer ${
            rfpSourceType === "external"
              ? "bg-primary-50 border-primary-800 ring-2 ring-primary-100"
              : "bg-white border-border hover:bg-neutral-50"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <span className="font-bold text-primary-900">{t("externalTenderOption")}</span>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                rfpSourceType === "external"
                  ? "border-primary-800 bg-primary-800 text-white"
                  : "border-neutral-300"
              }`}
            >
              {rfpSourceType === "external" && (
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              )}
            </div>
          </div>
          <span className="text-sm text-neutral-500">
            {locale === "ar"
              ? "ارفع مستندات واكتب تفاصيل منافسة خارجية غير مطروحة"
              : "Upload documents and enter details of an external tender not listed"}
          </span>
        </button>
      </div>

      {/* Platform Tender Selection */}
      {rfpSourceType === "platform" && (
        <div className="bg-white p-6 rounded-2xl border border-border card-shadow space-y-6">
          <h3 className="h5 text-primary-900">{t("listedTenderOption")}</h3>

          {selectedTender ? (
            <div className="flex items-start justify-between p-4 border border-primary-800/10 bg-primary-50/50 rounded-xl">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-400">
                  {selectedTender.externalId || selectedTender.referenceNumber}
                </span>
                <h4 className="font-bold text-primary-900">
                  {locale === "en" && selectedTender.titleEn
                    ? selectedTender.titleEn
                    : selectedTender.titleAr}
                </h4>
                <p className="text-sm text-neutral-500">
                  {locale === "en" && selectedTender.entityNameEn
                    ? selectedTender.entityNameEn
                    : selectedTender.entityNameAr}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTender(null)}
                className="text-neutral-400 hover:text-primary-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center border border-input rounded-xl px-3 bg-neutral-50">
                <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearching(true);
                  }}
                  onFocus={() => setIsSearching(true)}
                  placeholder={t("searchTenderPlaceholder")}
                  className="w-full text-base bg-transparent px-3 py-3 outline-none text-primary-800 placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedQuery("");
                    }}
                    className="text-neutral-400 hover:text-primary-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {isSearching && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                  {isLoadingTenders ? (
                    <div className="flex items-center justify-center p-4 gap-2 text-neutral-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{tOnboarding("Status.loading")}</span>
                    </div>
                  ) : tendersData?.data && tendersData.data.length > 0 ? (
                    tendersData.data.map((tender) => (
                      <button
                        key={tender.id}
                        type="button"
                        onClick={() => {
                          setSelectedTender(tender);
                          setIsSearching(false);
                          setSearchQuery("");
                          setDebouncedQuery("");
                        }}
                        className="w-full text-start p-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-0 flex flex-col"
                      >
                        <span className="text-xs font-semibold text-neutral-400">
                          {tender.externalId || tender.referenceNumber}
                        </span>
                        <span className="font-bold text-primary-900 truncate">
                          {locale === "en" && tender.titleEn ? tender.titleEn : tender.titleAr}
                        </span>
                        <span className="text-xs text-neutral-500 truncate">
                          {locale === "en" && tender.entityNameEn
                            ? tender.entityNameEn
                            : tender.entityNameAr}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-neutral-500">
                      {locale === "ar" ? "لا توجد نتائج مطابقة" : "No matching tenders found"}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* External Tender inputs */}
      {rfpSourceType === "external" && (
        <div className="bg-white p-6 rounded-2xl border border-border card-shadow space-y-6">
          <h3 className="h5 text-primary-900">{t("externalTenderOption")}</h3>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-800" htmlFor="external-desc">
              {t("externalDescriptionLabel")}
            </label>
            <textarea
              id="external-desc"
              value={rfpExternalDescription}
              onChange={(e) => setRfpExternalDescription(e.target.value)}
              placeholder={t("externalDescriptionPlaceholder")}
              className="w-full min-h-32 rounded-xl border border-input bg-neutral-50 p-4 text-base outline-none focus:ring-2 focus:ring-accent-300/20 focus:border-accent-300 resize-none text-primary-800 placeholder:text-neutral-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-800">
              {t("rfpDocumentLabel")}
            </label>
            <input
              type="file"
              ref={rfpInputRef}
              onChange={handleMainFileChange}
              accept=".pdf,.docx,.doc"
              className="hidden"
            />

            {rfpFile ? (
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border shrink-0">
                    <FileText className="w-5 h-5 text-primary-800" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-900 truncate max-w-md">
                      {rfpFile.name}
                    </p>
                    <p className="text-xs text-neutral-400">{formatBytes(rfpFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setRfpFile(null)}
                  className="text-neutral-400 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => rfpInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-100 transition-colors"
              >
                <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
                <span className="text-sm font-bold text-primary-900">
                  {t("rfpDocumentPlaceholder")}
                </span>
                <span className="text-xs text-neutral-400 mt-1">{t("uploadPDFDOCX")}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Additional Files Upload (For both) */}
      <div className="bg-white p-6 rounded-2xl border border-border card-shadow space-y-6">
        <h3 className="h5 text-primary-900">{t("additionalFilesLabel")}</h3>

        <input
          type="file"
          ref={additionalInputRef}
          onChange={handleAdditionalFilesChange}
          multiple
          className="hidden"
        />

        {additionalFiles.length > 0 && (
          <div className="space-y-3">
            {additionalFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-neutral-200 rounded-xl bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border shrink-0">
                    <FileText className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-900 truncate max-w-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-400">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAdditionalFile(index)}
                  className="text-neutral-400 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div
          onClick={() => additionalInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-100 transition-colors"
        >
          <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
          <span className="text-sm font-bold text-primary-900">
            {t("additionalFilesPlaceholder")}
          </span>
          <span className="text-xs text-neutral-400 mt-1">{t("uploadSupplementary")}</span>
        </div>
      </div>

      <ServiceRequestFooter>
        <Button
          variant="outline"
          onClick={prevStep}
          className="border-neutral-300 text-neutral-600 gap-2"
        >
          {tOnboarding("Actions.back")}
        </Button>
        <Button
          onClick={handleContinue}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8"
        >
          {tOnboarding("Actions.continue")}
        </Button>
      </ServiceRequestFooter>
    </div>
  );
}

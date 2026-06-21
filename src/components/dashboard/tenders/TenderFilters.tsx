/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { TendersControllerListTendersStatus } from "@/types/api";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface TenderFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  sector: string | undefined;
  setSector: (val: string | undefined) => void;
  region: string | undefined;
  setRegion: (val: string | undefined) => void;
  type: string | undefined;
  setType: (val: string | undefined) => void;
  status: TendersControllerListTendersStatus | undefined;
  setStatus: (val: TendersControllerListTendersStatus | undefined) => void;
  minBudget: number | undefined;
  setMinBudget: (val: number | undefined) => void;
  maxBudget: number | undefined;
  setMaxBudget: (val: number | undefined) => void;
  onFilterChange: () => void;
}

export default function TenderFilters({
  searchQuery,
  setSearchQuery,
  sector,
  setSector,
  region,
  setRegion,
  type,
  setType,
  status,
  setStatus,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  onFilterChange,
}: TenderFiltersProps) {
  const t = useTranslations("TendersList");
  const locale = useLocale();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Local input states for popovers
  const [localSector, setLocalSector] = useState("");
  const [localRegion, setLocalRegion] = useState("");
  const [localType, setLocalType] = useState("");
  const [localMinBudget, setLocalMinBudget] = useState("");
  const [localMaxBudget, setLocalMaxBudget] = useState("");

  // Sync local inputs when props change
  useEffect(() => {
    setLocalSector(sector || "");
  }, [sector]);

  useEffect(() => {
    setLocalRegion(region || "");
  }, [region]);

  useEffect(() => {
    setLocalType(type || "");
  }, [type]);

  useEffect(() => {
    setLocalMinBudget(minBudget !== undefined ? minBudget.toString() : "");
    setLocalMaxBudget(maxBudget !== undefined ? maxBudget.toString() : "");
  }, [minBudget, maxBudget]);

  const handleApply = (key: string) => {
    if (key === "sector") setSector(localSector.trim() || undefined);
    if (key === "region") setRegion(localRegion.trim() || undefined);
    if (key === "type") setType(localType.trim() || undefined);
    if (key === "budget") {
      const minVal = localMinBudget.trim() ? Number(localMinBudget) : undefined;
      const maxVal = localMaxBudget.trim() ? Number(localMaxBudget) : undefined;
      setMinBudget(minVal);
      setMaxBudget(maxVal);
    }
    setActiveDropdown(null);
    onFilterChange();
  };

  const handleClear = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (key === "sector") {
      setSector(undefined);
      setLocalSector("");
    }
    if (key === "region") {
      setRegion(undefined);
      setLocalRegion("");
    }
    if (key === "type") {
      setType(undefined);
      setLocalType("");
    }
    if (key === "status") {
      setStatus(undefined);
    }
    if (key === "budget") {
      setMinBudget(undefined);
      setMaxBudget(undefined);
      setLocalMinBudget("");
      setLocalMaxBudget("");
    }
    setActiveDropdown(null);
    onFilterChange();
  };

  const statusOptions = [
    { value: "open", labelEn: "Open", labelAr: "نشطة" },
    { value: "closed", labelEn: "Closed", labelAr: "مغلقة" },
    { value: "under_review", labelEn: "Under Review", labelAr: "تحت المراجعة" },
    { value: "awarded", labelEn: "Awarded", labelAr: "تمت الترسية" },
    { value: "canceled", labelEn: "Canceled", labelAr: "ملغاة" },
  ];

  const getFilterButtonLabel = (key: string) => {
    switch (key) {
      case "sector":
        return sector ? `${t("filters.sector")}: ${sector}` : t("filters.sector");
      case "region":
        return region ? `${t("filters.region")}: ${region}` : t("filters.region");
      case "type":
        return type ? `${t("filters.type")}: ${type}` : t("filters.type");
      case "status":
        if (status) {
          const opt = statusOptions.find((o) => o.value === status);
          return `${t("filters.status")}: ${locale === "ar" ? opt?.labelAr : opt?.labelEn}`;
        }
        return t("filters.status");
      case "budget":
        if (minBudget !== undefined || maxBudget !== undefined) {
          if (minBudget !== undefined && maxBudget !== undefined) {
            return `${t("filters.budget")}: ${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}`;
          }
          if (minBudget !== undefined) {
            return `${t("filters.budget")}: >= ${minBudget.toLocaleString()}`;
          }
          return `${t("filters.budget")}: <= ${maxBudget?.toLocaleString()}`;
        }
        return t("filters.budget");
      default:
        return "";
    }
  };

  const hasAnyFilter =
    !!searchQuery ||
    sector !== undefined ||
    region !== undefined ||
    type !== undefined ||
    status !== undefined ||
    minBudget !== undefined ||
    maxBudget !== undefined;

  const handleClearAll = () => {
    setSearchQuery("");
    setSector(undefined);
    setLocalSector("");
    setRegion(undefined);
    setLocalRegion("");
    setType(undefined);
    setLocalType("");
    setStatus(undefined);
    setMinBudget(undefined);
    setMaxBudget(undefined);
    setLocalMinBudget("");
    setLocalMaxBudget("");
    onFilterChange();
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input - Full Width & Premium Container */}
      <div className="relative flex items-center bg-white rounded-xl border border-neutral-200 shadow-md">
        <Search className="absolute text-neutral-400 w-5 h-5 inset-s-4" />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent border-none rounded-xl py-3.5 ps-12 pe-4 focus:ring-2 focus:ring-accent-300 outline-none text-primary-900"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onFilterChange();
          }}
        />
      </div>

      {/* Filter Row - Positioned Under Search Input */}
      <div className="flex flex-wrap items-center gap-2">
        {["region", "sector", "type", "status", "budget"].map((filterKey) => {
          const isActive = activeDropdown === filterKey;
          const hasValue =
            (filterKey === "sector" && sector !== undefined) ||
            (filterKey === "region" && region !== undefined) ||
            (filterKey === "type" && type !== undefined) ||
            (filterKey === "status" && status !== undefined) ||
            (filterKey === "budget" && (minBudget !== undefined || maxBudget !== undefined));

          return (
            <div key={filterKey} className="relative">
              <button
                onClick={() => setActiveDropdown(isActive ? null : filterKey)}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${
                  hasValue
                    ? "bg-primary-50 border-primary-300 text-primary-800 font-semibold"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <span>{getFilterButtonLabel(filterKey)}</span>
                {hasValue ? (
                  <span
                    onClick={(e) => handleClear(filterKey, e)}
                    className="p-0.5 rounded-full hover:bg-primary-200 text-primary-800 transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                ) : (
                  <svg
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                      isActive ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {/* Popover / Dropdown Overlay */}
              {isActive && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                  <div className="absolute z-50 mt-2 min-w-[260px] bg-white rounded-xl border border-neutral-200 shadow-xl p-4 animate-in fade-in slide-in-from-top-1 duration-200 end-0">
                    {/* Text Inputs for Region, Sector, Type */}
                    {(filterKey === "region" || filterKey === "sector" || filterKey === "type") && (
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          {t(`filters.${filterKey}`)}
                        </label>
                        <input
                          type="text"
                          value={
                            filterKey === "region"
                              ? localRegion
                              : filterKey === "sector"
                                ? localSector
                                : localType
                          }
                          onChange={(e) => {
                            if (filterKey === "region") setLocalRegion(e.target.value);
                            if (filterKey === "sector") setLocalSector(e.target.value);
                            if (filterKey === "type") setLocalType(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleApply(filterKey);
                          }}
                          placeholder={
                            locale === "ar"
                              ? `أدخل ${t(`filters.${filterKey}`)}...`
                              : `Enter ${t(`filters.${filterKey}`).toLowerCase()}...`
                          }
                          className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-300 focus:ring-2 focus:ring-accent-300/20 text-primary-900"
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => handleApply(filterKey)}
                            className="bg-primary-800 text-white text-xs font-semibold rounded-lg px-3 py-2 hover:bg-primary-700 transition-colors shadow-sm"
                          >
                            {locale === "ar" ? "تطبيق" : "Apply"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Dropdown list for Status */}
                    {filterKey === "status" && (
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 pb-2">
                          {t("filters.status")}
                        </label>
                        {statusOptions.map((opt) => {
                          const isSelected = status === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setStatus(opt.value as TendersControllerListTendersStatus);
                                setActiveDropdown(null);
                                onFilterChange();
                              }}
                              className={`w-full text-start px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg flex items-center justify-between transition-colors ${
                                isSelected
                                  ? "text-primary-800 bg-primary-50/50 font-semibold"
                                  : "text-neutral-700"
                              }`}
                            >
                              <span>{locale === "ar" ? opt.labelAr : opt.labelEn}</span>
                              {isSelected && (
                                <svg
                                  className="w-4 h-4 text-primary-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Numeric inputs for Budget */}
                    {filterKey === "budget" && (
                      <div className="space-y-3">
                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          {t("filters.budget")} ({locale === "ar" ? "ريال" : "SAR"})
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-neutral-400 block mb-1">
                              {locale === "ar" ? "الحد الأدنى" : "Min"}
                            </span>
                            <input
                              type="number"
                              value={localMinBudget}
                              onChange={(e) => setLocalMinBudget(e.target.value)}
                              placeholder="0"
                              className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-300 focus:ring-2 focus:ring-accent-300/20 text-primary-900"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-400 block mb-1">
                              {locale === "ar" ? "الحد الأقصى" : "Max"}
                            </span>
                            <input
                              type="number"
                              value={localMaxBudget}
                              onChange={(e) => setLocalMaxBudget(e.target.value)}
                              placeholder="Any"
                              className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-300 focus:ring-2 focus:ring-accent-300/20 text-primary-900"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => handleApply("budget")}
                            className="bg-primary-800 text-white text-xs font-semibold rounded-lg px-3 py-2 hover:bg-primary-700 transition-colors shadow-sm"
                          >
                            {locale === "ar" ? "تطبيق" : "Apply"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Clear All Filters Button */}
        {hasAnyFilter && (
          <button
            onClick={handleClearAll}
            className="px-3 py-2.5 text-sm font-semibold text-neutral-500 hover:text-error-foreground transition-colors duration-150"
          >
            {t("filters.clearAll")}
          </button>
        )}
      </div>
    </div>
  );
}

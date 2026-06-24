/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  parsePricingData,
  PricingData,
  PricingMetric,
  PricingItem,
  PaymentTerm,
} from "@/lib/proposal-utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import MarkdownEditor from "../ui/markdown-editor";

interface PricingFormProps {
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
}

export default function PricingForm({ content, onChange, isRtl }: PricingFormProps) {
  const t = useTranslations("AdminProposals");
  const locale = useLocale();

  // State
  const [dataState, setDataState] = useState<PricingData | null>(null);

  // Parse initial content
  useEffect(() => {
    const parsed = parsePricingData(content, isRtl);
    setDataState(parsed);
  }, [content, isRtl]);

  // Update field and serialize to JSON
  const updateField = (key: keyof PricingData, value: PricingData[keyof PricingData]) => {
    if (!dataState) return;
    const updated = { ...dataState, [key]: value };
    setDataState(updated);
    onChange(JSON.stringify(updated));
  };

  const labelClass = "text-xs font-bold text-neutral-600 mb-1 block text-start";
  const inputClass =
    "w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-sm text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-start";

  if (!dataState) return null;

  const metrics = dataState.metrics || [];
  const items = dataState.items || [];
  const paymentTerms = dataState.paymentTerms || [];

  // Metric operations
  const handleAddMetric = () => {
    const newMetric: PricingMetric = {
      value: "0",
      label: "",
      sublabel: "",
      highlighted: false,
    };
    updateField("metrics", [...metrics, newMetric]);
  };

  const handleRemoveMetric = (index: number) => {
    const updated = metrics.filter((_, i) => i !== index);
    updateField("metrics", updated);
  };

  const handleUpdateMetric = (index: number, key: keyof PricingMetric, val: string | boolean) => {
    const updated = metrics.map((item, i) => {
      if (i === index) {
        // If highlighting this metric, turn off highlight for others
        if (key === "highlighted" && val === true) {
          return { ...item, [key]: val };
        }
        return { ...item, [key]: val };
      }
      if (key === "highlighted" && val === true) {
        return { ...item, highlighted: false };
      }
      return item;
    });
    updateField("metrics", updated);
  };

  // Pricing Item operations
  const recalculateTotal = (updatedItems: PricingItem[]) => {
    const sum = updatedItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    if (!dataState) return;
    const updated = { ...dataState, items: updatedItems, totalAmount: sum };
    setDataState(updated);
    onChange(JSON.stringify(updated));
  };

  const handleAddItem = () => {
    const newItem: PricingItem = {
      item: "",
      description: "",
      unit: isRtl ? "مقطوعة" : "Lump Sum",
      amount: 0,
    };
    recalculateTotal([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    recalculateTotal(updated);
  };

  const handleUpdateItem = (index: number, key: keyof PricingItem, val: string | number) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [key]: val } : item));
    recalculateTotal(updated);
  };

  // Payment Terms operations
  const handleAddTerm = () => {
    const newTerm: PaymentTerm = {
      text: "",
    };
    updateField("paymentTerms", [...paymentTerms, newTerm]);
  };

  const handleRemoveTerm = (index: number) => {
    const updated = paymentTerms.filter((_, i) => i !== index);
    updateField("paymentTerms", updated);
  };

  const handleUpdateTerm = (index: number, val: string) => {
    const updated = paymentTerms.map((item, i) => (i === index ? { text: val } : item));
    updateField("paymentTerms", updated);
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6 max-h-full"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Title */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider border-b border-neutral-100 pb-2 text-start">
          {t("form.pricing.coreContent")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("form.pricing.mainTitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={dataState.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.pricing.subtitle")}</label>
            <input
              type="text"
              className={inputClass}
              value={dataState.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards / Metrics Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.pricing.metricsTitle")}
          </h3>
          <button
            type="button"
            onClick={handleAddMetric}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.pricing.addMetric")}
          </button>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-4 rounded-xl bg-neutral-50/10 flex flex-col sm:flex-row gap-4 items-end text-start"
            >
              <div className="w-full sm:w-28">
                <label className={labelClass}>{t("form.pricing.metricValue")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={metric.value}
                  onChange={(e) => handleUpdateMetric(idx, "value", e.target.value)}
                />
              </div>
              <div className="flex-1 w-full">
                <label className={labelClass}>{t("form.pricing.metricLabel")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={metric.label}
                  onChange={(e) => handleUpdateMetric(idx, "label", e.target.value)}
                />
              </div>
              <div className="flex-1 w-full">
                <label className={labelClass}>{t("form.pricing.metricSublabel")}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={metric.sublabel}
                  onChange={(e) => handleUpdateMetric(idx, "sublabel", e.target.value)}
                />
              </div>
              <div className="w-full sm:w-32 flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id={`metric-highlighted-${idx}`}
                  checked={!!metric.highlighted}
                  onChange={(e) => handleUpdateMetric(idx, "highlighted", e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label
                  htmlFor={`metric-highlighted-${idx}`}
                  className="text-xs font-bold text-neutral-600 cursor-pointer"
                >
                  {t("form.pricing.highlight")}
                </label>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMetric(idx)}
                className="text-xs px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold self-end sm:mb-0.5"
              >
                {t("form.pricing.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Pricing Breakdown Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.pricing.itemsTitle")}
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.pricing.addItem")}
          </button>
        </div>

        <div className="space-y-4">
          {items.map((pricingItem, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 p-5 rounded-2xl bg-neutral-50/10 space-y-4 relative text-start"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-primary-800 bg-primary-800/5 px-2.5 py-1 rounded-md">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-xs px-2.5 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
                >
                  {t("form.pricing.remove")}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("form.pricing.itemLabel")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={pricingItem.item}
                    onChange={(e) => handleUpdateItem(idx, "item", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("form.pricing.itemUnit")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={pricingItem.unit}
                    onChange={(e) => handleUpdateItem(idx, "unit", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className={labelClass}>{t("form.pricing.itemAmount")}</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={pricingItem.amount}
                    onChange={(e) =>
                      handleUpdateItem(idx, "amount", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className={labelClass}>{t("form.pricing.itemDescription")}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={pricingItem.description}
                    onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total Customizations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-neutral-100 rounded-xl bg-neutral-50/5 text-start">
          <div>
            <label className={labelClass}>{t("form.pricing.totalLabel")}</label>
            <input
              type="text"
              className={inputClass}
              value={dataState.totalLabel}
              onChange={(e) => updateField("totalLabel", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{t("form.pricing.totalAmount")}</label>
            <input
              type="number"
              className={inputClass}
              value={dataState.totalAmount}
              onChange={(e) => updateField("totalAmount", parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Payment Terms Editor */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
          <h3 className="text-sm font-extrabold text-primary-800 uppercase tracking-wider text-start">
            {t("form.pricing.termsTitle")}
          </h3>
          <button
            type="button"
            onClick={handleAddTerm}
            className="text-xs px-3 py-1 bg-primary-800/5 text-primary-800 font-bold rounded-lg border border-primary-800/10 hover:bg-primary-800/10 transition-all"
          >
            + {t("form.pricing.addTerm")}
          </button>
        </div>

        <div className="space-y-3">
          {paymentTerms.map((term, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-center border border-neutral-100 p-3 rounded-xl bg-neutral-50/5 text-start"
            >
              <div className="flex-1">
                <input
                  type="text"
                  className={inputClass}
                  placeholder={t("form.pricing.termPlaceholder")}
                  value={term.text}
                  onChange={(e) => handleUpdateTerm(idx, e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTerm(idx)}
                className="text-xs px-2.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-bold"
              >
                {t("form.pricing.remove")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Markdown Content */}
      <div className="space-y-4 pt-2 border-t border-neutral-100">
        <div>
          <label className={labelClass}>{t("form.pricing.additionalContent")} </label>
          <p className="text-[10px] text-neutral-400 mb-2 text-start">
            {t("form.pricing.additionalContentDesc")}
          </p>
          <MarkdownEditor
            markdown={dataState.additionalContent || ""}
            onChange={(value) => updateField("additionalContent", value)}
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      </div>
    </div>
  );
}

import { Locale } from "@/i18n/routing";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * This ensures that Tailwind CSS classes are properly merged without conflicts.
 *
 * @param inputs - A list of class values to merge.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tremor focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Helper to extract initials from name
const ARABIC_REGEX = /[\u0600-\u06FF]/;

export const getInitials = (name?: string | null) => {
  if (!name) return "TR";

  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2);

  const hasArabic = initials.some((char) => ARABIC_REGEX.test(char));

  if (hasArabic) {
    return initials.map((char) => `${char}.`).join(" ");
  }

  return initials.join("").toUpperCase();
};

// Helper to format estimated budget
export const formatBudget = (budget?: number | null, locale?: Locale) => {
  if (!budget) return "--";
  const millions = budget / 1000000;
  return !locale || locale === "ar"
    ? `${millions.toFixed(1)} مليون ر.س`
    : `${millions.toFixed(1)}M SAR`;
};

// Helper to format execution duration
export const formatDuration = (months?: number | null, locale?: Locale) => {
  if (!months) return "--";
  return !locale || locale === "ar" ? `${months} شهراً` : `${months} Months`;
};

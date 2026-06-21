"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLocale } from "next-intl";

interface TenderPaginationProps {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
}

export default function TenderPagination({ page, setPage, totalPages }: TenderPaginationProps) {
  const locale = useLocale();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 pb-12 select-none" dir="ltr">
      {/* First Page */}
      <button
        onClick={() => setPage(1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 transition-colors"
        title={locale === "ar" ? "الصفحة الأولى" : "First Page"}
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 transition-colors"
        title={locale === "ar" ? "الصفحة السابقة" : "Previous Page"}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className="px-2 text-neutral-400 font-medium select-none">
                ...
              </span>
            );
          }
          const pageNum = p as number;
          const isCurrent = pageNum === page;
          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => setPage(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                isCurrent
                  ? "bg-primary-800 text-white shadow-md border-transparent"
                  : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Page */}
      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 transition-colors"
        title={locale === "ar" ? "الصفحة التالية" : "Next Page"}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => setPage(totalPages)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 transition-colors"
        title={locale === "ar" ? "الصفحة الأخيرة" : "Last Page"}
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}

"use client";

import { useTendersControllerGetTenderDetails } from "@/lib/api/react-query/tenders/tenders";
import TenderDetailsHeader from "./TenderDetailsHeader";
import TenderDetailsSidebar from "./TenderDetailsSidebar";
import TenderDetailsTable from "./TenderDetailsTable";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TenderDetailsClientProps {
  id: string;
}

export default function TenderDetailsClient({ id }: TenderDetailsClientProps) {
  const t = useTranslations("TendersList");

  const { data: response, isLoading, error } = useTendersControllerGetTenderDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary-800" />
        <span className="text-sm font-semibold text-neutral-500">{t("loading")}</span>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-2">
        <span className="text-lg font-bold text-primary-900">{t("noResult")}</span>
      </div>
    );
  }

  const tender = response;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 animate-in fade-in duration-300">
      {/* Header card */}
      <TenderDetailsHeader tender={tender} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <TenderDetailsTable tender={tender} />
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <TenderDetailsSidebar tender={tender} />
        </div>
      </div>
    </div>
  );
}

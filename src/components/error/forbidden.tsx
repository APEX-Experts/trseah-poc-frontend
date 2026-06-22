"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Forbidden() {
  const t = useTranslations("Errors");
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-neutral-50/50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 mb-6 animate-pulse border border-red-100">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <h1 className="h1 text-primary-900 mb-2">{t("forbiddenTitle")}</h1>
      <p className="p-lg text-neutral-500 max-w-md mb-8">{t("forbiddenDescription")}</p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/")} variant="default" className="cursor-pointer">
          {t("goHome")}
        </Button>
        <Button onClick={() => router.back()} variant="secondary" className="cursor-pointer">
          {t("goBack")}
        </Button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { GenericForm } from "@/components/landing/layout/generic-form";
import { Button } from "@/components/ui/button";
import { useAuthControllerForgotPassword } from "@/hooks/use-auth";
import { Link } from "@/i18n/navigation";
import { getErrorMessage } from "@/lib/api-utils";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import * as z from "zod";
import { Locale } from "@/i18n/routing";
import { AuthFormTemplate } from "@/components/auth/auth-form-template";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();
  const rootT = useTranslations();
  const forgotPasswordSchema = z.object({
    email: z.email(rootT("validation.invalidEmail")),
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    mutateAsync: sendResetLink,
    isPending,
    error,
    data,
    reset,
  } = useAuthControllerForgotPassword();
  const errorMessage = getErrorMessage(error, data);

  const handleSubmit = async (values: { email: string }) => {
    try {
      await sendResetLink({
        data: {
          email: values.email,
          locale: locale as Locale,
        },
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  const isRtl = locale === "ar";

  const footerContent = (
    <Button variant="outline" className="w-fit gap-2" asChild>
      <Link href="/auth/login">
        {isRtl ? (
          <>
            <ArrowRight className="w-4 h-4" />
            <span>{t("backToLogin")}</span>
          </>
        ) : (
          <>
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToLogin")}</span>
          </>
        )}
      </Link>
    </Button>
  );

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 animate-in fade-in duration-500">
        <AuthFormTemplate
          title={t("title")}
          description=""
          isPending={false}
          showSocials={false}
          footer={footerContent}
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4 text-emerald-500 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">{t("successMessage")}</p>
          </div>
        </AuthFormTemplate>
      </div>
    );
  }

  const defaultFooter = (
    <Button variant="ghost" className="w-fit gap-2 hover:bg-neutral-100" asChild>
      <Link href="/auth/login">
        {isRtl ? (
          <>
            <ArrowRight className="w-4 h-4" />
            <span>{t("backToLogin")}</span>
          </>
        ) : (
          <>
            <ArrowLeft className="w-4 h-4" />
            <span>{t("backToLogin")}</span>
          </>
        )}
      </Link>
    </Button>
  );

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 animate-in fade-in duration-500">
      <AuthFormTemplate
        title={t("title")}
        description={t("description")}
        isPending={isPending}
        showSocials={false}
        footer={defaultFooter}
      >
        <GenericForm
          title={t("title")}
          schema={forgotPasswordSchema}
          error={errorMessage}
          defaultValues={{
            email: "",
          }}
          onSubmit={handleSubmit}
          onReset={reset}
          submitText={t("sendButton")}
          resetText={t("resetText")}
          submittingText={t("submitting")}
          fields={[
            {
              name: "email",
              label: t("emailLabel"),
              type: "email",
              placeholder: t("emailPlaceholder"),
            },
          ]}
        />
      </AuthFormTemplate>
    </div>
  );
}

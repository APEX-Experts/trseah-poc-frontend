"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GenericForm } from "@/components/landing/layout/generic-form";
import { Button } from "@/components/ui/button";
import {
  useAuthControllerResetPassword,
  useAuthControllerVerifyResetToken,
} from "@/hooks/use-auth";
import { Link, useRouter } from "@/i18n/navigation";
import { getErrorMessage } from "@/lib/api-utils";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as z from "zod";
import { AuthFormTemplate } from "@/components/auth/auth-form-template";

function ResetPasswordContent() {
  const t = useTranslations("ResetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const rootT = useTranslations();
  const resetPasswordSchema = z
    .object({
      password: z.string().min(8, rootT("validation.passwordMinLength")).max(32),
      confirmPassword: z.string().min(1, rootT("validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: rootT("validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });

  const [verificationState, setVerificationState] = useState<"loading" | "valid" | "invalid">(
    token ? "loading" : "invalid",
  );

  if (!token && verificationState !== "invalid") {
    setVerificationState("invalid");
  }

  const { mutateAsync: verifyToken } = useAuthControllerVerifyResetToken();
  const {
    mutateAsync: resetPassword,
    isPending: isResetting,
    error: resetError,
    data: resetData,
    reset: clearResetError,
  } = useAuthControllerResetPassword();

  useEffect(() => {
    if (!token) return;

    const checkToken = async () => {
      try {
        await verifyToken({ data: { token } });
        setVerificationState("valid");
      } catch (err) {
        console.error("Token verification failed:", err);
        setVerificationState("invalid");
      }
    };

    checkToken();
  }, [token, verifyToken]);

  const handleSubmit = async (values: { password: string }) => {
    try {
      await resetPassword({
        data: {
          token,
          password: values.password,
        },
      });

      toast.success(t("successToast"));
      router.push("/auth/login");
    } catch (err) {
      console.error("Password reset failed:", err);
    }
  };

  if (verificationState === "loading") {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          {t("verifyingToken")}
        </p>
      </div>
    );
  }

  if (verificationState === "invalid") {
    const errorFooter = (
      <Button className="w-full bg-primary-800 hover:bg-primary-700 text-white" asChild>
        <Link href="/auth/forgot-password">{t("requestNewLink")}</Link>
      </Button>
    );

    return (
      <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 animate-in fade-in duration-500">
        <AuthFormTemplate
          title={t("title")}
          description=""
          isPending={false}
          showSocials={false}
          footer={errorFooter}
        >
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              {token ? t("invalidToken") : t("noToken")}
            </p>
          </div>
        </AuthFormTemplate>
      </div>
    );
  }

  const errorMessage = getErrorMessage(resetError, resetData);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 animate-in fade-in duration-500">
      <AuthFormTemplate
        title={t("title")}
        description={t("description")}
        isPending={isResetting}
        showSocials={false}
      >
        <GenericForm
          title={t("title")}
          schema={resetPasswordSchema}
          error={errorMessage}
          defaultValues={{
            password: "",
            confirmPassword: "",
          }}
          onSubmit={handleSubmit}
          onReset={clearResetError}
          submitText={t("resetButton")}
          resetText={t("requestNewLink")}
          submittingText={t("submitting")}
          fields={[
            {
              name: "password",
              label: t("newPasswordLabel"),
              type: "password",
              placeholder: t("newPasswordPlaceholder"),
            },
            {
              name: "confirmPassword",
              label: t("confirmPasswordLabel"),
              type: "password",
              placeholder: t("confirmPasswordPlaceholder"),
            },
          ]}
        />
      </AuthFormTemplate>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

"use client";

import { GenericForm } from "@/components/landing/layout/generic-form";
import { useAuthControllerLogin } from "@/hooks/use-auth";
import { Link, useRouter } from "@/i18n/navigation";
import { getErrorMessage } from "@/lib/api-utils";
import { getAuthControllerGetProfileQueryKey } from "@/lib/api/react-query/auth/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import * as z from "zod";
import { AuthFormTemplate } from "./auth-form-template";

export interface LoginFormProps {
  onTabChange: (tab: "login" | "register") => void;
}

export function LoginForm({ onTabChange }: LoginFormProps) {
  const t = useTranslations("Login");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: login, isPending, error, data, reset } = useAuthControllerLogin();
  const rootT = useTranslations();
  const loginSchema = z.object({
    email: z.email(rootT("validation.invalidEmail")),
    password: z.string().min(1, rootT("validation.passwordRequired")),
  });
  const errorMessage = getErrorMessage(error, data);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await login({ data: values });

      if (response.statusCode === 200) {
        // Invalidate profile query to fetch the newly logged-in user
        await queryClient.invalidateQueries({
          queryKey: getAuthControllerGetProfileQueryKey(),
        });

        toast.success(t("successToast"));
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const footerContent = (
    <div className="text-sm">
      {t("noAccount")}{" "}
      <button
        type="button"
        onClick={() => onTabChange("register")}
        className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline ml-1"
      >
        {t("signUp")}
      </button>
    </div>
  );

  return (
    <AuthFormTemplate
      title={t("welcomeBack")}
      description={t("credentialsDescription")}
      isPending={isPending}
      footer={footerContent}
      socialsSeparatorText={t("orSeparator")}
      googleButtonText={t("googleButton")}
    >
      <GenericForm
        title={t("login")}
        schema={loginSchema}
        error={errorMessage}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
        onReset={reset}
        submitText={t("loginButton")}
        resetText={t("reset")}
        submittingText={t("submitting")}
        fields={[
          {
            name: "email",
            label: t("emailLabel"),
            type: "email",
            placeholder: t("emailPlaceholder"),
          },
          {
            name: "password",
            label: t("passwordLabel"),
            type: "password",
            placeholder: t("passwordPlaceholder"),
          },
        ]}
      />
      <div className="flex items-center justify-start my-4">
        <Link
          className="text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline ml-1"
          href="/auth/forgot-password"
        >
          {t("forgot")}
        </Link>
      </div>
    </AuthFormTemplate>
  );
}

"use client";

import { GenericForm } from "@/components/landing/layout/generic-form";
import { useAuthControllerRegister } from "@/hooks/use-auth";
import { useRouter } from "@/i18n/navigation";
import { getErrorMessage } from "@/lib/api-utils";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { AuthFormTemplate } from "./auth-form-template";

export interface RegisterFormProps {
  onTabChange: (tab: "login" | "register") => void;
}

export function RegisterForm({ onTabChange }: RegisterFormProps) {
  const t = useTranslations("Register");
  const router = useRouter();
  const { mutateAsync: register, isPending, error, data, reset } = useAuthControllerRegister();
  const rootT = useTranslations();
  const registerSchema = z.object({
    email: z.email(rootT("validation.invalidEmail")),
    password: z.string().min(8, rootT("validation.passwordMinLength")).max(32),
    firstName: z.string().min(1, rootT("validation.firstNameRequired")),
    lastName: z.string().min(1, rootT("validation.lastNameRequired")),
  });
  const errorMessage = getErrorMessage(error, data);

  const handleSubmit = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    await register(
      { data: values },
      {
        onSuccess: () => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
        },
      },
    );
  };

  const footerContent = (
    <div className="text-sm">
      {t("alreadyHaveAccount")}{" "}
      <button
        type="button"
        onClick={() => onTabChange("login")}
        className="font-medium text-primary hover:underline cursor-pointer bg-transparent border-none p-0 inline ml-1"
      >
        {t("login")}
      </button>
    </div>
  );

  return (
    <AuthFormTemplate
      title={t("createAccount")}
      description={t("detailsDescription")}
      isPending={isPending}
      footer={footerContent}
      socialsSeparatorText={t("orSeparator")}
      googleButtonText={t("googleButton")}
    >
      <GenericForm
        title={t("register")}
        schema={registerSchema}
        error={errorMessage}
        defaultValues={{
          email: "",
          password: "",
          firstName: "",
          lastName: "",
        }}
        onSubmit={handleSubmit}
        onReset={reset}
        submitText={t("createAccountButton")}
        resetText={t("reset")}
        submittingText={t("submitting")}
        fields={[
          {
            name: "firstName",
            label: t("firstNameLabel"),
            placeholder: t("firstNamePlaceholder"),
          },
          {
            name: "lastName",
            label: t("lastNameLabel"),
            placeholder: t("lastNamePlaceholder"),
          },
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
    </AuthFormTemplate>
  );
}

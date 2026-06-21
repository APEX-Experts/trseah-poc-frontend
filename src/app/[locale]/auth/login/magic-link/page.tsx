"use client";

import { GenericForm } from "@/components/landing/layout/generic-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMagicLinkControllerRequest } from "@/hooks/use-auth";
import { Loader2, MailCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import * as z from "zod";

// schema localized inside component so we can use t()

export default function MagicLinkRequestPage() {
  const t = useTranslations("MagicLink");
  const rootT = useTranslations();
  const magicLinkSchema = z.object({
    email: z.email(rootT("validation.invalidEmail")),
  });
  const { mutateAsync: requestMagicLink, isPending, error } = useMagicLinkControllerRequest();
  const errorMessage = Array.isArray(error?.message) ? error?.message.join(", ") : error?.message;
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    await requestMagicLink({ data: values }, { onSuccess: () => setIsSuccess(true) });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md animate-in fade-in zoom-in duration-300">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MailCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {t("checkInboxTitle")}
            </CardTitle>
            <CardDescription className="text-balance pt-2">
              {t("checkInboxDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button asChild variant="outline">
              <Link href="/auth/login">{t("backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md relative">
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg animate-in fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">{t("cardTitle")}</CardTitle>
          <CardDescription>{t("cardDescription")}</CardDescription>
        </CardHeader>

        <CardContent>
          <GenericForm
            title={t("requestTitle")}
            schema={magicLinkSchema}
            error={errorMessage}
            defaultValues={{
              email: "",
            }}
            onSubmit={handleSubmit}
            submitText={t("submit")}
            fields={[
              {
                name: "email",
                label: t("emailLabel"),
                type: "email",
                placeholder: t("emailPlaceholder"),
              },
            ]}
          />
        </CardContent>

        <CardFooter className="justify-center border-t bg-muted/50 py-4">
          <div className="text-sm">
            {t("rememberPassword")}{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              {t("signInWithPassword")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

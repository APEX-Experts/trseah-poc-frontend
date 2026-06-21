"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldLabel, Field as UIField } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthControllerResendVerification } from "@/hooks/use-auth";
import { AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api-utils";

export default function ClientVerificationUI({
  initialStatus,
  errorMessage: initialErrorMessage,
}: {
  initialStatus: "success" | "error";
  errorMessage?: string;
}) {
  const [resendEmail, setResendEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("Auth");
  const {
    mutateAsync: resendVerification,
    isPending: isResending,
    error: mutationError,
    data: mutationData,
  } = useAuthControllerResendVerification();

  const mutationErrorMessage = getErrorMessage(mutationError, mutationData);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error(t("verification.enterEmailToast"));
      return;
    }

    try {
      await resendVerification(
        { data: { email: resendEmail } },
        {
          onSuccess: () => {
            toast.success(t("verification.verificationEmailSent"));
            setIsDialogOpen(false);
            setResendEmail("");
          },
        },
      );
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  const status = initialStatus;

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {status === "success" && t("verification.emailVerifiedTitle")}
            {status === "error" && t("verification.verificationFailedTitle")}
          </CardTitle>
          <CardDescription>
            {status === "success" && t("verification.successDescription")}
            {status === "error" && t("verification.errorDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center pb-6">
          {status === "success" && (
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
          )}
          {status === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-center text-sm text-muted-foreground mb-2">
                {initialErrorMessage}
              </p>
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t bg-muted/50 py-6">
          {status === "success" && (
            <Button asChild className="w-full">
              <Link href="/auth/login">{t("verification.goToLogin")}</Link>
            </Button>
          )}

          {(status === "error" || status === "success") && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("verification.resendButton")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("verification.resendDialogTitle")}</DialogTitle>
                  <DialogDescription>{t("verification.resendDialogDescription")}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <UIField>
                    <FieldLabel htmlFor="resend-email">{t("verification.emailLabel")}</FieldLabel>
                    <Input
                      id="resend-email"
                      type="email"
                      placeholder={t("verification.emailPlaceholder")}
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                    />
                  </UIField>

                  {mutationErrorMessage && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2 rounded animate-in fade-in slide-in-from-top-1">
                      {mutationErrorMessage}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || !resendEmail}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("verification.sending")}
                      </>
                    ) : (
                      t("verification.sendVerificationLinkButton")
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {status === "error" && (
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/login">{t("verification.backToLogin")}</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

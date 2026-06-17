"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GOOGLE_AUTH_URL } from "@/hooks/use-auth";
import { Link } from "@/i18n/navigation";

interface AuthFormTemplateProps {
  title: string;
  description: string;
  isPending: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showSocials?: boolean;
  socialsSeparatorText?: string;
  googleButtonText?: string;
  magicLinkHref?: string;
  magicLinkButtonText?: string;
}

export function AuthFormTemplate({
  title,
  description,
  isPending,
  children,
  footer,
  showSocials = true,
  socialsSeparatorText,
  googleButtonText,
  magicLinkHref,
  magicLinkButtonText,
}: AuthFormTemplateProps) {
  return (
    <Card className="w-full max-w-lg relative border-none shadow-none bg-transparent">
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-lg animate-in fade-in">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <CardHeader className="text-center pt-2">
        <CardTitle className="text-3xl font-bold tracking-tight text-primary-800">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="p-4 md:p-6 pt-0">
        {children}

        {showSocials && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {socialsSeparatorText || "Or"}
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <Button variant="outline" className="w-full" asChild>
                <a href={GOOGLE_AUTH_URL} className="flex items-center justify-center">
                  <svg width="24px" height="24px" className="mr-2 h-6 w-6" viewBox="-3 0 262 262">
                    <path
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      fill="#4285F4"
                    />
                    <path
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      fill="#34A853"
                    />
                    <path
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      fill="#FBBC05"
                    />
                    <path
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      fill="#EB4335"
                    />
                  </svg>
                  <span>{googleButtonText || "Google"}</span>
                </a>
              </Button>

              {magicLinkHref && magicLinkButtonText && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={magicLinkHref} className="flex justify-center">
                    {magicLinkButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>

      {footer && <CardFooter className="justify-center px-0 py-4">{footer}</CardFooter>}
    </Card>
  );
}

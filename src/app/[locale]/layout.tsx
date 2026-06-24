import "@/app/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geSsTwo = localFont({
  src: [
    {
      path: "../fonts/GE_SS_Two/ArbFONTS-GE_SS_Two_Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/GE_SS_Two/ArbFONTS-GE_SS_Two_Medium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GE_SS_Two/ArbFONTS-GE_SS_Two_Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GE_SS_Two/ArbFONTS-GE_SS_Two_Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ge-ss-two",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
  };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Root layout component for the main application group.
 * Handles global providers (Query), fonts, and global UI elements like Toaster.
 * Supports localization and RTL direction switching.
 *
 * @param props - Component props containing children elements.
 */
export default async function MainLayout({ children, params }: Readonly<LayoutProps>) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the provider
  const messages = await getMessages();

  // Determine direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${geSsTwo.variable} ${geistMono.variable} h-full antialiased bg-background text-foreground`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

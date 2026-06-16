import React from "react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/landing/layout/logo";
import { LocaleSwitcher } from "@/components/landing/layout/locale-switcher";

/**
 * Layout component for the auth route group.
 * Shows a header with logo, locale switcher.
 *
 * @param props - Component props containing children elements.
 */
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center">
            <Logo brandName="Dashboard" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
          </div>
        </div>
      </header>
      <main className="grow flex items-center justify-center">{children}</main>
    </div>
  );
}

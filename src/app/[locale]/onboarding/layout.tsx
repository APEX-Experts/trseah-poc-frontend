import { DashboardNavbar } from "@/components/dashboard/layout/DashboardNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "@/i18n/navigation";
import { Locale } from "@/i18n/routing";
import getInitialData from "@/lib/getInitialData";
import React from "react";

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const { initialProfileData, redirectObject } = await getInitialData({
    locale: locale as Locale,
    checkOrganization: false,
  });

  if (redirectObject?.href) {
    return redirect(redirectObject);
  }
  if (!initialProfileData) {
    return redirect({
      href: `/auth/${locale}/login`,
      locale: locale as Locale,
      forcePrefix: true,
    });
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex w-full flex-col flex-1">
        <DashboardNavbar initialProfileData={initialProfileData} hideSidebarTrigger />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}

import { AppSidebar } from "@/components/dashboard/layout/AppSidebar";
import { DashboardNavbar } from "@/components/dashboard/layout/DashboardNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuth } from "@/lib/api/client/auth/auth";
import { AuthControllerGetProfile200 } from "@/types/api";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { PageContainer } from "@/components/layout/PageContainer";

export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  let initialProfileData: AuthControllerGetProfile200 | undefined = undefined;
  let defaultOpen = true;

  try {
    const cookieStore = await cookies();

    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    initialProfileData = await getAuth().authControllerGetProfile({
      headers: {
        Cookie: cookieString,
      },
    });
    const sidebarState = cookieStore.get("sidebar_state");
    defaultOpen = sidebarState ? sidebarState.value === "true" : true;
  } catch (error) {
    console.error("Dashboard layout error:", error);
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        redirect(`/${locale}/auth/login`);
      }
    }
    // Re-throw network or other errors to be caught by the error boundary
    throw error;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar initialProfileData={initialProfileData} />
      <div className="flex w-full flex-col flex-1">
        <DashboardNavbar />
        <main className="flex-1">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </SidebarProvider>
  );
}

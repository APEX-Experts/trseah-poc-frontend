"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Check if current route is the proposals workspace
  const isProposalWorkspace = pathname.includes("/admin/proposals/");

  if (isProposalWorkspace) {
    return <>{children}</>;
  }

  return (
    <PageContainer>
      <main className="flex-1">{children}</main>
    </PageContainer>
  );
}

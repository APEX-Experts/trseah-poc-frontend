import { PageContainer } from "@/components/layout/PageContainer";
import React from "react";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageContainer>
      <main className="flex-1">{children}</main>
    </PageContainer>
  );
}

import React from "react";
/**
 * Layout component for the auth route group.
 *
 * @param props - Component props containing children elements.
 */
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

import TenderDetailsClient from "@/components/dashboard/tenders/TenderDetailsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tender Details | TRSEAH",
  description: "View complete government tender information, specifications, and booklets.",
};

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function TenderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <TenderDetailsClient id={id} />;
}

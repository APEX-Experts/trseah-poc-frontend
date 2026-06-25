"use client";

import { ProposalDto } from "@/lib/proposal-utils";
import CompanyProfileForm from "./CompanyProfileForm";
import CoverLetterForm from "./CoverLetterForm";
import CoverPageForm from "./CoverPageForm";
import ExecutiveSummaryForm from "./ExecutiveSummaryForm";
import ScopeUnderstandingForm from "./ScopeUnderstandingForm";
import Vision2030Form from "./Vision2030Form";
import PastProjectsForm from "./PastProjectsForm";
import MethodologyForm from "./MethodologyForm";
import TeamForm from "./TeamForm";
import TimelineForm from "./TimelineForm";
import QualityAndRiskForm from "./QualityAndRiskForm";
import PricingForm from "./PricingForm";
import { jsonrepair } from "jsonrepair";
interface SectionFormProps {
  sectionId: string;
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
  requestData?: ProposalDto["request"] | null;
  tenderData?: ProposalDto["tender"] | null;
  formattedDate: string;
  isDisabled?: boolean;
}

export default function SectionForm({
  sectionId,
  content,
  onChange,
  isRtl,
  proposalData,
  requestData,
  tenderData,
  formattedDate,
  isDisabled,
}: SectionFormProps) {
  // 1. Default to the raw content (handles Markdown and empty strings safely)
  let safeContent = content;

  // 2. Only attempt to repair if it actually looks like JSON
  if (content && content.trim().startsWith("{")) {
    try {
      safeContent = jsonrepair(content);
    } catch (_e) {
      // If it's too broken even for jsonrepair, fail gracefully
      // The child forms will just use their fallback data for this render cycle
      console.warn("jsonrepair failed to parse stream chunk");
    }
  }
  if (sectionId === "cover_page") {
    return (
      <CoverPageForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        formattedDate={formattedDate}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "cover_letter") {
    return (
      <CoverLetterForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "executive_summary") {
    return (
      <ExecutiveSummaryForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "scope_understanding") {
    return (
      <ScopeUnderstandingForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "vision_2030") {
    return (
      <Vision2030Form
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "company_profile") {
    return (
      <CompanyProfileForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "past_projects") {
    return (
      <PastProjectsForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "methodology") {
    return (
      <MethodologyForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "team") {
    return (
      <TeamForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "timeline") {
    return (
      <TimelineForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "quality_and_risk") {
    return (
      <QualityAndRiskForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  if (sectionId === "pricing") {
    return (
      <PricingForm
        content={safeContent}
        onChange={onChange}
        isRtl={isRtl}
        isDisabled={isDisabled}
      />
    );
  }

  return null;
}

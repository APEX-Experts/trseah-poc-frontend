"use client";

import { ProposalDto } from "@/lib/proposal-utils";
import CompanyProfileTemplate from "./CompanyProfileTemplate";
import CoverLetterTemplate from "./CoverLetterTemplate";
import CoverPageTemplate from "./CoverPageTemplate";
import ExecutiveSummaryTemplate from "./ExecutiveSummaryTemplate";
import GenericTemplate from "./GenericTemplate";
import ScopeUnderstandingTemplate from "./ScopeUnderstandingTemplate";
import Vision2030Template from "./Vision2030Template";
import PastProjectsTemplate from "./PastProjectsTemplate";
import MethodologyTemplate from "./MethodologyTemplate";
import TeamTemplate from "./TeamTemplate";
import TimelineTemplate from "./TimelineTemplate";
import QualityAndRiskTemplate from "./QualityAndRiskTemplate";
import PricingTemplate from "./PricingTemplate";
import { jsonrepair } from "jsonrepair";

export interface SectionTemplateProps {
  sectionId: string;
  content: string;
  isRtl: boolean;
  locale: string;
  proposalData: ProposalDto;
  requestData: ProposalDto["request"];
  tenderData: ProposalDto["tender"];
  formattedDate: string;
}

export default function SectionTemplate({
  sectionId,
  content,
  isRtl,
  proposalData,
  requestData,
  tenderData,
  formattedDate,
}: SectionTemplateProps) {
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
      <CoverPageTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "cover_letter") {
    return (
      <CoverLetterTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "executive_summary") {
    return (
      <ExecutiveSummaryTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "scope_understanding") {
    return (
      <ScopeUnderstandingTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "vision_2030") {
    return (
      <Vision2030Template
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "company_profile") {
    return (
      <CompanyProfileTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "past_projects") {
    return (
      <PastProjectsTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "methodology") {
    return (
      <MethodologyTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "team") {
    return (
      <TeamTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "timeline") {
    return (
      <TimelineTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "quality_and_risk") {
    return (
      <QualityAndRiskTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "pricing") {
    return (
      <PricingTemplate
        content={safeContent}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  return <GenericTemplate content={safeContent} isRtl={isRtl} />;
}

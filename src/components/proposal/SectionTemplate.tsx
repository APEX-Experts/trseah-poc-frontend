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
  if (sectionId === "cover_page") {
    return (
      <CoverPageTemplate
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
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
        content={content}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  return <GenericTemplate content={content} isRtl={isRtl} />;
}

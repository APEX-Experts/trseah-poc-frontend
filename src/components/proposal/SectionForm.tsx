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

interface SectionFormProps {
  sectionId: string;
  content: string;
  onChange: (newContent: string) => void;
  isRtl: boolean;
  proposalData?: ProposalDto | null;
  requestData?: ProposalDto["request"] | null;
  tenderData?: ProposalDto["tender"] | null;
  formattedDate: string;
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
}: SectionFormProps) {
  console.log(sectionId);
  if (sectionId === "cover_page") {
    return (
      <CoverPageForm
        content={content}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "cover_letter") {
    return (
      <CoverLetterForm
        content={content}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
        requestData={requestData}
        tenderData={tenderData}
        formattedDate={formattedDate}
      />
    );
  }

  if (sectionId === "executive_summary") {
    return <ExecutiveSummaryForm content={content} onChange={onChange} isRtl={isRtl} />;
  }

  if (sectionId === "scope_understanding") {
    return <ScopeUnderstandingForm content={content} onChange={onChange} isRtl={isRtl} />;
  }

  if (sectionId === "vision_2030") {
    return <Vision2030Form content={content} onChange={onChange} isRtl={isRtl} />;
  }

  if (sectionId === "company_profile") {
    return (
      <CompanyProfileForm
        content={content}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
      />
    );
  }

  if (sectionId === "past_projects") {
    return (
      <PastProjectsForm
        content={content}
        onChange={onChange}
        isRtl={isRtl}
        proposalData={proposalData}
      />
    );
  }

  if (sectionId === "methodology") {
    return <MethodologyForm content={content} onChange={onChange} isRtl={isRtl} />;
  }

  if (sectionId === "team") {
    return (
      <TeamForm content={content} onChange={onChange} isRtl={isRtl} proposalData={proposalData} />
    );
  }

  if (sectionId === "timeline") {
    return <TimelineForm content={content} onChange={onChange} isRtl={isRtl} />;
  }

  if (sectionId === "quality_and_risk") {
    return <QualityAndRiskForm content={content} onChange={onChange} isRtl={isRtl} />;
  }

  if (sectionId === "pricing") {
    return <PricingForm content={content} onChange={onChange} isRtl={isRtl} />;
  }

  return null;
}

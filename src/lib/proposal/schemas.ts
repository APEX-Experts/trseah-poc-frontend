import { z } from "zod";

export const CoverPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  presentedTo: z.string(),
  reference: z.string(),
  date: z.string(),
  orgName: z.string(),
  vision: z.string(),
  specialists: z.string(),
  duration: z.string(),
  value: z.string(),
});

export const CoverLetterSchema = z.object({
  companyName: z.string(),
  tenderTitle: z.string(),
  entityName: z.string(),
  reference: z.string(),
  recipientTitle: z.string(),
  recipientName: z.string(),
  recipientLocation: z.string(),
  subject: z.string(),
  body: z.string(),
  signatoryName: z.string(),
  signatoryTitle: z.string(),
  date: z.string(),
});

export const CompanyMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const CompanyCertificateSchema = z.object({
  name: z.string(),
  authority: z.string(),
  theme: z.enum(["blue", "green"]),
});

export const CompanyProfileSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  metrics: z.array(CompanyMetricSchema),
  certificatesTitle: z.string(),
  certificates: z.array(CompanyCertificateSchema),
  additionalContent: z.string().optional(),
});

export const RoadmapPhaseSchema = z.object({
  title: z.string(),
  duration: z.string(),
});

export const HighlightFeatureSchema = z.object({
  title: z.string(),
  desc: z.string(),
});

export const ExecutiveSummarySchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  contractValue: z.string(),
  contractValueSub: z.string(),
  usersCount: z.string(),
  usersCountSub: z.string(),
  duration: z.string(),
  durationSub: z.string(),
  matchRate: z.string(),
  matchRateSub: z.string(),
  description: z.string(),
  roadmapTitle: z.string(),
  roadmap: z.array(RoadmapPhaseSchema),
  features: z.array(HighlightFeatureSchema),
  additionalContent: z.string().optional(),
});

export const MethodologyStepSchema = z.object({
  number: z.number(),
  title: z.string(),
  duration: z.string(),
  description: z.string(),
});

export const MethodologyDeliverableSchema = z.object({
  phase: z.string(),
  deliverable: z.string(),
  criterion: z.string(),
});

export const MethodologySchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  steps: z.array(MethodologyStepSchema),
  deliverablesTitle: z.string(),
  deliverables: z.array(MethodologyDeliverableSchema),
  additionalContent: z.string().optional(),
});

export const PastProjectItemSchema = z.object({
  title: z.string(),
  clientName: z.string(),
  value: z.string(),
  year: z.string(),
  description: z.string(),
  metrics: z.array(z.string()),
});

export const PastProjectsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  projects: z.array(PastProjectItemSchema),
  additionalContent: z.string().optional(),
});

export const PricingMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  sublabel: z.string(),
  highlighted: z.boolean().optional(),
});

export const PricingItemSchema = z.object({
  item: z.string(),
  description: z.string(),
  unit: z.string(),
  amount: z.number(),
});

export const PaymentTermSchema = z.object({
  text: z.string(),
});

export const PricingSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  metrics: z.array(PricingMetricSchema),
  items: z.array(PricingItemSchema),
  totalLabel: z.string(),
  totalAmount: z.number(),
  paymentTerms: z.array(PaymentTermSchema),
  additionalContent: z.string().optional(),
});

export const RiskItemSchema = z.object({
  title: z.string(),
  likelihood: z.string(),
  impact: z.string(),
  mitigation: z.string(),
});

export const QualityStandardSchema = z.object({
  standard: z.string(),
  method: z.string(),
  frequency: z.string(),
});

export const QualityAndRiskSchema = z.object({
  title: z.string(),
  risksTitle: z.string(),
  risks: z.array(RiskItemSchema),
  standardsTitle: z.string(),
  standards: z.array(QualityStandardSchema),
  additionalContent: z.string().optional(),
});

export const ScopeRequirementSchema = z.object({
  requirement: z.string(),
  classification: z.string(),
  alignment: z.string(),
});

export const ScopeUnderstandingSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  requirementsTitle: z.string(),
  requirements: z.array(ScopeRequirementSchema),
  goalsTitle: z.string(),
  goals: z.array(z.string()),
  additionalContent: z.string().optional(),
});

export const TeamIconSchema = z.enum([
  "Briefcase",
  "Cpu",
  "Shield",
  "Palette",
  "Code",
  "Terminal",
  "Database",
  "Layout",
  "Network",
  "Server",
  "User",
  "Users",
  "UserCheck",
  "UserCog",
  "ShieldAlert",
  "FileText",
  "TrendingUp",
  "Settings",
  "Key",
  "Lock",
  "Clock",
  "MessageSquare",
  "Activity",
  "Award",
  "BookOpen",
  "Zap",
  "Layers",
  "BarChart3",
  "Globe",
  "Search",
  "Megaphone",
  "CheckCircle",
  "GitBranch",
  "Phone",
  "MapPin",
  "Wrench",
  "HardDrive",
  "Heart",
  "Scale",
  "DollarSign",
]);

export const TeamMemberCardSchema = z.object({
  icon: TeamIconSchema,
  name: z.string(),
  role: z.string(),
  bio: z.string(),
});

export const TeamDivisionSchema = z.object({
  department: z.string(),
  responsibility: z.string(),
  count: z.string(),
  location: z.string(),
});

export const TeamGovernanceSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  members: z.array(TeamMemberCardSchema),
  divisionsTitle: z.string(),
  divisions: z.array(TeamDivisionSchema),
  additionalContent: z.string().optional(),
});

export const TimelinePhaseSchema = z.object({
  title: z.string(),
  duration: z.string(),
  durationLabel: z.string(),
  startMonth: z.number(),
  endMonth: z.number(),
});

export const TimelineMilestoneSchema = z.object({
  code: z.string(),
  description: z.string(),
  targetDate: z.string(),
  owner: z.string(),
});

export const TimelineSchema = z.object({
  title: z.string(),
  phases: z.array(TimelinePhaseSchema),
  milestonesTitle: z.string(),
  milestones: z.array(TimelineMilestoneSchema),
  additionalContent: z.string().optional(),
});

export const VisionPillarSchema = z.object({
  title: z.string(),
  metric: z.string(),
  nationalTarget: z.string(),
  projectContribution: z.string(),
});

export const Vision2030Schema = z.object({
  title: z.string(),
  subtitle: z.string(),
  pillars: z.array(VisionPillarSchema),
  additionalContent: z.string().optional(),
});

// Type Exports
export type CoverPageDataType = z.infer<typeof CoverPageSchema>;
export type CoverLetterDataType = z.infer<typeof CoverLetterSchema>;
export type CompanyMetricDataType = z.infer<typeof CompanyMetricSchema>;
export type CompanyCertificateDataType = z.infer<typeof CompanyCertificateSchema>;
export type CompanyProfileDataType = z.infer<typeof CompanyProfileSchema>;
export type RoadmapPhaseDataType = z.infer<typeof RoadmapPhaseSchema>;
export type HighlightFeatureDataType = z.infer<typeof HighlightFeatureSchema>;
export type ExecutiveSummaryDataType = z.infer<typeof ExecutiveSummarySchema>;
export type MethodologyStepDataType = z.infer<typeof MethodologyStepSchema>;
export type MethodologyDeliverableDataType = z.infer<typeof MethodologyDeliverableSchema>;
export type MethodologyDataType = z.infer<typeof MethodologySchema>;
export type PastProjectItemDataType = z.infer<typeof PastProjectItemSchema>;
export type PastProjectsDataType = z.infer<typeof PastProjectsSchema>;
export type PricingMetricDataType = z.infer<typeof PricingMetricSchema>;
export type PricingItemDataType = z.infer<typeof PricingItemSchema>;
export type PaymentTermDataType = z.infer<typeof PaymentTermSchema>;
export type PricingDataType = z.infer<typeof PricingSchema>;
export type RiskItemDataType = z.infer<typeof RiskItemSchema>;
export type QualityStandardDataType = z.infer<typeof QualityStandardSchema>;
export type QualityAndRiskDataType = z.infer<typeof QualityAndRiskSchema>;
export type ScopeRequirementDataType = z.infer<typeof ScopeRequirementSchema>;
export type ScopeUnderstandingDataType = z.infer<typeof ScopeUnderstandingSchema>;
export type TeamIconDataType = z.infer<typeof TeamIconSchema>;
export type TeamMemberCardDataType = z.infer<typeof TeamMemberCardSchema>;
export type TeamDivisionDataType = z.infer<typeof TeamDivisionSchema>;
export type TeamGovernanceDataType = z.infer<typeof TeamGovernanceSchema>;
export type TimelinePhaseDataType = z.infer<typeof TimelinePhaseSchema>;
export type TimelineMilestoneDataType = z.infer<typeof TimelineMilestoneSchema>;
export type TimelineDataType = z.infer<typeof TimelineSchema>;
export type VisionPillarDataType = z.infer<typeof VisionPillarSchema>;
export type Vision2030DataType = z.infer<typeof Vision2030Schema>;

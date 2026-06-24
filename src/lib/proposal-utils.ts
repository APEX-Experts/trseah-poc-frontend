import { adminProposalsControllerGetProposalDetail } from "./api/react-query/admin-—-proposals/admin-—-proposals";

export type ProposalDto = Awaited<ReturnType<typeof adminProposalsControllerGetProposalDetail>>;

export * from "./proposal/cover-page";
export * from "./proposal/cover-letter";
export * from "./proposal/executive-summary";
export * from "./proposal/scope-understanding";
export * from "./proposal/vision-2030";
export * from "./proposal/company-profile";
export * from "./proposal/past-projects";
export * from "./proposal/methodology";
export * from "./proposal/team";
export * from "./proposal/timeline";
export * from "./proposal/quality-and-risk";
export * from "./proposal/pricing";

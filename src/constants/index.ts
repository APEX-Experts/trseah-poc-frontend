import ar from "@/../messages/ar.json";
import en from "@/../messages/en.json";

export const DOCUMENT_TYPE_LABELS = {
  companyProfile: {
    ar: ar.Onboarding.Documents.types.companyProfile,
    en: en.Onboarding.Documents.types.companyProfile,
  },
  commercialRegistration: {
    ar: ar.Onboarding.Documents.types.commercialRegistration,
    en: en.Onboarding.Documents.types.commercialRegistration,
  },
  taxCertificate: {
    ar: ar.Onboarding.Documents.types.taxCertificate,
    en: en.Onboarding.Documents.types.taxCertificate,
  },
  saudizationCertificate: {
    ar: ar.Onboarding.Documents.types.saudizationCertificate,
    en: en.Onboarding.Documents.types.saudizationCertificate,
  },
  gosiCertificate: {
    ar: ar.Onboarding.Documents.types.gosiCertificate,
    en: en.Onboarding.Documents.types.gosiCertificate,
  },
  chamberOfCommerce: {
    ar: ar.Onboarding.Documents.types.chamberOfCommerce,
    en: en.Onboarding.Documents.types.chamberOfCommerce,
  },
  financialStatements: {
    ar: ar.Onboarding.Documents.types.financialStatements,
    en: en.Onboarding.Documents.types.financialStatements,
  },
  previousExperience: {
    ar: ar.Onboarding.Documents.types.previousExperience,
    en: en.Onboarding.Documents.types.previousExperience,
  },
  isoCertificate: {
    ar: ar.Onboarding.Documents.types.isoCertificate,
    en: en.Onboarding.Documents.types.isoCertificate,
  },
  technicalMethodology: {
    ar: ar.Onboarding.Documents.types.technicalMethodology,
    en: en.Onboarding.Documents.types.technicalMethodology,
  },
} as const;

export type AutoNamedDocumentType = keyof typeof DOCUMENT_TYPE_LABELS;

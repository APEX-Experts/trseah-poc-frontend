import { _Translator } from "next-intl";
import { z } from "zod";

// A generic type to satisfy next-intl's translation function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFunction = _Translator<Record<string, any>, never>;

export const createCompanySchema = (t: TFunction) =>
  z.object({
    nameAr: z.string().min(2, t("Status.required")),
    nameEn: z.string().optional(),
    crNumber: z.string().optional(),
    crExpiry: z.string().optional(),
    localContentScore: z.number().min(0).max(999.99).multipleOf(0.01).optional(),
    sector: z.string().optional(),
    size: z.enum(["micro", "small", "medium", "large"]).optional(),
  });

export const createTeamSchema = (t: TFunction) =>
  z.object({
    nameAr: z.string().min(2, t("Status.required")),
    nameEn: z.string().optional(),
    roleAr: z.string().min(2, t("Status.required")),
    roleEn: z.string().optional(),
    yearsOfExperience: z.number().min(0),
    file: z.any().optional(),
  });

export const createProjectSchema = (t: TFunction) =>
  z
    .object({
      titleAr: z.string().min(2, t("Status.required")),
      titleEn: z.string().optional(),
      clientNameAr: z.string().optional(),
      clientNameEn: z.string().optional(),
      value: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      descriptionAr: z.string().optional(),
      descriptionEn: z.string().optional(),
    })
    .refine(
      (data) =>
        !data.startDate || !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
      { path: ["endDate"], message: t("Projects.invalidDateRange") },
    );

// ✨ INFER THE TYPES ONCE FROM THE FACTORIES
export type CompanyInfoType = z.infer<ReturnType<typeof createCompanySchema>>;
export type TeamMemberType = z.infer<ReturnType<typeof createTeamSchema>>;
export type ProjectType = z.infer<ReturnType<typeof createProjectSchema>>;

"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { OnboardingFooter } from "./onboarding-footer";
import { GenericForm } from "@/components/landing/layout/generic-form";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { createCompanySchema, CompanyInfoType } from "@/lib/schemas";

export function StepCompanyInfo() {
  const t = useTranslations("Onboarding");
  const { nextStep, companyInfo, setCompanyInfo } = useOnboardingStore();

  const companySchema = createCompanySchema(t);

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up-and-fade pb-24">
      <div className="text-center mb-10">
        <h1 className="h2 text-primary-900 mb-2">{t("Company.title")}</h1>
        <p className="p-md text-neutral-500">{t("Company.description")}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-border card-shadow">
        <GenericForm<CompanyInfoType>
          title=""
          schema={companySchema}
          defaultValues={
            (companyInfo || {
              nameAr: "",
              nameEn: "",
              crNumber: "",
              crExpiry: "",
              localContentScore: undefined,
              sector: "",
              size: undefined,
            }) as CompanyInfoType
          }
          submitText={t("Actions.continue")}
          hideReset
          hideSubmit
          formId="company-info-form"
          fields={[
            {
              name: "nameAr",
              label: t("Company.nameAr"),
              type: "text",
              required: true,
            },
            {
              name: "nameEn",
              label: t("Company.nameEn"),
              type: "text",
            },
            {
              name: "crNumber",
              label: t("Company.crNumber"),
              type: "text",
            },
            {
              name: "crExpiry",
              label: t("Company.crExpiry"),
              type: "date",
            },
            {
              name: "localContentScore",
              label: t("Company.localContentScore"),
              type: "number",
              max: 999.99,
              step: 0.01,
            },
            {
              name: "sector",
              label: t("Company.sector"),
              type: "text",
            },
            {
              name: "size",
              label: t("Company.size"),
              type: "select",
              required: true,
              options: [
                { label: t("Company.sizes.micro"), value: "micro" },
                { label: t("Company.sizes.small"), value: "small" },
                { label: t("Company.sizes.medium"), value: "medium" },
                { label: t("Company.sizes.large"), value: "large" },
              ],
            },
          ]}
          onSubmit={async (values) => {
            setCompanyInfo(values);
            nextStep();
          }}
        />
      </div>

      <OnboardingFooter>
        <div /> {/* Spacer to push Continue to the right */}
        <Button
          type="submit"
          form="company-info-form"
          className="bg-primary-800 hover:bg-primary-900 text-white px-8"
        >
          {t("Actions.continue")}
        </Button>
      </OnboardingFooter>
    </div>
  );
}

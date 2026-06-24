"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GenericForm } from "@/components/landing/layout/generic-form";
import { OnboardingFooter } from "./onboarding-footer";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { ProjectType as ProjectForm, createProjectSchema } from "@/lib/schemas";

export function StepPastProjects() {
  const t = useTranslations("Onboarding");

  const projectSchema = createProjectSchema(t);

  const {
    prevStep,
    projects: projectsStore,
    setProjects: setProjectsStore,
    nextStep,
  } = useOnboardingStore();

  const [projects, setProjects] = useState<ProjectForm[]>(projectsStore || []);

  const handleAddProject = async (values: ProjectForm) => {
    setProjects((prev) => [...prev, values]);
  };

  const handleRemoveProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (projects.length === 0) {
      toast.error(t("Projects.addAtLeastOne"));
      return;
    }

    setProjectsStore(projects);
    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-up-and-fade pb-24">
      <div className="text-center mb-8">
        <h1 className="h2 text-primary-900 mb-2">{t("Projects.title")}</h1>

        <p className="p-md text-neutral-500">{t("Projects.description")}</p>
      </div>

      <div className="mb-10">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50 p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
              <Briefcase className="h-7 w-7 text-accent-500" />
            </div>

            <h3 className="text-lg font-semibold text-primary-900">
              {t("Projects.noProjectsTitle")}
            </h3>

            <p className="mt-2 max-w-md text-sm text-neutral-500">
              {t("Projects.noProjectsDescription")}
            </p>

            <p className="mt-3 text-xs font-medium text-accent-600">
              {t("Projects.addProjectsOneByOne")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider">
              {t("Projects.portfolio")}
            </h3>

            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4 p-4 border border-border rounded-xl bg-white card-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-accent-500" />

                    <h4 className="font-semibold text-primary-900">{project.titleAr}</h4>
                  </div>

                  {project.titleEn && (
                    <p className="text-sm text-neutral-500">EN: {project.titleEn}</p>
                  )}

                  {(project.clientNameAr || project.clientNameEn) && (
                    <p className="text-sm text-neutral-500">
                      {project.clientNameAr}
                      {project.clientNameAr && project.clientNameEn ? " / " : ""}
                      {project.clientNameEn}
                    </p>
                  )}

                  {project.value && (
                    <p className="text-sm text-neutral-500">
                      {t("Projects.projectValue")}: {project.value}
                    </p>
                  )}

                  {(project.startDate || project.endDate) && (
                    <p className="text-sm text-neutral-500">
                      {project.startDate} → {project.endDate}
                    </p>
                  )}

                  {project.descriptionAr && (
                    <p className="mt-2 text-sm text-neutral-500">{project.descriptionAr}</p>
                  )}
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveProject(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-border card-shadow">
        <h3 className="h4 text-primary-900 mb-6">{t("Projects.addProject")}</h3>

        <GenericForm<ProjectForm>
          title=""
          schema={projectSchema}
          resetOnSubmit
          hideReset
          submitText={t("Projects.addProject")}
          defaultValues={{
            titleAr: "",
            titleEn: "",

            clientNameAr: "",
            clientNameEn: "",

            value: "",

            startDate: "",
            endDate: "",

            descriptionAr: "",
            descriptionEn: "",
          }}
          fields={[
            {
              name: "titleAr",
              label: t("Projects.projectNameAr"),
              type: "text",
              required: true,
            },
            {
              name: "titleEn",
              label: t("Projects.projectNameEn"),
              type: "text",
            },

            {
              name: "clientNameAr",
              label: t("Projects.clientNameAr"),
              type: "text",
            },
            {
              name: "clientNameEn",
              label: t("Projects.clientNameEn"),
              type: "text",
            },

            {
              name: "value",
              label: t("Projects.projectValue"),
              type: "text",
            },

            {
              name: "startDate",
              label: t("Projects.startDate"),
              type: "date",
            },
            {
              name: "endDate",
              label: t("Projects.endDate"),
              type: "date",
            },

            {
              name: "descriptionAr",
              label: t("Projects.projectDescAr"),
              type: "textarea",
            },
            {
              name: "descriptionEn",
              label: t("Projects.projectDescEn"),
              type: "textarea",
            },
          ]}
          onSubmit={handleAddProject}
        />
      </div>

      <OnboardingFooter>
        <Button
          variant="outline"
          onClick={prevStep}
          className="border-neutral-300 text-neutral-600"
        >
          {t("Actions.back")}
        </Button>

        <Button
          onClick={handleContinue}
          disabled={projects.length === 0}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8"
        >
          {t("Actions.continue")}
        </Button>
      </OnboardingFooter>
    </div>
  );
}

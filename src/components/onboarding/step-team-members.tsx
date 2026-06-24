"use client";

import { GenericForm } from "@/components/landing/layout/generic-form";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Trash2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { OnboardingFooter } from "./onboarding-footer";
import { createTeamSchema, TeamMemberType as TeamMemberForm } from "@/lib/schemas";

export function StepTeamMembers() {
  const t = useTranslations("Onboarding");
  const { nextStep, prevStep, teamMembers, setTeamMembers } = useOnboardingStore();
  const teamSchema = createTeamSchema(t);

  const [members, setMembers] = useState<TeamMemberForm[]>(teamMembers || []);

  const handleAddMember = async (values: TeamMemberForm) => {
    setMembers((prev) => [...prev, values]);
  };

  const handleRemoveMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (members.length === 0) {
      toast.error(t("Team.addAtLeastOne"));
      return;
    }
    // Save to Zustand and LocalStorage
    setTeamMembers(members);
    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-up-and-fade pb-24">
      <div className="text-center mb-8">
        <h1 className="h2 text-primary-900 mb-2">{t("Team.title")}</h1>

        <p className="p-md text-neutral-500">{t("Team.description")}</p>
      </div>

      <div className="mb-10">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-neutral-50 p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
              <Users className="h-7 w-7 text-accent-500" />
            </div>

            <h3 className="text-lg font-semibold text-primary-900">{t("Team.noMembersTitle")}</h3>

            <p className="mt-2 max-w-md text-sm text-neutral-500">
              {t("Team.noMembersDescription")}
            </p>

            <p className="mt-3 text-xs font-medium text-accent-600">
              {t("Team.addMembersOneByOne")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider">
              {t("Team.roster")} ({members.length})
            </h3>

            {members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-4 border border-border rounded-xl bg-white card-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-500 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary-900">
                      {member.nameAr}
                      {member.nameEn && ` | ${member.nameEn}`}
                    </h4>

                    <p className="text-sm text-neutral-500">
                      {member.yearsOfExperience} {t("Team.yearsOf")} • {member.roleAr}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveMember(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-border card-shadow">
        <h3 className="h4 text-primary-900 mb-6">{t("Team.addMember")}</h3>

        <GenericForm<TeamMemberForm>
          title=""
          schema={teamSchema}
          resetOnSubmit
          hideReset
          submitText={t("Team.addMember")}
          defaultValues={{
            nameAr: "",
            nameEn: "",
            roleAr: "",
            roleEn: "",
            yearsOfExperience: 0,
            file: undefined,
          }}
          fields={[
            {
              name: "nameAr",
              label: t("Team.nameAr"),
              type: "text",
              required: true,
            },
            {
              name: "nameEn",
              label: t("Team.nameEn"),
              type: "text",
            },
            {
              name: "roleAr",
              label: t("Team.roleAr"),
              type: "text",
              required: true,
            },
            {
              name: "roleEn",
              label: t("Team.roleEn"),
              type: "text",
            },
            {
              name: "yearsOfExperience",
              label: t("Team.experience"),
              type: "number",
              required: true,
            },
            {
              name: "file",
              label: t("Team.cv"),
              type: "file",
              accept: ".pdf",
            },
          ]}
          onSubmit={handleAddMember}
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
          disabled={members.length === 0}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8"
        >
          {t("Actions.continue")}
        </Button>
      </OnboardingFooter>
    </div>
  );
}

import { Locale } from "@/i18n/routing";
import { getAuth } from "@/lib/api/client/auth/auth";
// getOrganizations can likely be removed from imports if it isn't used elsewhere in this file!
import { UnwrapEnvelope } from "@/lib/apiClient";
import { AuthControllerGetProfile200 } from "@/types/api";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";

type RedirectObject = {
  href: string;
  locale: Locale;
  forcePrefix: boolean;
};

export default async function getInitialData({
  locale,
  checkOrganization = false,
}: {
  locale: Locale;
  checkOrganization?: boolean;
}) {
  let initialProfileData: UnwrapEnvelope<AuthControllerGetProfile200> | undefined = undefined;
  let defaultOpen = true;
  let redirectObject: RedirectObject | null = null;

  try {
    const cookieStore = await cookies();

    const cookieString = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const headers = {
      Cookie: cookieString,
    };

    // 1. Fetch the profile data (which now includes hasCompletedOnboarding)
    initialProfileData = await getAuth().authControllerGetProfile({
      headers,
    });

    // 2. Synchronously check the onboarding status instead of making a second API call
    if (checkOrganization && initialProfileData) {
      const isStandardUser =
        initialProfileData.role !== "ADMIN" && initialProfileData.role !== "SUPER_ADMIN";

      if (isStandardUser && !initialProfileData.hasCompletedOnboarding) {
        redirectObject = {
          href: `/${locale}/onboarding`,
          locale,
          forcePrefix: false,
        };
      }
    }

    const sidebarState = cookieStore.get("sidebar_state");
    defaultOpen = sidebarState ? sidebarState.value === "true" : true;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        redirectObject = {
          href: `/${locale}/auth/login`,
          locale,
          forcePrefix: false,
        };
      } else {
        // Re-throw network or other errors to be caught by the error boundary
        throw error;
      }
    }
  }

  return { initialProfileData, defaultOpen, redirectObject };
}

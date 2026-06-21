import { Locale } from "@/i18n/routing";
import { getAuth } from "@/lib/api/client/auth/auth";
import { getOrganizations } from "@/lib/api/client/organizations/organizations";
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
    initialProfileData = await getAuth().authControllerGetProfile({
      headers,
    });
    if (checkOrganization) {
      try {
        await getOrganizations().organizationsControllerGetMe({ headers });
      } catch (orgError) {
        if (isAxiosError(orgError) && orgError.response?.status === 404) {
          redirectObject = {
            href: `/${locale}/onboarding`,
            locale,
            forcePrefix: false,
          };
        } else {
          throw orgError;
        }
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

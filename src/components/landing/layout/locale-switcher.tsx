"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTransition } from "react";
import { locales } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAuthControllerGetProfileQueryKey,
  useAuthControllerUpdateProfile,
} from "@/lib/api/react-query/auth/auth";
import { UpdateUserDtoLocale } from "@/types/api";

const localeNames: Record<string, string> = {
  ar: "العربية",
  en: "English",
};

/**
 * A locale switcher component that displays a dropdown menu of all supported locales.
 * Preserves the current path and query parameters during switching.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const { mutate: updateProfile } = useAuthControllerUpdateProfile({
    mutation: {
      onSuccess: (data) => {
        // Update profile in query cache immediately
        queryClient.setQueryData([getAuthControllerGetProfileQueryKey()], data);
        // Force invalidation to ensure sync across components
        queryClient.invalidateQueries({ queryKey: [getAuthControllerGetProfileQueryKey()] });
      },
    },
  });

  const switchLocale = (nextLocale: string) => {
    const queryString = searchParams.toString();
    const targetPath = queryString ? `${pathname}?${queryString}` : pathname;

    // Check if the user's profile is loaded in the cache (i.e. user is logged in)
    const user = queryClient.getQueryData([getAuthControllerGetProfileQueryKey()]);
    if (user) {
      // Fire the PATCH request in the background (non-blocking)
      updateProfile({
        data: {
          locale: nextLocale as UpdateUserDtoLocale,
        },
      });
    }

    startTransition(() => {
      router.replace(targetPath, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className="gap-2 px-1 md:px-3 h-9 max-md:w-8 max-md:h-8 max-md:rounded-full"
          aria-label="Select language"
        >
          <Globe className="size-4 animate-in fade-in duration-300" />
          <span className="text-sm font-medium uppercase hidden md:block">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            disabled={loc === locale}
            onClick={() => switchLocale(loc)}
            className="cursor-pointer focus:bg-neutral-100 focus:text-foreground"
          >
            {localeNames[loc] || loc}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

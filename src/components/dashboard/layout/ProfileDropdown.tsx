import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { UserResponseDto } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface ProfileDropdownProps {
  user: UserResponseDto;
  handleLogout: () => void;
  isPending: boolean;
  expanded?: boolean;
  isSidebar?: boolean;
  collapseOnMobile?: boolean;
}

export function ProfileDropdown({
  user,
  handleLogout,
  isPending,
  expanded: expandedProp,
  collapseOnMobile,
}: ProfileDropdownProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const expanded = expandedProp ?? !isCollapsed;
  const locale = useLocale();
  const t = useTranslations("AppSidebar");
  const queryClient = useQueryClient();
  return (
    <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className={cn(
            "relative flex items-center transition-all cursor-pointer",
            expanded
              ? collapseOnMobile
                ? "w-8 h-8 md:w-full md:px-3 md:py-6 justify-center md:justify-start gap-0 md:gap-3 rounded-full md:rounded-lg p-0"
                : "w-full px-3 py-6 justify-start gap-3 rounded-lg"
              : "h-8 w-8 justify-center rounded-full p-0",
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-foreground">
            {user.firstName && user.lastName ? (
              <span className="text-xs font-bold uppercase">
                {user.firstName.charAt(0) + user.lastName.charAt(0)}
              </span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          {expanded && (
            <div
              className={cn(
                "flex flex-col text-start overflow-hidden",
                collapseOnMobile && "hidden md:flex",
              )}
            >
              <p className="text-sm font-medium leading-none truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="font-inter text-xs leading-none text-muted-foreground truncate mt-1 group-hover/sidebar:text-accent-300">
                {user.email}
              </p>
            </div>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        style={
          {
            "--accent": "var(--neutral-100)",
            "--accent-foreground": "var(--primary-900)",
          } as React.CSSProperties
        }
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName + " " + user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground font-inter">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-error-foreground cursor-pointer"
          style={
            {
              "--accent-foreground": "var(--error-foreground)",
            } as React.CSSProperties
          }
          onClick={() => {
            handleLogout();
            queryClient.clear();
          }}
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? t("loading") : t("logOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

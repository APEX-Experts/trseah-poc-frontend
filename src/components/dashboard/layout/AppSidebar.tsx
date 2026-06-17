"use client";
import { Logo } from "@/components/landing/layout/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navConfig } from "@/config/nav-config";
import { useAuthAndLogout } from "@/hooks/use-auth";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AuthControllerGetProfile200 } from "@/types/api";
import { useLocale, useTranslations } from "next-intl";
import { ProfileDropdown } from "./ProfileDropdown";

export function AppSidebar({
  initialProfileData,
}: {
  initialProfileData: AuthControllerGetProfile200;
}) {
  const t = useTranslations("AppSidebar");
  const locale = useLocale();
  const side = locale === "ar" ? "right" : "left";

  const pathname = usePathname();

  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const { handleLogout, isPending, user, isLoading, error, statusCode } =
    useAuthAndLogout(initialProfileData);

  return (
    <Sidebar collapsible="icon" side={side} className="*:bg-primary-800 text-white">
      <SidebarHeader className="h-16 flex py-3 items-start justify-center px-2">
        <Link href={navConfig.primaryLink.href} className="flex items-center text-start">
          <Logo
            logoOnly={isCollapsed}
            logoImage="/logo_white.png"
            logoOnlyImage="/logo_mark.png"
            width={isCollapsed ? 30 : 120}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-y-1">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {navConfig.sidebarNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={t(item.label)}
                  isActive={pathname === item.href}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-md px-4 py-6",
                    pathname === item.href
                      ? "bg-accent-300/14! border border-accent-300/25 text-white! font-semibold!"
                      : "hover:bg-accent-300/14 text-white/55 hover:text-white border border-transparent hover:border-accent-300/25",
                    isCollapsed && "px-0 justify-center",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn(
                        "size-5",
                        pathname === item.href ? "text-accent-300" : "text-white/55",
                      )}
                    />
                    {!isCollapsed && <span>{t(item.label)}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem className="*:hover:bg-accent-300/14 *:hover:text-white *:hover:border-accent-300/25 *:border *:border-transparent group/sidebar">
            {isLoading && <div>{t("loading")}</div>}
            {error && <div>{t("error", { message: String(error.message) })}</div>}
            {statusCode && statusCode >= 400 && <div>{t("notAuthorized")}</div>}
            {user && (
              <ProfileDropdown
                user={user}
                handleLogout={handleLogout}
                isPending={isPending}
                expanded={!isCollapsed}
              />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

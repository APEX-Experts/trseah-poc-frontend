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
import { useAuthControllerGetProfile, useAuthControllerLogout } from "@/hooks/use-auth";
import { AuthControllerGetProfile200 } from "@/types/api";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { ProfileDropdown } from "./ProfileDropdown";
import { navConfig } from "@/config/nav-config";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export function AppSidebar({
  initialProfileData,
}: {
  initialProfileData: AuthControllerGetProfile200;
}) {
  const t = useTranslations("AppSidebar");
  const locale = useLocale();
  const side = locale === "ar" ? "right" : "left";

  const { data, isLoading, error } = useAuthControllerGetProfile({
    query: {
      initialData: initialProfileData,
      staleTime: 1000 * 60 * 5,
    },
  });
  const router = useRouter();
  const { mutate: logout, isPending } = useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        // Redirect to login page after successful logout
        router.push("/auth/login");
        // Force a refresh to clear any cached states if necessary
        router.refresh();
      },
    },
  });

  const handleLogout = () => {
    logout();
  };
  const pathname = usePathname();

  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const user = data?.data;
  return (
    <Sidebar collapsible="icon" side={side}>
      <SidebarHeader className="h-16 flex py-3 items-start justify-center px-2">
        <Link href={navConfig.primaryLink.href} className="flex items-center text-start">
          <Logo brandName="Sidebar" logoOnly={isCollapsed} />
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
                    "w-full flex items-center gap-4 rounded-full px-4 py-6",
                    pathname === item.href
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-muted/80",
                    isCollapsed && "px-0 justify-center",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="size-5" />
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
          <SidebarMenuItem>
            {isLoading && <div>{t("loading")}</div>}
            {error && <div>{t("error", { message: String(error.message) })}</div>}
            {data?.statusCode && data?.statusCode >= 400 && <div>{t("notAuthorized")}</div>}
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

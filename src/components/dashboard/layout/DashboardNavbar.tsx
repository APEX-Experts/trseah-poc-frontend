"use client";

import { Logo } from "@/components/landing/layout/logo";
import { LocaleSwitcher } from "@/components/landing/layout/locale-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { navConfig } from "@/config/nav-config";
import { useState } from "react"; // Added useState
import { SearchDialog, SearchTrigger } from "./SearchInput"; // Updated imports
import { NotificationsPopover } from "./NotificationsPopover";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { ProfileDropdown } from "./ProfileDropdown";
import { useAuthAndLogout } from "@/hooks/use-auth";
import { AuthControllerGetProfile200 } from "@/types/api";

export function DashboardNavbar({
  initialProfileData,
}: {
  initialProfileData: AuthControllerGetProfile200;
}) {
  const [searchOpen, setSearchOpen] = useState(false); // Global search state
  const { handleLogout, isPending, user } = useAuthAndLogout(initialProfileData);

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="absolute top-0 inset-s-0" />
          <Link href={navConfig.primaryLink.href} className="flex items-center">
            <Logo logoImage="/logo.png" width={120} />
          </Link>
        </div>
        <Separator orientation="vertical" className="h-6 my-auto mx-2" />

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 md:space-x-2 w-full">
          {/* Global Search (Mobile Trigger) */}
          <div className="flex-1">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>

          <NotificationsPopover />
          <LocaleSwitcher />
        </div>
        <Separator orientation="vertical" className="h-6 my-auto mx-2" />
        <div>
          {user && (
            <ProfileDropdown
              user={user}
              handleLogout={handleLogout}
              isPending={isPending}
              expanded
              collapseOnMobile
            />
          )}
        </div>
      </div>

      {/* Render Dialog strictly ONCE */}
      <SearchDialog open={searchOpen} setOpen={setSearchOpen} />
    </header>
  );
}

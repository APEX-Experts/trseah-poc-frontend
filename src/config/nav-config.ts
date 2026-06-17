import { LayoutDashboard, Settings, User, LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavConfig {
  primaryLink: {
    label: string;
    href: string;
  };
  sidebarNav: NavItem[];
}

export const navConfig: NavConfig = {
  primaryLink: {
    label: "Dashboard",
    href: "/",
  },
  sidebarNav: [
    {
      label: "Home",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
};

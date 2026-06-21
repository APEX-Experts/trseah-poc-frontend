import { LayoutDashboard, LucideIcon } from "lucide-react";

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
  ],
};

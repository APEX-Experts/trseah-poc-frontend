"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { Logo, LogoProps } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

// 1. Define the data structure for your navigation
/**
 * Represents a single navigation route.
 */
export type NavRoute = {
  /** The target URL for the link */
  href: string;
  /** The text label to display for the link */
  label: string;
};

/**
 * Props for the Navbar component.
 */
interface NavbarProps extends LogoProps {
  /** An array of navigation links to display in the menu */
  routes: NavRoute[];
  /** Optional slot for additional components like buttons or user profile dropdowns */
  actionSlot?: React.ReactNode;
}

/**
 * A responsive navigation bar component that supports branding, dynamic routes, and an action slot.
 *
 * @param {NavbarProps} props - The component props.
 * @param {string} [props.brandName="Brand"] - The name of your brand displayed in the logo.
 * @param {string} [props.logoImage] - Optional image URL for the brand logo.
 * @param {React.ReactNode} [props.logoSvg] - Optional SVG component for the brand logo.
 * @param {NavRoute[]} props.routes - An array of navigation links with 'to' and 'label' properties.
 * @param {React.ReactNode} [props.actionSlot] - Optional slot for additional components like buttons or user profile dropdowns.
 *
 * @example
 * ```tsx
 * <Navbar
 *   brandName="MyStore"
 *   routes={[{ to: "/products", label: "Products" }]}
 *   actionSlot={<Button>Login</Button>}
 * />
 * ```
 */

export function Navbar({
  brandName = "Brand",
  logoImage,
  logoSvg,
  routes,
  actionSlot,
}: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <Logo brandName={brandName} logoImage={logoImage} logoSvg={logoSvg} />
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Slot (e.g., Login Button) */}
        <div className="hidden md:flex items-center space-x-4">
          <LocaleSwitcher />
          {actionSlot}
        </div>

        {/* Mobile Navigation (Hidden on Desktop) */}
        <div className="flex md:hidden items-center space-x-2">
          <LocaleSwitcher />
          {actionSlot}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 sm:w-100 p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mb-8">
                <Logo brandName={brandName} logoImage={logoImage} logoSvg={logoSvg} />
              </div>

              <SheetDescription className="sr-only">Links to navigate the site.</SheetDescription>
              <nav className="flex flex-col space-y-4 mt-8">
                {routes.map((route) => {
                  const isActive = pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsOpen(false)} // Close menu on click
                      className={`text-lg font-medium transition-colors hover:text-foreground/80 ${
                        isActive ? "text-foreground" : "text-foreground/60"
                      }`}
                    >
                      {route.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

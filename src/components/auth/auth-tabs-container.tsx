"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthTabsContainerProps {
  defaultTab: "login" | "register";
}

export function AuthTabsContainer({ defaultTab }: AuthTabsContainerProps) {
  const t = useTranslations("Auth");

  // Track the incoming prop to detect changes from external navigation
  const [prevDefaultTab, setPrevDefaultTab] = useState<"login" | "register">(defaultTab);
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);

  // Sync tab state with route shifts without using useEffect
  // React will immediately restart the render if this condition is met, avoiding a cascading DOM update
  if (defaultTab !== prevDefaultTab) {
    setPrevDefaultTab(defaultTab);
    setActiveTab(defaultTab);
  }

  const handleTabChange = (tab: "login" | "register") => {
    if (tab === activeTab) return;
    setActiveTab(tab);

    // Replace the URL without navigating (shallow routing emulation)
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      let newPath = currentPath;

      if (tab === "register" && currentPath.includes("/login")) {
        newPath = currentPath.replace("/login", "/register");
      } else if (tab === "login" && currentPath.includes("/register")) {
        newPath = currentPath.replace("/register", "/login");
      }

      if (newPath !== currentPath) {
        window.history.replaceState(null, "", newPath + window.location.search);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-10rem)] py-8 animate-in fade-in-50 duration-500">
      {/* Premium Tab Selector */}
      <div className="relative flex w-full bg-neutral-100 p-1 rounded-full border border-primary-800/10 mb-8 select-none">
        {/* Animated active pill background */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out ${
            activeTab === "login"
              ? "left-1 rtl:right-1 rtl:left-auto"
              : "left-[calc(50%+2px)] rtl:right-[calc(50%+2px)] rtl:left-auto"
          }`}
        />
        <button
          type="button"
          onClick={() => handleTabChange("login")}
          className={`relative z-10 w-1/2 py-2 text-center text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-800/20 ${
            activeTab === "login"
              ? "text-primary-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("loginTab")}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("register")}
          className={`relative z-10 w-1/2 py-2 text-center text-sm font-semibold rounded-full transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-800/20 ${
            activeTab === "register"
              ? "text-primary-800"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t("registerTab")}
        </button>
      </div>

      {/* Render Active Form */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "login" ? (
          <LoginForm onTabChange={handleTabChange} />
        ) : (
          <RegisterForm onTabChange={handleTabChange} />
        )}
      </div>
    </div>
  );
}

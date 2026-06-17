import React from "react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/landing/layout/logo";
import { LocaleSwitcher } from "@/components/landing/layout/locale-switcher";
import { getTranslations } from "next-intl/server";
import { ClipboardList, Sparkles, Activity, ShieldCheck } from "lucide-react";

/**
 * Layout component for the auth route group.
 * Displays a split-screen design on desktop.
 *
 * @param props - Component props containing children elements and params.
 */
export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const t = await getTranslations("Auth");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main split-screen container */}
      <main className="grow flex flex-col lg:flex-row min-h-screen relative">
        {/* Left Section (Form/Template Side) */}
        <section className="w-full lg:w-1/2 bg-background flex items-center justify-center p-6 sm:p-12 overflow-y-auto relative max-h-screen lg:min-h-0">
          {/* Absolute Positioned Locale Switcher */}
          <div className="absolute top-4 inset-e-4 z-50">
            <LocaleSwitcher />
          </div>
          {children}
        </section>
        {/* Right section on desktop (Primary 800) */}
        <section className="hidden lg:flex lg:w-1/2 bg-primary-800 text-white p-12 xl:p-16 flex-col justify-between overflow-hidden select-none sticky max-h-screen">
          {/* Decorative ambient gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,158,138,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo at the top of the info panel */}
          <div className="relative z-10">
            <Link href="/" className="inline-block">
              <Logo logoImage="/logo_white.png" width={140} />
            </Link>
          </div>

          <div className="relative z-10 space-y-10 my-auto">
            {/* Headers */}
            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white tracking-tight">
                {t("title")}
              </h1>
              <p className="text-primary-100 text-base xl:text-lg leading-relaxed font-light">
                {t("subtitle")}
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {/* Card 1 */}
              <div className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 xl:p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-5 h-5 text-accent-300" />
                </div>
                <h3 className="font-semibold text-white text-base mb-1">{t("card1Title")}</h3>
                <p className="text-primary-100/85 text-xs xl:text-sm leading-relaxed">
                  {t("card1Desc")}
                </p>
              </div>

              {/* Card 2 */}
              <div className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 xl:p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-accent-300" />
                </div>
                <h3 className="font-semibold text-white text-base mb-1">{t("card2Title")}</h3>
                <p className="text-primary-100/85 text-xs xl:text-sm leading-relaxed">
                  {t("card2Desc")}
                </p>
              </div>

              {/* Card 3 */}
              <div className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 xl:p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-accent-300" />
                </div>
                <h3 className="font-semibold text-white text-base mb-1">{t("card3Title")}</h3>
                <p className="text-primary-100/85 text-xs xl:text-sm leading-relaxed">
                  {t("card3Desc")}
                </p>
              </div>

              {/* Card 4 */}
              <div className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 xl:p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary-700/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-accent-300" />
                </div>
                <h3 className="font-semibold text-white text-base mb-1">{t("card4Title")}</h3>
                <p className="text-primary-100/85 text-xs xl:text-sm leading-relaxed">
                  {t("card4Desc")}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 border-t border-white/10 pt-6 xl:pt-8 grid grid-cols-3 gap-4 max-w-xl">
            <div className="space-y-1">
              <div className="text-2xl xl:text-3xl font-extrabold text-accent-300 text-center">
                {t("stat1Value")}
              </div>
              <div className="text-xs text-primary-200 text-center">{t("stat1Label")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl xl:text-3xl font-extrabold text-accent-300 text-center">
                {t("stat2Value")}
              </div>
              <div className="text-xs text-primary-200 text-center">{t("stat2Label")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl xl:text-3xl font-extrabold text-accent-300 text-center">
                {t("stat3Value")}
              </div>
              <div className="text-xs text-primary-200 text-center">{t("stat3Label")}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

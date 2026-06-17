import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { Locale, locales, routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run next-intl middleware first to handle routing/locale prefixes
  const response = intlMiddleware(request);

  // If the next-intl response redirects (e.g. status 307 or 308, or contains location header),
  // return it immediately to perform the redirect.
  if (response.status === 307 || response.status === 308 || response.headers.has("location")) {
    return response;
  }

  // 2. Handle Authentication logic on the locale-prefixed routes
  // Extract locale from the request path if present, or use default locale
  const segments = pathname.split("/");
  const locale = routing.locales.includes(segments[1] as Locale)
    ? segments[1]
    : routing.defaultLocale;

  // Clean pathname without locale prefix to do matching
  const localesPattern = locales.join("|");
  const localeRegex = new RegExp(`^\\/(${localesPattern})(\\/|$)`);
  const pathnameWithoutLocale = pathname.replace(localeRegex, "/");
  const isAuthPage = pathnameWithoutLocale.startsWith("/auth");

  const hasAuthCookie = request.cookies.has(process.env.COOKIE_NAME || "nextjs_template");

  // A. Unauthenticated user trying to access a protected route
  if (!hasAuthCookie && !isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // B. Authenticated user trying to access login/register pages
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return response;
}

export const config = {
  // Good matcher setup. Excludes static files, API routes, and Next internals.
  matcher: [
    // Match all pathnames except for the ones starting with:
    // - api (API routes)
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - all files with an extension (e.g. favicon.ico, logo.png)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match all pathnames within the root or localized paths
    "/",
    "/(ar|en|fr)/:path*",
  ],
};

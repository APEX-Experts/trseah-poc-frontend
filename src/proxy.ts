import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(process.env.COOKIE_NAME || "nextjs_template");

  const isAuthPage = pathname.startsWith("/auth");

  // 1. Unauthenticated user trying to access a protected route
  if (!hasAuthCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 2. Authenticated user trying to access login/register pages
  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Good matcher setup. Excludes static files, API routes, and Next internals.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route paths → role yang diizinkan
const protectedRoutes: Record<string, string[]> = {
  "/supplier": ["supplier"],
  "/generator": ["generator"],
  "/aggregator": ["aggregator"],
  "/converter": ["converter"],
  "/enabler": ["enabler"],
  "/buyer": ["buyer"],
  "/designer": ["designer"],
};

// Halaman publik (no auth required)
const publicRoutes = [
  "/login",
  "/register",
  "/onboarding",
  "/role-selection",
  "/forgot-password",
  "/p/",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static assets & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Baca role dari cookie khusus (set oleh setAuthCookie di client)
  // JWT PocketBase tidak mengandung field 'role'
  const roleCookie = request.cookies.get("pb_role");
  const userRole: string | null = roleCookie?.value || null;

  // Cek route protection
  for (const [routePrefix, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      if (!userRole) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!allowedRoles.includes(userRole)) {
        const dashboardUrl = new URL(`/${userRole}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

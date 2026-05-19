import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";

// Route paths → role yang diizinkan
const protectedRoutes: Record<string, string[]> = {
  "/supplier": ["supplier"],
  "/generator": ["generator"],
  "/aggregator": ["aggregator"],
  "/converter": ["converter"],
  "/enabler": ["enabler"],
  "/buyer": ["buyer"],
};

// Halaman publik (no auth required)
const publicRoutes = [
  "/login",
  "/register",
  "/onboarding",
  "/role-selection",
  "/forgot-password",
  "/p/", // Traceability pages
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

  // Check auth dari cookie PocketBase
  const authCookie = request.cookies.get("pb_auth");
  let userRole: string | null = null;

  if (authCookie?.value) {
    try {
      const pb = new PocketBase(PB_URL);
      pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
      if (pb.authStore.isValid && pb.authStore.model) {
        userRole = (pb.authStore.model as Record<string, unknown>).role as string;
      }
    } catch {
      // Invalid token
    }
  }

  // Cek route protection
  for (const [routePrefix, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      if (!userRole) {
        // Not authenticated → redirect login
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!allowedRoles.includes(userRole)) {
        // Wrong role → redirect ke dashboard sesuai role
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

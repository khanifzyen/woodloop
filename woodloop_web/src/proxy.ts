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

function decodeJWTPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // Base64url → base64, then decode (atob tersedia di Edge Runtime)
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Tambah padding jika perlu
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

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

  // Cek auth dari cookie — decode JWT langsung
  const authCookie = request.cookies.get("pb_auth");
  let userRole: string | null = null;

  if (authCookie?.value) {
    const payload = decodeJWTPayload(authCookie.value);
    if (payload) {
      userRole = (payload.role as string) || null;
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

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://woodloop.pasarjepara.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/p/", "/buyer/marketplace", "/buyer/product/", "/login", "/register", "/onboarding", "/role-selection"],
        disallow: [
          "/supplier/",
          "/generator/",
          "/aggregator/",
          "/converter/",
          "/enabler/",
          "/buyer/cart",
          "/buyer/checkout",
          "/buyer/orders",
          "/wallet",
          "/chat",
          "/notifications",
          "/profile",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

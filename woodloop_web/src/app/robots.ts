import type { MetadataRoute } from "next";

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
    sitemap: "https://woodloop.app/sitemap.xml",
  };
}

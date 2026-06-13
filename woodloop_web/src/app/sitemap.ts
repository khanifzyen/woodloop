import type { MetadataRoute } from "next";
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "https://pb-woodloop.pasarjepara.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://woodloop.pasarjepara.com";

const CATEGORIES = ["furniture", "decor", "accessories", "art", "other"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/role-selection`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/onboarding`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/buyer/marketplace`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/buyer/scan`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
  ];

  // Category pages
  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES.map((slug) => ({
    url: `${BASE_URL}/buyer/marketplace?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Dynamic product pages (traceability + buyer detail)
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const pb = new PocketBase(PB_URL);
    const products = await pb.collection("products").getList(1, 200, {
      fields: "id,qr_code_id,updated",
    });
    productUrls = products.items.flatMap((p: Record<string, unknown>) => [
      {
        url: `${BASE_URL}/p/${p.qr_code_id || p.id}`,
        lastModified: new Date(p.updated as string),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/buyer/product/${p.id}`,
        lastModified: new Date(p.updated as string),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ]);
  } catch {
    // skip if PocketBase unavailable
  }

  return [...staticPages, ...categoryUrls, ...productUrls];
}

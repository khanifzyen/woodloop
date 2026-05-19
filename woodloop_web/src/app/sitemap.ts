import type { MetadataRoute } from "next";
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "https://pb-woodloop.pasarjepara.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: "https://woodloop.app", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://woodloop.app/login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://woodloop.app/register", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://woodloop.app/role-selection", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://woodloop.app/onboarding", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://woodloop.app/buyer/marketplace", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  // Dynamic product pages (traceability)
  let productUrls: MetadataRoute.Sitemap = [];
  try {
    const pb = new PocketBase(PB_URL);
    const products = await pb.collection("products").getList(1, 200, {
      fields: "id,qr_code_id,updated",
    });
    productUrls = products.items.map((p: Record<string, unknown>) => ({
      url: `https://woodloop.app/p/${p.qr_code_id || p.id}`,
      lastModified: new Date(p.updated as string),
      changeFrequency: "daily" as const,
      priority: 1.0,
    }));
  } catch {
    // skip if PocketBase unavailable
  }

  return [...staticPages, ...productUrls];
}

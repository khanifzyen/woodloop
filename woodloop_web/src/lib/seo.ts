import type { Product } from "@/lib/pocketbase/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://woodloop.pasarjepara.com";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WoodLoop",
    url: BASE_URL,
    description: "Platform ekonomi sirkular untuk industri kayu Jepara",
    logo: `${BASE_URL}/icon-512.png`,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WoodLoop",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/buyer/marketplace?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description?: string | null;
  price: number;
  photos?: string[];
  category?: string;
  expand?: { converter?: { name?: string } };
  qr_code_id?: string;
}) {
  const photo = product.photos?.[0];
  const converterName = product.expand?.converter?.name;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: photo || undefined,
    category: product.category || undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    brand: {
      "@type": "Brand",
      name: converterName || "WoodLoop",
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  };
}

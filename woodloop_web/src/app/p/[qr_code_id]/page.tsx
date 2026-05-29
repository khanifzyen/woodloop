import { getPB } from "@/lib/pocketbase/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFileUrlServer(record: any, filename: string) {
  return `${PB_URL}/api/files/${record.collectionId ?? "products"}/${record.id}/${filename}`;
}
function createServerPB() {
  const PocketBase = require("pocketbase").default;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090");
  return pb;
}

export async function generateMetadata({ params }: { params: Promise<{ qr_code_id: string }> }): Promise<Metadata> {
  const { qr_code_id } = await params;
  try {
    const pb = createServerPB();
    const products = await pb.collection("products").getList(1, 1, {
      filter: `qr_code_id="${qr_code_id}"`,
    });
    const product = products.items[0];
    if (!product) return { title: "Produk Tidak Ditemukan" };

    return {
      title: `${product.name} — WoodLoop Traceability`,
      description: product.description || `Produk daur ulang ${product.name} dari WoodLoop. Lacak perjalanan produk ini.`,
      openGraph: {
        title: product.name,
        description: product.description || `Produk daur ulang dari WoodLoop`,
        images: product.photos?.[0] ? [{ url: product.photos[0] }] : [],
      },
    };
  } catch {
    return { title: "WoodLoop — Traceability" };
  }
}

interface ProductRecord {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  photos?: string[];
  category?: string;
}

export default async function PublicTraceabilityPage({
  params,
}: {
  params: Promise<{ qr_code_id: string }>;
}) {
  const { qr_code_id } = await params;
  const pb = createServerPB();

  let product: ProductRecord | null = null;
  try {
    const result = await pb.collection("products").getList(1, 1, {
      filter: `qr_code_id="${qr_code_id}"`,
      expand: "converter",
    });
    product = (result.items[0] || null) as ProductRecord | null;
  } catch {
    // ignore
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildProductJsonLd({
            name: product.name || "",
            description: product.description,
            price: product.price || 0,
            photos: product.photos,
            category: product.category,
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd([
            { name: "Beranda", url: "/" },
            { name: "Marketplace", url: "/buyer/marketplace" },
            { name: product.name || "Produk", url: `/p/${qr_code_id}` },
          ])),
        }}
      />
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-8">
          <div className="inline-flex items-center gap-2">
            <span className="text-3xl">🌳</span>
            <h1 className="text-xl font-heading font-bold text-primary">WoodLoop</h1>
          </div>
          <p className="text-sm text-muted-foreground">Jepara Circular Hub</p>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          {product.photos?.[0] && (
            <img
              src={getFileUrlServer(product, product.photos[0])}
              alt={product.name as string}
              className="w-full h-64 object-cover rounded-xl border"
            />
          )}

          <div>
            <h2 className="text-2xl font-heading font-bold">
              {product.name as string}
            </h2>
            <p className="text-xl font-bold mt-1">
              Rp {(product.price as number).toLocaleString("id-ID")}
            </p>
          </div>

          <p className="text-muted-foreground">
            {product.description as string || "Produk daur ulang berkualitas dari Jepara."}
          </p>

          {/* Impact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/10 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">♻️</p>
              <p className="text-xs text-muted-foreground mt-1">Produk Daur Ulang</p>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">🌱</p>
              <p className="text-xs text-muted-foreground mt-1">Ramah Lingkungan</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">
              Tertarik dengan produk ini?
            </p>
            <a
              href={`/buyer/product/${product.id}`}
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Lihat Detail Produk
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-8">
          <p>WoodLoop — Ekonomi Sirkular Kayu Jepara</p>
          <p>Kode: {qr_code_id}</p>
        </div>
      </div>
    </div>
  );
}

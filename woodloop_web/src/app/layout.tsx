import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/hooks/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://woodloop.pasarjepara.com";

export const viewport: Viewport = {
  themeColor: "#2D6A4F",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "WoodLoop — Jepara Circular Hub", template: "%s — WoodLoop" },
  description:
    "Platform ekonomi sirkular untuk industri kayu Jepara. Kelola limbah kayu, jual beli bahan daur ulang, dan lacak dampak lingkungan.",
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "WoodLoop — Jepara Circular Hub",
    description:
      "Platform ekonomi sirkular untuk industri kayu Jepara. Kelola limbah kayu, jual beli bahan daur ulang, dan lacak dampak lingkungan.",
    url: BASE_URL,
    siteName: "WoodLoop",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "WoodLoop — Jepara Circular Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WoodLoop — Jepara Circular Hub",
    description:
      "Platform ekonomi sirkular untuk industri kayu Jepara.",
    images: ["/icon-512.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                if (location.hostname.includes("localhost") || location.hostname.includes("127.0.0.1")) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var r of regs) r.unregister();
                  });
                } else {
                  navigator.serviceWorker.register("/sw.js").catch(function(err) {
                    console.warn("[SW] Registration failed:", err);
                  });
                }
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "WoodLoop",
              url: BASE_URL,
              description: "Platform ekonomi sirkular untuk industri kayu Jepara",
              logo: BASE_URL + "/icon-512.png",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "WoodLoop",
              url: BASE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: BASE_URL + "/buyer/marketplace?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}

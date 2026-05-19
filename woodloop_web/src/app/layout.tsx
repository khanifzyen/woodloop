import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: { default: "WoodLoop — Jepara Circular Hub", template: "%s — WoodLoop" },
  description:
    "Platform ekonomi sirkular untuk industri kayu Jepara. Kelola limbah kayu, jual beli bahan daur ulang, dan lacak dampak lingkungan.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "WoodLoop — Jepara Circular Hub",
    description:
      "Platform ekonomi sirkular untuk industri kayu Jepara. Kelola limbah kayu, jual beli bahan daur ulang, dan lacak dampak lingkungan.",
    url: "https://woodloop.app",
    siteName: "WoodLoop",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "WoodLoop — Jepara Circular Hub",
    description:
      "Platform ekonomi sirkular untuk industri kayu Jepara.",
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
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/sw.js");
                });
              }
            `,
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

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WoodLoop — Jepara Circular Hub",
    short_name: "WoodLoop",
    description: "Platform ekonomi sirkular untuk industri kayu Jepara",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2D6A4F",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
  };
}

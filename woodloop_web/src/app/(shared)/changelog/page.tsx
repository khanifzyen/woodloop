"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { version } from "@/lib/version";

const changelog = [
  {
    version: "0.0.4",
    date: "31 Mei 2026",
    added: [
      "Halaman Daftar Limbah untuk Generator — lihat dan hapus limbah yang disetor",
      "Stok kayu — Supplier bisa isi jumlah stok saat daftarkan kayu",
      "Koleksi raw_timber_orders untuk pesanan Supplier ke Generator",
      "Halaman Changelog ini",
      "Filter & pencarian di halaman Pesanan Masuk Supplier",
      "Tombol Konfirmasi Bayar — Supplier bisa ubah status pesanan secara manual",
      "Notifikasi real-time — Supplier dapat notif saat Generator pesan, Generator dapat notif saat pesanan diproses/dikirim",
      "Navigasi foto — lihat semua foto kayu di kartu marketplace",
      "Cart + Checkout — Generator bisa kumpulkan beberapa kayu ke keranjang (localStorage) lalu checkout per supplier",
      "Koleksi raw_timber_order_details — line items untuk master-detail pesanan kayu",
      "Field total_quantity di raw_timber_orders — akses cepat tanpa expand",
      "Detail sheet di halaman Pesanan Kayu Generator dan Pesanan Masuk Supplier",
      "Kolom # (counter) di tabel pesanan Generator dan Supplier",
      "Dashboard Supplier — sekarang pakai data raw_timber_orders (bukan orders Buyer)",
      "Label 'Order Masuk' diganti 'Order Pending' di Dashboard Supplier",
      "Kolom Stok di header tabel Inventaris Supplier",
      "Tombol Tandai Diterima untuk status shipped di Pesanan Masuk Supplier",
    ],
    fixed: [
      "Error pesan kayu — now using raw_timber_orders collection with proper createRule",
      "Foto produk Generator tidak muncul — pakai getFileUrl",
      "Foto produk baru tidak terupload — pakai FormData",
      "Pencarian kayu di marketplace bisa cari jenis kayu",
      "Label 'Tinggi' diganti 'Tebal' di form dimensi balok/papan",
      "Pesanan masuk Supplier tampilkan nama kayu, bukan ID mentah",
      "Total penjualan dashboard & sales tidak sinkron — keduanya pakai raw_timber_orders sekarang",
      "Price security — server override harga di cart, client tidak bisa manipulasi harga",
    ],
  },
  {
    version: "0.0.3",
    date: "29 Mei 2026",
    added: [
      "Resize foto otomatis sebelum upload (max 1024px)",
      "Halaman Profil Supplier — edit profil + upload dokumen perizinan + peta interaktif",
      "Dokumen legalitas di form kayu baru dan edit",
      "Photo lightbox di halaman edit kayu",
      "Versi sidebar dinamis dari package.json",
      "Opsi bentuk kayu: Log, Square, Balok, Papan",
      "Opsi grade kayu: Perhutani, Hutan Rakyat, Lainnya",
    ],
    fixed: [
      "Error form submit kayu baru — sekarang pakai FormData",
      "Foto tidak muncul di semua role — pakai getFileUrl",
      "Cache tidak ter-invalidate setelah hapus data",
      "Dashboard Supplier tampilkan 'Jati' bukan ID mentah",
      "Validasi password 8 karakter",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-2">Changelog</h1>
          <p className="text-muted-foreground mt-1">
            Catatan perubahan WoodLoop — versi {version}
          </p>
        </div>
      </div>

      {changelog.map((entry) => (
        <Card key={entry.version}>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-semibold">
                v{entry.version}
              </h2>
              <span className="text-sm text-muted-foreground">
                {entry.date}
              </span>
            </div>

            {entry.added.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-primary mb-2">Ditambahkan</p>
                <ul className="space-y-1">
                  {entry.added.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.fixed.length > 0 && (
              <div>
                <p className="text-sm font-medium text-destructive mb-2">Diperbaiki</p>
                <ul className="space-y-1">
                  {entry.fixed.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

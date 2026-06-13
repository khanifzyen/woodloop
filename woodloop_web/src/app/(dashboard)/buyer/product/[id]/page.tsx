"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useProductDetail, useReviews, useIsInWishlist, useToggleWishlist, useCreateReview } from "@/lib/hooks/use-buyer";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ShoppingCart, TruckIcon, Leaf, Recycle, Heart, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import Image from "next/image";
import { getFileUrl } from "@/lib/pocketbase/client";

export default function ProductDetailPage() {
  const params = useParams();
  const { data: product, isLoading } = useProductDetail(params.id as string);
  const { data: reviewsData } = useReviews(params.id as string);
  const { data: isWishlisted } = useIsInWishlist(params.id as string);
  const toggleWishlist = useToggleWishlist();
  const cart = useCartStore();
  const { user } = useAuthStore();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const createReview = useCreateReview();

  const reviews = reviewsData?.items || [];

  // Inject JSON-LD after data loads
  useEffect(() => {
    if (!product) return;
    const remove: (() => void)[] = [];

    const productScript = document.createElement("script");
    productScript.type = "application/ld+json";
    productScript.id = "jsonld-product";
    productScript.textContent = JSON.stringify(buildProductJsonLd(product));
    document.head.appendChild(productScript);
    remove.push(() => document.getElementById("jsonld-product")?.remove());

    const breadScript = document.createElement("script");
    breadScript.type = "application/ld+json";
    breadScript.id = "jsonld-breadcrumb-product";
    breadScript.textContent = JSON.stringify(buildBreadcrumbJsonLd([
      { name: "Beranda", url: "/" },
      { name: "Marketplace", url: "/buyer/marketplace" },
      { name: product.name, url: `/buyer/product/${product.id}` },
    ]));
    document.head.appendChild(breadScript);
    remove.push(() => document.getElementById("jsonld-breadcrumb-product")?.remove());

    return () => remove.forEach((fn) => fn());
  }, [product]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /><Skeleton className="h-32 w-full" /></div>;
  if (!product) return <div className="py-12 text-center"><p className="text-muted-foreground">Produk tidak ditemukan</p></div>;

  const tx = product.expand?.source_transactions || [];
  const allPhotos = product.photos || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  async function handleToggleWishlist() {
    if (!product) return;
    try {
      const result = await toggleWishlist.mutateAsync(product.id);
      toast.success(result.added ? "Ditambahkan ke favorit" : "Dihapus dari favorit");
    } catch {
      toast.error("Gagal mengubah favorit");
    }
  }

  async function handleSubmitReview() {
    if (!product) return;
    try {
      await createReview.mutateAsync({
        productId: product.id,
        orderId: "",  // Will be populated from user's completed orders
        rating: parseInt(reviewRating),
        comment: reviewComment,
      });
      toast.success("Ulasan berhasil dikirim!");
      setReviewOpen(false);
      setReviewComment("");
    } catch {
      toast.error("Gagal mengirim ulasan");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/buyer/marketplace"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div className="flex-1">
          <h1 className="heading-2">{product.name}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{product.category}</Badge>
            {product.stock > 0 ? <Badge variant="default">Stok: {product.stock}</Badge> : <Badge variant="secondary">Habis</Badge>}
          </div>
        </div>
        {user?.role === "buyer" && (
          <Button variant="ghost" size="icon" onClick={handleToggleWishlist} disabled={toggleWishlist.isPending}>
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Photo Gallery Carousel */}
        <Card>
          <CardContent className="pt-6">
            {allPhotos.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {allPhotos.map((photo, idx) => (
                    <CarouselItem key={idx}>
                      <div className="aspect-[4/3] bg-muted rounded-lg relative flex items-center justify-center">
                        <Image
                          src={getFileUrl("products", product.id, photo)}
                          alt={`${product.name} ${idx + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {allPhotos.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-muted-foreground">Tidak ada foto</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info + Buy */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-3xl font-bold">Rp {product.price.toLocaleString("id-ID")}</p>
              {avgRating && (
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{avgRating} ({reviews.length} ulasan)</span>
                </div>
              )}
              {product.expand?.converter && (
                <p className="text-sm text-muted-foreground mt-1">
                  oleh <Link href={`/buyer/seller/${product.expand.converter.id}`} className="hover:underline text-primary">{product.expand.converter.name}</Link>
                </p>
              )}
            </div>

            {/* Converter info card */}
            {product.expand?.converter && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {product.expand.converter.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.expand.converter.name}</p>
                  <p className="text-xs text-muted-foreground">Converter</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/buyer/seller/${product.expand.converter.id}`}>Lihat Toko</Link>
                </Button>
              </div>
            )}

            <p className="text-sm">{product.description || "Tidak ada deskripsi"}</p>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={() => {
                cart.addItem({ id: product.id, name: product.name, price: product.price, photo: product.photos?.[0] ? getFileUrl("products", product.id, product.photos[0]) : undefined });
                toast.success("Ditambahkan ke keranjang!");
              }}>
                <ShoppingCart className="h-4 w-4" />+ Keranjang
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/buyer/checkout?product=${product.id}`}>Beli Langsung</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traceability Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" /> Perjalanan Produk
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tx.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Informasi traceability belum tersedia untuk produk ini.
            </p>
          ) : (
            <div className="space-y-4">
              {tx.map((t, i) => {
                const inv = t.expand?.inventory_item;
                const wood = inv?.expand?.wood_type;
                const seller = t.expand?.seller;
                const isFirst = i === 0;
                const isLast = i === tx.length - 1;
                return (
                  <div key={t.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isFirst ? "bg-green-500/20 text-green-600" : isLast ? "bg-primary/20 text-primary" : "bg-primary/20 text-primary"}`}>
                        {isFirst ? "🌱" : i + 1}
                      </div>
                      {i < tx.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm">
                        {isFirst ? "Bahan Baku" : isLast ? "Produk Jadi" : "Material"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wood?.name || inv?.form || "-"} dari {seller?.name || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {inv?.weight ? `${inv.weight} kg` : ""}
                        {t.expand?.inventory_item?.expand?.wood_type?.name ? " • " : ""}
                        {new Date(t.created).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" /> Dampak Lingkungan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <Recycle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-500">
                {tx.reduce((sum, t) => sum + (t.quantity || 0), 0)} kg
              </p>
              <p className="text-xs text-muted-foreground">Limbah Teralihkan</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <Leaf className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-500">
                {(tx.reduce((sum, t) => sum + (t.quantity || 0), 0) * 1.5).toFixed(1)} kg
              </p>
              <p className="text-xs text-muted-foreground">CO₂ Tersimpan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" /> Ulasan Pembeli
            {avgRating && <span className="text-sm font-normal text-muted-foreground">({avgRating} ★ • {reviews.length} ulasan)</span>}
          </CardTitle>
          {user?.role === "buyer" && (
            <Button variant="outline" size="sm" onClick={() => setReviewOpen(true)}>
              <MessageSquare className="h-4 w-4 mr-1" /> Beri Ulasan
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Belum ada ulasan untuk produk ini.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                      {review.expand?.buyer?.name?.charAt(0) || "?"}
                    </div>
                    <span className="text-sm font-medium">{review.expand?.buyer?.name || "Pembeli"}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(review.created).toLocaleDateString("id-ID")}</span>
                  </div>
                  {review.comment && <p className="text-sm text-muted-foreground ml-8">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Beri Ulasan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={reviewRating} onValueChange={setReviewRating}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} ★{n === 5 ? " — Sangat Baik" : n === 1 ? " — Buruk" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-comment">Komentar</Label>
              <Textarea id="review-comment" placeholder="Bagikan pengalamanmu dengan produk ini..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReviewOpen(false)}>Batal</Button>
            <Button onClick={handleSubmitReview} disabled={createReview.isPending}>
              {createReview.isPending ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useDesignRecipes } from "@/lib/hooks/use-converter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Palette } from "lucide-react";

export default function DesignRecipeDetailPage() {
  const params = useParams();
  const { data } = useDesignRecipes();
  const recipe = data?.items?.find((r) => r.id === params.id);

  if (!recipe) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/converter/design-clinic"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <div>
          <h1 className="heading-2">{recipe.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={recipe.difficulty === "easy" ? "outline" : recipe.difficulty === "medium" ? "secondary" : "default"}>
              {recipe.difficulty === "easy" ? "Mudah" : recipe.difficulty === "medium" ? "Sedang" : "Sulit"}
            </Badge>
            {recipe.expand?.author && (
              <span className="text-sm text-muted-foreground">oleh {recipe.expand.author.name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="h-56 bg-muted rounded-lg flex items-center justify-center">
        {recipe.photos?.[0] ? (
          <img src={recipe.photos[0]} alt={recipe.title} className="h-full w-full object-cover rounded-lg" />
        ) : (
          <Palette className="h-16 w-16 text-muted-foreground" />
        )}
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Deskripsi</h3>
            <p className="text-sm text-muted-foreground">{recipe.description || "Tidak ada deskripsi"}</p>
          </div>

          {recipe.expand?.suitable_wood_types?.length ? (
            <div>
              <h3 className="font-medium mb-2">Jenis Kayu yang Cocok</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.expand.suitable_wood_types.map((wt) => (
                  <Badge key={wt.id} variant="outline">{wt.name}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          {recipe.suitable_forms?.length ? (
            <div>
              <h3 className="font-medium mb-2">Bentuk Limbah yang Cocok</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.suitable_forms.map((f) => (
                  <Badge key={f} variant="secondary">{f}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          <Button asChild className="w-full gap-2 mt-4">
            <Link href="/converter/catalog/new">
              <Palette className="h-4 w-4" />Gunakan Resep Ini
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

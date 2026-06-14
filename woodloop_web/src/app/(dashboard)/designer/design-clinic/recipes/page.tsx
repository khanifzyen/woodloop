"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDesignRecipes } from "@/lib/hooks/use-converter";
import { getFileUrl } from "@/lib/pocketbase/client";
import Image from "next/image";
import type { DesignRecipe, WoodType } from "@/lib/pocketbase/types";

const difficultyLabels: Record<string, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

const difficultyColors: Record<string, string> = {
  easy: "text-green-600 bg-green-100",
  medium: "text-yellow-600 bg-yellow-100",
  hard: "text-red-600 bg-red-100",
};

export default function DesignRecipesPage() {
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const { data: recipesResult, isLoading } = useDesignRecipes({
    difficulty: difficulty || undefined,
    search: search || undefined,
  });
  const recipes = recipesResult?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/designer/design-clinic">Klinik Desain</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resep Desain</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/designer/design-clinic"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="heading-2">Resep Desain</h1>
          <p className="text-muted-foreground mt-1">
            Koleksi resep dan panduan desain sirkular untuk inspirasi
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari resep..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v === difficulty ? "" : v)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Semua Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Mudah</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="hard">Sulit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      ) : !recipes || recipes.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Belum ada resep desain tersedia.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => {
            const r = recipe as DesignRecipe & { expand?: { suitable_wood_types?: WoodType[]; author?: { id: string; name: string } } };
            return (
            <Card key={r.id} className="hover:border-primary/50 transition-colors group overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                {r.photos?.[0] ? (
                  <Image
                    src={getFileUrl("design_recipes", r.id, r.photos[0])}
                    alt={r.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${difficultyColors[r.difficulty] || ""}`}>
                    {difficultyLabels[r.difficulty] || r.difficulty}
                  </span>
                </div>
                <h3 className="font-medium">{r.title}</h3>
                {r.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                )}
                {r.expand?.suitable_wood_types && r.expand.suitable_wood_types.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {r.expand.suitable_wood_types.map((wt) => (
                      <Badge key={wt.id} variant="outline" className="text-xs">{wt.name}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

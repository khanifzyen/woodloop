"use client";

import { useState } from "react";
import Link from "next/link";
import { useDesignRecipes, useWoodTypes } from "@/lib/hooks/use-converter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card, CardContent,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, BookOpen } from "lucide-react";
import { getFileUrl } from "@/lib/pocketbase/client";

export default function DesignClinicPage() {
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useDesignRecipes({ difficulty: difficulty || undefined, search: search || undefined });
  const recipes = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Klinik Desain</h1>
        <p className="text-muted-foreground mt-1">Inspirasi dan resep desain produk dari limbah kayu</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari desain..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Semua Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Level</SelectItem>
            <SelectItem value="easy">Mudah</SelectItem>
            <SelectItem value="medium">Sedang</SelectItem>
            <SelectItem value="hard">Sulit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
        </div>
      ) : recipes.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Belum ada resep desain</p>
          <p className="text-sm text-muted-foreground mt-1">Resep akan muncul ketika tersedia</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <Link key={r.id} href={`/converter/design-clinic/${r.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full overflow-hidden">
                <div className="h-40 bg-muted flex items-center justify-center">
                  {r.photos?.[0] ? (
                    <img src={getFileUrl(r, r.photos[0])} alt={r.title} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{r.title}</p>
                    <Badge variant={r.difficulty === "easy" ? "outline" : r.difficulty === "medium" ? "secondary" : "default"}>
                      {r.difficulty}
                    </Badge>
                  </div>
                  {r.expand?.suitable_wood_types?.length ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.expand.suitable_wood_types.slice(0, 3).map((wt) => (
                        <Badge key={wt.id} variant="outline" className="text-xs">{wt.name}</Badge>
                      ))}
                      {r.expand.suitable_wood_types.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{r.expand.suitable_wood_types.length - 3}</span>
                      )}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

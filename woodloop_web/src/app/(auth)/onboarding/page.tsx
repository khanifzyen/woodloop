"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

const SLIDES = [
  {
    icon: "🏭",
    title: "Masalah",
    subtitle: "Penumpukan Limbah Kayu",
    description:
      "Setiap tahun, ribuan ton limbah kayu dari industri furnitur Jepara dibakar atau dibuang begitu saja. Ini merusak lingkungan dan menyia-nyiakan sumber daya berharga.",
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    icon: "🌳",
    title: "Solusi",
    subtitle: "WoodLoop Circular Hub",
    description:
      "WoodLoop menghubungkan semua pemangku kepentingan — dari pemasok kayu, pengrajin, pengepul, hingga konsumen akhir — dalam satu platform ekonomi sirkular.",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: "♻️",
    title: "Manfaat",
    subtitle: "Dampak Positif untuk Semua",
    description:
      "Limbah menjadi resource baru. Pengrajin dapat bahan murah. Lingkungan terbantu. Konsumen dapat produk ramah lingkungan dengan cerita unik di baliknya.",
    color: "from-blue-500/20 to-cyan-500/20",
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const slide = SLIDES[currentSlide];

  function completeOnboarding() {
    localStorage.setItem("woodloop_onboarding_done", "true");
    router.push("/role-selection");
  }

  function next() {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      completeOnboarding();
    }
  }

  function skip() {
    completeOnboarding();
  }

  function prev() {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Slide Content */}
        <div
          className={`p-8 text-center space-y-6 bg-gradient-to-b ${slide.color}`}
        >
          <div className="text-6xl animate-bounce">{slide.icon}</div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              {slide.title}
            </p>
            <h2 className="text-2xl font-heading font-bold">
              {slide.subtitle}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 py-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 pt-0">
          <Button variant="ghost" size="sm" onClick={skip}>
            <SkipForward className="mr-1 h-4 w-4" />
            Lewati
          </Button>

          <div className="flex gap-2">
            {currentSlide > 0 && (
              <Button variant="outline" size="sm" onClick={prev}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Kembali
              </Button>
            )}

            <Button size="sm" onClick={next}>
              {currentSlide < SLIDES.length - 1 ? (
                <>
                  Lanjut
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                "Mulai"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles, Sprout } from "lucide-react";

const SLIDES = [
  {
    icon: "🏭",
    title: "Masalah",
    subtitle: "Penumpukan Limbah Kayu",
    description:
      "Setiap tahun, ribuan ton limbah kayu dari industri furnitur Jepara dibakar atau dibuang begitu saja. Ini merusak lingkungan dan menyia-nyiakan sumber daya berharga.",
    color: "from-red-500 via-orange-500/80 to-amber-500",
    accent: "text-amber-600",
    bg: "from-rose-50 to-orange-50",
    decoration: "🏗️",
  },
  {
    icon: "🌳",
    title: "Solusi",
    subtitle: "WoodLoop Circular Hub",
    description:
      "WoodLoop menghubungkan semua pemangku kepentingan — dari pemasok kayu, pengrajin, pengepul, hingga konsumen akhir — dalam satu platform ekonomi sirkular.",
    color: "from-primary via-emerald-600 to-teal-600",
    accent: "text-primary",
    bg: "from-emerald-50 to-teal-50",
    decoration: "♻️",
  },
  {
    icon: "✨",
    title: "Manfaat",
    subtitle: "Dampak Positif untuk Semua",
    description:
      "Limbah menjadi resource baru. Pengrajin dapat bahan murah. Lingkungan terbantu. Konsumen dapat produk ramah lingkungan dengan cerita unik di baliknya.",
    color: "from-sky-500 via-blue-600 to-indigo-600",
    accent: "text-sky-600",
    bg: "from-sky-50 to-indigo-50",
    decoration: "🌱",
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
    <div className="space-y-6">
      {/* Top brand badge */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-xl">🌳</span>
        </div>
        <div>
          <h1 className="text-lg font-heading font-bold text-primary">
            WoodLoop
          </h1>
          <p className="text-[11px] text-muted-foreground">
            Jepara Circular Hub
          </p>
        </div>
      </div>

      {/* Hero Card */}
      <div
        key={currentSlide}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${slide.bg} p-8 sm:p-10 shadow-sm border border-border/40 animate-in fade-in slide-in-from-right-4 duration-500`}
      >
        {/* Decorative background pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Floating decoration */}
        <div
          aria-hidden
          className="absolute -right-4 -top-4 text-7xl opacity-10 select-none"
        >
          {slide.decoration}
        </div>
        <div
          aria-hidden
          className="absolute -left-6 bottom-4 text-6xl opacity-10 select-none rotate-12"
        >
          {slide.decoration}
        </div>

        {/* Slide content */}
        <div className="relative z-10 text-center space-y-5">
          {/* Icon with gradient ring */}
          <div className="relative mx-auto w-fit">
            <div
              className={`absolute inset-0 -m-2 rounded-full bg-gradient-to-br ${slide.color} opacity-20 blur-xl`}
            />
            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${slide.color} text-5xl shadow-xl ring-4 ring-background`}
            >
              {slide.icon}
            </div>
          </div>

          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${slide.accent}`}
            >
              <Sparkles className="h-3 w-3" />
              {slide.title}
            </div>
            <h2 className="text-2xl font-heading font-bold tracking-tight sm:text-3xl">
              {slide.subtitle}
            </h2>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === currentSlide
                ? `w-8 h-2 bg-gradient-to-r ${slide.color}`
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={skip}
          className="text-muted-foreground"
        >
          <ChevronRight className="mr-1 h-4 w-4" />
          Lewati
        </Button>

        <div className="flex gap-2">
          {currentSlide > 0 && (
            <Button variant="outline" size="sm" onClick={prev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="sm"
            onClick={next}
            className={`bg-gradient-to-r ${slide.color} text-white shadow-md font-semibold`}
          >
            {currentSlide < SLIDES.length - 1 ? (
              <>
                Lanjut
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                <Sprout className="mr-1 h-4 w-4" />
                Mulai
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step counter */}
      <p className="text-center text-[11px] text-muted-foreground">
        {currentSlide + 1} / {SLIDES.length}
      </p>
    </div>
  );
}

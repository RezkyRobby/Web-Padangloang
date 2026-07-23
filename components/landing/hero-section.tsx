"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const handleScroll = () => {
    const statsSection = document.getElementById("stats-section");
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D6A4F] via-[#1a4a3a] to-[#0d2b22]" />
      
      {/* Decorative overlay pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Dark overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-block rounded-full border border-white/20 bg-white/15 px-6 py-1.5 text-sm font-medium text-white/90 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.15)_inset]">
          Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang
        </div>
        
        <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
          Desa Padangloang
        </h1>
        
        <p className="mt-4 font-display text-xl text-white/80 sm:text-2xl md:text-3xl">
          &ldquo;Desa Maju, Mandiri, dan Sejahtera&rdquo;
        </p>
        
        <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-white/60 sm:text-lg">
          Selamat datang di portal resmi Desa Padangloang. Temukan informasi tentang potensi desa,
          wisata, UMKM, berita terbaru, dan layanan masyarakat.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={handleScroll}
            className="h-12 rounded-xs bg-white px-8 font-body text-sm font-semibold text-obsidian hover:bg-white/90"
          >
            Jelajahi Desa
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-xs border-white/30 bg-white/15 px-8 font-body text-sm font-semibold text-white backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.05),0_0_0_1px_rgba(255,255,255,0.15)_inset] hover:bg-white/25"
            asChild
          >
            <a href="/profil">Tentang Desa</a>
          </Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f9faf7] to-transparent dark:from-[#111411]" />
    </section>
  );
}
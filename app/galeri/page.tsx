"use client";

import { useState, useEffect, useCallback } from "react";
import { Images, Loader2 } from "lucide-react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import GalleryGrid from "@/components/galeri/gallery-grid";
import Lightbox from "@/components/galeri/lightbox";

interface GalleryItem {
  id: string;
  judul: string;
  gambar: string;
  kategori: string;
  createdAt: string;
}

const KATEGORI_TERSEDIA = [
  { value: "", label: "Semua" },
  { value: "Kegiatan", label: "Kegiatan" },
  { value: "Wisata", label: "Wisata" },
  { value: "Budaya", label: "Budaya" },
  { value: "Infrastruktur", label: "Infrastruktur" },
  { value: "Lainnya", label: "Lainnya" },
];

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kategori, setKategori] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fetchGaleri = useCallback(async (kategoriFilter: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = kategoriFilter
        ? `/api/galeri?kategori=${encodeURIComponent(kategoriFilter)}`
        : "/api/galeri";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat data galeri");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat galeri. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGaleri(kategori);
  }, [kategori, fetchGaleri]);

  const handleItemClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNavigate = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <div className="min-h-screen bg-linen dark:bg-[#111411]">
      <Navbar variant="public" />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-paper dark:bg-[#1a1a1a] pt-24 md:pt-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Images className="size-7 text-obsidian dark:text-white" />
              </div>
              <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
                Galeri Foto
              </h1>
              <p className="mt-4 font-body text-body-large leading-relaxed text-iron dark:text-white/70">
                Dokumentasi kegiatan dan potensi Desa Padangloang dalam bingkai foto.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
          {/* Filter Kategori */}
          <div className="mb-8 flex flex-wrap gap-2">
            {KATEGORI_TERSEDIA.map((k) => (
              <button
                key={k.value}
                onClick={() => setKategori(k.value)}
                className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                  kategori === k.value
                    ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                    : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-obsidian dark:text-white" />
                <p className="font-body text-body-medium text-iron">Memuat galeri...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Images className="h-8 w-8 text-iron" />
              </div>
              <p className="font-body text-body-large font-medium text-iron">
                {error}
              </p>
              <button
                onClick={() => fetchGaleri(kategori)}
                className="mt-4 rounded-xs border border-sage bg-paper px-6 py-2 font-body text-[13px] font-semibold text-obsidian transition-colors hover:bg-fog dark:border-[#414943] dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && !error && items.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Images className="h-8 w-8 text-iron" />
              </div>
              <p className="font-body text-body-large font-medium text-iron">
                Belum ada foto galeri
              </p>
              <p className="mt-1 font-body text-body-medium text-steel">
                {kategori
                  ? `Belum ada foto untuk kategori "${kategori}"`
                  : "Belum ada foto yang ditambahkan."}
              </p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <GalleryGrid items={items} onItemClick={handleItemClick} />
          )}
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      <Lightbox
        items={items}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        onNavigate={handleLightboxNavigate}
      />
    </div>
  );
}
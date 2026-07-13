"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";

// ── Dummy data galeri ─────────────────────────────────────────────────────────
// TODO: Ganti dengan data dari API `/api/galeri` setelah halaman galeri dibuat
const galleryItems = [
  {
    id: "1",
    judul: "Pemandangan Alam Desa Padangloang",
    kategori: "Wisata Alam",
    gambar: "https://picsum.photos/seed/padangloang-alam/800/600",
  },
  {
    id: "2",
    judul: "Kegiatan Gotong Royong Warga",
    kategori: "Kegiatan",
    gambar: "https://picsum.photos/seed/padangloang-gotong/800/600",
  },
  {
    id: "3",
    judul: "Produk UMKM Unggulan Desa",
    kategori: "UMKM",
    gambar: "https://picsum.photos/seed/padangloang-umkm/800/600",
  },
  {
    id: "4",
    judul: "Panen Raya Pertanian Desa",
    kategori: "Pertanian",
    gambar: "https://picsum.photos/seed/padangloang-panen/800/600",
  },
  {
    id: "5",
    judul: "Festival Budaya dan Kesenian",
    kategori: "Budaya",
    gambar: "https://picsum.photos/seed/padangloang-budaya/800/600",
  },
  {
    id: "6",
    judul: "Kegiatan Posyandu dan Kesehatan",
    kategori: "Kesehatan",
    gambar: "https://picsum.photos/seed/padangloang-posyandu/800/600",
  },
];

export function GallerySection() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
              <Camera className="h-3.5 w-3.5" />
              Galeri Desa
            </span>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Dokumentasi Kegiatan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Momen dan potret kegiatan masyarakat Desa Padangloang
            </p>
          </div>
          <Link
            href="/galeri"
            className="hidden text-sm font-semibold text-secondary hover:underline sm:inline"
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        {/* Grid Gallery */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <Link
              key={item.id}
              href="/galeri"
              className="group relative block overflow-hidden rounded-xl"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                <Image
                  src={item.gambar}
                  alt={item.judul}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 flex flex-col justify-end rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4">
                <span className="text-xs font-medium text-white/80">
                  {item.kategori}
                </span>
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  {item.judul}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "Lihat Semua" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/galeri"
            className="inline-block text-sm font-semibold text-secondary hover:underline"
          >
            Lihat Semua Galeri &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
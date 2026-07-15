import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { UMKMCard } from "@/components/cards/umkm-card";

export const metadata: Metadata = {
  title: "UMKM — Desa Padangloang",
  description: "Katalog produk UMKM Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang.",
};

type PageProps = {
  searchParams: Promise<{ kategori?: string; q?: string }>;
};

export default async function UMKMPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const kategoriParam = params.kategori?.trim() ?? "";
  const qParam = params.q?.trim() ?? "";

  // Ambil semua kategori unik untuk filter
  const allKategori = await prisma.uMKM.findMany({
    select: { kategori: true },
    distinct: ["kategori"],
    orderBy: { kategori: "asc" },
  });
  const kategoriList = allKategori.map((k) => k.kategori);

  // Build query filter
  const where: Record<string, unknown> = {};
  if (kategoriParam) where.kategori = kategoriParam;
  if (qParam) where.namaProduk = { contains: qParam, mode: "insensitive" };

  const umkmList = await prisma.uMKM.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar variant="public" />
      <main className="min-h-screen bg-linen dark:bg-[#121212]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#282834] via-[#1e1e28] to-[#282834] pt-24 md:pt-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Store className="size-7 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                UMKM Desa Padangloang
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Jelajahi produk-produk unggulan dari pelaku UMKM Desa Padangloang. Dari hasil pertanian, peternakan, hingga kuliner khas.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
          {/* Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <form method="GET" action="/umkm" className="relative w-full sm:max-w-xs">
              <input
                type="search"
                name="q"
                defaultValue={qParam}
                placeholder="Cari produk..."
                className="w-full rounded-xl border border-sage bg-paper px-4 py-2.5 pl-10 text-sm text-obsidian outline-none transition-colors placeholder:text-iron/60 focus:border-iron/30 dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-white/40"
              />
              <svg
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-iron/50 dark:text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {kategoriParam || qParam ? (
                <Link
                  href="/umkm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-iron/60 hover:text-obsidian dark:text-white/50 dark:hover:text-white"
                >
                  ✕
                </Link>
              ) : null}
            </form>

            {/* Kategori Filter */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/umkm"
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                  !kategoriParam
                    ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                    : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                }`}
              >
                Semua
              </Link>
              {kategoriList.map((k) => (
                <Link
                  key={k}
                  href={`/umkm?kategori=${encodeURIComponent(k)}`}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                    kategoriParam === k
                      ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                      : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                  }`}
                >
                  {k}
                </Link>
              ))}
            </div>
          </div>

          {/* Grid UMKM */}
          {umkmList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-paper p-6 shadow-xs ring-1 ring-sage dark:bg-[#2a2a2a] dark:ring-[#414943]">
                <Store className="size-10 text-iron/50" />
              </div>
              <h3 className="text-lg font-bold text-obsidian dark:text-white">Belum ada produk</h3>
              <p className="mt-1 text-sm text-iron dark:text-white/60">
                {qParam
                  ? `Tidak ditemukan produk dengan kata kunci "${qParam}"`
                  : "Belum ada produk UMKM yang ditambahkan."}
              </p>
              {qParam && (
                <Link href="/umkm" className="mt-4 text-sm font-semibold text-obsidian underline dark:text-white">
                  Reset pencarian
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {umkmList.map((umkm) => (
                <UMKMCard
                  key={umkm.id}
                  id={umkm.id}
                  namaProduk={umkm.namaProduk}
                  deskripsi={umkm.deskripsi}
                  harga={umkm.harga}
                  kategori={umkm.kategori}
                  kontak={umkm.kontak}
                  gambar={umkm.gambar}
                  pemilik={umkm.pemilik}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
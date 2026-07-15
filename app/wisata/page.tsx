import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { WisataCard } from "@/components/cards/wisata-card";

export const metadata: Metadata = {
  title: "Wisata — Desa Padangloang",
  description: "Destinasi wisata alam, kuliner, dan budaya Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang.",
};

type PageProps = {
  searchParams: Promise<{ kategori?: string; q?: string }>;
};

const KATEGORI_MAP: Record<string, string> = {
  WISATA_ALAM: "Wisata Alam",
  KULINER: "Kuliner",
  BUDAYA: "Budaya",
};

export default async function WisataPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const kategoriParam = params.kategori?.trim() ?? "";
  const qParam = params.q?.trim() ?? "";

  // Ambil semua kategori unik untuk filter
  const allKategori = await prisma.wisata.findMany({
    select: { kategori: true },
    distinct: ["kategori"],
    orderBy: { kategori: "asc" },
  });

  // Build query filter
  const where: Record<string, unknown> = {};
  if (kategoriParam) where.kategori = kategoriParam;
  if (qParam) where.nama = { contains: qParam, mode: "insensitive" };

  const wisataList = await prisma.wisata.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar variant="public" />
      <main className="min-h-screen bg-linen dark:bg-[#111411]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-paper dark:bg-[#1a1a1a] pt-24 md:pt-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <MapPin className="size-7 text-obsidian dark:text-white" />
              </div>
              <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
                Wisata Desa Padangloang
              </h1>
              <p className="mt-4 font-body text-body-large leading-relaxed text-iron dark:text-white/70">
                Jelajahi keindahan alam, kuliner khas, dan kekayaan budaya Desa Padangloang.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
          {/* Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <form method="GET" action="/wisata" className="relative w-full sm:max-w-xs">
              <input
                type="search"
                name="q"
                defaultValue={qParam}
                placeholder="Cari wisata..."
                className="w-full rounded-xs border border-mist bg-paper px-4 py-2.5 pl-10 text-sm font-body text-obsidian outline-none transition-colors placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-white/40"
              />
              <svg
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel/60 dark:text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {kategoriParam || qParam ? (
                <Link
                  href="/wisata"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-iron/60 hover:text-obsidian dark:text-white/50 dark:hover:text-white"
                >
                  ✕
                </Link>
              ) : null}
            </form>

            {/* Kategori Filter */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/wisata"
                className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                  !kategoriParam
                    ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                    : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                }`}
              >
                Semua
              </Link>
              {allKategori.map((k) => (
                <Link
                  key={k.kategori}
                  href={`/wisata?kategori=${encodeURIComponent(k.kategori)}`}
                  className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                    kategoriParam === k.kategori
                      ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                      : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                  }`}
                >
                  {KATEGORI_MAP[k.kategori] || k.kategori}
                </Link>
              ))}
            </div>
          </div>

          {/* Grid Wisata */}
          {wisataList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-paper p-6 shadow-xs ring-1 ring-sage dark:bg-[#2a2a2a] dark:ring-[#414943]">
                <MapPin className="size-10 text-iron/50" />
              </div>
              <h3 className="font-display text-headline-small font-bold text-obsidian dark:text-white">
                Belum ada wisata
              </h3>
              <p className="mt-1 font-body text-body-medium text-iron dark:text-white/60">
                {qParam
                  ? `Tidak ditemukan wisata dengan kata kunci "${qParam}"`
                  : "Belum ada destinasi wisata yang ditambahkan."}
              </p>
              {qParam && (
                <Link href="/wisata" className="mt-4 text-[13px] font-semibold text-obsidian underline dark:text-white">
                  Reset pencarian
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wisataList.map((wisata) => (
                <WisataCard
                  key={wisata.id}
                  id={wisata.id}
                  nama={wisata.nama}
                  deskripsi={wisata.deskripsi}
                  lokasi={wisata.lokasi}
                  kategori={wisata.kategori}
                  gambar={wisata.gambar}
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
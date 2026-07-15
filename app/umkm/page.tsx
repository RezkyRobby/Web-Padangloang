import type { Metadata } from "next";
import Link from "next/link";
import { Store, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { UMKMCard } from "@/components/cards/umkm-card";

export const metadata: Metadata = {
  title: "UMKM — Desa Padangloang",
  description:
    "Katalog produk UMKM Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang.",
};

type PageProps = {
  searchParams: Promise<{ kategori?: string; q?: string }>;
};

export default async function UMKMPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const kategoriParam = params.kategori?.trim() ?? "";
  const qParam = params.q?.trim() ?? "";

  // Ambil semua kategori unik untuk filter
  const allUmkm = await prisma.uMKM.findMany({
    select: { kategori: true },
    orderBy: { createdAt: "desc" },
  });
  const kategoriList = [...new Set(allUmkm.map((u) => u.kategori))].sort();

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
      <main className="min-h-screen bg-linen dark:bg-[#111411]">
        {/* ── Hero Editorial ── */}
        <section className="bg-paper border-b border-sage dark:bg-[#1a1a1a] dark:border-[#414943]">
          <div className="mx-auto max-w-7xl px-4 py-4xl md:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Store className="size-7 text-obsidian dark:text-white" />
              </div>
              <h1 className="font-display text-display-small font-medium text-obsidian dark:text-white">
                UMKM Desa Padangloang
              </h1>
              <div className="mx-auto mt-4 h-px w-16 bg-sage dark:bg-[#414943]" />
              <p className="mx-auto mt-4 max-w-2xl font-body text-body-large leading-relaxed text-iron dark:text-[#c2c8bd]">
                Jelajahi produk-produk unggulan dari pelaku UMKM Desa
                Padangloang. Dari hasil bumi, kerajinan tangan, hingga kuliner
                khas yang siap menemani keseharian Anda.
              </p>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="mx-auto max-w-7xl px-4 pb-4xl pt-xl md:px-8">
          {/* Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <form
              method="GET"
              action="/umkm"
              className="relative w-full sm:max-w-xs"
            >
              <input
                type="search"
                name="q"
                defaultValue={qParam}
                placeholder="Cari produk..."
                className="w-full rounded-xs border border-mist bg-paper h-12 px-4 pl-10 text-sm font-body text-obsidian outline-none transition-colors placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white dark:placeholder:text-white/40 dark:focus:border-white"
              />
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel dark:text-white/40" />
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
                className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                  !kategoriParam
                    ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                    : "bg-fog text-obsidian hover:bg-sage dark:bg-[#2e2e2e] dark:text-white dark:hover:bg-[#414943]"
                }`}
              >
                Semua
              </Link>
              {kategoriList.map((k) => (
                <Link
                  key={k}
                  href={`/umkm?kategori=${encodeURIComponent(k)}`}
                  className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                    kategoriParam === k
                      ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                      : "bg-fog text-obsidian hover:bg-sage dark:bg-[#2e2e2e] dark:text-white dark:hover:bg-[#414943]"
                  }`}
                >
                  {k}
                </Link>
              ))}
            </div>
          </div>

          {/* Grid UMKM */}
          {umkmList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4xl text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Store className="size-8 text-iron/60" />
              </div>
              <h3 className="font-display text-headline-small font-semibold text-obsidian dark:text-white">
                Belum ada produk
              </h3>
              <p className="mt-1 font-body text-body-medium text-iron dark:text-[#c2c8bd]">
                {qParam
                  ? `Tidak ditemukan produk dengan kata kunci "${qParam}"`
                  : "Belum ada produk UMKM yang ditambahkan."}
              </p>
              {qParam && (
                <Link
                  href="/umkm"
                  className="mt-4 font-body text-sm font-semibold text-obsidian underline underline-offset-2 dark:text-white"
                >
                  Reset pencarian
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
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
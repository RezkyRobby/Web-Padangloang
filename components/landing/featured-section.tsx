"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, MapPin, ChevronRight, Package, UtensilsCrossed, TreePine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type UMKMItem = {
  id: string;
  namaProduk: string;
  deskripsi: string;
  harga: string | null;
  kategori: string;
  kontak: string;
  gambar: string | null;
  pemilik: string;
};

type WisataItem = {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  kategori: "WISATA_ALAM" | "KULINER" | "BUDAYA";
  gambar: string | null;
};

const kategoriLabel: Record<string, string> = {
  WISATA_ALAM: "Wisata Alam",
  KULINER: "Kuliner",
  BUDAYA: "Budaya",
};

const kategoriIcon: Record<string, React.ElementType> = {
  WISATA_ALAM: TreePine,
  KULINER: UtensilsCrossed,
  BUDAYA: MapPin,
};

function SkeletonCard() {
  return (
    <div className="bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] shadow-paper-sm overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-ash/50" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-20 bg-ash/50" />
        <Skeleton className="h-5 w-full bg-ash/50" />
        <Skeleton className="h-4 w-3/4 bg-ash/50" />
      </div>
    </div>
  );
}

function UMKMEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Store className="h-12 w-12 text-steel mb-4" />
      <p className="font-body text-body-medium font-semibold text-iron">Belum ada data UMKM</p>
      <p className="font-body text-caption text-steel mt-1">Produk UMKM akan tampil di sini</p>
    </div>
  );
}

function WisataEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MapPin className="h-12 w-12 text-steel mb-4" />
      <p className="font-body text-body-medium font-semibold text-iron">Belum ada data wisata</p>
      <p className="font-body text-caption text-steel mt-1">Destinasi wisata akan tampil di sini</p>
    </div>
  );
}

function UMKMGrid({ items }: { items: UMKMItem[] }) {
  if (items.length === 0) return <UMKMEmpty />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/umkm/${item.id}`}
          className="group bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] shadow-paper-sm overflow-hidden transition-all duration-250 hover:shadow-paper-md hover:border-obsidian/20 dark:hover:border-white/20"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-fog dark:bg-[#2e2e2e]">
            {item.gambar ? (
              <Image
                src={item.gambar}
                alt={item.namaProduk}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-10 w-10 text-steel/50" />
              </div>
            )}
          </div>
          <div className="p-4">
            <span className="inline-block font-body text-label-medium text-hudson-blue dark:text-[#7fc8ff] bg-fog dark:bg-[#2e2e2e] px-2 py-0.5 rounded-[4px] mb-2">
              {item.kategori}
            </span>
            <h3 className="font-display text-headline-small text-obsidian dark:text-white line-clamp-2">
              {item.namaProduk}
            </h3>
            <p className="font-body text-body-small text-iron dark:text-[#c2c8bd] mt-1 line-clamp-2">
              {item.deskripsi}
            </p>
            {item.harga && (
              <p className="font-body text-body-medium font-semibold text-obsidian dark:text-white mt-2">
                {item.harga}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function WisataGrid({ items }: { items: WisataItem[] }) {
  if (items.length === 0) return <WisataEmpty />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = kategoriIcon[item.kategori] || MapPin;
        return (
          <Link
            key={item.id}
            href={`/wisata/${item.id}`}
            className="group bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] shadow-paper-sm overflow-hidden transition-all duration-250 hover:shadow-paper-md hover:border-obsidian/20 dark:hover:border-white/20"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-fog dark:bg-[#2e2e2e]">
              {item.gambar ? (
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Icon className="h-10 w-10 text-steel/50" />
                </div>
              )}
            </div>
            <div className="p-4">
              <span className="inline-flex items-center gap-1 font-body text-label-medium text-hudson-blue dark:text-[#7fc8ff] bg-fog dark:bg-[#2e2e2e] px-2 py-0.5 rounded-[4px] mb-2">
                <Icon className="h-3.5 w-3.5" />
                {kategoriLabel[item.kategori] || item.kategori}
              </span>
              <h3 className="font-display text-headline-small text-obsidian dark:text-white line-clamp-2">
                {item.nama}
              </h3>
              <p className="font-body text-body-small text-iron dark:text-[#c2c8bd] mt-1 line-clamp-2">
                {item.deskripsi}
              </p>
              <p className="font-body text-caption text-steel dark:text-[#8c9489] mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {item.lokasi}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function FeaturedSection() {
  const [umkm, setUmkm] = useState<UMKMItem[]>([]);
  const [wisata, setWisata] = useState<WisataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [umkmRes, wisataRes] = await Promise.all([
          fetch("/api/umkm?limit=6"),
          fetch("/api/wisata?limit=6"),
        ]);
        if (umkmRes.ok) {
          const data = await umkmRes.json();
          setUmkm(data);
        }
        if (wisataRes.ok) {
          const data = await wisataRes.json();
          setWisata(data);
        }
      } catch {
        // Fallback to empty state
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-linen dark:bg-[#111411] py-3xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 bg-ash/50" />
            <Skeleton className="h-4 w-64 mt-2 bg-ash/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="mt-12 mb-6">
            <Skeleton className="h-8 w-48 bg-ash/50" />
            <Skeleton className="h-4 w-64 mt-2 bg-ash/50" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`w-${i}`} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen dark:bg-[#111411] py-3xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* UMKM Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-display-small text-obsidian dark:text-white">
                UMKM <span className="text-hudson-blue dark:text-[#7fc8ff]">Unggulan</span>
              </h2>
              <p className="font-body text-body-medium text-iron dark:text-[#c2c8bd] mt-1">
                Produk unggulan dari masyarakat Desa Padangloang
              </p>
            </div>
            <Link
              href="/umkm"
              className="hidden sm:inline-flex items-center gap-1 font-body text-label-large text-hudson-blue dark:text-[#7fc8ff] hover:underline"
            >
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <UMKMGrid items={umkm} />

          <div className="mt-4 text-center sm:hidden">
            <Link
              href="/umkm"
              className="inline-flex items-center gap-1 font-body text-label-large text-hudson-blue dark:text-[#7fc8ff] hover:underline"
            >
              Lihat Semua UMKM
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Wisata Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-display-small text-obsidian dark:text-white">
                Wisata <span className="text-hudson-blue dark:text-[#7fc8ff]">Desa</span>
              </h2>
              <p className="font-body text-body-medium text-iron dark:text-[#c2c8bd] mt-1">
                Destinasi wisata alam, kuliner, dan budaya di Padangloang
              </p>
            </div>
            <Link
              href="/wisata"
              className="hidden sm:inline-flex items-center gap-1 font-body text-label-large text-hudson-blue dark:text-[#7fc8ff] hover:underline"
            >
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <WisataGrid items={wisata} />

          <div className="mt-4 text-center sm:hidden">
            <Link
              href="/wisata"
              className="inline-flex items-center gap-1 font-body text-label-large text-hudson-blue dark:text-[#7fc8ff] hover:underline"
            >
              Lihat Semua Wisata
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
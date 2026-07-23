"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, TreePine } from "lucide-react";

export type WisataCardProps = {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  kategori: string;
  gambar: string | null;
};

export function WisataCard({ id, nama, lokasi, kategori, gambar }: WisataCardProps) {
  const kategoriLabel = kategori === "WISATA_ALAM" ? "Wisata Alam" : kategori === "KULINER" ? "Kuliner" : "Budaya";

  return (
    <Link
      href={`/wisata/${id}`}
      className="group block overflow-hidden rounded-[12px] border border-sage bg-paper shadow-paper-sm transition hover:border-iron/30 dark:border-[#414943] dark:bg-[#1a1a1a] dark:hover:border-white/30"
    >
      {/* Gambar */}
      <div className="relative aspect-[4/3] overflow-hidden bg-fog dark:bg-[#2a2a2a]">
        {gambar ? (
          <Image
            src={gambar}
            alt={nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <TreePine className="size-12 text-steel/50" />
          </div>
        )}
        {/* Badge kategori */}
        <span className="absolute left-3 top-3 rounded-xs bg-white/70 px-3 py-1 text-[11px] font-semibold text-obsidian shadow-[0_0_12px_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.2)_inset] backdrop-blur-xl dark:bg-black/50 dark:text-white dark:shadow-[0_0_12px_rgba(0,0,0,0.2)]">
          {kategoriLabel}
        </span>
      </div>

      {/* Konten */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-body-large font-bold leading-snug text-obsidian transition-colors group-hover:text-obsidian/70 dark:text-white dark:group-hover:text-white/70">
          {nama}
        </h3>
        <div className="mt-2 flex items-start gap-1.5 text-[13px] text-iron dark:text-white/60">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">{lokasi}</span>
        </div>
      </div>
    </Link>
  );
}
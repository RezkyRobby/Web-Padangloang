"use client";

import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";

export type UMKMCardProps = {
  id: string;
  namaProduk: string;
  deskripsi: string;
  harga: string | null;
  kategori: string;
  kontak: string;
  gambar: string | null;
  pemilik: string;
};

export function UMKMCard({ id, namaProduk, harga, kategori, gambar, pemilik }: UMKMCardProps) {
  return (
    <Link
      href={`/umkm/${id}`}
      className="group block overflow-hidden rounded-xl border border-sage bg-paper transition hover:border-iron/30 dark:border-[#414943] dark:bg-[#1a1a1a] dark:hover:border-white/30"
    >
      {/* Gambar */}
      <div className="relative aspect-[4/3] overflow-hidden bg-fog dark:bg-[#2a2a2a]">
        {gambar ? (
          <Image
            src={gambar}
            alt={namaProduk}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Store className="size-12 text-steel/50" />
          </div>
        )}
        {/* Badge kategori */}
        <span className="absolute left-3 top-3 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-obsidian shadow-[0_0_12px_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.2)_inset] backdrop-blur-xl dark:bg-black/50 dark:text-white dark:shadow-[0_0_12px_rgba(0,0,0,0.2)]">
          {kategori}
        </span>
      </div>

      {/* Konten */}
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-body-large font-bold leading-snug text-obsidian transition-colors group-hover:text-obsidian/70 dark:text-white dark:group-hover:text-white/70">
          {namaProduk}
        </h3>
        {harga && (
          <p className="mt-1.5 font-display text-[13px] font-semibold text-hudson-blue dark:text-[#60a5fa]">
            {harga}
          </p>
        )}
        <p className="mt-2 text-[13px] text-iron dark:text-white/60">
          Oleh: {pemilik}
        </p>
      </div>
    </Link>
  );
}
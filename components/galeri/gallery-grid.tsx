"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface GalleryItem {
  id: string;
  judul: string;
  gambar: string;
  kategori: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  onItemClick: (index: number) => void;
}

export default function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
          <ImageIcon className="h-8 w-8 text-iron" />
        </div>
        <p className="font-body text-body-large font-medium text-iron">
          Belum ada foto galeri
        </p>
        <p className="mt-1 font-body text-body-medium text-steel">
          Belum ada foto untuk kategori ini
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemClick(index)}
          className="group relative aspect-square overflow-hidden rounded-[12px] border border-sage bg-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian dark:border-[#414943] dark:bg-[#2e2e2e]"
          aria-label={`Lihat ${item.judul}`}
        >
          {item.gambar ? (
            <Image
              src={item.gambar}
              alt={item.judul}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90 dark:brightness-[0.85] dark:group-hover:brightness-75"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-10 w-10 text-iron/50" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
            <div className="text-left text-white">
              <p className="truncate font-body text-body-medium font-semibold">
                {item.judul}
              </p>
              <p className="truncate font-body text-body-small text-white/70">
                {item.kategori}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
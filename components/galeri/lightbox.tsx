"use client";

import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  judul: string;
  gambar: string;
  kategori: string;
}

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const current = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl"
      onClick={onClose}
      role="dialog"
      aria-label="Lightbox galeri"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-colors hover:bg-white/25"
        aria-label="Tutup lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-colors hover:bg-white/25"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-colors hover:bg-white/25 md:flex"
          aria-label="Selanjutnya"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative mx-auto flex max-h-[85vh] w-full max-w-5xl flex-col items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex h-[70vh] w-full items-center justify-center">
          {current.gambar ? (
            <Image
              src={current.gambar}
              alt={current.judul}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="h-20 w-20 text-white/50" />
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-center text-white">
          <h3 className="font-display text-headline-small font-semibold">
            {current.judul}
          </h3>
          <p className="mt-1 font-body text-body-medium text-white/70">
            {current.kategori}
            <span className="mx-2">·</span>
            {currentIndex + 1} / {items.length}
          </p>
        </div>
      </div>

      {/* Mobile next button at bottom */}
      {currentIndex < items.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-colors hover:bg-white/25 md:hidden"
          aria-label="Selanjutnya"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
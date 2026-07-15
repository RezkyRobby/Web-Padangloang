import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, TreePine } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";

type PageProps = {
  params: Promise<{ id: string }>;
};

const KATEGORI_MAP: Record<string, string> = {
  WISATA_ALAM: "Wisata Alam",
  KULINER: "Kuliner",
  BUDAYA: "Budaya",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const wisata = await prisma.wisata.findUnique({ where: { id } });

  if (!wisata) return { title: "Wisata Tidak Ditemukan" };

  return {
    title: `${wisata.nama} — Wisata Desa Padangloang`,
    description: wisata.deskripsi.slice(0, 160),
  };
}

export default async function WisataDetailPage({ params }: PageProps) {
  const { id } = await params;
  const wisata = await prisma.wisata.findUnique({ where: { id } });

  if (!wisata) notFound();

  const kategoriLabel = KATEGORI_MAP[wisata.kategori] || wisata.kategori;

  return (
    <>
      <Navbar variant="public" />
      <main className="min-h-screen bg-linen dark:bg-[#111411]">
        {/* Back Button */}
        <div className="mx-auto max-w-6xl px-4 pt-6 md:px-8">
          <Link
            href="/wisata"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold font-body text-iron transition hover:text-obsidian dark:text-white/60 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Daftar Wisata
          </Link>
        </div>

        {/* Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-8 md:pt-10">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Gambar */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-fog dark:bg-[#2a2a2a]">
              {wisata.gambar ? (
                <Image
                  src={wisata.gambar}
                  alt={wisata.nama}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <TreePine className="size-20 text-steel/40" />
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="flex flex-col justify-center">
              {/* Kategori Badge */}
              <span className="mb-3 inline-flex w-fit rounded-xs bg-fog px-3.5 py-1.5 text-[12px] font-semibold font-body text-obsidian dark:bg-[#2e2e2e] dark:text-white">
                {kategoriLabel}
              </span>

              <h1 className="font-display text-headline-large font-bold text-obsidian dark:text-white">
                {wisata.nama}
              </h1>

              {/* Lokasi */}
              <div className="mt-4 flex items-start gap-2 font-body text-body-large text-iron dark:text-white/70">
                <MapPin className="mt-0.5 size-5 shrink-0 text-hudson-blue dark:text-[#60a5fa]" />
                <span>{wisata.lokasi}</span>
              </div>

              {/* Deskripsi */}
              <div className="mt-6">
                <h2 className="mb-3 font-display text-title-large font-bold text-obsidian dark:text-white">
                  Deskripsi
                </h2>
                <p className="font-body text-body-base leading-relaxed text-iron dark:text-white/70">
                  {wisata.deskripsi}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
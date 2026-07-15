import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Store, Phone, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const umkm = await prisma.uMKM.findUnique({ where: { id } });

  if (!umkm) return { title: "Produk Tidak Ditemukan" };

  return {
    title: `${umkm.namaProduk} — UMKM Desa Padangloang`,
    description: umkm.deskripsi.slice(0, 160),
  };
}

function formatWhatsApp(kontak: string): string {
  const digits = kontak.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export default async function UMKMDetailPage({ params }: PageProps) {
  const { id } = await params;
  const umkm = await prisma.uMKM.findUnique({ where: { id } });

  if (!umkm) notFound();

  const waNumber = formatWhatsApp(umkm.kontak);
  const waLink = `https://wa.me/${waNumber}?text=Halo%20saya%20tertarik%20dengan%20${encodeURIComponent(umkm.namaProduk)}`;

  return (
    <>
      <Navbar variant="public" />
      <main className="min-h-screen bg-linen dark:bg-[#121212]">
        {/* Back Button */}
        <div className="mx-auto max-w-6xl px-4 pt-6 md:px-8">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-iron transition hover:text-obsidian dark:text-white/60 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Katalog UMKM
          </Link>
        </div>

        {/* Content */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-8 md:pt-10">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Gambar */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-fog dark:bg-[#2a2a2a]">
              {umkm.gambar ? (
                <Image
                  src={umkm.gambar}
                  alt={umkm.namaProduk}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Store className="size-20 text-steel/40" />
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="flex flex-col justify-center">
              {/* Kategori Badge */}
              <span className="mb-3 inline-flex w-fit rounded-xs bg-paper px-3.5 py-1.5 text-[12px] font-semibold text-obsidian shadow-xs ring-1 ring-sage dark:bg-[#1a1a1a] dark:text-white dark:ring-[#414943]">
                {umkm.kategori}
              </span>

              <h1 className="font-display text-headline-large font-bold text-obsidian dark:text-white">
                {umkm.namaProduk}
              </h1>

              {umkm.harga && (
                <p className="mt-3 font-display text-headline-medium font-bold text-hudson-blue dark:text-[#60a5fa]">
                  {umkm.harga}
                </p>
              )}

              {/* Pemilik */}
              <div className="mt-5 flex items-center gap-2 text-body-medium text-iron dark:text-white/60">
                <User className="size-4" />
                <span className="font-semibold text-obsidian dark:text-white">{umkm.pemilik}</span>
              </div>

              {/* Deskripsi */}
              <div className="mt-5">
                <h2 className="mb-2 font-display text-body-large font-bold text-obsidian dark:text-white">
                  Deskripsi
                </h2>
                <p className="text-body-medium leading-relaxed text-iron dark:text-white/70">
                  {umkm.deskripsi}
                </p>
              </div>

              {/* Kontak */}
              <div className="mt-6">
                <h2 className="mb-3 font-display text-body-large font-bold text-obsidian dark:text-white">
                  Kontak
                </h2>
                <div className="flex items-center gap-2 text-body-medium text-iron dark:text-white/70">
                  <Phone className="size-4 shrink-0" />
                  <span>{umkm.kontak}</span>
                </div>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xs bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1da854]"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Hubungi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
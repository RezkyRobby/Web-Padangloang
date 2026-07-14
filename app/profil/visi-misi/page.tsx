"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import {
  Target,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react";

// ── Placeholder data (sementara, akan diganti dari API nanti) ──
const PLACEHOLDER_VISI =
  "Mewujudkan Desa Padangloang yang Maju, Mandiri, dan Sejahtera melalui Tata Kelola Pemerintahan yang Baik dan Pemberdayaan Masyarakat yang Berkelanjutan.";

const PLACEHOLDER_MISI: string[] = [
  "Meningkatkan tata kelola pemerintahan desa yang transparan, akuntabel, dan partisipatif",
  "Mengembangkan potensi ekonomi lokal melalui pemberdayaan UMKM, pertanian, dan pariwisata desa",
  "Meningkatkan kualitas infrastruktur desa yang merata dan berkelanjutan",
  "Memperkuat kehidupan sosial budaya dan nilai-nilai kearifan lokal",
  "Menjaga kelestarian lingkungan hidup dan mewujudkan desa yang bersih dan sehat",
];

interface DataDesa {
  visi: string;
  misi: string;
}

export default function VisiMisiPage() {
  const [data, setData] = useState<DataDesa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch("/api/desa");
      if (!res.ok) throw new Error("Gagal memuat data");
      const json = await res.json();
      setData(json);
    } catch {
      // Fallback ke placeholder jika API gagal (DB offline)
      setData({
        visi: PLACEHOLDER_VISI,
        misi: PLACEHOLDER_MISI.join("\n"),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const misiList: string[] = data
    ? data.misi
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* ─── HEADER ─── */}
          <section className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-obsidian dark:bg-white">
              <Target className="h-8 w-8 text-white dark:text-obsidian" />
            </div>
            <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white md:text-display-medium">
              Visi & Misi
            </h1>
            <p className="mt-3 font-body text-body-large text-iron dark:text-[#c2c8bd]">
              Desa Padangloang — Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang
            </p>
          </section>

          {/* ─── LOADING ─── */}
          {isLoading && (
            <div className="space-y-8">
              <div className="animate-pulse rounded-[12px] bg-ash/50 p-8 dark:bg-[#2e2e2e]">
                <div className="mb-4 h-6 w-48 rounded bg-iron/30" />
                <div className="h-20 w-full rounded bg-iron/20" />
              </div>
              <div className="animate-pulse rounded-[12px] bg-ash/50 p-8 dark:bg-[#2e2e2e]">
                <div className="mb-4 h-6 w-48 rounded bg-iron/30" />
                <div className="mb-3 h-4 w-full rounded bg-iron/20" />
                <div className="mb-3 h-4 w-5/6 rounded bg-iron/20" />
                <div className="mb-3 h-4 w-4/5 rounded bg-iron/20" />
                <div className="h-4 w-3/4 rounded bg-iron/20" />
              </div>
            </div>
          )}

          {/* ─── ERROR ─── */}
          {!isLoading && isError && (
            <section className="flex flex-col items-center justify-center rounded-[12px] border border-sage bg-paper p-12 text-center dark:border-[#414943] dark:bg-[#1a1a1a]">
              <AlertCircle className="mb-4 h-12 w-12 text-iron" />
              <h2 className="mb-2 font-display text-headline-small font-semibold text-obsidian dark:text-white">
                Terjadi Kesalahan
              </h2>
              <p className="mb-6 font-body text-body-medium text-iron">
                Gagal memuat data visi & misi. Silakan coba lagi.
              </p>
              <button
                onClick={fetchData}
                className="inline-flex h-10 items-center gap-2 rounded-xs bg-obsidian px-6 font-body text-sm font-semibold tracking-wide text-white transition-colors hover:bg-obsidian/90 dark:bg-white dark:text-obsidian dark:hover:bg-white/90"
              >
                <RefreshCw className="h-4 w-4" />
                Coba Lagi
              </button>
            </section>
          )}

          {/* ─── EMPTY ─── */}
          {!isLoading && !isError && data && misiList.length === 0 && (
            <section className="flex flex-col items-center justify-center rounded-[12px] border border-sage bg-paper p-12 text-center dark:border-[#414943] dark:bg-[#1a1a1a]">
              <FileText className="mb-4 h-12 w-12 text-iron" />
              <h2 className="mb-2 font-display text-headline-small font-semibold text-obsidian dark:text-white">
                Belum Ada Data
              </h2>
              <p className="font-body text-body-medium text-iron">
                Data visi & misi desa belum tersedia.
              </p>
            </section>
          )}

          {/* ─── VISI ─── */}
          {!isLoading && !isError && data && misiList.length > 0 && (
            <>
              <section>
                <div className="rounded-[12px] border border-sage bg-paper p-8 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a] md:p-12">
                  <div className="mb-6 flex items-center gap-3">
                    <Target className="h-6 w-6 text-obsidian dark:text-white" />
                    <h2 className="font-display text-headline-large font-semibold tracking-tight text-obsidian dark:text-white">
                      Visi
                    </h2>
                  </div>
                  <blockquote className="border-l-4 border-primary pl-6">
                    <p className="font-display text-title-large leading-relaxed text-obsidian dark:text-white md:text-headline-small">
                      &ldquo;{data.visi}&rdquo;
                    </p>
                  </blockquote>
                </div>
              </section>

              {/* ─── MISI ─── */}
              <section>
                <div className="rounded-[12px] border border-sage bg-paper p-8 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a] md:p-12">
                  <div className="mb-6 flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-obsidian dark:text-white" />
                    <h2 className="font-display text-headline-large font-semibold tracking-tight text-obsidian dark:text-white">
                      Misi
                    </h2>
                  </div>
                  <ol className="space-y-5">
                    {misiList.map((item, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-obsidian text-sm font-bold text-white dark:bg-white dark:text-obsidian">
                          {index + 1}
                        </span>
                        <p className="pt-1 font-body text-body-large leading-relaxed text-iron dark:text-[#c2c8bd]">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* ─── CTA ─── */}
              <section className="rounded-[12px] border border-sage bg-paper p-8 text-center shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a] md:p-12">
                <h2 className="mb-3 font-display text-headline-medium font-semibold tracking-tight text-obsidian dark:text-white">
                  Mari Bersama Membangun Desa
                </h2>
                <p className="mx-auto max-w-2xl font-body text-body-large leading-relaxed text-iron dark:text-[#c2c8bd]">
                  Visi dan misi ini menjadi pedoman kita bersama dalam
                  mewujudkan Desa Padangloang yang lebih baik. Partisipasi
                  dan dukungan seluruh elemen masyarakat sangat kami harapkan.
                </p>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
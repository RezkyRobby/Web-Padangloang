"use client";

import { Award, TrendingUp, Target, CheckCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";

/** Indeks Desa Membangun (IDM) data — representatif untuk Desa Padangloang */
const IDM_DATA = {
  status: "Maju",
  statusDeskripsi: "Desa Padangloang berada di status MAJU — menunjukkan ketahanan dan potensi berkembang yang berdesar.",
  totalSkor: 72,
  tahunPenilaian: 2026,
  dimensi: [
    {
      id: "iks",
      nama: "Indeks Ketahanan Sosial (IKS)",
      deskripsi: "Menilai ketahanan sosial desa termasuk kualitas pendidikan, modal sosial, kesehatan publik, dan pemukiman basan.",
      skor: 75,
      ikon: "people",
      indikator: [
        { label: "Kesehatan Publik", nilai: 78 },
        { label: "Pendidikan", nilai: 72 },
        { label: "Modal Sosial", nilai: 80 },
        { label: "Pemukiman Basan", nilai: 68 },
      ],
    },
    {
      id: "ike",
      nama: "Indeks Ketahanan Ekonomi (IKE)",
      deskripsi: "Menilai ketahanan ekonomi termasuk keragaman produksi UMKM, akses pusat perdagangan, dan akses keuangan desa.",
      skor: 70,
      ikon: "trending",
      indikator: [
        { label: "Keragaman Produksi UMKM", nilai: 74 },
        { label: "Akses Pusat Perdagangan", nilai: 65 },
        { label: "Akses Keuangan", nilai: 72 },
        { label: "Ekonomi Kreatif", nilai: 69 },
      ],
    },
    {
      id: "ikl",
      nama: "Indeks Ketahanan Lingkungan (IKL)",
      deskripsi: "Menilai ketahanan lingkungan desa termasuk kualitas lingkungan, bencana alam, dan keberlanjabilitas.",
      skor: 68,
      ikon: "target",
      indikator: [
        { label: "Kualitas Lingkungan", nilai: 70 },
        { label: "Bencana Alam", nilai: 65 },
        { label: "Keberlanjabilitas", nilai: 72 },
        { label: "Lingkungan Kesadaran", nilai: 64 },
      ],
    },
  ],
};

function IDMSkorBar({ skor, label }: { skor: number; label: string }) {
  const barColor =
    skor >= 75 ? "bg-[#2D6A4F]" : skor >= 60 ? "bg-hudson-blue" : "bg-[#F59E0B]";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-body text-body-small font-medium text-obsidian dark:text-white">
          {label}
        </span>
        <span className="font-body text-body-small font-semibold text-obsidian dark:text-white">
          {skor}/100
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-fog dark:bg-[#2e2e2e]">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${skor}%` }}
        />
      </div>
    </div>
  );
}

export default function IDMPage() {
  return (
    <div className="min-h-screen bg-linen dark:bg-[#111411]">
      <Navbar variant="public" />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-paper dark:bg-[#1a1a1a] pt-24 md:pt-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Award className="size-7 text-obsidian dark:text-white" />
              </div>
              <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
                Indeks Desa Membangun (IDM)
              </h1>
              <p className="mt-4 font-body text-body-large leading-relaxed text-iron dark:text-white/70">
                IDM menilai ketahanan dan kapasitas desa dalam tiga dimensi: Sosial, Ekonomi, dan Lingkungan — berdarakan pada Sustainable Desa Goals (SDGs).
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
          {/* Status Card */}
          <div className="mb-8 rounded-[16px] bg-paper border border-sage shadow-paper-md p-md dark:bg-[#1a1a1a] dark:border-[#414943]">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F]/10 dark:bg-[#2D6A4F]/20">
                <Award className="size-8 text-[#2D6A4F]" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-headline-small font-semibold text-obsidian dark:text-white">
                    Status Desa: {IDM_DATA.status}
                  </h2>
                  <span className="rounded-full bg-[#2D6A4F]/10 px-3 py-1 text-xs font-semibold text-[#2D6A4F] dark:bg-[#2D6A4F]/20">
                    {IDM_DATA.tahunPenilaian}
                  </span>
                </div>
                <p className="font-body text-body-medium text-iron">
                  {IDM_DATA.statusDeskripsi}
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <p className="font-display text-display-medium font-semibold text-[#2D6A4F]">
                  {IDM_DATA.totalSkor}
                </p>
                <p className="font-body text-body-small text-iron">Total Skor / 100</p>
              </div>
            </div>
          </div>

          {/* IDM Progress Overall */}
          <div className="mb-8">
            <IDMSkorBar skor={IDM_DATA.totalSkor} label="IDM Desa Padangloang Total" />
          </div>

          {/* Dimension Cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            {IDM_DATA.dimensi.map((dim) => {
              const averageSkor =
                Math.round(
                  dim.indikator.reduce((acc, ind) => acc + ind.nilai, 0) /
                    dim.indikator.length,
                );

              return (
                <div
                  key={dim.id}
                  className="rounded-[12px] bg-paper border border-sage shadow-paper-sm p-md dark:bg-[#1a1a1a] dark:border-[#414943]"
                >
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                        {dim.ikon === "trending" ? (
                          <TrendingUp className="size-5 text-obsidian dark:text-white" />
                        ) : dim.ikon === "target" ? (
                          <Target className="size-5 text-obsidian dark:text-white" />
                        ) : (
                          <Award className="size-5 text-obsidian dark:text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-title-large font-semibold text-obsidian dark:text-white">
                          {dim.nama}
                        </h3>
                        <p className="font-body text-body-small text-iron">
                          Skor {dim.skor}/100
                        </p>
                      </div>
                    </div>
                    <p className="font-body text-body-small text-iron leading-relaxed">
                      {dim.deskripsi}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-body text-body-small font-semibold text-obsidian dark:text-white">
                        {dim.nama}
                      </span>
                      <span className="font-body text-body-small font-semibold text-obsidian dark:text-white">
                        {dim.skor}/100
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-fog dark:bg-[#2e2e2e]">
                      <div
                        className="h-3 rounded-full bg-[#2D6A4F] transition-all duration-500"
                        style={{ width: `${dim.skor}%` }}
                      />
                    </div>
                  </div>

                  {/* Indikators */}
                  <div className="space-y-2.5">
                    {dim.indikator.map((ind) => (
                      <div key={ind.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="size-4 text-[#2D6A4F]" />
                          <span className="font-body text-body-small text-obsidian dark:text-white">
                            {ind.label}
                          </span>
                        </div>
                        <span className="font-body text-body-small font-medium text-iron">
                          {ind.nilai}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sustainable Desa Goals Reference */}
          <div className="mt-8 rounded-[12px] bg-paper border border-sage shadow-paper-sm p-md dark:bg-[#1a1a1a] dark:border-[#414943]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Target className="size-6 text-obsidian dark:text-white" />
              </div>
              <div>
                <h3 className="font-display text-title-large font-semibold text-obsidian dark:text-white">
                  Sustainable Desa Goals (SDGs)
                </h3>
                <p className="font-body text-body-medium text-iron">
                  IDM Desa Padangloang diukur ketahanan dan berkembang terhadap Sustainable Desa Goals: ketahanan sosial (IKS · SDG 3 & 4), ketahanan ekonomi (IKE · SDG 8 & 9), dan ketahanan lingkungan (IKL · SDG 13 & 15). Data untuk tahun {IDM_DATA.tahunPenilaian}.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
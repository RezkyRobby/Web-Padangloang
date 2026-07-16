"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, Loader2, Users, Sprout, Landmark, Rat, TrendingUp } from "lucide-react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";

interface InfografisItem {
  id: string;
  judul: string;
  tahun: number;
  dataJson: Record<string, number | string>;
  createdAt: string;
}

export default function InfografisPage() {
  const [items, setItems] = useState<InfografisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tahunFilter, setTahunFilter] = useState<number | null>(null);

  const fetchInfografis = useCallback(async (tahun: number | null) => {
    setLoading(true);
    setError(null);
    try {
      const url = tahun !== null ? `/api/infografis?tahun=${tahun}` : "/api/infografis";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat data infografis");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat data infografis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfografis(tahunFilter);
  }, [tahunFilter, fetchInfografis]);

  const tersediaTahun = Array.from(new Set(items.map((i) => i.tahun))).sort((a, b) => b - a);

  /** Render bar chart for Mata Pencaharian Penduduk */
  const renderPencaharianChart = (data: Record<string, number>) => {
    const maxValue = Math.max(...Object.values(data), 1);
    const entries = Object.entries(data);
    const colors = [
      "bg-[#2D6A4F]/80",
      "bg-hudson-blue/80",
      "bg-obsidian/60",
      "bg-iron/80",
      "bg-[#9ca3af]/60",
      "bg-sage/80",
    ];

    return (
      <div className="space-y-3">
        {entries.map(([key, value], idx) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-body text-body-small font-medium text-obsidian dark:text-white">
                {key}
              </span>
              <span className="font-body text-body-small text-iron">
                {value}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-fog dark:bg-[#2e2e2e]">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${colors[idx % colors.length]}`}
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  /** Render stat card for Demografi */
  const renderDemografiStats = (data: Record<string, number>) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.jumlahPenduduk !== undefined && (
        <div className="rounded-[12px] bg-paper border border-sage p-4 shadow-paper-sm dark:bg-[#1a1a1a] dark:border-[#414943]">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
            <Users className="size-5 text-obsidian dark:text-white" />
          </div>
          <p className="font-display text-title-large font-semibold text-obsidian dark:text-white">
            {data.jumlahPenduduk.toLocaleString()}
          </p>
          <p className="font-body text-body-small text-iron">Penduduk Total</p>
        </div>
      )}
      {data.jumlahKK !== undefined && (
        <div className="rounded-[12px] bg-paper border border-sage p-4 shadow-paper-sm dark:bg-[#1a1a1a] dark:border-[#414943]">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
            <Sprout className="size-5 text-obsidian dark:text-white" />
          </div>
          <p className="font-display text-title-large font-semibold text-obsidian dark:text-white">
            {data.jumlahKK}
          </p>
          <p className="font-body text-body-small text-iron">Kepala KK</p>
        </div>
      )}
      {data.jumlahDusun !== undefined && (
        <div className="rounded-[12px] bg-paper border border-sage p-4 shadow-paper-sm dark:bg-[#1a1a1a] dark:border-[#414943]">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
            <Landmark className="size-5 text-obsidian dark:text-white" />
          </div>
          <p className="font-display text-title-large font-semibold text-obsidian dark:text-white">
            {data.jumlahDusun}
          </p>
          <p className="font-body text-body-small text-iron">Dusun</p>
        </div>
      )}
      {data.luasWilayah !== undefined && (
        <div className="rounded-[12px] bg-paper border border-sage p-4 shadow-paper-sm dark:bg-[#1a1a1a] dark:border-[#414943]">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
            <Landmark className="size-5 text-obsidian dark:text-white" />
          </div>
          <p className="font-display text-title-large font-semibold text-obsidian dark:text-white">
            {data.luasWilayah} km²
          </p>
          <p className="font-body text-body-small text-iron">Luas Wilayah</p>
        </div>
      )}
      {data.presentaseLakiLaki !== undefined && data.presentasePerempuan !== undefined && (
        <div className="rounded-[12px] bg-paper border border-sage p-4 shadow-paper-sm dark:bg-[#1a1a1a] dark:border-[#414943]">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
            <Rat className="size-5 text-obsidian dark:text-white" />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-body text-body-small text-iron">Laki-Laki</span>
            <span className="font-body text-body-small text-obsidian dark:text-white">{data.presentaseLakiLaki}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-fog dark:bg-[#2e2e2e]">
            <div className="h-2 rounded-full bg-[#2D6A4F]" style={{ width: `${data.presentaseLakiLaki}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-body text-body-small text-iron">Perempuan</span>
            <span className="font-body text-body-small text-obsidian dark:text-white">{data.presentasePerempuan}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-fog dark:bg-[#2e2e2e]">
            <div className="h-2 rounded-full bg-hudson-blue" style={{ width: `${data.presentasePerempuan}%` }} />
          </div>
        </div>
      )}
    </div>
  );

  /** Render infografis card dynamically based on data keys */
  const renderInfografisCard = (item: InfografisItem) => {
    const data = item.dataJson as Record<string, number>;
    const hasDemografiKeys =
      data.jumlahPenduduk !== undefined ||
      data.jumlahKK !== undefined ||
      data.jumlahDusun !== undefined;

    const hasPencaharianKeys =
      data.petani !== undefined ||
      data.peternak !== undefined ||
      data.pedagang !== undefined;

    return (
      <div className="rounded-[12px] bg-paper border border-sage shadow-paper-sm p-md dark:bg-[#1a1a1a] dark:border-[#414943]">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="font-display text-headline-small font-semibold text-obsidian dark:text-white">
              {item.judul}
            </h2>
            <span className="rounded-full bg-fog px-3 py-1 text-xs font-semibold text-iron dark:bg-[#2e2e2e] dark:text-white/70">
              {item.tahun}
            </span>
          </div>
        </div>

        {hasDemografiKeys && renderDemografiStats(data)}
        {hasPencaharianKeys && (
          <div className="mt-4">
            <h3 className="mb-3 font-display text-title-medium font-semibold text-obsidian dark:text-white">
              Distribusi Profesi (%)
            </h3>
            {renderPencaharianChart(data)}
          </div>
        )}
      </div>
    );
  };

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
                <BarChart3 className="size-7 text-obsidian dark:text-white" />
              </div>
              <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
                Infografis Desa
              </h1>
              <p className="mt-4 font-body text-body-large leading-relaxed text-iron dark:text-white/70">
                Visualisasi data dan statistik Desa Padangloang — demografi, distribusi profesi, dan indikator berkembang.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-8">
          {/* Filter Tahun */}
          {tersediaTahun.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setTahunFilter(null)}
                className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                  tahunFilter === null
                    ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                    : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                }`}
              >
                Semua
              </button>
              {tersediaTahun.map((t) => (
                <button
                  key={t}
                  onClick={() => setTahunFilter(t)}
                  className={`rounded-xs px-4 py-1.5 text-[13px] font-semibold font-body transition-colors ${
                    tahunFilter === t
                      ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian"
                      : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-obsidian dark:text-white" />
                <p className="font-body text-body-medium text-iron">Memuat data infografis...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <BarChart3 className="h-8 w-8 text-iron" />
              </div>
              <p className="font-body text-body-large font-medium text-iron">{error}</p>
              <button
                onClick={() => fetchInfografis(tahunFilter)}
                className="mt-4 rounded-xs border border-sage bg-paper px-6 py-2 font-body text-[13px] font-semibold text-obsidian transition-colors hover:bg-fog dark:border-[#414943] dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && items.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <BarChart3 className="h-8 w-8 text-iron" />
              </div>
              <p className="font-body text-body-large font-medium text-iron">Belum ada data infografis</p>
              <p className="mt-1 font-body text-body-medium text-steel">
                {tahunFilter !== null
                  ? `Belum ada data untuk tahun ${tahunFilter}`
                  : "Belum ada infografis yang ditambahkan."}
              </p>
            </div>
          )}

          {/* Infografis Cards */}
          {!loading && !error && items.length > 0 && (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id}>{renderInfografisCard(item)}</div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
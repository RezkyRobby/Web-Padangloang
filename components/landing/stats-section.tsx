"use client";

import { useEffect, useState } from "react";
import { Map, Users, Home, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type DesaStats = {
  luasWilayah: number | null;
  jumlahPenduduk: number | null;
  jumlahKK: number | null;
  jumlahDusun: number | null;
};

const defaultStats: DesaStats = {
  luasWilayah: 2.75,
  jumlahPenduduk: 1599,
  jumlahKK: 561,
  jumlahDusun: 3,
};

const statCards = [
  {
    label: "Luas Wilayah",
    value: (stats: DesaStats) =>
      stats.luasWilayah !== null ? `${stats.luasWilayah} km²` : "-",
    icon: Map,
    description: "Total area desa",
  },
  {
    label: "Jumlah Penduduk",
    value: (stats: DesaStats) =>
      stats.jumlahPenduduk !== null
        ? stats.jumlahPenduduk.toLocaleString("id-ID")
        : "-",
    icon: Users,
    description: "Total jiwa",
  },
  {
    label: "Kepala Keluarga",
    value: (stats: DesaStats) =>
      stats.jumlahKK !== null ? `${stats.jumlahKK} KK` : "-",
    icon: Home,
    description: "Kartu Keluarga",
  },
  {
    label: "Jumlah Dusun",
    value: (stats: DesaStats) =>
      stats.jumlahDusun !== null ? `${stats.jumlahDusun} Dusun` : "-",
    icon: Building2,
    description: "Wilayah dusun",
  },
];

export function StatsSection() {
  const [stats, setStats] = useState<DesaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/desa");
        if (res.ok) {
          const data = await res.json();
          setStats({
            luasWilayah: data.luasWilayah ?? defaultStats.luasWilayah,
            jumlahPenduduk: data.jumlahPenduduk ?? defaultStats.jumlahPenduduk,
            jumlahKK: data.jumlahKK ?? defaultStats.jumlahKK,
            jumlahDusun: data.jumlahDusun ?? defaultStats.jumlahDusun,
          });
        } else {
          setStats(defaultStats);
        }
      } catch {
        setStats(defaultStats);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <section
      id="stats-section"
      className="relative -mt-20 z-20 mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] shadow-paper-sm p-6"
              >
                <Skeleton className="mb-4 h-12 w-12 rounded-lg bg-ash/50" />
                <Skeleton className="mb-2 h-8 w-24 bg-ash/50" />
                <Skeleton className="h-4 w-20 bg-ash/50" />
              </div>
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="group bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] shadow-paper-sm p-6 transition-all duration-250 hover:shadow-paper-md hover:border-obsidian/20 dark:hover:border-white/20"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fog dark:bg-[#2e2e2e]">
                    <Icon className="h-6 w-6 text-hudson-blue dark:text-[#7fc8ff]" />
                  </div>
                  <p className="font-display text-headline-large font-semibold text-obsidian dark:text-white">
                    {stats ? card.value(stats) : "-"}
                  </p>
                  <p className="mt-1 font-body text-body-small font-semibold text-iron">
                    {card.label}
                  </p>
                  <p className="font-body text-caption text-steel">
                    {card.description}
                  </p>
                </div>
              );
            })}
      </div>
    </section>
  );
}
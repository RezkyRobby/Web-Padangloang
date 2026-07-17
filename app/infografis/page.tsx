"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  AlertCircle,
  TrendingUp,
  PieChart,
  ChartNoAxesCombined,
  AreaChart,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { ChartType } from "@/lib/schemas/infografis";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── TYPES ──────────────────────────────────────────

interface InfografisItem {
  id: string;
  judul: string;
  tahun: number;
  dataJson: Record<string, number>;
  chartType: ChartType;
  createdAt: string;
  updatedAt: string;
}

// ─── CONSTANTS ──────────────────────────────────────

const CHART_COLORS = [
  "#282834",
  "#006496",
  "#2D6A4F",
  "#dee2de",
  "#6b7280",
  "#ba1a1a",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
] as const;

const CHART_TYPE_LABELS: Record<ChartType, string> = {
  BAR_CHART: "Diagram Batang",
  LINE_CHART: "Diagram Garis",
  PIE_CHART: "Diagram Bulat",
  DOUGHNUT_CHART: "Diagram Donat",
  AREA_CHART: "Diagram Area",
  STAT_CARDS: "Kartu Statistik",
};

const chartTypeIcons: Record<ChartType, React.ReactNode> = {
  BAR_CHART: <BarChart3 className="h-4 w-4" />,
  LINE_CHART: <TrendingUp className="h-4 w-4" />,
  PIE_CHART: <PieChart className="h-4 w-4" />,
  DOUGHNUT_CHART: <ChartNoAxesCombined className="h-4 w-4" />,
  AREA_CHART: <AreaChart className="h-4 w-4" />,
  STAT_CARDS: <LayoutGrid className="h-4 w-4" />,
};

// ─── CHART RENDERER ─────────────────────────────────

function ChartRenderer({
  data,
  chartType,
}: {
  data: Record<string, number>;
  chartType: ChartType;
}) {
  const chartData = Object.entries(data)
    .filter(([, v]) => typeof v === "number" && !isNaN(v))
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-iron dark:text-[#c2c8bd]">
        <BarChart3 className="h-12 w-12 mb-3 text-steel" />
        <p className="text-sm">Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }

  // Stat Cards
  if (chartType === "STAT_CARDS") {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {chartData.map((item, i) => (
          <div
            key={i}
            className="rounded-[12px] bg-linen dark:bg-[#2e2e2e] border border-sage dark:border-[#414943] p-4 text-center animate-in zoom-in-95 fade-in duration-300"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="font-display text-title-large font-bold text-obsidian dark:text-white">
              {item.value.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-iron dark:text-[#c2c8bd] mt-1 font-medium">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // All chart types
  return (
    <div className="h-[350px] w-full animate-in fade-in duration-500">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "BAR_CHART" ? (
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2de" strokeOpacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              interval={0}
              angle={chartData.length > 6 ? -30 : 0}
              textAnchor={chartData.length > 6 ? "end" : "middle"}
              height={chartData.length > 6 ? 80 : 40}
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #dee2de",
                backgroundColor: "#fff",
                fontSize: "13px",
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : chartType === "LINE_CHART" ? (
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2de" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #dee2de",
                backgroundColor: "#fff",
                fontSize: "13px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[1]}
              strokeWidth={3}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </LineChart>
        ) : chartType === "PIE_CHART" ? (
          <RePieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #dee2de",
                backgroundColor: "#fff",
                fontSize: "13px",
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-obsidian dark:text-white">{value}</span>
              )}
            />
          </RePieChart>
        ) : chartType === "DOUGHNUT_CHART" ? (
          <RePieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #dee2de",
                backgroundColor: "#fff",
                fontSize: "13px",
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-sm text-obsidian dark:text-white">{value}</span>
              )}
            />
          </RePieChart>
        ) : chartType === "AREA_CHART" ? (
          <ReAreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2de" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #dee2de",
                backgroundColor: "#fff",
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[1]}
              fill={CHART_COLORS[1]}
              fillOpacity={0.15}
              strokeWidth={2}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </ReAreaChart>
        ) : (
          <div className="flex items-center justify-center h-full text-iron">
            Chart tidak didukung
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────

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

  const tersediaTahun = Array.from(new Set(items.map((i) => i.tahun))).sort(
    (a, b) => b - a
  );

  return (
    <div className="min-h-screen bg-linen dark:bg-[#111411]">
      <Navbar variant="public" />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-paper dark:bg-[#1a1a1a] pt-24 md:pt-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
            <div className="mx-auto max-w-3xl text-center animate-in slide-in-from-bottom-6 fade-in duration-500">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <BarChart3 className="size-7 text-obsidian dark:text-white" />
              </div>
              <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
                Infografis Desa
              </h1>
              <p className="mt-4 font-body text-body-large leading-relaxed text-iron dark:text-white/70">
                Visualisasi data dan statistik Desa Padangloang — demografi, ekonomi,
                sosial, dan indikator pembangunan dalam bentuk chart interaktif.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-8">
          {/* Filter Tahun */}
          {tersediaTahun.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300">
              <span className="text-sm font-semibold text-iron dark:text-[#c2c8bd] mr-1 flex items-center gap-1">
                <ChevronDown className="h-4 w-4" />
                Tahun:
              </span>
              <button
                onClick={() => setTahunFilter(null)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold font-body transition-all duration-200 ${
                  tahunFilter === null
                    ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian shadow-sm"
                    : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a] border border-sage dark:border-[#414943]"
                }`}
              >
                Semua
              </button>
              {tersediaTahun.map((t) => (
                <button
                  key={t}
                  onClick={() => setTahunFilter(t)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-semibold font-body transition-all duration-200 ${
                    tahunFilter === t
                      ? "bg-obsidian text-paper dark:bg-white dark:text-obsidian shadow-sm"
                      : "bg-paper text-obsidian hover:bg-fog dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a] border border-sage dark:border-[#414943]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-[12px] bg-paper border border-sage dark:bg-[#1a1a1a] dark:border-[#414943] p-6 animate-pulse"
                >
                  <div className="h-5 w-48 bg-fog dark:bg-[#2e2e2e] rounded mb-4" />
                  <div className="h-[300px] bg-fog/50 dark:bg-[#2e2e2e]/50 rounded-[8px]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50 animate-in fade-in duration-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <AlertCircle className="h-8 w-8 text-iron" />
              </div>
              <p className="font-body text-body-large font-medium text-iron dark:text-[#c2c8bd]">
                {error}
              </p>
              <button
                onClick={() => fetchInfografis(tahunFilter)}
                className="mt-4 rounded-full border border-sage bg-paper px-6 py-2 font-body text-[13px] font-semibold text-obsidian transition-all hover:bg-fog hover:shadow-sm dark:border-[#414943] dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && items.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[12px] border border-dashed border-sage bg-fog/50 p-xl dark:border-[#414943] dark:bg-[#2e2e2e]/50 animate-in fade-in duration-500">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <BarChart3 className="h-8 w-8 text-iron" />
              </div>
              <p className="font-body text-body-large font-medium text-iron dark:text-[#c2c8bd]">
                Belum ada data infografis
              </p>
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
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-[12px] bg-paper border border-sage shadow-paper-sm dark:bg-[#1a1a1a] dark:border-[#414943] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-400"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Card Header */}
                  <div className="p-5 md:p-6 border-b border-sage/50 dark:border-[#414943]/50 bg-linen/30 dark:bg-[#111411]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-fog dark:bg-[#2e2e2e] rounded-[8px] p-2.5">
                          <span className="text-obsidian dark:text-white">
                            {chartTypeIcons[item.chartType]}
                          </span>
                        </div>
                        <div>
                          <h2 className="font-display text-headline-small font-semibold text-obsidian dark:text-white">
                            {item.judul}
                          </h2>
                          <p className="text-xs text-steel mt-0.5">
                            {CHART_TYPE_LABELS[item.chartType]} • {item.tahun}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-fog dark:bg-[#2e2e2e] px-3 py-1.5 text-xs font-semibold text-iron dark:text-[#c2c8bd]">
                        {Object.keys(item.dataJson).length} data point
                      </span>
                    </div>
                  </div>

                  {/* Chart Content */}
                  <div className="p-5 md:p-6">
                    <ChartRenderer
                      data={item.dataJson as Record<string, number>}
                      chartType={item.chartType}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
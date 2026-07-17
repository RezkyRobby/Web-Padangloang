"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ChartNoAxesCombined,
  AreaChart,
  LayoutGrid,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  X,
  GripVertical,
  Upload,
  FileJson,
  Sparkles,
  CheckCircle2,
  Eye,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CHART_TYPE_LABELS,
  type ChartType,
} from "@/lib/schemas/infografis";
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
} from "recharts";
import { cn } from "@/lib/utils";

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

interface KeyValueRow {
  id: string;
  label: string;
  value: number;
}

const CHART_COLORS = [
  "#282834",
  "#006496",
  "#2D6A4F",
  "#dee2de",
  "#6b7280",
  "#ba1a1a",
  "#f59e0b",
  "#8b5cf6",
] as const;

const chartTypeIcons: Record<ChartType, React.ReactNode> = {
  BAR_CHART: <BarChart3 className="h-5 w-5" />,
  LINE_CHART: <TrendingUp className="h-5 w-5" />,
  PIE_CHART: <PieChart className="h-5 w-5" />,
  DOUGHNUT_CHART: <ChartNoAxesCombined className="h-5 w-5" />,
  AREA_CHART: <AreaChart className="h-5 w-5" />,
  STAT_CARDS: <LayoutGrid className="h-5 w-5" />,
};

const chartTypeBadgeColors: Record<ChartType, string> = {
  BAR_CHART:
    "bg-[#cae6ff] text-[#004a73] dark:bg-[#004a73] dark:text-[#cae6ff]",
  LINE_CHART:
    "bg-[#e8f5e9] text-[#1b5e20] dark:bg-[#1b5e20] dark:text-[#e8f5e9]",
  PIE_CHART:
    "bg-[#fce4ec] text-[#880e4f] dark:bg-[#880e4f] dark:text-[#fce4ec]",
  DOUGHNUT_CHART:
    "bg-[#fff3e0] text-[#e65100] dark:bg-[#e65100] dark:text-[#fff3e0]",
  AREA_CHART:
    "bg-[#ede7f6] text-[#4527a0] dark:bg-[#4527a0] dark:text-[#ede7f6]",
  STAT_CARDS:
    "bg-[#f1f3f1] text-[#6b7280] dark:bg-[#2e2e2e] dark:text-[#c2c8bd]",
};

const chartTypeDescriptions: Record<ChartType, string> = {
  BAR_CHART: "Cocok untuk perbandingan data antar kategori",
  LINE_CHART: "Cocok untuk menampilkan tren dari waktu ke waktu",
  PIE_CHART: "Cocok untuk menampilkan proporsi atau persentase",
  DOUGHNUT_CHART: "Seperti pie chart dengan ruang tengah untuk info tambahan",
  AREA_CHART: "Cocok untuk volume atau akumulasi data",
  STAT_CARDS: "Tampilan kartu statistik sederhana tanpa grafik",
};

// ─── CHART PREVIEW ──────────────────────────────────

function ChartPreview({
  data,
  chartType,
}: {
  data: KeyValueRow[];
  chartType: ChartType;
}) {
  const chartData = data
    .filter((r) => r.label.trim() !== "")
    .map((r) => ({ name: r.label, value: r.value }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-iron">
        <BarChart3 className="h-10 w-10 mb-2 text-steel animate-bounce" />
        <p className="text-sm">Tambahkan data untuk melihat preview</p>
      </div>
    );
  }

  if (chartType === "STAT_CARDS") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {chartData.map((item, i) => (
          <div
            key={i}
            className="bg-fog dark:bg-[#2e2e2e] rounded-lg p-3 text-center border border-sage dark:border-[#414943] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="text-lg font-bold text-obsidian dark:text-white animate-in fade-in slide-in-from-top-2 duration-300">
              {item.value.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-iron dark:text-[#c2c8bd] mt-1">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full animate-in fade-in duration-500">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "BAR_CHART" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2de" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={CHART_COLORS[1]}
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        ) : chartType === "LINE_CHART" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2de" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[1]}
              strokeWidth={2}
              dot={{ r: 4 }}
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
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        ) : chartType === "DOUGHNUT_CHART" ? (
          <RePieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        ) : chartType === "AREA_CHART" ? (
          <ReAreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dee2de" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS[1]}
              fill={CHART_COLORS[1]}
              fillOpacity={0.2}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </ReAreaChart>
        ) : (
          <div className="flex items-center justify-center h-full text-iron">
            Preview tidak tersedia
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── CHART TYPE SELECTOR CARD ───────────────────────

function ChartTypeCard({
  type,
  selected,
  onClick,
}: {
  type: ChartType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
        "hover:shadow-md hover:-translate-y-1 active:scale-95",
        selected
          ? "border-hudson-blue bg-[#cae6ff]/30 dark:bg-[#004a73]/20 shadow-md"
          : "border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a] hover:border-hudson-blue/50"
      )}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 bg-hudson-blue text-white rounded-full p-0.5 animate-in zoom-in duration-200">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "p-2.5 rounded-lg transition-colors duration-300",
          selected
            ? "bg-hudson-blue text-white"
            : "bg-fog dark:bg-[#2e2e2e] text-obsidian dark:text-white"
        )}
      >
        {chartTypeIcons[type]}
      </div>
      <span className="text-xs font-semibold text-obsidian dark:text-white text-center">
        {CHART_TYPE_LABELS[type]}
      </span>
    </button>
  );
}

// ─── KEY-VALUE ROW ──────────────────────────────────

function KeyValueRowInput({
  row,
  onChange,
  onRemove,
  canDelete,
  index,
}: {
  row: KeyValueRow;
  onChange: (
    id: string,
    field: "label" | "value",
    val: string | number
  ) => void;
  onRemove: (id: string) => void;
  canDelete: boolean;
  index: number;
}) {
  return (
    <div
      className="flex items-center gap-3 animate-in slide-in-from-left-2 fade-in duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <GripVertical className="h-4 w-4 text-steel shrink-0" />
      <div className="flex-1">
        <Input
          placeholder="Label (misal: Petani)"
          value={row.label}
          onChange={(e) => onChange(row.id, "label", e.target.value)}
          className="h-10 rounded-lg border-mist dark:border-[#414943] focus:border-hudson-blue transition-colors duration-200"
        />
      </div>
      <div className="w-32">
        <Input
          type="number"
          placeholder="Nilai"
          value={row.value || ""}
          onChange={(e) =>
            onChange(
              row.id,
              "value",
              e.target.value === "" ? 0 : Number(e.target.value)
            )
          }
          className="h-10 rounded-lg border-mist dark:border-[#414943] focus:border-hudson-blue transition-colors duration-200"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(row.id)}
        disabled={!canDelete}
        className="h-10 w-10 rounded-full hover:bg-[#ffdad6] dark:hover:bg-[#93000a] text-iron hover:text-red-500 transition-all duration-200 shrink-0 group"
      >
        <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
      </Button>
    </div>
  );
}

// ─── CONFETTI PARTICLES ─────────────────────────────

const CONFETTI_COLORS = [
  "#006496",
  "#2D6A4F",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
];

function ConfettiParticle({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  // Use deterministic pseudo-random values based on index to avoid impure Math.random() during render
  const left = 20 + ((index * 17) % 60);
  const delay = ((index * 13) % 100) / 100 * 0.6;
  const size = 6 + ((index * 7) % 8);
  const rotation = ((index * 23) % 720);
  const duration = 1.5 + ((index * 11) % 150) / 100;

  return (
    <div
      className="fixed top-0 z-[100] pointer-events-none"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 0.6}px`,
        background: color,
        borderRadius: "2px",
        animation: `confetti-fall ${duration}s ease-out ${delay}s both`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

// ─── MAIN PAGE ──────────────────────────────────────

export default function DashboardInfografisPage() {
  // Data states
  const [items, setItems] = useState<InfografisItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTahun, setSelectedTahun] = useState<string>("all");
  const [availableTahuns, setAvailableTahuns] = useState<number[]>([]);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InfografisItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formJudul, setFormJudul] = useState("");
  const [formTahun, setFormTahun] = useState(new Date().getFullYear());
  const [formChartType, setFormChartType] = useState<ChartType>("BAR_CHART");
  const [formDataRows, setFormDataRows] = useState<KeyValueRow[]>([
    { id: crypto.randomUUID(), label: "", value: 0 },
  ]);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<InfografisItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);

  // File import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // ─── Fetch Data ───────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedTahun && selectedTahun !== "all") params.set("tahun", selectedTahun);

      const res = await fetch(`/api/infografis?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data");

      const data: InfografisItem[] = await res.json();
      setItems(data);

      const years = [...new Set(data.map((item) => item.tahun))].sort(
        (a, b) => b - a
      );
      setAvailableTahuns(years);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data infografis. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTahun]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Filter ───────────────────────────────────────
  const filteredItems = items.filter((item) =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Form Handlers ────────────────────────────────
  const openCreateModal = () => {
    setEditingItem(null);
    setFormJudul("");
    setFormTahun(new Date().getFullYear());
    setFormChartType("BAR_CHART");
    setFormDataRows([{ id: crypto.randomUUID(), label: "", value: 0 }]);
    setShowPreview(false);
    setIsFormOpen(true);
  };

  const openEditModal = (item: InfografisItem) => {
    setEditingItem(item);
    setFormJudul(item.judul);
    setFormTahun(item.tahun);
    setFormChartType(item.chartType);
    setFormDataRows(
      Object.entries(item.dataJson as Record<string, number>).map(
        ([label, value]) => ({
          id: crypto.randomUUID(),
          label,
          value,
        })
      )
    );
    setShowPreview(true);
    setIsFormOpen(true);
  };

  const addDataRow = () => {
    setFormDataRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: "", value: 0 },
    ]);
  };

  const updateDataRow = (
    id: string,
    field: "label" | "value",
    val: string | number
  ) => {
    setFormDataRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const removeDataRow = (id: string) => {
    if (formDataRows.length <= 1) return;
    setFormDataRows((prev) => prev.filter((row) => row.id !== id));
  };

  // ─── File Import ──────────────────────────────────
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        if (file.name.endsWith(".json")) {
          const json = JSON.parse(text);
          // Expect format: { "Label": value, ... }
          const rows: KeyValueRow[] = Object.entries(json).map(
            ([label, value]) => ({
              id: crypto.randomUUID(),
              label,
              value: Number(value) || 0,
            })
          );
          if (rows.length === 0) throw new Error("Data kosong");
          setFormDataRows(rows);
          toast.success(`${rows.length} data berhasil diimpor`, {
            description: `Dari file: ${file.name}`,
            duration: 3000,
          });
        } else if (file.name.endsWith(".csv")) {
          const lines = text.split("\n").filter((l) => l.trim());
          const rows: KeyValueRow[] = [];
          for (const line of lines) {
            const [label, valueStr] = line.split(",").map((s) => s.trim());
            if (label && valueStr) {
              rows.push({
                id: crypto.randomUUID(),
                label,
                value: Number(valueStr) || 0,
              });
            }
          }
          if (rows.length === 0) throw new Error("Data kosong");
          setFormDataRows(rows);
          toast.success(`${rows.length} data berhasil diimpor`, {
            description: `Dari file: ${file.name}`,
            duration: 3000,
          });
        }
      } catch {
        toast.error("Format file tidak valid", {
          description: "Gunakan JSON atau CSV dengan format yang benar",
          duration: 4000,
        });
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ─── Drag & Drop ──────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const fakeEvent = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileImport(fakeEvent);
  };

  // ─── Form Content Renderer ─────────────────────────
  const renderFormContent = () => (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
          {editingItem ? "Edit Infografis" : "Tambah Infografis Baru"}
        </DialogTitle>
        <DialogDescription className="text-body-medium text-iron dark:text-[#c2c8bd]">
          {editingItem
            ? "Ubah judul, tahun, jenis chart, dan data."
            : "Isi data yang akan divisualisasikan di halaman publik."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        {/* Judul + Tahun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-obsidian dark:text-white">
              Judul Infografis
            </label>
            <Input
              placeholder="Contoh: Mata Pencaharian Penduduk"
              value={formJudul}
              onChange={(e) => setFormJudul(e.target.value)}
              className="h-10 rounded-lg border-sage dark:border-[#414943] focus:border-hudson-blue transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-obsidian dark:text-white">
              Tahun
            </label>
            <Input
              type="number"
              placeholder={String(new Date().getFullYear())}
              value={formTahun || ""}
              onChange={(e) =>
                setFormTahun(
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              className="h-10 rounded-lg border-sage dark:border-[#414943] focus:border-hudson-blue transition-colors duration-200"
            />
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-obsidian dark:text-white">
            Jenis Chart
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(CHART_TYPE_LABELS) as ChartType[]).map((type) => (
              <ChartTypeCard
                key={type}
                type={type}
                selected={formChartType === type}
                onClick={() => setFormChartType(type)}
              />
            ))}
          </div>
          <p className="text-xs text-iron dark:text-[#c2c8bd] mt-1">
            {chartTypeDescriptions[formChartType]}
          </p>
        </div>

        {/* Data Rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-obsidian dark:text-white">
              Data Points
            </label>
            <div className="flex items-center gap-2">
              {/* File Import Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-3 rounded-lg border-dashed border-hudson-blue/50 text-hudson-blue hover:bg-[#cae6ff]/20 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDataRow}
                className="h-8 px-3 rounded-lg border-sage dark:border-[#414943] text-obsidian dark:text-white text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Tambah Baris
              </Button>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-4 transition-all duration-300",
              isDragging
                ? "border-hudson-blue bg-[#cae6ff]/20 scale-[1.02] shadow-md"
                : "border-sage dark:border-[#414943]"
            )}
          >
            {isDragging ? (
              <div className="flex flex-col items-center gap-2 py-8 animate-in zoom-in duration-200">
                <div className="bg-hudson-blue text-white rounded-full p-3 animate-bounce">
                  <FileJson className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-hudson-blue">
                  Lepaskan file JSON/CSV di sini
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {formDataRows.map((row, i) => (
                  <KeyValueRowInput
                    key={row.id}
                    row={row}
                    onChange={updateDataRow}
                    onRemove={removeDataRow}
                    canDelete={formDataRows.length > 1}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Toggle Preview */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full h-9 rounded-lg text-steel hover:text-hudson-blue hover:bg-[#cae6ff]/20 text-xs font-semibold transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Sembunyikan Preview" : "Lihat Preview Chart"}
          </Button>

          {/* Preview */}
          {showPreview && (
            <div className="border border-sage dark:border-[#414943] rounded-xl p-4 bg-fog dark:bg-[#2e2e2e] animate-in slide-in-from-top-2 fade-in duration-300">
              <p className="text-xs font-semibold text-steel mb-3">
                PREVIEW — {CHART_TYPE_LABELS[formChartType]}
              </p>
              <ChartPreview data={formDataRows} chartType={formChartType} />
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="mt-6 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFormOpen(false)}
          className="h-10 px-5 rounded-lg border-sage dark:border-[#414943] text-iron dark:text-[#c2c8bd] hover:bg-linen dark:hover:bg-[#2e2e2e] font-semibold text-sm transition-all duration-200"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-6 rounded-lg bg-obsidian text-white hover:bg-obsidian/90 font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : editingItem ? (
            "Simpan Perubahan"
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Tambah Infografis
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );

  // ─── Submit ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formJudul.trim().length < 3) {
      toast.error("Judul minimal 3 karakter", {
        duration: 3000,
        icon: "⚠️",
      });
      return;
    }

    const validRows = formDataRows.filter((row) => row.label.trim() !== "");
    if (validRows.length === 0) {
      toast.error("Minimal 1 data point harus diisi", {
        duration: 3000,
        icon: "⚠️",
      });
      return;
    }

    const dataJson: Record<string, number> = {};
    validRows.forEach((row) => {
      dataJson[row.label.trim()] = row.value;
    });

    setIsSubmitting(true);
    try {
      const url = editingItem
        ? `/api/infografis/${editingItem.id}`
        : "/api/infografis";
      const method = editingItem ? "PUT" : "POST";

      const body = {
        judul: formJudul.trim(),
        tahun: formTahun,
        dataJson,
        chartType: formChartType,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan data");
      }

      // Show celebration for new items
      if (!editingItem) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success("Infografis baru berhasil ditambahkan! 🎉", {
          description: `"${formJudul.trim()}" siap ditampilkan di halaman publik`,
          duration: 4000,
          icon: <Sparkles className="h-4 w-4 text-amber-500" />,
        });
      } else {
        toast.success("Infografis berhasil diperbarui", {
          description: `"${formJudul.trim()}" telah diperbarui`,
          duration: 3000,
        });
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan",
        {
          duration: 4000,
          icon: "❌",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/infografis/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      toast.success(`"${deleteTarget.judul}" berhasil dihapus`, {
        description: "Data infografis telah dihapus permanen",
        duration: 3000,
      });

      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus data", {
        duration: 4000,
        icon: "❌",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Render: Skeleton ─────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-xl"
          >
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    );
  }

  // ─── Render: Error ────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="bg-[#ffdad6] dark:bg-[#93000a] rounded-full p-6 mb-6 animate-in zoom-in duration-300">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="font-display text-headline-small text-obsidian dark:text-white mb-2">
          Gagal Memuat Data
        </h3>
        <p className="text-body-medium text-iron dark:text-[#c2c8bd] mb-6">
          {error}
        </p>
        <Button
          onClick={fetchData}
          variant="outline"
          className="border-sage dark:border-[#414943] text-obsidian dark:text-white hover:bg-linen dark:hover:bg-[#2e2e2e] h-10 px-6 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  // ─── Render: Empty ────────────────────────────────
  if (items.length === 0) {
    return (
      <>
        {showConfetti &&
          Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-headline-large text-obsidian dark:text-white">
              Kelola Infografis
            </h1>
            <p className="text-body-medium text-iron dark:text-[#c2c8bd] mt-1">
              Tambah, edit, dan atur visualisasi data statistik desa
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="bg-fog dark:bg-[#2e2e2e] rounded-full p-6 mb-6 animate-in zoom-in duration-300">
            <BarChart3 className="h-12 w-12 text-steel" />
          </div>
          <h3 className="font-display text-headline-small text-obsidian dark:text-white mb-2">
            Belum Ada Data Infografis
          </h3>
          <p className="text-body-medium text-iron dark:text-[#c2c8bd] mb-6 max-w-md text-center">
            Tambahkan data infografis untuk divisualisasikan di halaman
            publik. Pilih jenis chart yang sesuai dengan data Anda.
          </p>
          <Button
            onClick={openCreateModal}
            className="bg-obsidian text-white h-10 px-6 rounded-lg font-semibold text-sm hover:bg-obsidian/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Infografis
          </Button>
        </div>

        {/* Create Modal (for empty state) */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[720px] max-h-[92vh] overflow-y-auto rounded-2xl border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a]">
            {renderFormContent()}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ─── Render: Data List ────────────────────────────
  return (
    <>
      {showConfetti &&
        Array.from({ length: 30 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-headline-large text-obsidian dark:text-white">
              Kelola Infografis
            </h1>
            <p className="text-body-medium text-iron dark:text-[#c2c8bd] mt-1">
              Tambah, edit, dan atur visualisasi data statistik desa
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-obsidian text-white h-10 px-6 rounded-lg font-semibold text-sm hover:bg-obsidian/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Infografis
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel" />
            <Input
              placeholder="Cari infografis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-lg border-sage dark:border-[#414943] focus:border-hudson-blue transition-colors duration-200"
            />
          </div>
          <Select
            value={selectedTahun}
            onValueChange={setSelectedTahun}
          >
            <SelectTrigger className="w-full sm:w-44 h-10 rounded-lg border-sage dark:border-[#414943]">
              <SelectValue placeholder="Semua Tahun">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Semua Tahun
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-lg border-sage dark:border-[#414943]">
              <SelectItem value="all">Semua Tahun</SelectItem>
              {availableTahuns.map((tahun) => (
                <SelectItem key={tahun} value={String(tahun)}>
                  {tahun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filteredItems.length > 0 && (
            <p className="text-sm text-iron dark:text-[#c2c8bd] self-center">
              {filteredItems.length} dari {items.length} infografis
            </p>
          )}
        </div>

        {/* Items List */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
            <Search className="h-10 w-10 text-steel mb-3" />
            <p className="text-body-medium text-iron dark:text-[#c2c8bd]">
              Tidak ada infografis yang cocok
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-xl hover:shadow-md hover:border-hudson-blue/30 transition-all duration-300 group animate-in fade-in slide-in-from-top-2"
              >
                {/* Icon by chart type */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 p-2.5 rounded-lg bg-fog dark:bg-[#2e2e2e] text-hudson-blue group-hover:bg-[#cae6ff]/30 transition-colors duration-300">
                    {chartTypeIcons[item.chartType]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-obsidian dark:text-white truncate">
                      {item.judul}
                    </h3>
                    <p className="text-xs text-steel mt-0.5">
                      {item.tahun} ·{" "}
                      {Object.keys(item.dataJson as Record<string, number>).length}{" "}
                      data points
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 ml-10 sm:ml-0">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[11px] font-semibold px-2.5 py-0.5",
                      chartTypeBadgeColors[item.chartType]
                    )}
                  >
                    {CHART_TYPE_LABELS[item.chartType]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(item)}
                    className="h-9 w-9 rounded-full hover:bg-fog dark:hover:bg-[#2e2e2e] text-iron hover:text-hudson-blue transition-all duration-200 hover:scale-110 active:scale-90"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(item)}
                    className="h-9 w-9 rounded-full hover:bg-[#ffdad6] dark:hover:bg-[#93000a] text-iron hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[720px] max-h-[92vh] overflow-y-auto rounded-2xl border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a]">
            {renderFormContent()}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <AlertDialogContent className="rounded-2xl border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a]">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
                Hapus Infografis?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-body-medium text-iron dark:text-[#c2c8bd]">
                Data{" "}
                <span className="font-semibold text-obsidian dark:text-white">
                  &ldquo;{deleteTarget?.judul}&rdquo;
                </span>{" "}
                akan dihapus permanen dan tidak dapat dikembalikan. Halaman
                publik yang menampilkan infografis ini akan kehilangan data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel
                disabled={isDeleting}
                className="h-10 px-5 rounded-lg border-sage dark:border-[#414943] text-iron dark:text-[#c2c8bd] hover:bg-linen dark:hover:bg-[#2e2e2e] font-semibold text-sm transition-all duration-200"
              >
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={handleDelete}
                className="h-10 px-5 rounded-lg bg-[#ba1a1a] text-white hover:bg-[#93000a] font-semibold text-sm transition-all duration-200 active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Hapus Infografis"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

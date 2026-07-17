"use client";

import { useState, useEffect, useCallback } from "react";
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
  BAR_CHART: <BarChart3 className="h-4 w-4" />,
  LINE_CHART: <TrendingUp className="h-4 w-4" />,
  PIE_CHART: <PieChart className="h-4 w-4" />,
  DOUGHNUT_CHART: <ChartNoAxesCombined className="h-4 w-4" />,
  AREA_CHART: <AreaChart className="h-4 w-4" />,
  STAT_CARDS: <LayoutGrid className="h-4 w-4" />,
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
        <BarChart3 className="h-10 w-10 mb-2 text-steel" />
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
            className="bg-fog dark:bg-[#2e2e2e] rounded-[8px] p-3 text-center border border-sage dark:border-[#414943]"
          >
            <p className="text-lg font-bold text-obsidian dark:text-white">
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
    <div className="h-[250px] w-full">
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
              animationDuration={1000}
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
              animationDuration={1000}
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
              animationDuration={1000}
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
              animationDuration={1000}
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
              animationDuration={1000}
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
      className="flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-200"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <GripVertical className="h-4 w-4 text-steel shrink-0" />
      <div className="flex-1">
        <Input
          placeholder="Label (misal: Petani)"
          value={row.label}
          onChange={(e) => onChange(row.id, "label", e.target.value)}
          className="h-10 rounded-xs border-mist dark:border-[#414943]"
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
          className="h-10 rounded-xs border-mist dark:border-[#414943]"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(row.id)}
        disabled={!canDelete}
        className="h-10 w-10 rounded-full hover:bg-[#ffdad6] dark:hover:bg-[#93000a] text-iron hover:text-red-500 transition-colors duration-200 shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
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
  const [selectedTahun, setSelectedTahun] = useState<string>("");
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

  // ─── Fetch Data ───────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedTahun) params.set("tahun", selectedTahun);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formJudul.trim().length < 3) {
      toast.error("Judul minimal 3 karakter", { duration: 3000 });
      return;
    }

    const validRows = formDataRows.filter((row) => row.label.trim() !== "");
    if (validRows.length === 0) {
      toast.error("Minimal 1 data point harus diisi", { duration: 3000 });
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

      toast.success(
        editingItem
          ? "Infografis berhasil diperbarui"
          : "Infografis baru berhasil ditambahkan",
        { duration: 3000 }
      );

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan",
        { duration: 4000 }
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
        duration: 3000,
      });

      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus data", { duration: 4000 });
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
            className="flex items-center gap-4 p-4 bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px]"
          >
            <Skeleton className="h-12 w-12 rounded-[8px]" />
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
        <div className="bg-[#ffdad6] dark:bg-[#93000a] rounded-full p-6 mb-6">
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
          className="border-sage dark:border-[#414943] text-obsidian dark:text-white hover:bg-linen dark:hover:bg-[#2e2e2e] h-10 px-6 rounded-xs font-semibold text-sm"
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
          <div className="bg-fog dark:bg-[#2e2e2e] rounded-full p-6 mb-6">
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
            className="bg-obsidian text-white h-10 px-6 rounded-xs font-semibold text-sm hover:bg-obsidian/90 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Infografis
          </Button>
        </div>

        {/* Create Modal (for empty state) */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto rounded-[12px] border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a]">
            <DialogHeader>
              <DialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
                Tambah Infografis
              </DialogTitle>
              <DialogDescription className="text-body-medium text-iron dark:text-[#c2c8bd]">
                Tambahkan data statistik baru dengan memilih jenis chart yang
                sesuai
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Judul */}
              <div className="space-y-2">
              <label htmlFor="judul" className="text-sm font-semibold text-obsidian dark:text-white block">
                  Judul Infografis
                </label>
                <Input
                  id="judul"
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: Mata Pencaharian Penduduk"
                  className="h-10 rounded-xs border-mist dark:border-[#414943]"
                />
              </div>

              {/* Tahun + Chart Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="tahun" className="text-sm font-semibold text-obsidian dark:text-white block">
                    Tahun
                  </label>
                  <Input
                    id="tahun"
                    type="number"
                    value={formTahun}
                    onChange={(e) => setFormTahun(Number(e.target.value))}
                    className="h-10 rounded-xs border-mist dark:border-[#414943]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="chartType" className="text-sm font-semibold text-obsidian dark:text-white block">
                    Jenis Chart
                  </label>
                  <Select
                    value={formChartType}
                    onValueChange={(val) =>
                      setFormChartType(val as ChartType)
                    }
                  >
                    <SelectTrigger
                      id="chartType"
                      className="h-10 rounded-xs border-mist dark:border-[#414943]"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[8px] border-sage dark:border-[#414943]">
                      {(
                        Object.entries(CHART_TYPE_LABELS) as [
                          ChartType,
                          string,
                        ][]
                      ).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {chartTypeIcons[key]}
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Points */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-obsidian dark:text-white block">
                    Data Points
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addDataRow}
                    className="h-8 text-hudson-blue hover:text-hudson-blue/80 text-xs font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Tambah Baris
                  </Button>
                </div>
                <div className="space-y-2">
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
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-obsidian dark:text-white block">
                  Preview Chart
                </label>
                <div className="bg-fog dark:bg-[#2e2e2e] rounded-[12px] p-4 border border-sage dark:border-[#414943]">
                  <ChartPreview data={formDataRows} chartType={formChartType} />
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="border-sage dark:border-[#414943] text-obsidian dark:text-white rounded-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-obsidian text-white rounded-xs hover:bg-obsidian/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Infografis"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ─── Render: Data List ────────────────────────────
  return (
    <>
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
            className="bg-obsidian text-white h-10 px-6 rounded-xs font-semibold text-sm hover:bg-obsidian/90 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Infografis
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-steel" />
            <Input
              placeholder="Cari berdasarkan judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xs border-mist dark:border-[#414943] bg-paper dark:bg-[#1a1a1a] text-sm"
            />
          </div>
          <Select
            value={selectedTahun}
            onValueChange={(val) =>
              setSelectedTahun(val === "all" ? "" : val)
            }
          >
            <SelectTrigger className="w-[160px] h-10 rounded-xs border-mist dark:border-[#414943] bg-paper dark:bg-[#1a1a1a] text-sm">
              <SelectValue placeholder="Semua Tahun" />
            </SelectTrigger>
            <SelectContent className="rounded-[8px] border-sage dark:border-[#414943]">
              <SelectItem value="all">Semua Tahun</SelectItem>
              {availableTahuns.map((tahun) => (
                <SelectItem key={tahun} value={String(tahun)}>
                  {tahun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {items.length > 0 && (
            <p className="text-xs text-steel ml-auto">
              {filteredItems.length} dari {items.length} data
            </p>
          )}
        </div>

        {/* No Search Results */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
            <Search className="h-10 w-10 text-steel mb-4" />
            <p className="text-body-medium text-iron dark:text-[#c2c8bd]">
              Tidak ada hasil untuk pencarian ini
            </p>
          </div>
        ) : (
          /* Data Items */
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] shadow-sm hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Icon + Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-fog dark:bg-[#2e2e2e] rounded-[8px] p-3 shrink-0">
                    <span className="text-obsidian dark:text-white">
                      {chartTypeIcons[item.chartType]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-obsidian dark:text-white truncate">
                      {item.judul}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${chartTypeBadgeColors[item.chartType]}`}
                      >
                        {CHART_TYPE_LABELS[item.chartType]}
                      </Badge>
                      <span className="text-xs text-iron dark:text-[#c2c8bd]">
                        {item.tahun}
                      </span>
                      <span className="text-xs text-steel">
                        {Object.keys(item.dataJson as Record<string, unknown>).length} data point
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(item)}
                    className="h-9 w-9 rounded-full hover:bg-[#cae6ff] dark:hover:bg-[#004a73] text-hudson-blue transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(item)}
                    className="h-9 w-9 rounded-full hover:bg-[#ffdad6] dark:hover:bg-[#93000a] text-iron hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto rounded-[12px] border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a]">
          <DialogHeader>
            <DialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
              {editingItem ? "Edit Infografis" : "Tambah Infografis"}
            </DialogTitle>
            <DialogDescription className="text-body-medium text-iron dark:text-[#c2c8bd]">
              {editingItem
                ? "Ubah data statistik dan jenis chart"
                : "Tambahkan data statistik baru dengan memilih jenis chart yang sesuai"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Judul */}
            <div className="space-y-2">
              <label htmlFor="judul" className="text-sm font-semibold text-obsidian dark:text-white block">
                Judul Infografis
              </label>
              <Input
                id="judul"
                value={formJudul}
                onChange={(e) => setFormJudul(e.target.value)}
                placeholder="Contoh: Mata Pencaharian Penduduk"
                className="h-10 rounded-xs border-mist dark:border-[#414943]"
              />
            </div>

            {/* Tahun + Chart Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tahun" className="text-sm font-semibold text-obsidian dark:text-white block">
                  Tahun
                </label>
                <Input
                  id="tahun"
                  type="number"
                  value={formTahun}
                  onChange={(e) => setFormTahun(Number(e.target.value))}
                  className="h-10 rounded-xs border-mist dark:border-[#414943]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="chartType" className="text-sm font-semibold text-obsidian dark:text-white block">
                  Jenis Chart
                </label>
                <Select
                  value={formChartType}
                  onValueChange={(val) =>
                    setFormChartType(val as ChartType)
                  }
                >
                  <SelectTrigger
                    id="chartType"
                    className="h-10 rounded-xs border-mist dark:border-[#414943]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[8px] border-sage dark:border-[#414943]">
                    {(
                      Object.entries(CHART_TYPE_LABELS) as [
                        ChartType,
                        string,
                      ][]
                    ).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          {chartTypeIcons[key]}
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data Points */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-obsidian dark:text-white">
                  Data Points
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addDataRow}
                  className="h-8 text-hudson-blue hover:text-hudson-blue/80 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Tambah Baris
                </Button>
              </div>
              <div className="space-y-2">
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
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-obsidian dark:text-white block">
                Preview Chart
              </label>
              <div className="bg-fog dark:bg-[#2e2e2e] rounded-[12px] p-4 border border-sage dark:border-[#414943]">
                <ChartPreview data={formDataRows} chartType={formChartType} />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="border-sage dark:border-[#414943] text-obsidian dark:text-white rounded-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-obsidian text-white rounded-xs hover:bg-obsidian/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : editingItem ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Infografis"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-[12px] border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
              Hapus Infografis?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-body-medium text-iron dark:text-[#c2c8bd]">
              Anda akan menghapus{" "}
              <span className="font-semibold text-obsidian dark:text-white">
                &ldquo;{deleteTarget?.judul}&rdquo;
              </span>
              . Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-sage dark:border-[#414943] text-obsidian dark:text-white rounded-xs"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white rounded-xs hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  X,
  Ticket,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Ban,
  PauseCircle,
  ArrowUpCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Layanan {
  id: string;
  nama: string;
  icon: string | null;
}

interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
}

interface PermohonanData {
  id: string;
  nomorTiket: string;
  status: string;
  jenisAjuan: string;
  createdAt: string;
  layanan: Layanan | null;
  user: UserInfo;
  _count: {
    progress: number;
  };
}

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "MENUNGGU", label: "Menunggu" },
  { value: "DIPROSES", label: "Diproses" },
  { value: "SELESAI", label: "Selesai" },
  { value: "DITOLAK", label: "Ditolak" },
  { value: "DITANGGUHKAN", label: "Ditangguhkan" },
  { value: "DIBATALKAN", label: "Dibatalkan" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  MENUNGGU:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  DIPROSES:
    "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  SELESAI:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  DITOLAK:
    "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30",
  DITANGGUHKAN:
    "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
  DIBATALKAN:
    "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border-gray-200 dark:border-gray-500/30",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  MENUNGGU: <Clock className="size-3.5" />,
  DIPROSES: <Loader2 className="size-3.5 animate-spin" />,
  SELESAI: <CheckCircle2 className="size-3.5" />,
  DITOLAK: <AlertCircle className="size-3.5" />,
  DITANGGUHKAN: <PauseCircle className="size-3.5" />,
  DIBATALKAN: <Ban className="size-3.5" />,
};

const JENIS_STYLES: Record<string, string> = {
  ONLINE:
    "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-400 border-violet-200 dark:border-violet-500/30",
  OFFLINE:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30",
};

const PAGE_SIZE = 10;

// ── Skeleton Loader ────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={8} className="p-0">
        <div className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex size-20 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-5">
        {hasFilter ? (
          <Search className="size-8 text-steel dark:text-[#8c9489]" />
        ) : (
          <Ticket className="size-8 text-steel dark:text-[#8c9489]" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {hasFilter
          ? "Tidak ada permohonan ditemukan"
          : "Belum ada permohonan"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {hasFilter
          ? "Coba ubah kata kunci pencarian atau hapus filter yang aktif."
          : "Belum ada warga yang mengajukan permohonan layanan."}
      </p>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 animate-in fade-in duration-500">
      <Button
        variant="outline"
        size="icon"
        className="size-9 border-sage dark:border-[#414943]"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-steel select-none">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="icon"
            className={`size-9 text-sm font-medium ${
              p === page
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "border-sage dark:border-[#414943]"
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="icon"
        className="size-9 border-sage dark:border-[#414943]"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const label =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-[11px] font-semibold border ${
        STATUS_STYLES[status] ?? ""
      }`}
    >
      {STATUS_ICONS[status] ?? null}
      {label}
    </Badge>
  );
}

function JenisAjuanBadge({ jenis }: { jenis: string }) {
  const label = jenis === "ONLINE" ? "Online" : "Offline";
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-semibold border px-2 py-0.5 ${
        JENIS_STYLES[jenis] ?? ""
      }`}
    >
      {label}
    </Badge>
  );
}

// ── Format Helpers ─────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function formatDateTime(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PermohonanPage() {
  const router = useRouter();
  const [data, setData] = useState<PermohonanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [layananFilter, setLayananFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const hasFilter =
    !!debouncedSearch ||
    !!statusFilter ||
    !!layananFilter ||
    !!fromDate ||
    !!toDate;

  // Fetch layanan list for filter
  useEffect(() => {
    fetch("/api/layanan")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Layanan[]) => setLayananList(data))
      .catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, layananFilter, fromDate, toDate]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      if (layananFilter) params.set("layananId", layananFilter);
      if (fromDate) params.set("from", fromDate);
      if (toDate) params.set("to", toDate);

      const res = await fetch(`/api/permohonan?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data");

      const allData: PermohonanData[] = await res.json();
      setTotalPages(Math.ceil(allData.length / PAGE_SIZE) || 1);
      const start = (page - 1) * PAGE_SIZE;
      setData(allData.slice(start, start + PAGE_SIZE));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data permohonan");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, layananFilter, fromDate, toDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setLayananFilter("");
    setFromDate("");
    setToDate("");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-display">
            Daftar Permohonan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Memuat data..."
              : `${data.length} permohonan ditampilkan`}
          </p>
        </div>
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
      <Card className="border-sage dark:border-[#414943]">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel dark:text-[#8c9489]" />
              <Input
                placeholder="Cari nomor tiket atau nama pemohon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-sage dark:border-[#414943] bg-background"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-foreground transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <Select
              value={statusFilter || "all"}
              onValueChange={(v) =>
                setStatusFilter(v === "all" ? "" : v)
              }
            >
              <SelectTrigger className="w-full border-sage dark:border-[#414943] sm:w-40">
                <Filter className="mr-2 size-3.5 text-steel" />
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || "all"} value={opt.value || "all"}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={layananFilter || "all"}
              onValueChange={(v) =>
                setLayananFilter(v === "all" ? "" : v)
              }
            >
              <SelectTrigger className="w-full border-sage dark:border-[#414943] sm:w-44">
                <Filter className="mr-2 size-3.5 text-steel" />
                <SelectValue placeholder="Semua Layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Layanan</SelectItem>
                {layananList.map((layanan) => (
                  <SelectItem key={layanan.id} value={layanan.id}>
                    {layanan.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex gap-3 flex-1">
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Dari Tanggal
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-sage dark:border-[#414943] bg-background h-10"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Sampai Tanggal
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-sage dark:border-[#414943] bg-background h-10"
                />
              </div>
            </div>
            {hasFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="mr-1.5 size-3.5" />
                Hapus Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-sage dark:border-[#414943]">
        <Table>
          <TableHeader>
            <TableRow className="bg-fog/50 dark:bg-[#2e2e2e]/50">
              <TableHead className="w-10">#</TableHead>
              <TableHead>Nomor Tiket</TableHead>
              <TableHead>Pemohon</TableHead>
              <TableHead className="hidden md:table-cell">
                Layanan
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Jenis
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">
                Progress
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Tanggal
              </TableHead>
              <TableHead className="w-16 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="p-0">
                  <EmptyState hasFilter={hasFilter} />
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="group transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <TableCell className="text-sm text-muted-foreground">
                    {((page - 1) * PAGE_SIZE + idx + 1)
                      .toString()
                      .padStart(2, "0")}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono font-semibold text-foreground">
                      {item.nomorTiket}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-foreground line-clamp-1">
                        {item.user.name ?? item.user.email ?? "—"}
                      </span>
                      {item.user.email && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {item.user.email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-foreground">
                      {item.layanan?.nama ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <JenisAjuanBadge jenis={item.jenisAjuan} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpCircle className="size-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {item._count.progress}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {formatDateTime(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() =>
                        router.push(
                          `/dashboard/permohonan/${item.id}`,
                        )
                      }
                      title="Lihat Detail"
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
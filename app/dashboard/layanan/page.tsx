"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Building2,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface LayananData {
  id: string;
  nama: string;
  deskripsi: string | null;
  icon: string | null;
  isActive: boolean;
  hanyaOffline: boolean;
  persyaratan: string[] | null;
  templateFile: string | null;
  formFields: { id: string }[];
  _count?: { formFields: number; permohonan: number };
  createdAt: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

const PAGE_SIZE = 10;

// ── Skeleton Loader ────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="p-0">
        <div className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20 rounded-md" />
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
          <FileText className="size-8 text-steel dark:text-[#8c9489]" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {hasFilter ? "Tidak ada hasil ditemukan" : "Belum ada layanan"}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {hasFilter
          ? "Coba ubah kata kunci pencarian atau hapus filter yang aktif."
          : "Mulai tambahkan layanan desa Padangloang dengan klik tombol di bawah."}
      </p>
      {!hasFilter && (
        <Button asChild className="gap-2 animate-in zoom-in-95 duration-300">
          <Link href="/dashboard/layanan/new">
            <Plus className="size-4" />
            Tambah Layanan Pertama
          </Link>
        </Button>
      )}
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

// ── Icon Renderer ──────────────────────────────────────────────────────────────

function IconRenderer({ icon }: { icon: string | null }) {
  const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText className="size-4" />,
    FileCheck: <CheckCircle2 className="size-4" />,
    ScrollText: <FileText className="size-4" />,
    Home: <Building2 className="size-4" />,
    Users: <Building2 className="size-4" />,
    Landmark: <Building2 className="size-4" />,
    Shield: <Building2 className="size-4" />,
    UserCheck: <Building2 className="size-4" />,
    MapPin: <Building2 className="size-4" />,
    Briefcase: <Building2 className="size-4" />,
    Heart: <Building2 className="size-4" />,
  };

  const fallback = <FileText className="size-4" />;
  return iconMap[icon || ""] || fallback;
}

// ── Format Helpers ─────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function truncate(text: string | null, max: number) {
  if (!text) return "—";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function LayananPage() {
  const router = useRouter();
  const [data, setData] = useState<LayananData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<LayananData | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const hasFilter = !!debouncedSearch || statusFilter !== "all";

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
  }, [statusFilter]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("all", "true");
      if (debouncedSearch) params.set("q", debouncedSearch);

      const res = await fetch(`/api/layanan?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data");

      const allData: LayananData[] = await res.json();

      // Client-side filtering
      let filtered = allData;
      if (statusFilter === "active") {
        filtered = filtered.filter((item) => item.isActive);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((item) => !item.isActive);
      }

      setTotalPages(Math.ceil(filtered.length / PAGE_SIZE) || 1);
      const start = (page - 1) * PAGE_SIZE;
      setData(filtered.slice(start, start + PAGE_SIZE));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data layanan");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Delete
  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete.id);
    try {
      const res = await fetch(`/api/layanan/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Layanan berhasil dihapus", {
        description: `"${itemToDelete.nama}" telah dihapus dari database.`,
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });
      setShowDeleteDialog(false);
      setItemToDelete(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus layanan", {
        description: "Terjadi kesalahan, coba lagi nanti.",
        icon: <AlertTriangle className="size-4" />,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Kelola Layanan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Memuat data..."
              : `${data.length} layanan ditampilkan`}
          </p>
        </div>
        <Button asChild className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Link href="/dashboard/layanan/new">
            <Plus className="size-4" />
            Tambah Layanan
          </Link>
        </Button>
      </div>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
      <Card className="border-sage dark:border-[#414943]">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel dark:text-[#8c9489]" />
            <Input
              placeholder="Cari layanan..."
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
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-full border-sage dark:border-[#414943] sm:w-44">
              <Filter className="mr-2 size-3.5 text-steel" />
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        </CardContent>
      </Card>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-sage dark:border-[#414943]">
        <Table>
          <TableHeader>
            <TableRow className="bg-fog/50 dark:bg-[#2e2e2e]/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">
                Hanya Offline
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Form Fields
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Tanggal
              </TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <RowSkeleton key={i} />
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-0">
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
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fog dark:bg-[#2e2e2e]">
                        <IconRenderer icon={item.icon} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground line-clamp-1">
                            {item.nama}
                          </span>
                          {new Date(item.createdAt).getTime() >
                            Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] animate-in zoom-in-95 duration-300"
                            >
                              Baru
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {truncate(item.deskripsi, 60)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.isActive ? (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-medium gap-1"
                      >
                        <CheckCircle2 className="size-3" />
                        Aktif
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-ash/20 text-iron dark:bg-[#414943]/50 dark:text-[#8c9489] text-[11px] font-medium gap-1"
                      >
                        <EyeOff className="size-3" />
                        Nonaktif
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {item.hanyaOffline ? (
                      <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[11px] font-medium gap-1"
                      >
                        <Ban className="size-3" />
                        Ya
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {item.formFields?.length ?? 0} field
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:bg-background"
                        onClick={() =>
                          router.push(
                            `/dashboard/layanan/${item.id}/edit`,
                          )
                        }
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteDialog(true);
                        }}
                        disabled={deletingId === item.id}
                        title="Hapus"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </Button>
                    </div>
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

      {/* ── Delete Confirm Dialog ───────────────────────────────────────────── */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md animate-in zoom-in-95 fade-in duration-200">
          <DialogHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20 mb-3">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">
              Hapus Layanan?
            </DialogTitle>
            <DialogDescription className="text-center">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-foreground">
                "{itemToDelete?.nama}"
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-sage dark:border-[#414943]"
              onClick={() => {
                setShowDeleteDialog(false);
                setItemToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
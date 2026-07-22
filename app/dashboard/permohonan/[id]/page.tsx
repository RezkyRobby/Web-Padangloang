"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  User,
  FileText,
  Tag,
  MessageSquare,
  Send,
  ChevronRight,
  Building2,
  Smartphone,
  Calendar,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Types ──────────────────────────────────────────────────────────────────────

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  nik: string | null;
  phoneNumber: string | null;
}

interface LayananData {
  id: string;
  nama: string;
  icon: string | null;
}

interface FormFieldData {
  id: string;
  label: string;
  fieldType: string;
  required: boolean;
  placeholder: string | null;
  options: string[] | null;
}

interface PermohonanDataItem {
  id: string;
  formFieldId: string;
  value: string;
  formField: FormFieldData;
}

interface ProgressItem {
  id: string;
  status: string;
  catatan: string | null;
  createdAt: string;
  createdBy: { id: string; name: string | null };
}

interface PermohonanDetail {
  id: string;
  nomorTiket: string;
  jenisAjuan: string;
  status: string;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;
  layanan: LayananData | null;
  layananId: string | null;
  user: UserData;
  data: PermohonanDataItem[];
  progress: ProgressItem[];
}

interface LayananOption {
  id: string;
  nama: string;
  icon: string | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
  DITANGGUHKAN: "Ditangguhkan",
  DIBATALKAN: "Dibatalkan",
};

const STATUS_COLORS: Record<string, string> = {
  MENUNGGU:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  DIPROSES: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  SELESAI:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  DITOLAK: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  DITANGGUHKAN:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  DIBATALKAN: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400",
};

const JENIS_AJUAN_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  ONLINE: { label: "Online", icon: <Smartphone className="size-3.5" /> },
  OFFLINE: {
    label: "Offline (Datang ke Kantor)",
    icon: <Building2 className="size-3.5" />,
  },
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  MENUNGGU: ["DIPROSES", "DITOLAK", "DIBATALKAN"],
  DIPROSES: ["SELESAI", "DITOLAK", "DITANGGUHKAN"],
  DITANGGUHKAN: ["DIPROSES", "DIBATALKAN"],
  SELESAI: [],
  DITOLAK: [],
  DIBATALKAN: [],
};

const PROGRESS_STATUS_LABELS: Record<string, string> = {
  MENUNGGU: "Permohonan diajukan",
  DIPROSES: "Permohonan sedang diproses",
  SELESAI: "Permohonan selesai",
  DITOLAK: "Permohonan ditolak",
  DITANGGUHKAN: "Permohonan ditangguhkan",
  DIBATALKAN: "Permohonan dibatalkan",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Status Timeline Item ───────────────────────────────────────────────────────

function TimelineItem({
  progress,
  isLast,
}: {
  progress: ProgressItem;
  isLast: boolean;
}) {
  const statusColor = STATUS_COLORS[progress.status]?.split(" ")[0] || "bg-gray-300";
  const iconColor =
    progress.status === "SELESAI"
      ? "bg-emerald-500"
      : progress.status === "DITOLAK" || progress.status === "DIBATALKAN"
        ? "bg-red-500"
        : progress.status === "DIPROSES"
          ? "bg-blue-500"
          : "bg-amber-500";

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-sage dark:bg-[#414943]" />
      )}

      {/* Dot */}
      <div className="relative shrink-0">
        <div
          className={`size-6 rounded-full ${iconColor} flex items-center justify-center shadow-sm`}
        >
          {progress.status === "SELESAI" ? (
            <CheckCircle2 className="size-3 text-white" />
          ) : progress.status === "DITOLAK" || progress.status === "DIBATALKAN" ? (
            <X className="size-3 text-white" />
          ) : (
            <Clock className="size-3 text-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {PROGRESS_STATUS_LABELS[progress.status] || progress.status}
            </span>
            <Badge
              variant="secondary"
              className={`text-[10px] font-medium ${statusColor}`}
            >
              {STATUS_LABELS[progress.status] || progress.status}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDateShort(progress.createdAt)} {formatTime(progress.createdAt)}
          </span>
        </div>

        {progress.catatan && (
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {progress.catatan}
          </p>
        )}

        <p className="text-xs text-steel mt-1">
          oleh {progress.createdBy.name || "Admin"}
        </p>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="size-9 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-sage dark:border-[#414943]">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-sage dark:border-[#414943]">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-6 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Error State ────────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="flex size-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 mb-5">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Terjadi Kesalahan
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {message}
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-sage dark:border-[#414943]"
      >
        Coba Lagi
      </Button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function DetailPermohonanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PermohonanDetail | null>(null);

  // Layanan options for assignment (offline)
  const [layananList, setLayananList] = useState<LayananOption[]>([]);
  const [loadingLayanan, setLoadingLayanan] = useState(false);

  // Progress form
  const [newStatus, setNewStatus] = useState("");
  const [newCatatan, setNewCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Assign layanan (for offline)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedLayananId, setSelectedLayananId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // ── Fetch detail ─────────────────────────────────────────────────────────────

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/permohonan/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Permohonan tidak ditemukan");
        throw new Error("Gagal memuat data");
      }
      const result: PermohonanDetail = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // ── Fetch layanan list (for offline assignment) ─────────────────────────────

  const fetchLayanan = useCallback(async () => {
    setLoadingLayanan(true);
    try {
      const res = await fetch("/api/layanan");
      if (res.ok) {
        const list: LayananOption[] = await res.json();
        setLayananList(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLayanan(false);
    }
  }, []);

  // ── Assign Layanan (offline) ─────────────────────────────────────────────────

  const handleAssignLayanan = async () => {
    if (!selectedLayananId) {
      toast.error("Pilih layanan terlebih dahulu");
      return;
    }

    setAssigning(true);
    try {
      const res = await fetch(`/api/permohonan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layananId: selectedLayananId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menetapkan layanan");
      }

      toast.success("Layanan berhasil ditetapkan", {
        description: "Permohonan offline telah dikaitkan dengan layanan.",
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });

      setAssignDialogOpen(false);
      fetchDetail();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menetapkan layanan", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setAssigning(false);
    }
  };

  // ── Submit progress ──────────────────────────────────────────────────────────

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newStatus) {
      toast.error("Pilih status terlebih dahulu");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/permohonan/${id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          catatan: newCatatan.trim() || undefined,
          createdById: data?.user.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mengupdate status");
      }

      toast.success("Status berhasil diperbarui", {
        description: `Permohonan sekarang: ${STATUS_LABELS[newStatus] || newStatus}`,
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });

      setNewStatus("");
      setNewCatatan("");
      fetchDetail();
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengupdate status", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) return <DetailSkeleton />;

  // ── Error ────────────────────────────────────────────────────────────────────

  if (error || !data) {
    return (
      <ErrorState
        message={error || "Data tidak ditemukan"}
        onRetry={fetchDetail}
      />
    );
  }

  const availableTransitions = STATUS_TRANSITIONS[data.status] || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ──────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/dashboard/permohonan">
                <ArrowLeft className="mr-1 size-3.5" />
                Kembali ke Permohonan
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              {data.nomorTiket}
            </h1>
            <Badge
              variant="secondary"
              className={`text-xs font-semibold px-3 py-1 ${
                STATUS_COLORS[data.status] || ""
              }`}
            >
              {STATUS_LABELS[data.status] || data.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Diajukan pada {formatDate(data.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left: Info Cards ─────────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-1">
          {/* User Info */}
          <Card className="border-sage dark:border-[#414943]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="size-4 text-secondary" />
                Data Pemohon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Nama</p>
                <p className="font-medium text-foreground">
                  {data.user.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">
                  {data.user.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">NIK</p>
                <p className="font-medium text-foreground">
                  {data.user.nik || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">No. Telepon</p>
                <p className="font-medium text-foreground">
                  {data.user.phoneNumber || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Info */}
          <Card className="border-sage dark:border-[#414943]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Tag className="size-4 text-secondary" />
                Informasi Tiket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Nomor Tiket</p>
                <p className="font-mono font-medium text-foreground text-sm">
                  {data.nomorTiket}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jenis Ajuan</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {JENIS_AJUAN_LABELS[data.jenisAjuan]?.icon}
                  <span className="font-medium text-foreground">
                    {JENIS_AJUAN_LABELS[data.jenisAjuan]?.label ||
                      data.jenisAjuan}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Layanan</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {data.layanan ? (
                    <>
                      <FileText className="size-3.5 text-secondary" />
                      <span className="font-medium text-foreground">
                        {data.layanan.nama}
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="size-3.5" />
                      {data.jenisAjuan === "OFFLINE"
                        ? "Belum ditetapkan"
                        : "Tidak ada"}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Catatan Admin</p>
                <p className="font-medium text-foreground text-sm">
                  {data.catatan || "—"}
                </p>
              </div>

              {/* Assign Layanan Button (only for offline without layanan) */}
              {data.jenisAjuan === "OFFLINE" && !data.layanan && (
                <Button
                  onClick={() => {
                    fetchLayanan();
                    setAssignDialogOpen(true);
                  }}
                  size="sm"
                  className="w-full gap-2"
                >
                  <Building2 className="size-4" />
                  Tetapkan Layanan
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Center & Right ──────────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* ── Form Data ───────────────────────────────────────────────────────── */}
          {data.data.length > 0 && (
            <Card className="border-sage dark:border-[#414943]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="size-4 text-secondary" />
                  Data Formulir
                </CardTitle>
                <CardDescription className="text-xs">
                  Data yang diisi oleh pemohon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-fog/50 dark:bg-[#2e2e2e]/50">
                      <TableHead className="w-1/3">Field</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((item) => (
                      <TableRow
                        key={item.id}
                        className="group transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {item.formField.label}
                            </span>
                            {item.formField.required && (
                              <span className="text-destructive text-xs font-bold">
                                *
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-sage dark:border-[#414943]"
                          >
                            {item.formField.fieldType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.formField.fieldType === "FILE_UPLOAD" ? (
                            <a
                              href={item.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-hudson-blue hover:underline font-medium inline-flex items-center gap-1"
                            >
                              <Upload className="size-3" />
                              Lihat File
                            </a>
                          ) : (
                            <span className="text-sm text-foreground">
                              {item.value || "—"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* ── Progress Timeline ────────────────────────────────────────────── */}
          <Card className="border-sage dark:border-[#414943]">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="size-4 text-secondary" />
                Timeline Progress
              </CardTitle>
              <CardDescription className="text-xs">
                Riwayat perkembangan permohonan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.progress.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="flex size-12 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-3">
                    <Clock className="size-5 text-steel dark:text-[#8c9489]" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Belum ada progress
                  </p>
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    Progress akan muncul setelah admin melakukan update status.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {data.progress.map((p, idx) => (
                    <TimelineItem
                      key={p.id}
                      progress={p}
                      isLast={idx === data.progress.length - 1}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Update Status Form ──────────────────────────────────────────────── */}
          <Card className="border-sage dark:border-[#414943]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Send className="size-4 text-secondary" />
                Update Status
              </CardTitle>
              <CardDescription className="text-xs">
                Perbarui status permohonan
                {availableTransitions.length === 0 && (
                  <span className="text-destructive ml-0.5">
                    — Status ini sudah final, tidak bisa diubah lagi.
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            {availableTransitions.length > 0 && (
              <CardContent>
                <form onSubmit={handleSubmitProgress} className="space-y-4">
                  {/* Status Select */}
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status Baru <span className="text-destructive">*</span>
                    </Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger
                        id="status"
                        className="border-sage dark:border-[#414943] bg-background"
                      >
                        <SelectValue placeholder="Pilih status baru" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTransitions.map((st) => (
                          <SelectItem key={st} value={st}>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block size-2 rounded-full ${
                                  st === "SELESAI"
                                    ? "bg-emerald-500"
                                    : st === "DITOLAK" || st === "DIBATALKAN"
                                      ? "bg-red-500"
                                      : st === "DIPROSES"
                                        ? "bg-blue-500"
                                        : st === "DITANGGUHKAN"
                                          ? "bg-orange-500"
                                          : "bg-gray-400"
                                }`}
                              />
                              {STATUS_LABELS[st] || st}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Catatan */}
                  <div className="space-y-2">
                    <Label htmlFor="catatan">Catatan (opsional)</Label>
                    <Textarea
                      id="catatan"
                      placeholder="Tambahkan catatan mengenai perubahan status ini..."
                      rows={3}
                      value={newCatatan}
                      onChange={(e) => setNewCatatan(e.target.value)}
                      className="border-sage dark:border-[#414943] bg-background resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={submitting || !newStatus}
                      className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      {submitting ? "Menyimpan..." : "Update Status"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* ── Assign Layanan Dialog ──────────────────────────────────────────────── */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md animate-in zoom-in-95 fade-in duration-200">
          <DialogHeader>
            <DialogTitle>Tetapkan Layanan</DialogTitle>
            <DialogDescription>
              Pilih layanan yang sesuai untuk permohonan offline ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="assign-layanan">
                Pilih Layanan <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedLayananId}
                onValueChange={setSelectedLayananId}
              >
                <SelectTrigger
                  id="assign-layanan"
                  className="border-sage dark:border-[#414943]"
                >
                  <SelectValue placeholder="Pilih layanan..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingLayanan ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : layananList.length === 0 ? (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      Tidak ada layanan tersedia
                    </div>
                  ) : (
                    layananList.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="size-3.5 text-secondary" />
                          {l.nama}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
              disabled={assigning}
              className="border-sage dark:border-[#414943]"
            >
              Batal
            </Button>
            <Button
              onClick={handleAssignLayanan}
              disabled={assigning || !selectedLayananId}
              className="gap-2"
            >
              {assigning ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {assigning ? "Menyimpan..." : "Tetapkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

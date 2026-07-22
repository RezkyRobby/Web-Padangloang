"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Navbar from "@/components/custom/navbar";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  MENUNGGU: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DIPROSES: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SELESAI: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DITOLAK: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  DITANGGUHKAN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DIBATALKAN: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const STATUS_LABELS: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
  DITANGGUHKAN: "Ditangguhkan",
  DIBATALKAN: "Dibatalkan",
};

const STATUS_ICONS: Record<string, typeof Circle> = {
  MENUNGGU: Clock,
  DIPROSES: Loader2,
  SELESAI: CheckCircle2,
  DITOLAK: XCircle,
  DITANGGUHKAN: Clock,
  DIBATALKAN: XCircle,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface PermohonanDataItem {
  id: string;
  value: string;
  formField: {
    id: string;
    label: string;
    fieldType: string;
  };
}

interface ProgressItem {
  id: string;
  status: string;
  catatan: string | null;
  createdAt: string;
  createdBy: { id: string; name: string } | null;
}

interface PermohonanDetail {
  id: string;
  nomorTiket: string;
  layanan: { id: string; nama: string } | null;
  userId: string;
  jenisAjuan: string;
  status: string;
  catatan: string | null;
  createdAt: string;
  updatedAt: string;
  data: PermohonanDataItem[];
  progress: ProgressItem[];
}

export default function PermohonanDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [permohonan, setPermohonan] = useState<PermohonanDetail | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function fetchDetail() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/permohonan/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) {
        setError("Gagal memuat data permohonan");
        return;
      }
      const json: PermohonanDetail = await res.json();
      setPermohonan(json);
    } catch {
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sessionLoading && session?.user) {
      fetchDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoading, session, id]);

  // Cek unauthorized setelah data & session tersedia
  useEffect(() => {
    if (permohonan && session?.user && permohonan.userId !== session.user.id) {
      setUnauthorized(true);
    }
  }, [permohonan, session]);

  async function handleCancel() {
    if (!permohonan) return;
    try {
      setCancelling(true);
      const res = await fetch(`/api/permohonan/${permohonan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DIBATALKAN" }),
      });
      if (!res.ok) {
        throw new Error("Gagal membatalkan permohonan");
      }
      toast.success("Permohonan berhasil dibatalkan");
      await fetchDetail();
    } catch {
      toast.error("Gagal membatalkan permohonan");
    } finally {
      setCancelling(false);
    }
  }

  // Loading session
  if (sessionLoading || (loading && !permohonan && !error && !notFound)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-foreground/40" />
        </div>
      </div>
    );
  }

  // Belum login
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="size-12 text-foreground/40" />
          <h2 className="text-2xl font-bold text-foreground/70">
            Silakan login terlebih dahulu
          </h2>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not found
  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <FileText className="size-12 text-foreground/30" />
          <h2 className="text-xl font-bold text-foreground/70">
            Permohonan tidak ditemukan
          </h2>
          <Link href="/akun/dashboard/permohonan">
            <Button variant="outline" className="gap-1.5">
              <ArrowLeft className="size-4" />
              Kembali ke Riwayat
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Unauthorized
  if (unauthorized) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="size-12 text-foreground/30" />
          <h2 className="text-xl font-bold text-foreground/70">
            Anda tidak memiliki akses ke permohonan ini
          </h2>
          <Link href="/akun/dashboard/permohonan">
            <Button variant="outline" className="gap-1.5">
              <ArrowLeft className="size-4" />
              Kembali ke Riwayat
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="size-12 text-foreground/30" />
          <h2 className="text-xl font-bold text-foreground/70">{error}</h2>
          <Button variant="outline" onClick={fetchDetail} className="gap-1.5">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!permohonan) {
    return null;
  }

  const canCancel = permohonan.status === "MENUNGGU";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-24 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/akun/dashboard/permohonan">
              <Button variant="outline" size="icon" className="size-9 rounded-full">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <p className="text-xs font-medium text-foreground/40">Nomor Tiket</p>
              <h1 className="font-display text-2xl font-semibold text-foreground">
                {permohonan.nomorTiket}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                STATUS_STYLES[permohonan.status] ?? "bg-foreground/10 text-foreground/60",
              )}
            >
              {STATUS_LABELS[permohonan.status] ?? permohonan.status}
            </Badge>
            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-1.5">
                    <XCircle className="size-4" />
                    Batalkan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Permohonan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Permohonan dengan nomor tiket{" "}
                      <span className="font-semibold">{permohonan.nomorTiket}</span> akan
                      dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {cancelling ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Ya, Batalkan"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-6">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">
              {permohonan.layanan?.nama ?? "Layanan Umum"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="font-medium">
                {permohonan.jenisAjuan === "ONLINE" ? "Online" : "Offline"}
              </Badge>
              <span className="text-foreground/50">Jenis Ajuan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              <Calendar className="size-4" />
              {formatDate(permohonan.createdAt)}
            </div>
            {permohonan.catatan && (
              <div className="sm:col-span-2 rounded-md bg-muted/50 p-3 text-sm text-foreground/70">
                <span className="font-medium">Catatan: </span>
                {permohonan.catatan}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Form */}
        {permohonan.data.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Data Permohonan</CardTitle>
            </CardHeader>
            <CardContent className="divide-y pt-0">
              {permohonan.data.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <span className="text-sm font-medium text-foreground/70">
                    {d.formField.label}
                  </span>
                  <span className="text-sm text-foreground sm:text-right sm:max-w-[60%] break-words">
                    {d.value || "-"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Timeline Progress */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg">Riwayat Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {permohonan.progress.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Clock className="size-10 text-foreground/30" />
                <p className="text-sm text-foreground/50">
                  Belum ada riwayat progress.
                </p>
              </div>
            ) : (
              <ol className="relative border-l border-border pl-6">
                {permohonan.progress.map((p) => {
                  const Icon = STATUS_ICONS[p.status] ?? Circle;
                  return (
                    <li key={p.id} className="mb-6 last:mb-0">
                      <span className="absolute -left-[11px] flex size-5 items-center justify-center rounded-full bg-background ring-2 ring-border">
                        <Icon className="size-3 text-foreground/60" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              STATUS_STYLES[p.status] ?? "bg-foreground/10 text-foreground/60",
                            )}
                          >
                            {STATUS_LABELS[p.status] ?? p.status}
                          </Badge>
                          <span className="text-xs text-foreground/40">
                            {formatDateShort(p.createdAt)}
                          </span>
                        </div>
                        {p.catatan && (
                          <p className="text-sm text-foreground/70">{p.catatan}</p>
                        )}
                        {p.createdBy && (
                          <p className="text-xs text-foreground/40">
                            Oleh: {p.createdBy.name}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
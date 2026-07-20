"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Loader2,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const JENIS_AJUAN_LABELS: Record<string, string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
};

interface PermohonanItem {
  id: string;
  nomorTiket: string;
  layanan: { id: string; nama: string } | null;
  jenisAjuan: string;
  status: string;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PermohonanList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PermohonanItem[]>([]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/permohonan?userId=${userId}`);
      const json: PermohonanItem[] | { error: string } = await res.json();
      if (!res.ok || !Array.isArray(json)) {
        throw new Error("Gagal memuat data permohonan");
      }
      setData(json);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat riwayat permohonan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-8 animate-spin text-foreground/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <AlertCircle className="size-10 text-destructive/60" />
        <p className="text-sm text-foreground/60">{error}</p>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={load}>
          <RefreshCw className="size-4" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <FileText className="size-10 text-foreground/30" />
        <p className="text-sm text-foreground/50">
          {"Belum ada permohonan. Klik \"Ajukan Layanan\" untuk memulai."}
        </p>
        <Link href="/akun/dashboard/ajukan">
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="size-4" />
            Ajukan Layanan
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {data.map((p) => (
        <Link
          key={p.id}
          href={`/akun/dashboard/permohonan/${p.id}`}
          className="flex flex-col gap-2 py-3 transition-colors hover:bg-foreground/5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              {p.layanan?.nama ?? "Layanan Umum"}
            </span>
            <span className="text-xs text-foreground/40">
              {p.nomorTiket} · {formatDate(p.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground/50">
              {JENIS_AJUAN_LABELS[p.jenisAjuan] ?? p.jenisAjuan}
            </span>
            <Badge
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                STATUS_STYLES[p.status] ?? "bg-foreground/10 text-foreground/60",
              )}
            >
              {STATUS_LABELS[p.status] ?? p.status}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function UserPermohonanPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-foreground/40" />
        </div>
      </div>
    );
  }

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

  const user = session.user;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-24 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-headline-small font-semibold text-foreground">
              Riwayat Permohonan
            </h1>
            <p className="mt-1 text-sm text-foreground/50">
              Daftar semua pengajuan layanan yang telah Anda buat.
            </p>
          </div>
          <Link href="/akun/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="size-4" />
              Kembali
            </Button>
          </Link>
        </div>

        {/* Tombol ajukan */}
        <div className="mb-6 flex justify-end">
          <Link href="/akun/dashboard/ajukan">
            <Button className="gap-1.5">
              <PlusCircle className="size-4" />
              Ajukan Layanan
            </Button>
          </Link>
        </div>

        {/* List */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle>Semua Permohonan</CardTitle>
            <CardDescription>
              Klik salah satu untuk melihat detail dan progres pengajuan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <PermohonanList userId={user.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
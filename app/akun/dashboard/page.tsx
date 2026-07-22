"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  FileText,
  Loader2,
  PlusCircle,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getInitials } from "@/utils/string";
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

export default function UserDashboardPage() {
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
        {/* Profile ringkas */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <Avatar className="size-16 ring-2 ring-background">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-foreground/20 text-lg font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-foreground/50">{user.email}</p>
          </div>
          <Link href="/akun/dashboard/profil">
            <Button variant="outline" size="sm" className="gap-1.5">
              <User className="size-4" />
              Edit Profil
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

        {/* 5 Permohonan terbaru */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle>Permohonan Terbaru</CardTitle>
              <CardDescription>
                Riwayat pengajuan layanan Anda.
              </CardDescription>
            </div>
            <Link href="/akun/dashboard/permohonan">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Lihat Semua
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <UserPermohonanList userId={user.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function UserPermohonanList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PermohonanItem[]>([]);

  useEffect(() => {
    fetch(`/api/permohonan?userId=${userId}&limit=5`)
      .then((res) => res.json())
      .then((json: PermohonanItem[] | { error: string }) => {
        if (Array.isArray(json)) setData(json.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-foreground/40" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <FileText className="size-10 text-foreground/30" />
        <p className="text-sm text-foreground/50">
          Belum ada permohonan. Klik "Ajukan Layanan" untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {data.map((p) => (
        <Link
          key={p.id}
          href={`/akun/dashboard/permohonan/${p.id}`}
          className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-foreground/5"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              {p.layanan?.nama ?? "Layanan Umum"}
            </span>
            <span className="text-xs text-foreground/40">
              {p.nomorTiket} · {formatDate(p.createdAt)}
            </span>
          </div>
          <Badge
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              STATUS_STYLES[p.status] ?? "bg-foreground/10 text-foreground/60",
            )}
          >
            {STATUS_LABELS[p.status] ?? p.status}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
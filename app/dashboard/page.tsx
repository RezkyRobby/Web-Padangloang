import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Users,
  MessageSquare,
  Tag,
  Eye,
  TrendingUp,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  MailOpen,
  Mail,
  Store,
  MapPin,
  ImageIcon,
  BarChart3,
  Building2,
  Map,
  Sparkles,
  Plus,
  Inbox,
  Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ElementType;
  description: string;
  href: string;
  gradient: string;
}

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function getDashboardStats() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    trendingPosts,
    totalViews,
    totalUsers,
    totalMessages,
    unreadMessages,
    totalCategories,
    totalBreakingNews,
    totalUMKM,
    totalWisata,
    totalGaleri,
    totalInfografis,
    totalPerangkatDesa,
    // Permohonan stats
    totalPermohonan,
    permohonanMenunggu,
    permohonanDiproses,
    permohonanSelesai,
    recentPosts,
    recentMessages,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.post.count({ where: { trending: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.user.count(),
    prisma.message.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.category.count(),
    prisma.breakingNews.count({ where: { isActive: true } }),
    prisma.uMKM.count().catch(() => 0),
    prisma.wisata.count().catch(() => 0),
    prisma.galeri.count().catch(() => 0),
    prisma.infografis.count().catch(() => 0),
    prisma.perangkatDesa.count().catch(() => 0),

    // ── Permohonan stats ──
    prisma.permohonan.count().catch(() => 0),
    prisma.permohonan.count({ where: { status: "MENUNGGU" } }).catch(() => 0),
    prisma.permohonan.count({ where: { status: "DIPROSES" } }).catch(() => 0),
    prisma.permohonan.count({ where: { status: "SELESAI" } }).catch(() => 0),

    // 5 most recent posts
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        trending: true,
        views: true,
        createdAt: true,
        category: { select: { name: true, color: true } },
        authors: { select: { name: true } },
      },
    }),

    // 5 most recent messages
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    trendingPosts,
    totalViews: totalViews._sum.views ?? 0,
    totalUsers,
    totalMessages,
    unreadMessages,
    totalCategories,
    totalBreakingNews,
    totalUMKM,
    totalWisata,
    totalGaleri,
    totalInfografis,
    totalPerangkatDesa,
    totalPermohonan,
    permohonanMenunggu,
    permohonanDiproses,
    permohonanSelesai,
    recentPosts,
    recentMessages,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

// ── Animated Counter Number (Server Component — CSS only) ──────────────────────

function AnimatedNumber({ value }: { value: string }) {
  return (
    <span
      className="inline-block animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
      style={{ animationDelay: `var(--tw-enter-delay, 100ms)` }}
    >
      {value}
    </span>
  );
}

// ── Pulse Badge ────────────────────────────────────────────────────────────────

function PulseBadge({
  count,
  label,
  color = "destructive",
}: {
  count: number;
  label: string;
  color?: string;
}) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex size-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-${color}`}
        />
        <span
          className={`relative inline-flex size-2 rounded-full bg-${color}`}
        />
      </span>
      <span className="text-[11px] font-semibold text-destructive animate-in fade-in duration-300">
        {count} {label}
      </span>
    </span>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  // ── Main stat cards (top row + new desa stats) ───────────────────────────
  const statCards: StatCard[] = [
    {
      label: "Total Postingan",
      value: formatNumber(stats.totalPosts),
      subValue: `${stats.publishedPosts} diterbitkan · ${stats.draftPosts} draf · ${stats.trendingPosts} trending`,
      icon: FileText,
      description: "",
      href: "/dashboard/posts",
      gradient: "from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10",
    },
    {
      label: "Total Penayangan",
      value: formatNumber(stats.totalViews),
      icon: Eye,
      description: "",
      href: "/dashboard/posts",
      gradient: "from-violet-500/10 to-violet-500/5 dark:from-violet-500/20 dark:to-violet-500/10",
    },
    {
      label: "UMKM",
      value: formatNumber(stats.totalUMKM),
      subValue: "Produk & layanan warga",
      icon: Store,
      description: "",
      href: "/dashboard/umkm",
      gradient: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10",
    },
    {
      label: "Wisata & Kuliner",
      value: formatNumber(stats.totalWisata),
      subValue: "Destinasi unggulan",
      icon: MapPin,
      description: "",
      href: "/dashboard/wisata",
      gradient: "from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10",
    },
    {
      label: "Galeri",
      value: formatNumber(stats.totalGaleri),
      subValue: "Koleksi foto desa",
      icon: ImageIcon,
      description: "",
      href: "/dashboard/galeri",
      gradient: "from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/10",
    },
    {
      label: "Infografis",
      value: formatNumber(stats.totalInfografis),
      subValue: "Data statistik desa",
      icon: BarChart3,
      description: "",
      href: "/dashboard/infografis",
      gradient: "from-cyan-500/10 to-cyan-500/5 dark:from-cyan-500/20 dark:to-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Welcome Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Selamat Datang, Admin 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Panel pengelolaan konten Desa Padangloang — ringkasan data terkini.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 sm:mt-0">
          <PulseBadge
            count={stats.unreadMessages}
            label="pesan belum dibaca"
          />
        </div>
      </div>

      <Separator />

      {/* ── Post Status Quick View ───────────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/dashboard/posts">
          <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-500/10" />
            <CardContent className="relative flex items-center gap-4 py-5 px-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-5" />
              </span>
              <div className="min-w-0">
                <AnimatedNumber value={formatNumber(stats.publishedPosts)} />
                <p className="text-2xl font-bold text-foreground">{formatNumber(stats.publishedPosts)}</p>
                <p className="text-xs text-muted-foreground">Postingan diterbitkan</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/posts">
          <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent dark:from-yellow-500/10" />
            <CardContent className="relative flex items-center gap-4 py-5 px-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                <Clock className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">{formatNumber(stats.draftPosts)}</p>
                <p className="text-xs text-muted-foreground">Draf menunggu publikasi</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/posts">
          <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:from-blue-500/10" />
            <CardContent className="relative flex items-center gap-4 py-5 px-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                <TrendingUp className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">{formatNumber(stats.trendingPosts)}</p>
                <p className="text-xs text-muted-foreground">Postingan trending</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* ── Stat Cards Grid ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkles className="size-3.5" />
          Ringkasan Konten
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.label} href={card.href}>
                <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </CardTitle>
                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                      <Icon className="size-4" />
                    </span>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-3xl font-extrabold text-foreground">
                      {card.value}
                    </p>
                    {card.subValue && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {card.subValue}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Quick Action Cards ───────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Plus className="size-3.5" />
          Aksi Cepat
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/posts/new">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4 px-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-transform duration-200 group-hover:scale-110">
                  <FileText className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Tambah Berita</p>
                  <p className="text-[11px] text-muted-foreground">Buat postingan baru</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-steel dark:text-[#8c9489] transition-transform duration-200 group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/umkm/new">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4 px-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110">
                  <Store className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Tambah UMKM</p>
                  <p className="text-[11px] text-muted-foreground">Produk atau layanan baru</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-steel dark:text-[#8c9489] transition-transform duration-200 group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/wisata/new">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4 px-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-110">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Tambah Wisata</p>
                  <p className="text-[11px] text-muted-foreground">Destinasi atau kuliner baru</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-steel dark:text-[#8c9489] transition-transform duration-200 group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/galeri">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4 px-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-transform duration-200 group-hover:scale-110">
                  <ImageIcon className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Upload Foto</p>
                  <p className="text-[11px] text-muted-foreground">Tambah ke galeri desa</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-steel dark:text-[#8c9489] transition-transform duration-200 group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* ── Desa Quick Stats ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Building2 className="size-3.5" />
          Info Desa
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/profil-desa">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex items-center gap-3 py-4 px-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 transition-transform duration-200 group-hover:scale-110">
                  <Building2 className="size-4" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Profil Desa</p>
                  <p className="text-[11px] text-muted-foreground">Edit data & sejarah</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-sage dark:border-[#414943] bg-white dark:bg-[#1a1a1a] px-5 py-4">
            <Users className="size-9 text-steel dark:text-[#8c9489]" />
            <div>
              <p className="text-xl font-bold text-foreground">{formatNumber(stats.totalPerangkatDesa)}</p>
              <p className="text-[11px] text-muted-foreground">Perangkat Desa</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-sage dark:border-[#414943] bg-white dark:bg-[#1a1a1a] px-5 py-4">
            <Map className="size-9 text-steel dark:text-[#8c9489]" />
            <div>
              <p className="text-xl font-bold text-foreground">2,75 km²</p>
              <p className="text-[11px] text-muted-foreground">Luas Wilayah</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-sage dark:border-[#414943] bg-white dark:bg-[#1a1a1a] px-5 py-4">
            <Users className="size-9 text-steel dark:text-[#8c9489]" />
            <div>
              <p className="text-xl font-bold text-foreground">~1.586</p>
              <p className="text-[11px] text-muted-foreground">Jumlah Penduduk</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ringkasan Permohonan ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <Inbox className="size-3.5" />
          Ringkasan Permohonan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/permohonan">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-slate-500/5 dark:from-slate-500/20 dark:to-slate-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Permohonan
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <Inbox className="size-4" />
                </span>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-extrabold text-foreground">
                  {formatNumber(stats.totalPermohonan)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Seluruh permohonan masuk
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/permohonan?status=MENUNGGU">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Menunggu
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <Clock className="size-4" />
                </span>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-extrabold text-foreground">
                  {formatNumber(stats.permohonanMenunggu)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Belum diproses
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/permohonan?status=DIPROSES">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Diproses
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <Loader2 className="size-4 animate-spin" />
                </span>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-extrabold text-foreground">
                  {formatNumber(stats.permohonanDiproses)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sedang dikerjakan
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/permohonan?status=SELESAI">
            <Card className="group relative overflow-hidden border-sage dark:border-[#414943] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10" />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Selesai
                </CardTitle>
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <CheckCircle2 className="size-4" />
                </span>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-extrabold text-foreground">
                  {formatNumber(stats.permohonanSelesai)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Permohonan selesai
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* ── Recent Posts ──────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Postingan Terbaru
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/posts" className="flex items-center gap-1">
              Lihat semua <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <Card className="border-sage dark:border-[#414943] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Kategori
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Penulis
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="hidden text-right lg:table-cell">
                  Penayangan
                </TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  Tanggal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="size-8 text-steel/40 dark:text-[#6b7568]/40" />
                      <p className="text-sm">Belum ada postingan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentPosts.map((post) => (
                  <TableRow key={post.id} className="transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50">
                    <TableCell className="max-w-50 font-medium">
                      <Link
                        href={`/dashboard/posts`}
                        className="line-clamp-1 hover:underline"
                      >
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {post.category ? (
                        <Badge
                          variant="secondary"
                          className={post.category.color ?? ""}
                        >
                          {post.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {post.authors.map((a) => a.name).join(", ") || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {post.published ? (
                        <Badge
                          variant="default"
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          Tayang
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Draf</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-right text-sm text-muted-foreground lg:table-cell">
                      {formatNumber(post.views)}
                    </TableCell>
                    <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                      {formatDate(post.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* ── Recent Messages ───────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Pesan Terbaru
            </h2>
            <PulseBadge count={stats.unreadMessages} label="baru" />
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/dashboard/messages"
              className="flex items-center gap-1"
            >
              Lihat semua <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <Card className="border-sage dark:border-[#414943] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengirim</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Pesan</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="hidden text-right md:table-cell">
                  Tanggal
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentMessages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="size-8 text-steel/40 dark:text-[#6b7568]/40" />
                      <p className="text-sm">Belum ada pesan masuk.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentMessages.map((msg) => (
                  <TableRow key={msg.id} className="transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50">
                    <TableCell className="font-medium">
                      {msg.fullName}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {msg.email}
                    </TableCell>
                    <TableCell className="hidden max-w-60 text-sm text-muted-foreground md:table-cell">
                      <span className="line-clamp-1">{msg.content}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {msg.isRead ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MailOpen className="size-3.5" />
                          Dibaca
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          <Mail className="size-3.5" />
                          Baru
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                      {formatDate(msg.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}
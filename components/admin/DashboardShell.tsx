"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Home,
  Plus,
  FileText,
  Store,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Breadcrumb {
  label: string;
  href?: string;
}

// ── Breadcrumb Generator ───────────────────────────────────────────────────────

function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [{ label: "Dashboard", href: "/dashboard" }];

  const segments = pathname.replace("/dashboard", "").split("/").filter(Boolean);

  if (segments.length === 0) return breadcrumbs;

  const labelMap: Record<string, string> = {
    posts: "Berita",
    "breaking-news": "Breaking News",
    umkm: "UMKM",
    wisata: "Wisata",
    galeri: "Galeri",
    "profil-desa": "Profil Desa",
    infografis: "Infografis",
    messages: "Pesan",
    users: "Pengguna",
    categories: "Kategori",
    new: "Tambah Baru",
    edit: "Edit",
    pengaturan: "Pengaturan",
  };

  let accumulatedPath = "/dashboard";

  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = labelMap[segment] ?? segment.replace(/-/g, " ");

    breadcrumbs.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: isLast ? undefined : accumulatedPath,
    });
  });

  return breadcrumbs;
}

// ── Quick Actions ──────────────────────────────────────────────────────────────

const quickActions = [
  { label: "Berita Baru", href: "/dashboard/posts/new", icon: FileText, color: "bg-blue-500 hover:bg-blue-600" },
  { label: "UMKM Baru", href: "/dashboard/umkm/new", icon: Store, color: "bg-emerald-500 hover:bg-emerald-600" },
];

// ── DashboardShell Component ───────────────────────────────────────────────────

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  const userRole = (session?.user?.role as string) ?? "";
  const fullName = session?.user?.name ?? "Pengguna";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-h-screen transition-all duration-300">
        {/* ── Top Bar ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-sage dark:border-[#414943] bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset] px-4 lg:px-6">
          {/* Mobile sidebar toggle & Breadcrumbs */}
          <div className="flex flex-1 items-center gap-3 pl-10 lg:pl-0">
            {/* Breadcrumbs */}
            <nav className="hidden items-center gap-1.5 text-sm sm:flex">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className="text-steel dark:text-[#6b7568] select-none">/</span>
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-steel dark:text-[#8c9489] hover:text-obsidian dark:hover:text-white transition-colors font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-obsidian dark:text-white font-semibold">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Quick Action Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-1.5 sm:flex border-sage dark:border-[#414943] hover:bg-fog dark:hover:bg-[#2e2e2e] transition-all duration-200 animate-in fade-in zoom-in-95"
                onClick={() => setQuickActionOpen(!quickActionOpen)}
              >
                <Plus className="size-4" />
                <span className="text-[12px] font-semibold">Buat Baru</span>
                <ChevronDown className={cn(
                  "size-3.5 transition-transform duration-200",
                  quickActionOpen && "rotate-180"
                )} />
              </Button>

              {/* Quick Action Dropdown */}
              {quickActionOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setQuickActionOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-lg border border-sage dark:border-[#414943] bg-white dark:bg-[#1a1a1a] shadow-xl animate-in slide-in-from-top-2 fade-in duration-200 p-1.5">
                    {quickActions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <Link
                          key={action.href}
                          href={action.href}
                          onClick={() => setQuickActionOpen(false)}
                          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-obsidian dark:text-white hover:bg-fog dark:hover:bg-[#2e2e2e] transition-colors"
                        >
                          <span className={cn("size-7 rounded-md flex items-center justify-center text-white", action.color)}>
                            <ActionIcon className="size-3.5" />
                          </span>
                          {action.label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 hover:bg-fog dark:hover:bg-[#2e2e2e] transition-colors"
              title="Notifikasi"
            >
              <Bell className="size-[18px] text-iron dark:text-[#c2c8bd]" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive animate-pulse" />
            </Button>

            {/* User Avatar */}
            <div className="hidden items-center gap-2 pl-2 border-l border-sage dark:border-[#414943] sm:flex">
              <Avatar className="size-8">
                <AvatarImage src={session?.user?.image ?? undefined} alt={fullName} />
                <AvatarFallback className="bg-foreground/10 text-[11px] font-bold">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col leading-tight lg:flex">
                <span className="text-[12px] font-semibold text-obsidian dark:text-white truncate max-w-[100px]">
                  {fullName}
                </span>
                <span className="text-[10px] font-medium text-steel dark:text-[#8c9489] uppercase tracking-wider">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
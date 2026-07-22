"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Store,
  MapPin,
  ImageIcon,
  Building2,
  BarChart3,
  MessageSquare,
  Users,
  Tag,
  ClipboardList,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string";

// ── Types ──────────────────────────────────────────────────────────────────────

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badge?: number | null;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

// ── Menu Definition ────────────────────────────────────────────────────────────

const menuGroups: MenuGroup[] = [
  {
    label: "Utama",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Berita", href: "/dashboard/posts", icon: FileText },
      { label: "Breaking News", href: "/dashboard/breaking-news", icon: Bell },
    ],
  },
  {
    label: "Konten Desa",
    items: [
      { label: "UMKM", href: "/dashboard/umkm", icon: Store },
      { label: "Wisata", href: "/dashboard/wisata", icon: MapPin },
      { label: "Galeri", href: "/dashboard/galeri", icon: ImageIcon },
      { label: "Profil Desa", href: "/dashboard/profil-desa", icon: Building2 },
      { label: "Infografis", href: "/dashboard/infografis", icon: BarChart3 },
    ],
  },
  {
    label: "Pelayanan",
    items: [
      { label: "Layanan", href: "/dashboard/layanan", icon: ClipboardList },
      { label: "Permohonan", href: "/dashboard/permohonan", icon: FileCheck },
    ],
  },
  {
    label: "Pengelolaan",
    items: [
      { label: "Pesan", href: "/dashboard/messages", icon: MessageSquare },
      { label: "Pengguna", href: "/dashboard/users", icon: Users, adminOnly: true },
      { label: "Kategori", href: "/dashboard/categories", icon: Tag },
    ],
  },
];

// ── AdminSidebar Component ─────────────────────────────────────────────────────

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const userRole = (session?.user?.role as string) ?? "";
  const isAdmin = userRole === "ADMIN";

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  const filteredGroups = menuGroups.map((group) => ({
    ...group,
    items: isAdmin
      ? group.items
      : group.items.filter((item) => !item.adminOnly),
  }));

  // ── Sidebar Content ──────────────────────────────────────────────────────────

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white dark:bg-[#1a1a1a]">
      {/* Logo & Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sage dark:border-[#414943] px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Logo Desa Padangloang"
            width={36}
            height={36}
            className="rounded-sm object-contain"
            priority
          />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-extrabold tracking-tight text-obsidian dark:text-white">
                Desa Padangloang
              </span>
              <span className="text-[10px] font-bold tracking-wide text-iron dark:text-[#c2c8bd]">
                Panel Admin
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4">
        {filteredGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {!collapsed && (
              <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-steel dark:text-[#8c9489]">
                {group.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5 px-2">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const isHovered = hoveredItem === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ease-out",
                        active
                          ? "bg-fog dark:bg-[#2e2e2e] text-obsidian dark:text-white"
                          : "text-iron dark:text-[#c2c8bd] hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50 hover:text-obsidian dark:hover:text-white",
                        isHovered && !active && "translate-x-[2px]",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      {/* Active Indicator Bar */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-obsidian dark:bg-white animate-in slide-in-from-left-1 duration-200" />
                      )}

                      <Icon
                        className={cn(
                          "size-[18px] shrink-0 transition-transform duration-200",
                          isHovered && "scale-110",
                          active && "text-obsidian dark:text-white",
                        )}
                      />

                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}

                      {/* Badge */}
                      {!collapsed && item.badge != null && item.badge > 0 && (
                        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white animate-in zoom-in-50 duration-200">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer: User Section + Collapse Toggle */}
      <div className="border-t border-sage dark:border-[#414943] p-3">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Avatar className="size-8 shrink-0">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? "Pengguna"}
                />
                <AvatarFallback className="bg-foreground/10 text-[11px] font-bold text-foreground">
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-obsidian dark:text-white">
                  {session?.user?.name ?? "Pengguna"}
                </p>
                <p className="text-[10px] font-medium text-steel dark:text-[#8c9489] uppercase tracking-wider">
                  {userRole}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 hover:bg-fog dark:hover:bg-[#2e2e2e] transition-colors duration-200"
                onClick={handleSignOut}
                title="Keluar"
              >
                <LogOut className="size-4 text-iron dark:text-[#c2c8bd]" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? "Pengguna"}
              />
              <AvatarFallback className="bg-foreground/10 text-[11px] font-bold text-foreground">
                {getInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-fog dark:hover:bg-[#2e2e2e] transition-colors duration-200"
              onClick={handleSignOut}
              title="Keluar"
            >
              <LogOut className="size-4 text-iron dark:text-[#c2c8bd]" />
            </Button>
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        <Button
          variant="ghost"
          size="icon"
          className="mt-2 hidden h-7 w-full items-center justify-center rounded-md hover:bg-fog dark:hover:bg-[#2e2e2e] transition-colors duration-200 lg:flex"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4 text-steel dark:text-[#8c9489] transition-transform duration-200" />
          ) : (
            <ChevronLeft className="size-4 text-steel dark:text-[#8c9489] transition-transform duration-200" />
          )}
        </Button>
      </div>
    </div>
  );

  // ── Mobile Drawer Overlay ─────────────────────────────────────────────────────

  const mobileOverlay = (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-all duration-300 lg:hidden",
        mobileOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-72 shadow-xl transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen sticky top-0 flex-col border-r border-sage dark:border-[#414943] transition-all duration-300 ease-out",
          collapsed ? "w-[68px]" : "w-[256px]",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-3 z-30 lg:hidden hover:bg-fog dark:hover:bg-[#2e2e2e] rounded-md transition-colors duration-200"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? (
          <X className="size-5 text-obsidian dark:text-white" />
        ) : (
          <Menu className="size-5 text-obsidian dark:text-white" />
        )}
      </Button>

      {/* Mobile Overlay */}
      {mobileOverlay}
    </>
  );
}
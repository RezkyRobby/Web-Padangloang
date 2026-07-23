"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  LogIn,
  UserPlus,
  FileText,
  Bell,
  Users,
  Tag,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  Search,
  ChevronDown,
  History,
  UserCheck,
  Network,
  MapPin,
  Landmark,
  ImageIcon,
  BarChart3,
  Globe,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/string";

// --- Types ---
interface NavLink {
  label: string;
  href: string;
}

interface NavDropdown {
  label: string;
  href: string;
  children: { label: string; href: string; icon: React.ElementType }[];
}

type NavItem = NavLink | NavDropdown;

function isDropdown(item: NavItem): item is NavDropdown {
  return "children" in item;
}

// --- Nav Items untuk Desa Padangloang ---
const profilDropdown: NavDropdown = {
  label: "Profil",
  href: "/profil",
  children: [
    { label: "Sejarah", href: "/profil", icon: History },
    { label: "Visi & Misi", href: "/profil/visi-misi", icon: UserCheck },
    { label: "Struktur Organisasi", href: "/profil/struktur", icon: Network },
    { label: "Perangkat Desa", href: "/profil/perangkat", icon: Users },
  ],
};

const informasiDropdown: NavDropdown = {
  label: "Informasi",
  href: "/news",
  children: [
    { label: "Berita", href: "/news", icon: FileText },
    { label: "Galeri", href: "/galeri", icon: ImageIcon },
    { label: "Infografis", href: "/infografis", icon: BarChart3 },
    { label: "IDM", href: "/idm", icon: Globe },
  ],
};

const potensiDropdown: NavDropdown = {
  label: "Potensi",
  href: "/umkm",
  children: [
    { label: "UMKM", href: "/umkm", icon: Landmark },
    { label: "Wisata", href: "/wisata", icon: MapPin },
  ],
};

const publicLinks: NavItem[] = [
  { label: "Beranda", href: "/" },
  profilDropdown,
  informasiDropdown,
  potensiDropdown,
  { label: "Kontak", href: "/kontak" },
];

const dashboardLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Postingan", href: "/dashboard/posts" },
  { label: "Breaking News", href: "/dashboard/breaking-news" },
  { label: "Pengguna", href: "/dashboard/users" },
  { label: "Kategori", href: "/dashboard/categories" },
  { label: "Pesan", href: "/dashboard/messages" },
];

const dashboardIcons: Record<string, React.ElementType> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/posts": FileText,
  "/dashboard/breaking-news": Bell,
  "/dashboard/users": Users,
  "/dashboard/categories": Tag,
  "/dashboard/messages": MessageSquare,
};

// --- Main Navbar ---
interface NavbarProps {
  variant?: "public" | "dashboard";
}

export default function Navbar({ variant = "public" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when panel opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
    setSearchOpen(false);
    setSearchValue("");
  }

  const userRole = session?.user?.role;
  const isPrivileged = userRole === "EDITOR" || userRole === "ADMIN";
  const isAdmin = userRole === "ADMIN";

  const visibleDashboardLinks = isAdmin
    ? dashboardLinks
    : dashboardLinks.filter((l) => l.href !== "/dashboard/users");

  const links: NavItem[] =
    variant === "dashboard" ? visibleDashboardLinks : publicLinks;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  function toggleMobileDropdown(label: string) {
    setMobileDropdownOpen((prev) => (prev === label ? null : label));
  }

  // Track which dropdown is open
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Desktop Navigation ──
  const renderDesktopNav = () => (
    <ul className="hidden items-center gap-1 md:flex">
      {links.map((link) => {
        if (isDropdown(link)) {
          const dropdownActive =
            (pathname.startsWith(link.href) && link.href !== "/") ||
            openDropdown === link.label;
          return (
            <li key={link.href}>
              <DropdownMenu
                {...(mounted
                  ? {
                      open: openDropdown === link.label,
                      onOpenChange: (open: boolean) =>
                        setOpenDropdown(open ? link.label : null),
                    }
                  : {})}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-[#171717] outline-none transition-all duration-300 hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
                      dropdownActive &&
                        "bg-black/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] dark:bg-white/15 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]",
                      openDropdown === link.label &&
                        "bg-black/10 shadow-[inset_0_1px_4px_rgba(255,255,255,0.8)] dark:bg-white/20"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-300",
                        openDropdown === link.label && "rotate-180"
                      )}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={14}
                  // Tambahkan class "group" di sini agar elemen anak bisa membaca posisi (side) menu
                  className="group relative min-w-56 rounded-2xl border border-white/60 bg-white/50 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#282834]/60 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                  {/* ── Caret / Segitiga Penunjuk yang Dinamis ── */}
                  {/* 1. Jika menu terbuka di BAWAH trigger (panah menghadap KE ATAS) */}
                  <div className="absolute -top-[6px] left-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-tl-[2px] border-l border-t border-white/60 bg-white/80 shadow-[-2px_-2px_4px_rgba(255,255,255,0.4)] backdrop-blur-2xl group-data-[side=bottom]:block dark:border-white/15 dark:bg-[#282834]/90" />
                  
                  {/* 2. Jika menu otomatis terbuka di ATAS trigger (panah menghadap KE BAWAH) */}
                  <div className="absolute -bottom-[6px] left-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-br-[2px] border-b border-r border-white/60 bg-white/80 shadow-[2px_2px_4px_rgba(255,255,255,0.4)] backdrop-blur-2xl group-data-[side=top]:block dark:border-white/15 dark:bg-[#282834]/90" />
                  
                  <DropdownMenuGroup className="relative z-10 flex flex-col gap-1">
                    {link.children.map((child) => {
                      const childActive = pathname === child.href;
                      const ChildIcon = child.icon;
                      return (
                        <DropdownMenuItem
                          key={child.href}
                          asChild
                          className="relative outline-none"
                        >
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#282834]/80 transition-all duration-300 hover:bg-white/70 hover:pl-4 hover:text-[#171717] hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
                              childActive &&
                                "bg-white/90 text-[#171717] shadow-sm dark:bg-white/20 dark:text-white"
                            )}
                          >
                            {/* Glowing Left accent bar for active item */}
                            {childActive && (
                              <span className="absolute left-0 top-1/2 h-1/2 w-[3px] -translate-y-1/2 rounded-r-full bg-[#171717] shadow-[0_0_8px_rgba(23,23,23,0.4)] dark:bg-white dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                            )}
                            <ChildIcon
                              className={cn(
                                "size-4 shrink-0 text-[#282834]/60 transition-colors duration-300 dark:text-white/60",
                                childActive && "text-[#171717] dark:text-white"
                              )}
                            />
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        }
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-[#171717] transition-colors duration-300 hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
                active && "bg-black/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] dark:bg-white/15 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  // ── Mobile Drawer ──
  const renderMobileDrawer = () => (
    <div
      className={cn(
        "fixed inset-0 z-40 transition-all duration-300 md:hidden",
        mobileOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setMobileOpen(false)}
      />
      {/* Drawer */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-72 bg-white/95 shadow-xl backdrop-blur-xl transition-transform duration-300 dark:bg-[#282834]/95",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#dee2de]/20 p-4 dark:border-white/10">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-sm object-contain dark:brightness-0 dark:invert"
                priority
              />
              <span className="text-[15px] font-extrabold text-[#171717] dark:text-white">
                Desa Padangloang
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#171717] hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Drawer Nav Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-1">
              {links.map((link) => {
                if (isDropdown(link)) {
                  const isOpen = mobileDropdownOpen === link.label;
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => toggleMobileDropdown(link.label)}
                        className="flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "size-4 text-[#171717]/60 transition-transform dark:text-white/60",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200 ease-in-out",
                          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <ul className="ml-2 flex flex-col gap-0.5 border-l-2 border-[#dee2de]/30 pl-3 pt-1 dark:border-white/10">
                          {link.children.map((child) => {
                            const childActive = pathname === child.href;
                            const ChildIcon = child.icon;
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileDropdownOpen(null);
                                  }}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-[#171717]/80 transition-colors hover:bg-black/5 hover:text-[#171717] dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
                                    childActive &&
                                      "bg-black/10 font-semibold text-[#171717] dark:bg-white/15 dark:text-white"
                                  )}
                                >
                                  <ChildIcon className="size-4 shrink-0 text-[#171717]/60 dark:text-white/60" />
                                  {child.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                }
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
                        active && "bg-black/10 dark:bg-white/15"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              {/* User menu di mobile drawer */}
              {session?.user && (
                <>
                  <li className="mt-2 border-t border-[#dee2de]/20 pt-2 dark:border-white/10">
                    <Link
                      href="/akun/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <LayoutDashboard className="size-4 shrink-0 text-[#171717]/60 dark:text-white/60" />
                      Dashboard Saya
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/akun/${session.user.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <User className="size-4 shrink-0 text-[#171717]/60 dark:text-white/60" />
                      Profil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-[#171717] transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                    >
                      <LogOut className="size-4 shrink-0 text-[#171717]/60 dark:text-white/60" />
                      Keluar
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-[#dee2de]/20 p-4 dark:border-white/10">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          variant === "dashboard" &&
            "border-b border-foreground/10 bg-background/80 backdrop-blur-md"
        )}
        data-search-open={searchOpen}
      >
        {variant === "dashboard" ? (
          /* ── Dashboard Navbar ── */
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo Desa Padangloang"
                width={36}
                height={36}
                className="rounded-sm object-contain dark:brightness-0 dark:invert"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-extrabold tracking-tight">
                  Desa Padangloang
                </span>
                <span className="text-[10px] font-bold tracking-wide text-foreground/70">
                  Kec. Dua Pitue, Kab. Sidenreng Rappang
                </span>
              </div>
            </Link>

            <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
              {visibleDashboardLinks.map((link) => {
                const Icon = dashboardIcons[link.href];
                const active =
                  link.href === "/dashboard"
                    ? pathname === link.href
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-foreground/10"
                      )}
                    >
                      {Icon && <Icon className="size-4 shrink-0" />}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-9 rounded-full p-0 focus-visible:ring-2"
                  >
                    <Avatar className="size-8">
                      <AvatarImage
                        src={session?.user?.image ?? undefined}
                        alt={session?.user?.name ?? "Pengguna"}
                      />
                      <AvatarFallback className="bg-foreground/10 text-xs text-foreground">
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {session ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <p className="truncate text-sm font-medium text-foreground">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {isPrivileged && (
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                              <LayoutDashboard />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link href="/akun/dashboard">
                            <LayoutDashboard />
                            Dashboard Saya
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/akun/${session.user.id}`}>
                            <User />
                            Profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={handleSignOut}
                        >
                          <LogOut />
                          Keluar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  ) : (
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/signin">
                          <LogIn />
                          Masuk
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/signup">
                          <UserPlus />
                          Daftar
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </nav>
        ) : (
          /* ── Public Navbar (Floating Island — Glassmorphism) ── */
          <nav className="mx-auto mt-3 flex max-w-5xl items-center justify-between rounded-full border border-white/40 bg-white/60 px-6 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#282834]/60 max-md:mx-4 max-md:px-4">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Logo Desa Padangloang"
                width={32}
                height={32}
                className="rounded-sm object-contain dark:brightness-0 dark:invert"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold tracking-tight text-[#171717] dark:text-white max-sm:hidden">
                  Desa Padangloang
                </span>
                <span className="text-[9px] font-bold tracking-wide text-[#6b7280] dark:text-white/70 max-sm:hidden">
                  Kec. Dua Pitue, Kab. Sidenreng Rappang
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            {renderDesktopNav()}

            {/* Right side */}
            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-8 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/30"
                  >
                    <Avatar className="size-7">
                      <AvatarImage
                        src={session?.user?.image ?? undefined}
                        alt={session?.user?.name ?? "Pengguna"}
                      />
                      <AvatarFallback className="bg-black/5 text-[10px] text-[#171717] dark:bg-white/10 dark:text-white">
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 border border-white/60 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#282834]/80"
                >
                  {session ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <p className="truncate text-sm font-medium text-[#282834] dark:text-white">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-[#282834]/60 dark:text-white/60">
                          {session.user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#dee2de]/30 dark:bg-white/10" />
                      <DropdownMenuGroup>
                        {isPrivileged && (
                          <DropdownMenuItem asChild>
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 text-[13px] font-semibold text-[#282834] transition-colors hover:bg-white/60 dark:text-white dark:hover:bg-white/10"
                            >
                              <LayoutDashboard className="size-4" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link
                            href="/akun/dashboard"
                            className="flex items-center gap-3 text-[13px] font-semibold text-[#282834] transition-colors hover:bg-white/60 dark:text-white dark:hover:bg-white/10"
                          >
                            <LayoutDashboard className="size-4" />
                            Dashboard Saya
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/akun/${session.user.id}`}
                            className="flex items-center gap-3 text-[13px] font-semibold text-[#282834] transition-colors hover:bg-white/60 dark:text-white dark:hover:bg-white/10"
                          >
                            <User className="size-4" />
                            Profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={handleSignOut}
                        >
                          <LogOut />
                          Keluar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  ) : (
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/signin"
                          className="flex items-center gap-3 text-[13px] font-semibold text-[#282834] transition-colors hover:bg-white/60 dark:text-white dark:hover:bg-white/10"
                        >
                          <LogIn className="size-4" />
                          Masuk
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/signup"
                          className="flex items-center gap-3 text-[13px] font-semibold text-[#282834] transition-colors hover:bg-white/60 dark:text-white dark:hover:bg-white/10"
                        >
                          <UserPlus className="size-4" />
                          Daftar
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="text-[#171717] hover:bg-black/5 dark:text-white dark:hover:bg-white/10 md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </nav>
        )}
      </header>

      {/* ── Mobile Drawer ── */}
      {variant !== "dashboard" && renderMobileDrawer()}
    </>
  );
}
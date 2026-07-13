# Project Structure — Website Profil Desa Padangloang

> Berisi peta struktur proyek, route map, database models, komponen, dan API routes.
> **Agent WAJIB membaca file ini sebelum mengerjakan task apa pun** (lihat AGENTS.md Section 0.1).

---

## 1. Tech Stack

| Komponen | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| CSS | Tailwind CSS | 4.x |
| Components | shadcn/ui | latest |
| Database | PostgreSQL | latest |
| ORM | Prisma | 7.x |
| Auth | Better-Auth | 1.x |
| Rich Text | TipTap (ProseMirror) | 3.x |
| Image Upload | Cloudinary | 2.x |
| Icons | Lucide React | 0.x |
| Forms | Zod | 4.x |

---

## 2. Struktur Direktori

```
Web-Padangloang/                          # Root proyek
├── app/                                  # Next.js App Router
│   ├── aduan/                            # → /kontak (akan dimodifikasi)
│   ├── akun/[id]/                        # Halaman profil user
│   ├── api/                              # API Routes
│   │   ├── auth/[...all]/                # Better-Auth endpoints
│   │   ├── breaking-news/                # GET, POST, DELETE
│   │   ├── categories/                   # GET (list), POST, [id]
│   │   ├── desa/                         # GET, PUT (single record) ✅
│   │   ├── messages/                     # GET, POST, [id]
│   │   ├── posts/                        # GET, POST, [id]
│   │   ├── profile/[id]/                 # GET, PUT user profile
│   │   ├── umkm/                         # GET (list + limit), POST ✅
│   │   ├── upload/                       # Upload ke Cloudinary
│   │   ├── users/                        # GET, POST, [id]
│   │   └── wisata/                       # GET (list + limit), POST ✅
│   ├── auth/                             # Halaman login/signup
│   ├── dashboard/                        # Admin dashboard
│   │   ├── breaking-news/                # CRUD breaking news
│   │   ├── categories/                   # CRUD kategori
│   │   ├── layout.tsx                    # Admin layout (sidebar)
│   │   ├── messages/                     # Kelola pesan masuk
│   │   ├── page.tsx                      # Dashboard overview
│   │   ├── posts/                        # CRUD berita
│   │   └── users/                        # Manajemen user
│   ├── news/[slug]/                      # Detail berita
│   ├── profil/                           # Profil desa
│   │   ├── pejabat-kodim/                # Struktur organisasi
│   │   ├── sejarah-satuan/               # Sejarah
│   │   └── struktur-organisasi/          # Bagan struktur
│   ├── program-satuan/                   # → /profil/visi-misi (akan dimodif)
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Beranda
│
├── components/                           # Komponen React
│   ├── cards/                            # (belum ada, placeholder target)
│   ├── custom/                           # Komponen custom utama
│   │   ├── breaking-news.tsx
│   │   ├── category-badge.tsx
│   │   ├── color-picker.tsx
│   │   ├── date-range-picker.tsx
│   │   ├── footer.tsx
│   │   ├── image-upload.tsx
│   │   ├── navbar.tsx
│   │   ├── news-card.tsx
│   │   ├── posts-grid.tsx
│   │   ├── scroll-to-top.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── user-multi-select.tsx
│   ├── landing/                          # Komponen landing page ✅
│   │   ├── hero-section.tsx              # Hero ✅
│   │   ├── stats-section.tsx             # Statistik ✅
│   │   └── featured-section.tsx          # UMKM + Wisata ✅
│   ├── ui/                               # shadcn/ui components
│   ├── tiptap-*/                         # TipTap editor components
│   └── galeri/                           # (belum ada, akan dibuat)
│
├── hooks/                                # Custom React hooks
├── lib/                                  # Utility & config
│   ├── auth-client.ts                    # Better-Auth client
│   ├── auth.ts                           # Better-Auth server config
│   ├── dal.ts                            # Data access layer
│   ├── permissions.ts                    # Role-based access
│   ├── prisma.ts                         # Prisma client singleton
│   ├── tiptap-utils.ts
│   └── utils.ts                          # Tailwind helper (cn)
│
├── prisma/                               # Database
│   ├── schema.prisma                     # Schema lengkap
│   ├── seed.ts                           # Seed data
│   └── migrations/                       # Migrasi Prisma
│
├── public/                               # Static assets
├── styles/                               # SCSS (legacy)
├── .env.example
├── AGENTS.md                             # Agent guide & task tracker
├── DESIGN.md                             # Design system reference
├── PROJECT_STRUCTURE.md                  # ← FILE INI
├── PRD_Website_Desa_Padangloang.md       # Product requirement
├── next.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts (via postcss.config.mjs)
```

---

## 3. Route Map — Seluruh Halaman

### 3.1 Public Pages

| # | Route | Tipe | Status | File |
|---|---|---|---|---|
| 1 | `/` | Modified (existing) | ✅ Done | `app/page.tsx` |
| 2 | `/profil` | Modified (existing) | ⬜ Pending | `app/profil/page.tsx` |
| 3 | `/profil/visi-misi` | Modified (ex: program-satuan) | ⬜ Pending | `app/program-satuan/page.tsx` |
| 4 | `/profil/struktur` | Modified (ex: profil-satuan) | ⬜ Pending | `app/profil/struktur-organisasi/` |
| 5 | `/profil/perangkat` | Modified (ex: profil-satuan) | ⬜ Pending | `app/profil/pejabat-kodim/` |
| 6 | `/news` | Modified (existing) | Existing | `app/news/` |
| 7 | `/news/[slug]` | Modified (existing) | Existing | `app/news/[slug]/` |
| 8 | `/umkm` | New | ⬜ Pending | `app/umkm/page.tsx` |
| 9 | `/umkm/[id]` | New | ⬜ Pending | `app/umkm/[id]/page.tsx` |
| 10 | `/wisata` | New | ⬜ Pending | `app/wisata/page.tsx` |
| 11 | `/wisata/[id]` | New | ⬜ Pending | `app/wisata/[id]/page.tsx` |
| 12 | `/galeri` | New | ⬜ Pending | `app/galeri/page.tsx` |
| 13 | `/infografis` | New | ⬜ Pending | `app/infografis/page.tsx` |
| 14 | `/idm` | New | ⬜ Pending | `app/idm/page.tsx` |
| 15 | `/kontak` | Modified (ex: aduan) | ⬜ Pending | `app/aduan/page.tsx` |

### 3.2 Auth

| Route | Status | File |
|---|---|---|
| `/auth/login` | Existing | `app/auth/signin/` |
| `/auth/register` | Existing | `app/auth/signup/` |

### 3.3 Admin Pages

| # | Route | Tipe | Status | File |
|---|---|---|---|---|
| 16 | `/dashboard` | Modified (existing) | ⬜ Pending | `app/dashboard/page.tsx` |
| 17 | `/dashboard/posts` | Existing | Existing | `app/dashboard/posts/` |
| 18 | `/dashboard/breaking-news` | Existing | Existing | `app/dashboard/breaking-news/` |
| 19 | `/dashboard/categories` | Existing | Existing | `app/dashboard/categories/` |
| 20 | `/dashboard/messages` | Existing | Existing | `app/dashboard/messages/` |
| 21 | `/dashboard/users` | Existing | Existing | `app/dashboard/users/` |
| 22 | `/dashboard/umkm` | New | ⬜ Pending | `app/dashboard/umkm/` |
| 23 | `/dashboard/wisata` | New | ⬜ Pending | `app/dashboard/wisata/` |
| 24 | `/dashboard/galeri` | New | ⬜ Pending | `app/dashboard/galeri/` |
| 25 | `/dashboard/profil-desa` | New | ⬜ Pending | `app/dashboard/profil-desa/` |
| 26 | `/dashboard/infografis` | New | ⬜ Pending | `app/dashboard/infografis/` |

### 3.4 API Routes

| Route | Method | Status | File |
|---|---|---|---|
| `/api/desa` | GET, PUT | ✅ Done | `app/api/desa/route.ts` |
| `/api/umkm` | GET (list + limit), POST | ✅ Done | `app/api/umkm/route.ts` |
| `/api/umkm/[id]` | GET, PUT, DELETE | ⬜ Pending | — |
| `/api/wisata` | GET (list + limit), POST | ✅ Done | `app/api/wisata/route.ts` |
| `/api/wisata/[id]` | GET, PUT, DELETE | ⬜ Pending | — |
| `/api/galeri` | GET, POST | ⬜ Pending | — |
| `/api/galeri/[id]` | GET, PUT, DELETE | ⬜ Pending | — |
| `/api/infografis` | GET, POST | ⬜ Pending | — |
| `/api/infografis/[id]` | GET, PUT, DELETE | ⬜ Pending | — |
| `/api/perangkat-desa` | GET, POST | ⬜ Pending | — |
| `/api/perangkat-desa/[id]` | GET, PUT, DELETE | ⬜ Pending | — |
| `/api/upload` | POST | ✅ Done | `app/api/upload/route.ts` |
| `/api/auth/[...all]` | — | Existing | Better-Auth built-in |
| `/api/posts` | GET, POST | Existing | `app/api/posts/route.ts` |
| `/api/categories` | GET, POST | Existing | `app/api/categories/route.ts` |
| `/api/messages` | GET, POST | Existing | `app/api/messages/route.ts` |
| `/api/users` | GET, POST | Existing | `app/api/users/route.ts` |
| `/api/breaking-news` | GET, POST | Existing | `app/api/breaking-news/route.ts` |
| `/api/profile/[id]` | GET, PUT | Existing | `app/api/profile/[id]/route.ts` |

---

## 4. Database Models

### 4.1 Existing (dari PortalBeritaKodim)

| Model | Table | Keterangan |
|---|---|---|
| `User` | `user` | Auth + role (ADMIN, EDITOR, USER) |
| `Session` | `session` | Better-Auth session |
| `Account` | `account` | Better-Auth account |
| `Verification` | `verification` | Better-Auth verifikasi |
| `Post` | `post` | Berita desa (judul, slug, konten, gambar, category, trending, published) |
| `Category` | `category` | Kategori berita |
| `BreakingNews` | `breaking_news` | Pengumuman darurat/breaking news |
| `Message` | `message` | Kontak/pesan dari pengunjung |

### 4.2 New (ditambahkan untuk Padangloang)

| Model | Table | Field Utama | Status |
|---|---|---|---|
| `Desa` | `desa` | nama, sejarah, visi, misi, luasWilayah, jumlahPenduduk, jumlahKK, jumlahDusun, batas* | ✅ Done |
| `PerangkatDesa` | `perangkat_desa` | nama, jabatan, foto, urutan | ✅ Done |
| `UMKM` | `umkm` | namaProduk, deskripsi, harga, kategori, kontak, gambar, pemilik | ✅ Done |
| `Wisata` | `wisata` | nama, deskripsi, lokasi, kategori (enum), gambar | ✅ Done |
| `Galeri` | `galeri` | judul, gambar, kategori, uploadedBy (relasi ke User) | ✅ Done |
| `Infografis` | `infografis` | judul, tahun, dataJson (Json) | ✅ Done |

---

## 5. Komponen yang Tersedia

### 5.1 Landing Page Components (`components/landing/`)

| Komponen | Status | Fungsi |
|---|---|---|
| `HeroSection` | ✅ Done | Hero section beranda dengan overlay gelap, judul & deskripsi desa |
| `StatsSection` | ✅ Done | Statistik desa (luas, penduduk, KK, dusun) — data dari `/api/desa` |
| `FeaturedSection` | ✅ Done | Grid UMKM + Wisata terbaru — data dari `/api/umkm?limit=6` & `/api/wisata?limit=6` |

### 5.2 Custom Components (`components/custom/`)

| Komponen | Status | Fungsi |
|---|---|---|
| `Navbar` | ✅ Existing | Navigasi utama (public mode) |
| `Footer` | ✅ Existing | Footer halaman public |
| `BreakingNews` | ✅ Existing | Breaking news ticker |
| `NewsCard` | ✅ Existing | Card berita |
| `PostsGrid` | ✅ Existing | Grid berita dengan pagination |
| `CategoryBadge` | ✅ Existing | Badge kategori berita |
| `ThemeProvider` | ✅ Existing | next-themes provider |
| `ThemeToggle` | ✅ Existing | Tombol dark/light mode |
| `ImageUpload` | ✅ Existing | Upload ke Cloudinary |
| `ScrollToTop` | ✅ Existing | Tombol scroll to top |

### 5.3 UI Components (`components/ui/` — shadcn/ui)

`Avatar`, `Badge`, `Button`, `Calendar`, `Card`, `Dialog`, `DropdownMenu`, `Field`, `Input`, `Label`, `NavigationMenu`, `Popover`, `Select`, `Separator`, `Skeleton`, `Sonner`, `Table`, `Toggle`

---

## 6. Progress Saat Ini

### Fase Aktif: Fase 2 — Halaman Public (Hari 6-9)

| Task | Status | Keterangan |
|---|---|---|
| 8a. Hero + Statistik | ✅ Done | HeroSection + StatsSection di beranda |
| 8b. Featured UMKM + Wisata | ✅ Done | FeaturedSection di beranda |
| **8c. Galeri + Breaking News** | **⬜ Next** | Galeri foto grid + pengumuman desa |
| 9. Profil | ⬜ | — |
| 10. Visi-Misi | ⬜ | — |
| 11. UMKM + detail | ⬜ | — |
| 12. Wisata + detail | ⬜ | — |
| 13. Galeri | ⬜ | — |
| 14. Infografis + IDM | ⬜ | — |
| 15. Kontak | ⬜ | — |

> Lihat AGENTS.md Section 8 untuk daftar lengkap semua task.

---

## 7. Cara Menjalankan

```bash
# Development
npm run dev

# Database
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Migrasi database
npx prisma db seed        # Seed data

# Verifikasi
npx tsc --noEmit          # TypeScript check
npm run lint              # ESLint check

# Build
npm run build
```

---

*Terakhir diperbarui: Juli 2026*
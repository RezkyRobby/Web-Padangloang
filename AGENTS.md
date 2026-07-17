# Agent Guide — Website Profil Desa Padangloang

Panduan teknis untuk AI agent dalam membangun Website Profil Desa Padangloang, KKN Universitas Hasanuddin.


## 0. Aturan Kerja Agent

### 0.1 Eksekusi Per Run
- SETIAP SATU RUN HANYA mengerjakan **satu task** dari daftar di Section 8
- Jangan melanjutkan ke task berikutnya dalam run yang sama
- Setelah task selesai, **ubah tanda `[ ]` menjadi `[x]`** di daftar Section 8 untuk menandai progress
- Setelah selesai, laporkan hasil dan tunggu perintah untuk run berikutnya
- **Sebelum mulai mengerjakan task apa pun, baca `PROJECT_STRUCTURE.md`** untuk mengetahui struktur proyek terkini, **lalu baca `DESIGN.md`** untuk referensi warna, font, spacing, shadow, dan komponen styling — gunakan sebagai panduan visual di setiap halaman yang dibuat/dimodifikasi

### 0.2 Commit Per Task
- SETELAH setiap task selesai dan sudah diverifikasi, WAJIB melakukan git commit
- Format commit message:

| Task Tipe | Prefix | Contoh |
|---|---|---|
| Setup/migrasi | `chore:` | `chore: clone repo PortalBeritaKodim dan install dependencies` |
| Model/schema baru | `feat(db):` | `feat(db): tambah model Desa, PerangkatDesa, UMKM, Wisata, Galeri, Infografis` |
| Halaman public | `feat(public):` | `feat(public): buat halaman UMKM dan detail produk` |
| Halaman admin | `feat(admin):` | `feat(admin): tambah CRUD UMKM di dashboard` |
| API routes | `feat(api):` | `feat(api): tambah API routes untuk Wisata` |
| Modifikasi | `feat:` | `feat: modifikasi beranda dengan konten desa Padangloang` |
| Testing | `test:` | `test: testing end-to-end semua CRUD` |
| Deploy | `deploy:` | `deploy: konfigurasi Vercel dan deploy` |

- Contoh perintah:
  ```bash
  git add -A
  git commit -m "feat(api): tambah API routes untuk UMKM (list, create, get, update, delete)"
  ```

### 0.3 Verifikasi Per Task
Sebelum commit, pastikan:

1. **TypeScript** — tidak ada error:
   ```bash
   npx tsc --noEmit
   ```
   *(Jika ada error, perbaiki dulu sebelum commit)*

2. **Lint** — tidak ada error (jika tersedia):
   ```bash
   npm run lint
   ```

3. **Build** — tidak broken (jika memungkinkan untuk task yang dikerjakan):
   ```bash
   npm run build
   ```
   *(Untuk task kecil/parsial yang belum bisa di-build, skip langkah ini)*

### 0.4 Dependency Rules (Urutan Wajib)
Task berikut memiliki dependensi dan TIDAK BOLEH dikerjakan sebelum dependensinya selesai:

| Task | Dependensi |
|---|---|
| Migrasi database (Task 4) | Schema Prisma harus selesai (Task 3) |
| Seed data (Task 5) | Migrasi harus selesai (Task 4) |
| Semua API routes (Task 16) | Migrasi harus selesai (Task 4) |
| Halaman public yang panggil DB (semua halaman di Fase 2) | API routes atau Prisma query harus siap |
| Halaman admin CRUD (Task 18-22) | API routes harus selesai (Task 16) |
| Testing (Task 23) | Semua halaman public dan admin harus selesai |

### 0.5 Akhir Run — Wajib Lapor
Setelah commit, laporkan:
1. Task apa yang dikerjakan
2. Perubahan apa saja yang dibuat (file yang ditambah/dimodifikasi)
3. Status verifikasi (TS error/lint/build)
4. Tandai task yang sudah selesai dengan `[x]` di daftar Section 8
5. Task berikutnya yang akan dikerjakan

### 0.6 Konfirmasi Keberhasilan Per Task
Setiap task WAJIB dikonfirmasi keberhasilannya sebelum dianggap selesai.

**Kriteria task SUKSES:**
- Semua perintah dieksekusi dengan exit code = 0 (tidak ada error)
- Verifikasi TypeScript/lint/build di Section 0.3 lolos
- Git commit berhasil (jalankan `git log -1 --oneline` untuk konfirmasi)
- File yang diharapkan sudah ada di filesystem
- Tanda `[ ]` sudah diubah menjadi `[x]` di Section 8

**Kriteria task GAGAL:**
- Ada error yang tidak bisa diperbaiki dalam run ini
- Exit code command ≠ 0
- Verifikasi gagal dan tidak ada solusi langsung

**Jika task SUKSES:**
```laporan
✅ Task X selesai — [nama task]
- Commit: [hash commit]
- Verifikasi: TS ✅ | Lint ✅ | Build ✅
- File diubah: [daftar file]
- Task selanjutnya: [task Y]
```

**Jika task GAGAL:**
```laporan
❌ Task X gagal — [nama task]
- Error: [detail error]
- Langkah yang sudah dicoba: [deskripsi]
```
Jangan commit jika task gagal. Laporkan error dan tunggu arahan.


## 1. Sumber Kode (Base Repository)

Clone dan modifikasi dari: **`RezkyRobby23h/PortalBeritaKodim`**

```
git clone https://github.com/RezkyRobby23h/PortalBeritaKodim.git Web-Padangloang
cd Web-Padangloang
rm -rf .git          # Hapus history git PortalBeritaKodim
git init             # Inisialisasi repo git baru untuk Web-Padangloang
```

**Directory layout target:**
```
KKN/
├── Persiapan/           # Dokumentasi & persiapan (tidak diedit agent)
│   └── docs/
│       ├── PRD_Website_Desa_Padangloang.md
│       ├── agent.md
│       └── design.md
└── Web-Padangloang/     # Project Next.js (clone dari PortalBeritaKodim)
```

---

## 2. Tech Stack

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

## 3. Environment Setup

### 3.1 File `.env`
```
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 3.2 Database
```bash
npx prisma migrate dev --name add_desa_models   # sesuaikan nama migrasi dengan task yang dikerjakan
npx prisma generate
npx prisma db seed  # jika ada seed
```

---

## 4. Struktur Database — Perubahan dari PortalBeritaKodim

### 4.1 Model yang SUDAH ADA (bisa langsung dipakai)
- `User` — autentikasi + role (ADMIN, EDITOR)
- `Session`, `Account`, `Verification` (Better-Auth)
- `Post` — untuk berita desa (judul, slug, konten, gambar, category, trending, published)
- `Category` — kategori berita
- `BreakingNews` — pengumuman darurat/breaking news
- `Message` — kontak/pesan dari pengunjung

### 4.2 Model yang HARUS DITAMBAHKAN

```prisma
model Desa {
  id              String   @id @default(cuid())
  nama            String
  sejarah         String   @db.Text
  visi            String   @db.Text
  misi            String   @db.Text
  luasWilayah     Float?
  jumlahPenduduk  Int?
  jumlahKK        Int?
  jumlahDusun     Int?
  batasUtara      String?
  batasTimur      String?
  batasSelatan    String?
  batasBarat      String?
  fotoKepalaDesa  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("desa")
}

model PerangkatDesa {
  id        String   @id @default(cuid())
  nama      String
  jabatan   String
  foto      String?
  urutan    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("perangkat_desa")
}

model UMKM {
  id         String   @id @default(cuid())
  namaProduk String
  deskripsi  String   @db.Text
  harga      String?
  kategori   String
  kontak     String
  gambar     String?
  pemilik    String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("umkm")
}

model Wisata {
  id         String   @id @default(cuid())
  nama       String
  deskripsi  String   @db.Text
  lokasi     String
  kategori   WisataKategori
  gambar     String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("wisata")
}

enum WisataKategori {
  WISATA_ALAM
  KULINER
  BUDAYA
}

model Galeri {
  id           String   @id @default(cuid())
  judul        String
  gambar       String
  kategori     String
  uploadedById String
  uploadedBy   User     @relation(fields: [uploadedById], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("galeri")
}

model Infografis {
  id        String   @id @default(cuid())
  judul     String
  tahun     Int
  dataJson  Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("infografis")
}
```

---

## 5. Panduan Modifikasi — Halaman Existing

### 5.1 Beranda (`app/page.tsx`)
- **Jangan dihapus**, modifikasi konten:
  - Hero section: ganti judul & deskripsi ke Desa Padangloang
  - Tambah section statistik desa (luas wilayah, penduduk, KK, dusun)
  - Featured UMKM & Wisata (query terbaru)
  - Galeri foto grid
  - Breaking news → pengumuman desa

### 5.2 Profil (`app/profil/`)
- Modifikasi menjadi profil Desa Padangloang
- Data diambil dari model `Desa`

### 5.3 Profil Satuan (`app/profil-satuan/`)
- Ubah menjadi halaman Sejarah atau Visi Misi desa
- Atau digabung ke `/profil` dengan section terpisah

### 5.4 Program Satuan (`app/program-satuan/`)
- Ubah menjadi halaman Visi & Misi desa
- Konten dari model `Desa.visi` dan `Desa.misi`

### 5.5 Berita (`app/news/` & `app/dashboard/posts/`)
- Halaman public: sudah OK, sesuaikan query & tampilan
- Halaman admin CRUD: sudah OK, sesuaikan label & field

### 5.6 Aduan (`app/aduan/`) → Kontak
- Ubah menjadi halaman Kontak & Lokasi
- Tambah Google Maps embed
- Link WhatsApp kantor desa

### 5.7 Auth (`app/auth/`)
- Tidak perlu diubah, langsung pakai

### 5.8 Dashboard (`app/dashboard/`)
- Modifikasi overview dengan data desa
- Tambah menu CRUD UMKM, Wisata, Galeri, Infografis

---

## 6. Panduan — Halaman Baru yang Harus Dibuat

### 6.1 Public Pages

| Route | File | Keterangan |
|---|---|---|
| `/umkm` | `app/umkm/page.tsx` | Katalog UMKM (grid card, filter kategori, pencarian) |
| `/umkm/[id]` | `app/umkm/[id]/page.tsx` | Detail produk UMKM |
| `/wisata` | `app/wisata/page.tsx` | Daftar destinasi wisata/kuliner/budaya |
| `/wisata/[id]` | `app/wisata/[id]/page.tsx` | Detail wisata |
| `/galeri` | `app/galeri/page.tsx` | Grid galeri responsif + lightbox, filter kategori |
| `/infografis` | `app/infografis/page.tsx` | Visualisasi data statistik desa |
| `/idm` | `app/idm/page.tsx` | Indeks Desa Membangun |

### 6.2 Admin Pages

| Route | File | Keterangan |
|---|---|---|
| `/dashboard/umkm` | `app/dashboard/umkm/page.tsx` | List UMKM + CRUD |
| `/dashboard/umkm/new` | `app/dashboard/umkm/new/page.tsx` | Form tambah UMKM |
| `/dashboard/umkm/[id]/edit` | `app/dashboard/umkm/[id]/edit/page.tsx` | Form edit UMKM |
| `/dashboard/wisata` | `app/dashboard/wisata/page.tsx` | List wisata + CRUD |
| `/dashboard/wisata/new` | `app/dashboard/wisata/new/page.tsx` | Form tambah wisata |
| `/dashboard/wisata/[id]/edit` | `app/dashboard/wisata/[id]/edit/page.tsx` | Form edit wisata |
| `/dashboard/galeri` | `app/dashboard/galeri/page.tsx` | Upload & kelola foto galeri |
| `/dashboard/profil-desa` | `app/dashboard/profil-desa/page.tsx` | Edit data desa & perangkat |
| `/dashboard/infografis` | `app/dashboard/infografis/page.tsx` | Kelola data infografis |

---

## 7. API Routes

### 7.1 Route yang perlu ditambahkan

```
app/api/
├── umkm/
│   ├── route.ts          # GET (list), POST (create)
│   └── [id]/
│       └── route.ts      # GET, PUT, DELETE
├── wisata/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── galeri/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── desa/
│   └── route.ts          # GET, PUT (single record)
├── perangkat-desa/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── infografis/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── upload/
    └── route.ts           # Upload gambar ke Cloudinary
```

### 7.2 Pattern API Route (contoh)

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.uMKM.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await prisma.uMKM.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

---

## 8. Urutan Pengerjaan (2 Minggu)

**Progress tracker:** Agent wajib mengubah `[ ]` menjadi `[x]` setelah setiap task selesai.

### Fase 1 — Setup & Database (Hari 1–5)
- [x] 1. Clone repo PortalBeritaKodim ke `Web-Padangloang/` — setelah clone, hapus folder `.git` dan jalankan `git init` agar project siap dipasangi remote repository baru milik KKN
- [x] 2. Install dependencies: `npm install`
- [x] 3. Tambah model `Desa`, `PerangkatDesa`, `UMKM`, `Wisata`, `Galeri`, `Infografis` ke `prisma/schema.prisma`
- [x] 4. Jalankan migrasi: `npx prisma migrate dev --name add_desa_models`
- [x] 5. Buat seed data desa (minimal data Desa Padangloang) — gunakan data dari `PRD_Website_Desa_Padangloang.md` Section 2 (Latar Belakang): luas wilayah 2,75 km², penduduk 1.572–1.599 jiwa, 561 KK, 3 dusun, dan batas wilayah (Utara, Timur, Selatan, Barat)
- [x] 6. Verifikasi auth Better-Auth berjalan
- [x] 7. Setup Cloudinary upload route

### Fase 2 — Halaman Public (Hari 6–9)
- [x] 8a. Beranda: Hero section + statistik desa
- [x] 8b. Beranda: Featured UMKM + Wisata terbaru
- [x] 8c. Beranda: Galeri foto grid + pengumuman desa (breaking news)
- [x] 9. Modifikasi halaman profil dengan data Desa
- [x] 10. Modifikasi halaman visi-misi dari program-satuan
- [x] 11. Buat halaman UMKM + detail
- [x] 12. Buat halaman Wisata + detail (placeholder siap)
- [x] 13. Buat halaman Galeri + lightbox
- [x] 14. Buat halaman Infografis + IDM (placeholder siap)
- [x] 15. Modifikasi halaman kontak + Google Maps

### Fase 3 — Admin & CRUD (Hari 10–12)
- [x] 16a. API routes untuk UMKM (list, create, get, update, delete)
- [x] 16b. API routes untuk Wisata
- [x] 16c. API routes untuk Galeri
- [x] 16d. API routes untuk Desa + PerangkatDesa
- [x] 16e. API routes untuk Infografis
- [ ] 17. Dashboard admin: tambah menu baru
- [ ] 18. Halaman CRUD UMKM (list, create, edit)
- [ ] 19. Halaman CRUD Wisata
- [ ] 20. Halaman kelola Galeri
- [ ] 21. Halaman edit profil desa & perangkat
- [ ] 22. Halaman kelola Infografis

### Fase 4 — Testing & Deploy (Hari 13–14)
- [ ] 23. Testing end-to-end (semua CRUD, auth, tampilan)
- [ ] 24. Responsive testing (mobile, tablet, desktop)
- [ ] 25. Dark mode testing
- [ ] 26. Deploy ke Vercel
- [ ] 27. Dokumentasi serah terima ke perangkat desa


## 9. Konvensi Coding

### 9.1 Naming Convention
- **File/Route:** kebab-case (`profil-desa`, `program-satuan`)
- **Komponen React:** PascalCase (`BeritaCard`, `UMKMCard`)
- **Fungsi:** camelCase (`fetchBerita`, `createUMKM`)
- **Variabel:** camelCase (`isLoading`, `totalPenduduk`)
- **Database Table/Field:** snake_case via `@@map` / `@map` di Prisma

### 9.2 Struktur Komponen
```
components/
├── ui/                 # shadcn/ui (auto-generated)
├── cards/              # BeritaCard, UMKMCard, WisataCard
├── landing/            # HeroSection, StatsSection, HighlightSection
├── galeri/             # GalleryGrid, Lightbox
├── admin/              # AdminSidebar, AdminTable, AdminForm
├── layout/             # Navbar, Footer, MobileMenu
├── maps/               # GoogleMapsEmbed
└── infografis/         # Charts, DataCards
```

### 9.3 Error Handling
- Semua API route wajib try-catch dengan return 500
- Gunakan `console.error()` untuk debugging (jangan `console.log` untuk error)
- Toast notification untuk operasi CRUD (gunakan `sonner`)
- Loading state untuk semua data fetching
- Empty state untuk list kosong
- Skeleton loader untuk halaman yang memuat data

### 9.4 TypeScript
- Wajib strict mode
- Hindari `any`, gunakan proper typing
- Gunakan Prisma generated types dari `@prisma/client`
- Gunakan Zod untuk validasi API input

### 9.5 Struktur Navbar

Floating navigation island (Graphite Night #282834, pill-shaped 50px+ radius, centered horizontally) dengan **5 item**:

| Nav Item | Type | Isi Dropdown | Route |
|---|---|---|---|
| **Beranda** | Link langsung | — | `/` |
| **Profil** | Dropdown ▾ | Sejarah, Visi & Misi, Struktur Organisasi, Perangkat Desa | `/profil`, `/profil/visi-misi`, `/profil/struktur`, `/profil/perangkat` |
| **Informasi** | Dropdown ▾ | Berita, Galeri, Infografis, IDM | `/news`, `/galeri`, `/infografis`, `/idm` |
| **Potensi** | Dropdown ▾ | UMKM, Wisata | `/umkm`, `/wisata` |
| **Kontak** | Link langsung | — | `/kontak` |

**Styling dropdown:**
- Container: Paper (#ffffff) card, 1px Sage (#dee2de) border, radius 8px, multi-layer shadow subtle
- Item: Inter 13px semi-bold, hover background Linen (#f9faf7), padding 12px 16px
- Active state: text bold atau underline
- Pemisah antar item: dot kecil (·) atau spacing 24px

**Navbar rules:**
- Floating di tengah horizontal, tidak menyentuh tepi viewport
- Background Graphite Night (#282834), text putih
- Font: Inter, label size (13px), font-weight semi-bold (600)
- Dropdown muncul pada hover/click dengan transisi cepat
- Di mobile (< 768px): collapse jadi hamburger menu dengan drawer
- Di tablet (768–1023px): tetap horizontal dengan margin 16px

### 9.6 Route Mapping — Seluruh Halaman

| # | Route | Tipe | Category | Stitch Screen |
|---|---|---|---|---|
| 1 | `/` | Modified (existing) | Public | Landing Page (Nav Updated) |
| 2 | `/profil` | Modified (existing) | Public | Profil Desa |
| 3 | `/profil/visi-misi` | Modified (ex: program-satuan) | Public | Visi & Misi Desa |
| 4 | `/profil/struktur` | Modified (ex: profil-satuan) | Public | Bagan Struktur Organisasi |
| 5 | `/profil/perangkat` | Modified (ex: profil-satuan) | Public | Pejabat Desa |
| 6 | `/news` | Modified (existing) | Public | Berita Desa |
| 7 | `/news/[slug]` | Modified (existing) | Public | (existing) |
| 8 | `/umkm` | New | Public | Katalog UMKM |
| 9 | `/umkm/[id]` | New | Public | Detail Produk UMKM |
| 10 | `/wisata` | New | Public | Daftar Wisata |
| 11 | `/wisata/[id]` | New | Public | Detail Wisata |
| 12 | `/galeri` | New | Public | Galeri Foto |
| 13 | `/infografis` | New | Public | Infografis Desa |
| 14 | `/idm` | New | Public | IDM Padangloang |
| 15 | `/kontak` | Modified (ex: aduan) | Public | Layanan Aduan Masyarakat |
| 16 | `/auth/login` | Existing (no change) | Auth | Login Admin |
| 17 | `/dashboard` | Modified (existing) | Admin | Dashboard Admin |
| 18 | `/dashboard/umkm` | New | Admin | Kelola UMKM |
| 19 | `/dashboard/umkm/new` | New | Admin | — |
| 20 | `/dashboard/umkm/[id]/edit` | New | Admin | — |
| 21 | `/dashboard/wisata` | New | Admin | Kelola Wisata |
| 22 | `/dashboard/wisata/new` | New | Admin | — |
| 23 | `/dashboard/wisata/[id]/edit` | New | Admin | — |
| 24 | `/dashboard/galeri` | New | Admin | Kelola Galeri |
| 25 | `/dashboard/profil-desa` | New | Admin | Edit Profil Desa |
| 26 | `/dashboard/infografis` | New | Admin | Kelola Infografis |
| 27 | `/dashboard/posts` | Existing (no change) | Admin | — |

**Keterangan Tipe:**
- **Existing:** Halaman sudah ada dari PortalBeritaKodim, tidak perlu dibuat ulang
- **Modified:** Halaman existing yang dimodifikasi kontennya
- **New:** Halaman baru yang harus dibuat dari awal

---

## 10. Checklist Testing

### Public Pages
- [ ] Beranda menampilkan semua section dengan data benar
- [ ] Profil desa menampilkan data dari database
- [ ] Visi misi tampil dengan baik
- [ ] Daftar berita + detail berita
- [ ] Katalog UMKM + filter + detail
- [ ] Daftar wisata + filter + detail
- [ ] Galeri grid + lightbox + filter
- [ ] Infografis menampilkan data statistik
- [ ] IDM menampilkan data SDGs
- [ ] Kontak + Google Maps + link WhatsApp
- [ ] Dark mode berfungsi di semua halaman

### Admin Pages
- [ ] Login berhasil (Admin & Editor)
- [ ] Dashboard menampilkan overview
- [ ] CRUD Berita (create, read, update, delete)
- [ ] CRUD UMKM
- [ ] CRUD Wisata
- [ ] Upload & hapus galeri
- [ ] Edit profil desa
- [ ] Edit perangkat desa
- [ ] Edit infografis
- [ ] Manajemen pengguna (Super Admin)

### Performance
- [ ] Lighthouse score ≥ 90
- [ ] Image optimization (Next.js Image)
- [ ] Lazy loading untuk galeri
- [ ] Page load < 3 detik

### Responsive
- [ ] Desktop 1920px
- [ ] Laptop 1366px
- [ ] Tablet 768px
- [ ] Mobile 375px

---

## 11. Troubleshooting Common Issues

| Issue | Solusi |
|---|---|
| Prisma client tidak terupdate setelah migrasi | `npx prisma generate` |
| Better-Auth session error | Cek `BETTER_AUTH_SECRET` di `.env` |
| Cloudinary upload gagal | Cek API key & cloud name di `.env` |
| Dark mode flicker | Pastikan `next-themes` `ThemeProvider` di root layout |
| Image broken | Cek URL Cloudinary atau gunakan fallback image |
| Next.js build error | Cek `npx prisma migrate deploy` di `package.json` build script |

---

## 12. Catatan Penting

1. **Jangan hapus file existing** dari PortalBeritaKodim kecuali benar-benar tidak diperlukan
2. **Gunakan TipTap** yang sudah terinstall untuk rich text editing konten berita & halaman
3. **Upload gambar** menggunakan Cloudinary yang sudah terkonfigurasi
4. **Role auth** sudah 3 level: USER, ADMIN, EDITOR — ADMIN bisa kelola pengguna
5. **Dark mode** sudah berfungsi via next-themes, pastikan komponen baru support dark mode
6. **Responsive breakpoints** Tailwind: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

---

*Dokumen panduan untuk AI Agent — Program Kerja Pembuatan Website Profil Desa Padangloang, KKN Universitas Hasanuddin.*
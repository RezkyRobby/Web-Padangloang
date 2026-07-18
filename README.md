<div align="center"> 

# 🏘️ Website Profil Desa Padangloang

### Sistem Informasi Desa Terpadu — KKN Universitas Hasanuddin

![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

[Demo](#) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Dokumentasi](#-dokumentasi)

</div>

---

## 📋 Daftar Isi

- [Tentang Projek](#-tentang-projek)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Struktur Kode](#-struktur-kode)
- [Model Database](#-model-database)
- [API Endpoints](#-api-endpoints)
- [Konfigurasi](#%EF%B8%8F-konfigurasi)
- [Dokumentasi](#-dokumentasi)
- [Kontribusi](#-kontribusi)

---

## 🎯 Tentang Projek

**Website Profil Desa Padangloang** adalah platform digital desa yang dikembangkan sebagai program kerja Kuliah Kerja Nyata (KKN) Universitas Hasanuddin. Website ini bertujuan untuk mempromosikan potensi desa, menyediakan informasi publik, dan menjadi sarana digitalisasi layanan Desa Padangloang, Kecamatan Alu, Kabupaten Polewali Mandar, Sulawesi Barat.

### ✨ Kenapa Projek Ini?

- 🚀 **Performa Tinggi** — Dibangun dengan Next.js App Router untuk SSR & SSG yang cepat
- 🎨 **UI/UX Modern** — Desain minimalis menggunakan Shadcn UI & Tailwind CSS
- 🌓 **Dark Mode** — Dukungan tema gelap untuk kenyamanan membaca
- 📱 **Responsive** — Tampilan optimal di semua perangkat (mobile, tablet, desktop)
- 🔐 **Autentikasi** — Login email/password dan Google OAuth via Better Auth
- ✍️ **Rich Text Editor** — Editor konten lengkap dengan Tiptap
- 🖼️ **Cloud Storage** — Upload gambar otomatis ke Cloudinary
- 📊 **Profil Desa** — Informasi lengkap desa, sejarah, visi-misi, struktur organisasi
- 🗺️ **Potensi Desa** — Katalog UMKM, destinasi wisata, galeri foto, dan infografis

---

## 🎨 Fitur Utama

### 👥 Untuk Pengunjung
- ✅ **Beranda** — Hero section, statistik desa, UMKM & wisata unggulan, galeri foto
- ✅ **Profil Desa** — Sejarah, visi & misi, struktur organisasi, daftar perangkat desa
- ✅ **Berita Desa** — Artikel berita terbaru dengan filter kategori
- ✅ **UMKM** — Katalog produk UMKM dengan filter kategori dan pencarian
- ✅ **Wisata** — Daftar destinasi wisata alam, kuliner, dan budaya
- ✅ **Galeri Foto** — Grid galeri responsif dengan lightbox dan filter kategori
- ✅ **Infografis** — Visualisasi data statistik desa
- ✅ **IDM** — Informasi Indeks Desa Membangun
- ✅ **Kontak** — Halaman kontak dengan Google Maps embed dan link WhatsApp
- ✅ **Dark/Light Mode** — Toggle tema sesuai preferensi

### 🔧 Untuk Admin & Editor
- ✅ **Dashboard** — Panel manajemen konten terpusat
- ✅ **CRUD Berita** — Tambah, edit, hapus, dan publikasi berita
- ✅ **Rich Text Editor** — Editor Tiptap dengan format teks, gambar, heading, dll
- ✅ **Upload Gambar** — Upload thumbnail ke Cloudinary
- ✅ **Manajemen Kategori** — Atur kategori berita beserta warna
- ✅ **CRUD UMKM** — Kelola data produk UMKM desa
- ✅ **CRUD Wisata** — Kelola data destinasi wisata
- ✅ **Kelola Galeri** — Upload dan kelola foto galeri desa
- ✅ **Edit Profil Desa** — Update data desa dan perangkat desa
- ✅ **Kelola Infografis** — Atur data statistik infografis
- ✅ **Manajemen Pengguna** — Kelola akun dan peran pengguna (Admin/Editor/User)
- ✅ **Breaking News** — Update teks pengumuman desa secara langsung
- ✅ **Pesan Masuk** — Kelola pesan dari pengunjung

---

## 🛠 Teknologi

### Frontend Framework
- **Next.js 16.x** — React framework dengan App Router, SSR & SSG
- **React 19.x** — UI Library untuk komponen interaktif
- **Tailwind CSS 4.x** — Utility-first CSS framework

### UI & Komponen
- **Shadcn UI** — Komponen UI berbasis Radix UI
- **Radix UI** — Komponen primitif yang aksesibel
- **Lucide React** — Icon library modern
- **next-themes** — Dark/Light mode management
- **Tiptap 3.x** — Rich text editor yang powerful dan extensible

### Backend & Database
- **Prisma 7.x** — ORM modern dengan type-safety penuh
- **PostgreSQL** — Database relasional
- **Better Auth 1.x** — Sistem autentikasi (Email/Password & Google OAuth)
- **Cloudinary** — Cloud storage untuk gambar dan media
- **Zod 4.x** — Schema validation untuk form dan API

### DevTools
- **TypeScript 5.x** — Type safety end-to-end
- **ESLint** — Code linting
- **Docker** — Containerisasi database PostgreSQL
- **Sass** — CSS preprocessor untuk styling tambahan

---

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- **Node.js** versi 18.x atau lebih tinggi
- **npm** atau **pnpm** atau **yarn**
- **Docker** (untuk menjalankan PostgreSQL via Docker Compose)
- Akun **Cloudinary** (untuk upload gambar)

### Langkah Instalasi

1️⃣ **Clone Repository**
```bash
git clone https://github.com/RezkyRobby/Web-Padangloang.git
cd Web-Padangloang
```

2️⃣ **Install Dependencies**
```bash
npm install
```

3️⃣ **Setup Environment Variables**

Buat file `.env` di root project lalu isi berdasarkan contoh di file `.env.example`:
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

4️⃣ **Jalankan Database dengan Docker**
```bash
docker compose up -d
```

5️⃣ **Jalankan Migrasi & Generate Prisma Client**
```bash
npx prisma migrate dev
npx prisma generate
```

6️⃣ **Seed Data Desa**
```bash
npx prisma db seed
```

---

## 🚀 Cara Menjalankan

### Development Mode

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

- 🏠 Halaman Utama: `http://localhost:3000/`
- ⚙️ Dashboard: `http://localhost:3000/dashboard`
- 🔐 Halaman Login: `http://localhost:3000/auth/signin`

### Production Build

```bash
# Build aplikasi (otomatis menjalankan prisma migrate deploy & generate)
npm run build

# Jalankan production server
npm run start
```

### Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server dengan hot-reload |
| `npm run build` | Build aplikasi untuk production (+ prisma migrate & generate) |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint untuk pengecekan kode |
| `npx tsc --noEmit` | TypeScript type checking |
| `npx prisma studio` | Membuka Prisma Studio (GUI database) |

---

## 📁 Struktur Kode

```
Web-Padangloang/
│
├── 📂 app/                             # Next.js App Router
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Halaman beranda (/)
│   ├── globals.css                    # Global styles
│   ├── 📂 api/                        # API Route Handlers
│   │   ├── auth/[...all]/             # Better Auth endpoints
│   │   ├── posts/                     # CRUD berita
│   │   │   └── [id]/                  # GET, PUT, PATCH, DELETE single post
│   │   ├── categories/                # CRUD kategori
│   │   │   └── [id]/                  # DELETE single kategori
│   │   ├── users/                     # CRUD pengguna
│   │   │   └── [id]/                  # PATCH, DELETE single user
│   │   ├── breaking-news/             # CRUD pengumuman desa
│   │   │   └── [id]/                  # PATCH, DELETE single breaking news
│   │   ├── messages/                  # CRUD pesan pengunjung
│   │   │   └── [id]/                  # GET, PATCH, DELETE single pesan
│   │   ├── upload/                    # POST upload gambar ke Cloudinary
│   │   ├── profile/[id]/              # GET & PATCH profil pengguna
│   │   ├── desa/                      # GET, PUT data desa
│   │   ├── perangkat-desa/            # CRUD perangkat desa
│   │   │   └── [id]/                  # GET, PUT, DELETE single perangkat
│   │   ├── umkm/                      # CRUD UMKM
│   │   │   └── [id]/                  # GET, PUT, DELETE single UMKM
│   │   ├── wisata/                    # CRUD wisata
│   │   │   └── [id]/                  # GET, PUT, DELETE single wisata
│   │   ├── galeri/                    # CRUD galeri
│   │   │   └── [id]/                  # GET, PUT, DELETE single galeri
│   │   └── infografis/                # CRUD infografis
│   │       └── [id]/                  # GET, PUT, DELETE single infografis
│   ├── 📂 auth/                       # Halaman autentikasi
│   │   ├── signin/                    # Halaman login
│   │   └── signup/                    # Halaman registrasi
│   ├── 📂 dashboard/                  # Panel admin/editor
│   │   ├── page.tsx                   # Dashboard overview
│   │   ├── posts/                     # Manajemen berita
│   │   ├── categories/                # Manajemen kategori
│   │   ├── users/                     # Manajemen pengguna
│   │   ├── breaking-news/             # Manajemen pengumuman
│   │   ├── messages/                  # Manajemen pesan
│   │   ├── umkm/                      # Manajemen UMKM
│   │   │   ├── new/                   # Form tambah UMKM
│   │   │   └── [id]/edit/             # Form edit UMKM
│   │   ├── wisata/                    # Manajemen wisata
│   │   ├── galeri/                    # Manajemen galeri
│   │   ├── profil-desa/               # Edit data desa & perangkat
│   │   └── infografis/                # Manajemen infografis
│   ├── 📂 profil/                     # Halaman profil desa
│   │   ├── page.tsx                   # Profil utama
│   │   ├── visi-misi/                 # Visi & misi
│   │   ├── struktur-organisasi/       # Bagan struktur
│   │   └── pejabat-kodim/             # Perangkat desa
│   ├── 📂 news/[slug]/                # Halaman detail berita
│   ├── 📂 umkm/                       # Katalog UMKM
│   │   └── [id]/                      # Detail produk UMKM
│   ├── 📂 wisata/                     # Daftar wisata
│   │   └── [id]/                      # Detail wisata
│   ├── 📂 galeri/                     # Galeri foto
│   ├── 📂 infografis/                 # Infografis desa
│   ├── 📂 idm/                        # IDM (Indeks Desa Membangun)
│   ├── 📂 kontak/                     # Halaman kontak + Maps
│   └── 📂 akun/[id]/                  # Profil pengguna
│
├── 📂 components/                      # React components
│   ├── 📂 landing/                    # Komponen landing page
│   │   ├── hero-section.tsx           # Hero section beranda
│   │   ├── stats-section.tsx          # Statistik desa
│   │   └── featured-section.tsx       # UMKM & wisata unggulan
│   ├── 📂 custom/                     # Komponen kustom aplikasi
│   │   ├── navbar.tsx                 # Navigation bar (floating)
│   │   ├── footer.tsx                 # Footer
│   │   ├── news-card.tsx              # Card berita
│   │   ├── posts-grid.tsx             # Grid tampilan berita
│   │   ├── breaking-news.tsx          # Pengumuman ticker
│   │   ├── category-badge.tsx         # Badge kategori
│   │   ├── image-upload.tsx           # Upload gambar ke Cloudinary
│   │   ├── theme-provider.tsx         # Dark/light mode provider
│   │   └── theme-toggle.tsx           # Toggle dark/light mode
│   ├── 📂 cards/                      # Card komponen (UMKM, Wisata)
│   ├── 📂 admin/                      # Komponen admin
│   │   ├── AdminSidebar.tsx           # Sidebar dashboard
│   │   └── DashboardShell.tsx         # Shell layout dashboard
│   ├── 📂 galeri/                     # Komponen galeri (lightbox)
│   ├── 📂 infografis/                 # Komponen infografis (charts)
│   ├── 📂 tiptap-ui/                  # Komponen UI Tiptap editor
│   ├── 📂 tiptap-extension/           # Ekstensi kustom Tiptap
│   ├── 📂 tiptap-icons/               # Icon kustom Tiptap
│   ├── 📂 tiptap-node/                # Node kustom Tiptap
│   ├── 📂 tiptap-templates/           # Template editor Tiptap
│   ├── 📂 tiptap-ui-primitive/        # Komponen primitif Tiptap UI
│   └── 📂 ui/                         # Komponen Shadcn UI
│
├── 📂 lib/                             # Library & utilitas server
│   ├── auth.ts                        # Konfigurasi Better Auth
│   ├── auth-client.ts                 # Better Auth client
│   ├── dal.ts                         # Data Access Layer
│   ├── permissions.ts                 # Konfigurasi izin akses
│   ├── prisma.ts                      # Prisma client instance
│   ├── tiptap-utils.ts                # Utilitas Tiptap
│   ├── utils.ts                       # Fungsi utilitas umum
│   └── schemas/                       # Zod validation schemas
│       ├── desa.ts                    # Schema validasi data desa
│       ├── perangkat-desa.ts          # Schema validasi perangkat desa
│       ├── umkm.ts                    # Schema validasi UMKM
│       ├── wisata.ts                  # Schema validasi wisata
│       ├── galeri.ts                  # Schema validasi galeri
│       └── infografis.ts              # Schema validasi infografis
│
├── 📂 prisma/                          # Prisma ORM
│   ├── schema.prisma                  # Schema database
│   ├── seed.ts                        # Seed data desa Padangloang
│   └── migrations/                    # Riwayat migrasi database
│
├── 📂 hooks/                           # Custom React hooks
├── 📂 utils/                           # Fungsi utilitas
├── 📂 styles/                          # SCSS styles tambahan
├── 📂 public/                          # Static assets
│
├── 📄 AGENTS.md                       # Panduan untuk AI agent
├── 📄 DESIGN.md                       # Design system reference
├── 📄 PROJECT_STRUCTURE.md            # Peta struktur proyek
├── 📄 PRD_Website_Desa_Padangloang.md # Product requirement document
├── 📄 docker-compose.yml              # Konfigurasi Docker (PostgreSQL)
├── 📄 next.config.ts                  # Konfigurasi Next.js
├── 📄 prisma.config.ts                # Konfigurasi Prisma
├── 📄 proxy.ts                        # Konfigurasi proxy
├── 📄 tsconfig.json                   # Konfigurasi TypeScript
├── 📄 postcss.config.mjs              # Konfigurasi PostCSS (Tailwind)
└── 📄 package.json                    # Dependencies & scripts
```

---

## 🗂 Model Database

### Model dari PortalBeritaKodim

| Model | Table | Fungsi |
|-------|-------|--------|
| `User` | `user` | Data pengguna dengan role (USER / EDITOR / ADMIN) |
| `Session` | `session` | Sesi autentikasi pengguna (Better Auth) |
| `Account` | `account` | Akun OAuth provider (Google, dll) |
| `Verification` | `verification` | Verifikasi akun (Better Auth) |
| `Post` | `post` | Artikel berita desa |
| `Category` | `category` | Kategori berita |
| `BreakingNews` | `breaking_news` | Pengumuman desa (ticker) |
| `Message` | `message` | Pesan masuk dari pengunjung |

### Model Baru — Khusus Desa Padangloang

| Model | Table | Field Utama |
|-------|-------|-------------|
| `Desa` | `desa` | nama, sejarah, visi, misi, luasWilayah, jumlahPenduduk, jumlahKK, jumlahDusun, batasUtara/Timur/Selatan/Barat, fotoKepalaDesa |
| `PerangkatDesa` | `perangkat_desa` | nama, jabatan, foto, urutan |
| `UMKM` | `umkm` | namaProduk, deskripsi, harga, kategori, kontak, gambar, pemilik |
| `Wisata` | `wisata` | nama, deskripsi, lokasi, kategori (WISATA_ALAM / KULINER / BUDAYA), gambar |
| `Galeri` | `galeri` | judul, gambar, kategori, uploadedBy (relasi ke User) |
| `Infografis` | `infografis` | judul, tahun, dataJson (JSON) |

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints — Umum

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/desa` | Ambil data desa |
| `PUT` | `/api/desa` | Update data desa |
| `GET` | `/api/perangkat-desa` | Ambil semua perangkat desa |
| `POST` | `/api/perangkat-desa` | Tambah perangkat desa |
| `GET` | `/api/perangkat-desa/[id]` | Ambil detail perangkat |
| `PUT` | `/api/perangkat-desa/[id]` | Update perangkat desa |
| `DELETE` | `/api/perangkat-desa/[id]` | Hapus perangkat desa |
| `POST` | `/api/upload` | Upload gambar ke Cloudinary |

### Endpoints — UMKM

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/umkm` | Ambil semua UMKM (support `?limit=n` & `?kategori=x`) |
| `POST` | `/api/umkm` | Tambah UMKM baru |
| `GET` | `/api/umkm/[id]` | Ambil detail UMKM |
| `PUT` | `/api/umkm/[id]` | Update UMKM |
| `DELETE` | `/api/umkm/[id]` | Hapus UMKM |

### Endpoints — Wisata

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/wisata` | Ambil semua wisata (support `?limit=n` & `?kategori=x`) |
| `POST` | `/api/wisata` | Tambah wisata baru |
| `GET` | `/api/wisata/[id]` | Ambil detail wisata |
| `PUT` | `/api/wisata/[id]` | Update wisata |
| `DELETE` | `/api/wisata/[id]` | Hapus wisata |

### Endpoints — Galeri & Infografis

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/galeri` | Ambil semua galeri (support `?kategori=x`) |
| `POST` | `/api/galeri` | Tambah foto galeri |
| `GET` | `/api/galeri/[id]` | Ambil detail galeri |
| `PUT` | `/api/galeri/[id]` | Update galeri |
| `DELETE` | `/api/galeri/[id]` | Hapus galeri |
| `GET` | `/api/infografis` | Ambil semua infografis |
| `POST` | `/api/infografis` | Tambah infografis |
| `GET` | `/api/infografis/[id]` | Ambil detail infografis |
| `PUT` | `/api/infografis/[id]` | Update infografis |
| `DELETE` | `/api/infografis/[id]` | Hapus infografis |

### Endpoints — Existing (dari PortalBeritaKodim)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/posts` | Ambil semua berita |
| `POST` | `/api/posts` | Buat berita baru |
| `GET` | `/api/posts/[id]` | Ambil detail berita |
| `PUT` | `/api/posts/[id]` | Update berita (full) |
| `PATCH` | `/api/posts/[id]` | Update berita sebagian |
| `DELETE` | `/api/posts/[id]` | Hapus berita |
| `GET` | `/api/categories` | Ambil semua kategori |
| `POST` | `/api/categories` | Buat kategori baru |
| `DELETE` | `/api/categories/[id]` | Hapus kategori |
| `GET` | `/api/breaking-news` | Ambil pengumuman |
| `POST` | `/api/breaking-news` | Buat pengumuman |
| `PATCH` | `/api/breaking-news/[id]` | Update pengumuman |
| `DELETE` | `/api/breaking-news/[id]` | Hapus pengumuman |
| `GET` | `/api/users` | Ambil semua pengguna |
| `PATCH` | `/api/users/[id]` | Update pengguna |
| `DELETE` | `/api/users/[id]` | Hapus pengguna |
| `GET` | `/api/messages` | Ambil semua pesan |
| `POST` | `/api/messages` | Kirim pesan baru |
| `PATCH` | `/api/messages/[id]` | Update status pesan |
| `DELETE` | `/api/messages/[id]` | Hapus pesan |
| `GET` | `/api/profile/[id]` | Ambil profil pengguna |
| `PATCH` | `/api/profile/[id]` | Update profil pengguna |
| `ALL` | `/api/auth/*` | Endpoint autentikasi Better Auth |

---

## ⚙️ Konfigurasi

### Next.js Config (`next.config.ts`)

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' }, // Cloudinary images
    ],
  },
};
```

### Docker Compose (`docker-compose.yml`)

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: padangloang_db
    restart: always
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypassword
      - POSTGRES_DB=padangloang
    ports:
      - "5432:5432"
```

---

## 📚 Dokumentasi

Dokumentasi lengkap proyek tersedia di file:

| File | Deskripsi |
|------|-----------|
| `AGENTS.md` | Panduan kerja AI agent, task tracker, konvensi coding |
| `DESIGN.md` | Design system (warna, font, spacing, shadow, komponen) |
| `PROJECT_STRUCTURE.md` | Peta struktur proyek, route map, database, komponen |
| `PRD_Website_Desa_Padangloang.md` | Product requirement document |

---

## 🤝 Kontribusi

Proyek ini adalah bagian dari program KKN Universitas Hasanuddin. Kontribusi dari mahasiswa dan developer sangat diterima!

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/NamaFitur`)
3. Commit perubahan (`git commit -m 'feat: tambah fitur X'`)
4. Push ke branch (`git push origin feature/NamaFitur`)
5. Buat Pull Request

> Format commit message mengikuti konvensi di `AGENTS.md`:
> - `feat(public):` — halaman public
> - `feat(admin):` — halaman admin
> - `feat(api):` — API routes
> - `chore:` — setup/migrasi
> - `test:` — testing
> - `deploy:` — deploy

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Tim Pengembang

Website Profil Desa Padangloang dikembangkan oleh mahasiswa KKN Universitas Hasanuddin.

**Tim Developer:**
- Rezky Robbyyanto A
- Yousran
- Arelio Palinoan

---

## 📞 Kontak & Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/RezkyRobby/Web-Padangloang/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/RezkyRobby/Web-Padangloang/discussions)
- 📧 **Email**: akbarirr23h@student.unhas.ac.id

---

<div align="center">

### ⭐ Jika proyek ini bermanfaat, jangan lupa beri bintang!

**Made with Next.js 🚀 • React ⚛️ • Tailwind 🎨 • Prisma 🔷 • PostgreSQL 🐘**

**KKN Universitas Hasanuddin — Desa Padangloang 2026**

</div>

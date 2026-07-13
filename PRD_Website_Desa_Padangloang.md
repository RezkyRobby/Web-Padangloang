# Product Requirement Document (PRD)

## Website Profil Desa Padangloang — KKN Universitas Hasanuddin

---

## 1. Executive Summary

Proyek ini bertujuan untuk membangun **Website Profil Desa Padangloang**, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Website ini dikembangkan sebagai bagian dari program Kuliah Kerja Nyata (KKN) Universitas Hasanuddin. Platform ini akan menjadi pusat informasi digital desa yang menampilkan profil desa, potensi wisata, UMKM lokal, berita kegiatan, serta galeri dokumentasi. Dikembangkan menggunakan teknologi modern (Next.js, Tailwind CSS, Prisma, PostgreSQL) agar responsif, cepat, dan mudah dikelola.

---

## 2. Latar Belakang

Desa Padangloang memiliki luas wilayah sekitar **2,75 km²** dengan jumlah penduduk berkisar antara **1.572–1.599 jiwa** (561 KK). Desa ini terbagi menjadi **3 dusun** dan berbatasan dengan:
- **Utara:** Desa Ajubissue (Kec. Pitu Riawa)
- **Timur:** Desa Padangloang Alau
- **Barat:** Desa Sumpang Mango (Kec. Pitu Riawa)

**Potensi utama desa:**
- **Sektor Pertanian:** Mayoritas penduduk bekerja sebagai petani padi sawah. Kecamatan Dua Pitue merupakan lumbung pangan utama Sidrap.
- **Sektor Peternakan:** Sentra ayam ras petelur yang menjadi penggerak ekonomi masyarakat.

Dengan potensi besar ini, Desa Padangloang membutuhkan media digital untuk mempromosikan potensi desa, memperkenalkan UMKM lokal, serta menyediakan informasi publik yang transparan dan mudah diakses.

---

## 3. Tujuan

1. Menyediakan platform informasi digital terpadu untuk Desa Padangloang
2. Mempromosikan potensi desa (pertanian, peternakan, UMKM, wisata) ke khalayak luas
3. Memudahkan perangkat desa dalam mengelola dan menyebarkan informasi publik
4. Mendokumentasikan kegiatan KKN dan program kerja secara digital
5. Meningkatkan transparansi informasi desa kepada masyarakat

---

## 4. Target Pengguna

| Pengguna | Kebutuhan |
|---|---|
| **Masyarakat Desa** | Mendapatkan informasi desa, berita, UMKM, dan galeri |
| **Perangkat Desa** | Mengelola konten website (berita, profil, galeri) |
| **Wisatawan / Pengunjung** | Melihat potensi wisata, kuliner, dan budaya desa |
| **Investor / Mitra** | Melihat potensi ekonomi dan UMKM desa |
| **Tim KKN** | Mendokumentasikan program kerja dan kegiatan |

---

## 5. Fitur & Fungsionalitas

### 5.1 Modul Public (Tanpa Login)

| No | Fitur | Deskripsi |
|---|---|---|
| 1 | **Landing Page / Beranda** | Hero section, statistik desa, highlight potensi, berita terbaru, galeri |
| 2 | **Profil Desa** | Sejarah, visi misi, data geografis & demografis, struktur pemerintahan |
| 3 | **Berita & Kegiatan** | Daftar artikel berita desa dengan filter & pencarian, detail berita |
| 4 | **UMKM & Produk Lokal** | Katalog produk UMKM, detail produk, kontak penjual, filter kategori |
| 5 | **Wisata & Potensi** | Destinasi wisata, kuliner khas, budaya & tradisi |
| 6 | **Galeri Foto** | Grid galeri responsif dengan lightbox, filter kategori |
| 7 | **Kontak & Lokasi** | Google Maps, kontak WhatsApp, alamat kantor desa |
| 8 | **Infografis** | Visualisasi data statistik desa interaktif (demografi, APBDes, pendidikan, kesehatan) |
| 9 | **IDM (Indeks Desa Membangun)** | Status IDM desa, skor 3 pilar (sosial, ekonomi, ekologi), capaian SDGs Desa |

### 5.2 Modul Admin (Login Diperlukan)

| No | Fitur | Deskripsi |
|---|---|---|
| 1 | **Dashboard Admin** | Overview statistik, aktivitas terbaru |
| 2 | **Kelola Berita** | CRUD berita (tambah, edit, hapus, publish) |
| 3 | **Kelola UMKM** | CRUD produk UMKM |
| 4 | **Kelola Wisata** | CRUD destinasi wisata |
| 5 | **Kelola Galeri** | Upload & kelola foto galeri |
| 6 | **Kelola Profil Desa** | Edit data profil desa, perangkat desa |
| 7 | **Kelola Pengguna** | Manajemen admin/editor (Super Admin) |
| 8 | **Kelola Infografis** | Update data statistik desa & IDM |

### 5.3 Modul Autentikasi

| No | Fitur | Deskripsi |
|---|---|---|
| 1 | **Login** | Autentikasi email/password via Better-Auth |
| 2 | **Register** | Registrasi akun (dengan approval admin) |
| 3 | **Role Management** | Role: Admin, Editor |

---

## 6. Tech Stack

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR, API routes, front-end terpadu |
| **Front-end Library** | React 18/19 | UI interaktif |
| **CSS Framework** | Tailwind CSS | Utility-first, responsif, dark mode |
| **UI Components** | shadcn/ui | Komponen aksesibel & kustomizable |
| **Database** | PostgreSQL | Database relasional |
| **ORM** | Prisma ORM | Type-safe database access |
| **Autentikasi** | Better-Auth | Manajemen sesi aman |
| **Otorisasi** | CASL | Ability-based authorization per role |
| **Rich Text Editor** | TipTap (ProseMirror) | WYSIWYG editor untuk konten berita & halaman |
| **Deployment** | Vercel | CI/CD, hosting global |

---

## 7. Struktur Database (Prisma Schema)

### 7.1 Model-Model

```
User
├── id (UUID)
├── email (String, unique)
├── password (String, hashed)
├── name (String)
├── role (Enum: ADMIN, EDITOR)
├── image (String, nullable)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Desa
├── id (UUID)
├── nama (String)
├── sejarah (Text)
├── visiMisi (Text)
├── luasWilayah (Float)
├── jumlahPenduduk (Int)
├── jumlahKK (Int)
├── jumlahDusun (Int)
├── batasUtara (String)
├── batasTimur (String)
├── batasBarat (String)
├── komposisiGender (JSON)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Berita
├── id (UUID)
├── judul (String)
├── slug (String, unique)
├── konten (Text)
├── gambar (String, nullable)
├── penulisId (UUID, FK → User)
├── publishedAt (DateTime, nullable)
├── createdAt (DateTime)
└── updatedAt (DateTime)

UMKM
├── id (UUID)
├── namaProduk (String)
├── deskripsi (Text)
├── harga (String)
├── kategori (String)
├── kontak (String)
├── gambar (String, nullable)
├── pemilik (String)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Wisata
├── id (UUID)
├── nama (String)
├── deskripsi (Text)
├── lokasi (String)
├── kategori (Enum: WISATA_ALAM, KULINER, BUDAYA)
├── gambar (String, nullable)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Galeri
├── id (UUID)
├── judul (String)
├── gambar (String)
├── kategori (String)
├── uploadedById (UUID, FK → User)
├── createdAt (DateTime)
└── updatedAt (DateTime)

PerangkatDesa
├── id (UUID)
├── nama (String)
├── jabatan (String)
├── foto (String, nullable)
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

---

## 8. User Flow

### 8.1 Pengunjung (Public)
```
Beranda → Lihat Profil Desa → Lihat Berita → Detail Berita
        → Lihat UMKM → Detail UMKM
        → Lihat Wisata → Detail Wisata
        → Lihat Galeri → Lightbox Foto
        → Hubungi / Lokasi
```

### 8.2 Admin
```
Login → Dashboard → Kelola Berita (CRUD)
                  → Kelola UMKM (CRUD)
                  → Kelola Wisata (CRUD)
                  → Kelola Galeri (Upload/Hapus)
                  → Kelola Profil Desa (Edit)
                  → Kelola Pengguna (Admin only)
```

---

## 9. Non-Functional Requirements

| Aspek | Spesifikasi |
|---|---|
| **Responsivitas** | Tampilan optimal di desktop, tablet, dan smartphone |
| **Dark Mode** | Mendukung tema terang & gelap (Tailwind dark mode) |
| **Performa** | Lighthouse score ≥ 90 untuk Performance, Accessibility, SEO |
| **Keamanan** | Autentikasi aman (Better-Auth), hashed password, HTTPS |
| **SEO** | SSR untuk halaman public, meta tags, Open Graph |
| **Aksesibilitas** | Menggunakan komponen shadcn/ui yang aksesibel |
| **Maintainability** | Kode terstruktur, modular, dokumentasi jelas |

---

## 10. Timeline & Milestone

| Fase | Kegiatan | Durasi |
|---|---|---|
| **Fase 1** | Inisialisasi project, setup environment, database, & autentikasi | 5 hari |
| **Fase 2** | Layout, komponen utama & halaman public (Beranda, Profil, Berita, UMKM, Wisata, Galeri, Infografis, IDM) | 4 hari |
| **Fase 3** | Dashboard admin, CRUD, testing & debugging | 3 hari |
| **Fase 4** | Deployment ke Vercel, dokumentasi & serah terima | 2 hari |
| **Total** | | **14 hari (2 minggu)** |

---

## 11. Kriteria Keberhasilan (Success Metrics)

- Website berhasil di-deploy dan dapat diakses publik via Vercel
- Semua halaman public menampilkan konten dengan benar
- Admin dapat login dan melakukan CRUD data
- Galeri foto dapat di-upload dan ditampilkan
- Website responsif di perangkat mobile
- Dark mode berfungsi dengan baik
- Waktu loading halaman < 3 detik

---

## 12. Risks & Mitigation

| Risiko | Mitigasi |
|---|---|
| Keterbatasan data desa | Koordinasi dengan perangkat desa untuk pengumpulan data |
| Keterbatasan akses internet | Optimalisasi performa & lazy loading |
| Perubahan kebutuhan | Pendekatan agile dengan iterasi cepat |
| Keamanan data | Implementasi autentikasi & otorisasi ketat |

---

## 13. Glossary

| Istilah | Definisi |
|---|---|
| **SSR** | Server-Side Rendering — halaman di-render di server |
| **CRUD** | Create, Read, Update, Delete — operasi dasar data |
| **ORM** | Object-Relational Mapping — jembatan database & kode |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **UUID** | Universally Unique Identifier |

---

*Dokumen ini disusun oleh Tim KKN Universitas Hasanuddin — Program Kerja Pembuatan Website Profil Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang.*
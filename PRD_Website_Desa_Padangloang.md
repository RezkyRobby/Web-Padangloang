# Product Requirement Document (PRD)

## Website Profil Desa Padangloang — KKN Universitas Hasanuddin

---

## 1. Executive Summary

Proyek ini bertujuan untuk membangun **Website Profil Desa Padangloang**, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Website ini dikembangkan sebagai bagian dari program Kuliah Kerja Nyata (KKN) Universitas Hasanuddin. Platform ini akan menjadi pusat informasi digital desa yang menampilkan profil desa, potensi wisata, UMKM lokal, berita kegiatan, serta galeri dokumentasi. Dikembangkan menggunakan teknologi modern (Next.js, Tailwind CSS, Prisma, PostgreSQL) agar responsif, cepat, dan mudah dikelola. Selain itu, website juga dilengkapi modul **Tracking Pelayanan Desa** untuk memudahkan warga mengajukan permohonan administrasi secara online maupun langsung di kantor desa dengan sistem ticketing.

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
6. Mendigitalisasi pelayanan administrasi desa dengan sistem ticketing dan tracking

---

## 4. Target Pengguna

| Pengguna | Kebutuhan |
|---|---|
| **Masyarakat Desa** | Mendapatkan informasi desa, berita, UMKM, galeri, mengajukan pelayanan administrasi via tracking |
| **Perangkat Desa** | Mengelola konten website, memproses permohonan warga, mengelola layanan & form |
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
| 1 | **Dashboard Admin** | Overview statistik, ringkasan permohonan, aktivitas terbaru |
| 2 | **Kelola Berita** | CRUD berita (tambah, edit, hapus, publish) |
| 3 | **Kelola UMKM** | CRUD produk UMKM |
| 4 | **Kelola Wisata** | CRUD destinasi wisata |
| 5 | **Kelola Galeri** | Upload & kelola foto galeri |
| 6 | **Kelola Profil Desa** | Edit data profil desa, perangkat desa |
| 7 | **Kelola Pengguna** | Manajemen admin/editor (Super Admin) |
| 8 | **Kelola Infografis** | Update data statistik desa & IDM |
| 9 | **Kelola Layanan** | CRUD jenis pelayanan desa (KK, Surat Tanah, dll.) + upload template file |
| 10 | **Form Builder** | Buat form dinamis per layanan (field: TEXT, NUMBER, TEXTAREA, DATE, FILE_UPLOAD, SELECT, RADIO, CHECKBOX) |
| 11 | **Kelola Permohonan** | Lihat semua ticket, filter status/layanan/tanggal, proses ticket offline (pilih layanan + isi form), update status & progress |

### 5.3 Modul Pelayanan Desa — Tracking & Ticketing

| No | Fitur | Deskripsi |
|---|---|---|
| 1 | **Dashboard User** | Dashboard mandiri warga: profil & data diri, riwayat permohonan, tracking, tombol ajukan baru |
| 2 | **Pengajuan Online** | Warga pilih layanan (yang tidak di-set hanya offline), isi form dinamis, upload dokumen, submit → ticket terbuat |
| 3 | **Pengajuan Offline (Dari Kantor Desa)** | Warga cukup klik "Buat Ticket Offline" → ticket kosong dengan nomor seri terbuat, admin yang memilihkan layanan & mengisi form |
| 4 | **Tracking Progress** | Timeline detail setiap permohonan: status, catatan, timestamp, admin yang memproses |
| 5 | **Batalkan Ticket** | Warga bisa batalkan ticket yang masih berstatus MENUNGGU (status berubah jadi DIBATALKAN) |
| 6 | **Notifikasi** | In-web toast notification (sonner) untuk semua update status + email otomatis via Gmail SMTP (Nodemailer) saat SELESAI/DITOLAK |
| 7 | **Template Download** | Warga bisa download template/form (PDF) yang di-upload admin, print, isi manual, lalu upload ulang |

**Flow Pengajuan:**
```
Warga Login → Pilih Jenis Ajuan
  ├─ Online → Pilih Layanan → Isi Form Dinamis → Upload Dokumen → Submit → Ticket Terbuat
  └─ Offline → Klik "Buat Ticket Offline" → Ticket Kosong Terbuat → Admin Pilih Layanan + Isi Form
Admin/Editor → Review → Proses → Update Status (MENUNGGU → DIPROSES → SELESAI/DITOLAK/DITANGGUHKAN)
Warga → Tracking Progress di Dashboard + Dapat Notifikasi
```

**Status Permohonan:** `MENUNGGU` → `DIPROSES` → `SELESAI` / `DITOLAK` / `DITANGGUHKAN` / `DIBATALKAN`

**Role Akses:**
- **Admin:** Full akses (CRUD layanan, form builder, hapus permohonan, kelola semua ticket)
- **Editor:** Hanya proses permohonan (isi form offline, update status & progress)
- **User (Warga):** Dashboard sendiri (pengajuan, tracking, batalkan ticket)

**Nomor Tiket:** Format `PL-YYYYMMDD-XXX`, counter reset per hari.

### 5.4 Modul Autentikasi

| No | Fitur | Deskripsi |
|---|---|---|
| 1 | **Login** | Autentikasi email/password via Better-Auth |
| 2 | **Register** | Registrasi akun publik |
| 3 | **Role Management** | Role: USER (Warga), ADMIN, EDITOR |

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
| **Rich Text Editor** | TipTap (ProseMirror) | WYSIWYG editor untuk konten berita & halaman |
| **Image/File Upload** | Cloudinary | Storage gambar & template file |
| **Email** | Nodemailer + Gmail SMTP | Notifikasi email otomatis |
| **Form Validation** | Zod | Validasi input form dinamis |
| **Deployment** | Vercel | CI/CD, hosting global |

---

## 7. Struktur Database (Prisma Schema)

### 7.1 Model — Konten & Profil

```
User
├── id (UUID)
├── email (String, unique)
├── name (String)
├── role (Enum: USER, ADMIN, EDITOR)
├── image (String, nullable)
├── nik (String, nullable)
├── phoneNumber (String, nullable)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Desa
├── id (UUID)
├── nama (String)
├── sejarah (Text)
├── visi (Text)
├── misi (Text)
├── luasWilayah (Float)
├── jumlahPenduduk (Int)
├── jumlahKK (Int)
├── jumlahDusun (Int)
├── batasUtara (String)
├── batasTimur (String)
├── batasSelatan (String)
├── batasBarat (String)
├── fotoKepalaDesa (String)
├── createdAt (DateTime)
└── updatedAt (DateTime)

PerangkatDesa
├── id (UUID)
├── nama (String)
├── jabatan (String)
├── foto (String, nullable)
├── urutan (Int)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Post (Berita)
├── id (UUID)
├── title (String)
├── slug (String, unique)
├── summary (Text)
├── fullContent (Text)
├── image (String, nullable)
├── categoryId (FK → Category)
├── published (Boolean)
├── trending (Boolean)
├── isHighlight (Boolean)
├── views (Int)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Category
├── id (UUID)
├── name (String, unique)
├── slug (String, unique)
└── color (String)

BreakingNews
├── id (UUID)
├── text (String)
├── labelLink (String)
├── postId (FK → Post, nullable)
├── isActive (Boolean)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Message
├── id (UUID)
├── fullName (String)
├── email (String)
├── phoneNumber (String)
├── content (Text)
├── isRead (Boolean)
└── createdAt (DateTime)

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
├── uploadedById (FK → User)
├── createdAt (DateTime)
└── updatedAt (DateTime)

Infografis
├── id (UUID)
├── judul (String)
├── tahun (Int)
├── dataJson (Json)
├── chartType (Enum)
├── createdAt (DateTime)
└── updatedAt (DateTime)
```

### 7.2 Model — Tracking Pelayanan (BARU)

```
Layanan
├── id (UUID)
├── nama (String)                    — "Pembuatan Kartu Keluarga", "Surat Keterangan Tanah"
├── deskripsi (Text, nullable)       — Penjelasan & persyaratan
├── icon (String, nullable)          — Icon opsional
├── isActive (Boolean)               — Default true, bisa dinonaktifkan
├── hanyaOffline (Boolean)           — Default false. Jika true, tidak muncul di pilihan online
├── templateFile (String, nullable)  — Cloudinary URL template (PDF/DOCX) yang bisa di-download warga
├── formFields → FormField[]
├── permohonan → Permohonan[]
├── createdAt (DateTime)
└── updatedAt (DateTime)

FormField
├── id (UUID)
├── layananId (FK → Layanan)
├── label (String)                   — "NIK", "Nama Lengkap", "Upload KTP"
├── fieldType (Enum)                 — TEXT, NUMBER, TEXTAREA, DATE, FILE_UPLOAD, SELECT, RADIO, CHECKBOX
├── required (Boolean)               — Default false
├── placeholder (String, nullable)
├── options (Json, nullable)         — Untuk SELECT/RADIO/CHECKBOX: ["Pilihan 1", "Pilihan 2"]
├── urutan (Int)                     — Urutan tampil di form
├── createdAt (DateTime)
└── updatedAt (DateTime)

Permohonan
├── id (UUID)
├── nomorTiket (String, unique)      — Format: PL-YYYYMMDD-XXX (counter reset per hari)
├── layananId (FK → Layanan, nullable) — NULL jika offline & admin belum pilih layanan
├── userId (FK → User)
├── jenisAjuan (Enum)                — ONLINE, OFFLINE
├── status (Enum)                    — MENUNGGU, DIPROSES, SELESAI, DITOLAK, DITANGGUHKAN, DIBATALKAN
├── catatan (Text, nullable)         — Catatan dari admin
├── createdAt (DateTime)
└── updatedAt (DateTime)

PermohonanData
├── id (UUID)
├── permohonanId (FK → Permohonan)
├── formFieldId (FK → FormField)
├── value (Text)                     — Isian teks atau Cloudinary URL (jika FILE_UPLOAD)
├── createdAt (DateTime)
└── updatedAt (DateTime)

ProgressHistory
├── id (UUID)
├── permohonanId (FK → Permohonan)
├── status (Enum)                    — Status saat entri ini dibuat
├── catatan (Text, nullable)         — "Dokumen sudah diverifikasi", "Menunggu tanda tangan kepala desa"
├── createdById (FK → User)          — Admin/editor yang membuat entri
├── createdAt (DateTime)
```

**Enum:**

- `FieldType`: TEXT, NUMBER, TEXTAREA, DATE, FILE_UPLOAD, SELECT, RADIO, CHECKBOX
- `JenisAjuan`: ONLINE, OFFLINE
- `StatusPermohonan`: MENUNGGU, DIPROSES, SELESAI, DITOLAK, DITANGGUHKAN, DIBATALKAN

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

### 8.2 Warga (Login sebagai USER)
```
Login → Dashboard User
  → Edit Profil & Data Diri (NIK, Telepon)
  → Ajukan Pelayanan
     ├─ Online: Pilih Layanan → Isi Form → Upload → Submit → Ticket
     └─ Offline: Klik "Buat Ticket Offline" → Ticket
  → Lihat Riwayat Permohonan
  → Tracking Progress (Timeline Detail)
  → Batalkan Ticket (jika masih MENUNGGU)
```

### 8.3 Admin / Editor
```
Login → Dashboard Admin
  → Ringkasan Permohonan (total, menunggu, diproses, selesai)
  → Kelola Layanan (CRUD + Form Builder)
  → Kelola Permohonan (filter status/layanan/tanggal, search)
     → Detail Ticket → Pilih Layanan (offline) → Isi Form → Upload → Update Status
     → Tambah Progress History
  → Kelola Berita (CRUD)
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
| **Email Delivery** | Gmail SMTP via Nodemailer untuk notifikasi email |

---

## 10. Timeline & Milestone

| Fase | Kegiatan | Durasi |
|---|---|---|
| **Fase 1** | Inisialisasi project, setup environment, database, & autentikasi | 5 hari |
| **Fase 2** | Layout, komponen utama & halaman public (Beranda, Profil, Berita, UMKM, Wisata, Galeri, Infografis, IDM) | 4 hari |
| **Fase 3** | Dashboard admin, CRUD konten, testing & debugging | 3 hari |
| **Fase 4** | Deployment ke Vercel, dokumentasi & serah terima | 2 hari |
| **Fase 5** | Modul Tracking Pelayanan (models, API, halaman user & admin, notifikasi email) | 5 hari |
| **Total** | | **19 hari** |

---

## 11. Kriteria Keberhasilan (Success Metrics)

- Website berhasil di-deploy dan dapat diakses publik via Vercel
- Semua halaman public menampilkan konten dengan benar
- Admin dapat login dan melakukan CRUD data
- Galeri foto dapat di-upload dan ditampilkan
- Website responsif di perangkat mobile
- Dark mode berfungsi dengan baik
- Waktu loading halaman < 3 detik
- **Warga dapat registrasi, login, mengajukan permohonan online/offline**
- **Admin dapat membuat layanan + form dinamis, memproses ticket, update status**
- **Warga dapat tracking progress permohonan dengan timeline**
- **Notifikasi email terkirim saat status SELESAI/DITOLAK**

---

## 12. Risks & Mitigation

| Risiko | Mitigasi |
|---|---|
| Keterbatasan data desa | Koordinasi dengan perangkat desa untuk pengumpulan data |
| Keterbatasan akses internet | Optimalisasi performa & lazy loading |
| Perubahan kebutuhan | Pendekatan agile dengan iterasi cepat |
| Keamanan data | Implementasi autentikasi & otorisasi ketat |
| Kompleksitas form builder | Gunakan Zod schema dinamis & component-driven form |
| Gmail SMTP limit | Monitor kuota pengiriman, fallback ke in-web notif |

---

## 13. Glossary

| Istilah | Definisi |
|---|---|
| **SSR** | Server-Side Rendering — halaman di-render di server |
| **CRUD** | Create, Read, Update, Delete — operasi dasar data |
| **ORM** | Object-Relational Mapping — jembatan database & kode |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **UUID** | Universally Unique Identifier |
| **SMTP** | Simple Mail Transfer Protocol — protokol pengiriman email |
| **Form Builder** | Sistem pembuatan form dinamis tanpa coding |

---

*Dokumen ini disusun oleh Tim KKN Universitas Hasanuddin — Program Kerja Pembuatan Website Profil Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang.*
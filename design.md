# Design System — Website Profil Desa Padangloang

Panduan desain visual dan komponen untuk Website Profil Desa Padangloang, KKN Universitas Hasanuddin. Design system ini dihasilkan oleh **Stitch** dengan tema **Natural — Editorial-First**, mencerminkan identitas desa yang profesional, bersih, dan modern dengan sentuhan hangat khas pedesaan.

> **Source: Stitch Natural Design System**
> - ID: `assets/12649005188872170337`
> - Project: `projects/6285428822006984399`
> - Theme: Natural — Editorial-First (Minimalism + Glassmorphism, Paper Aesthetic)

---

## 1. Brand Identity

### 1.1 Nama
**Desa Padangloang** — Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan.

### 1.2 Tagline
*"Desa Maju, Mandiri, dan Sejahtera"*

### 1.3 Karakter Visual
- **Editorial-First** — Tipografi menjadi elemen visual utama, layout seperti majalah digital
- **Minimalism** — White space ekspansif, konten bernapas, tanpa dekorasi berlebihan
- **Glassmorphism** — Efek transparansi, backdrop blur, floating elements
- **Paper Aesthetic** — Card putih dengan border subtle, tampilan seperti kertas premium
- **Floating Architecture** — Navigasi mengapung (floating island), card dan elemen tidak menempel tepi

---

## 2. Color Palette (Stitch Natural Design System)

Stitch menghasilkan palet dengan seed color `#2D6A4F` (hijau alami) dan varian **EXPRESSIVE**, namun tema **Editorial-First** mendominasi dengan pendekatan monokrom + aksen biru.

### 2.1 Named Colors (Stitch Natural)

| Nama | Hex | Usage |
|---|---|---|
| **Obsidian** | `#171717` | Heading, teks utama dark mode |
| **Graphite Night** | `#282834` | Navbar, footer, dark surface |
| **Paper** | `#ffffff` | Card, surface, modal background |
| **Linen** | `#f9faf7` | Background utama, surface variant light |
| **Sage** | `#dee2de` | Border, outline, divider |
| **Fog** | `#f1f3f1` | Background alt, hover state |
| **Ash** | `#e8ebe8` | Disabled background, skeleton |
| **Iron** | `#6b7280` | Secondary text, caption |
| **Steel** | `#9ca3af` | Placeholder, icon muted |
| **Carbon** | `#000000` | Primary (dark) |
| **Mist** | `#e5e7eb` | Border subtle, input border |
| **Hudson Blue** | `#006496` | Secondary accent, link, CTA |

### 2.2 Core Dynamic Colors (Material 3 Tokens)

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| **Primary** | `#000000` (Carbon) | `#ffffff` (White) | Aksi utama, navbar active, heading |
| **On Primary** | `#ffffff` | `#000000` | Teks di atas primary |
| **Primary Container** | `#e8e8e8` | `#2e2e2e` | Background elemen primary |
| **On Primary Container** | `#000000` | `#ffffff` | Teks di atas primary container |
| **Secondary** | `#006496` (Hudson Blue) | `#7fc8ff` | Aksi sekunder, link, badge |
| **Secondary Container** | `#cae6ff` | `#004a73` | Background elemen sekunder |
| **Tertiary** | `#000000` | `#ffffff` | Aksen komplementer |
| **Error** | `#ba1a1a` | `#ffb4ab` | Validasi, destructive actions |
| **Error Container** | `#ffdad6` | `#93000a` | Background error |

### 2.3 Neutral Dynamic Colors

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| **Background** | `#f9faf7` (Linen) | `#111411` | Background utama |
| **Surface** | `#ffffff` (Paper) | `#1a1a1a` | Card, modal, dialog |
| **Surface Variant** | `#f1f3f1` (Fog) | `#2e2e2e` | Surface alternatif |
| **Outline** | `#dee2de` (Sage) | `#8c9489` | Border, divider |
| **Outline Variant** | `#e5e7eb` (Mist) | `#414943` | Border subtle |
| **On Background** | `#171717` (Obsidian) | `#e1e3e0` | Body text |
| **On Surface** | `#171717` (Obsidian) | `#e1e3e0` | Teks di atas surface |
| **On Surface Variant** | `#6b7280` (Iron) | `#c2c8bd` | Subtitle, caption |

---

## 3. Typography

### 3.1 Font Families (Stitch Natural)

| Level | Font | Karakter |
|---|---|---|
| **Display / Headline** | **Source Serif 4** | Elegan, editorial, serif klasik — untuk judul besar dan heading utama |
| **Body / UI** | **Inter** | Clean, readable, modern sans-serif — untuk body text dan UI elements |

### 3.2 Type Scale

Font Source Serif 4 menggunakan fitur opentype: `"liga"`, `"kern"`, `"dlig"`, `"swsh"`, `"calt"`, `"salt"`.

| Token | Size / Line Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|
| **Display Large** | 57px / 64px | 400 (Regular) | `-0.02em` | Hero headline (jarang) |
| **Display Medium** | 45px / 52px | 400 | `-0.02em` | Hero sub-headline |
| **Display Small** | 36px / 44px | 400 | `-0.02em` | Section heading utama |
| **Headline Large** | 32px / 40px | 600 (Semi Bold) | `-0.02em` | Halaman heading |
| **Headline Medium** | 28px / 36px | 600 | `-0.01em` | Card title utama |
| **Headline Small** | 24px / 32px | 600 | `-0.01em` | Sub-section heading |
| **Title Large** | 22px / 28px | 500 (Medium) | `0em` | Nav item, dialog title |
| **Title Medium** | 16px / 24px | 500 | `0em` | Card title, list heading |
| **Title Small** | 14px / 20px | 500 | `0em` | Small heading, label |
| **Body Large** | 16px / 24px | 400 (Regular) | `0em` | Lead paragraph |
| **Body Medium** | 14px / 20px | 400 | `0em` | Body text default |
| **Body Small** | 12px / 16px | 400 | `0em` | Caption, meta info |
| **Label Large** | 14px / 20px | 600 (Semi Bold) | `0.02em` | Button, tab, badge |
| **Label Medium** | 12px / 16px | 600 | `0.02em` | Chip, small badge |
| **Label Small** | 11px / 16px | 600 | `0.02em` | Tiny label |

---

## 4. Shape & Roundness

Stitch menggunakan **ROUND_EIGHT** (8px default radius), dengan variasi:

| Token | Value | Usage |
|---|---|---|
| **None** | 0px | Table sharp edges, layout blocks |
| **Extra Small** | 4px | **Buttons** (default radius), input kecil, chip |
| **Small** | 8px | Card default, modal kecil |
| **Medium** | 12px | Card featured, dialog |
| **Large** | 16px | Large card, hero card |
| **Full** | 9999px | Pill badge, avatar, floating nav island |

**Catatan:** Button menggunakan radius **4px** (bukan 8px) — konsisten dengan gaya editorial minimalis.

---

## 5. Spacing System

Menggunakan base unit **4px** dengan sistem spacing Material 3 yang dimodifikasi:

| Token | Value | Usage |
|---|---|---|
| `spacing-3xs` | 2px | Compact, dense |
| `spacing-2xs` | 4px | Icon padding, small gap |
| `spacing-xs` | 8px | Small elements, input padding |
| `spacing-sm` | 12px | Button padding, list gap |
| `spacing-md` | 16px | Card padding, list gap (default) |
| `spacing-lg` | 24px | Section spacing, form gap |
| `spacing-xl` | 32px | Large section padding |
| `spacing-2xl` | 48px | Hero padding, section margins |
| `spacing-3xl` | 64px | Major section divider |
| `spacing-4xl` | 80px | Page section gap |

---

## 6. Elevation & Shadow

Editorial-First menggunakan pendekatan **tonal layers + glassmorphism**, bukan bayangan tradisional Material Design.

| Level | Description | CSS | Usage |
|---|---|---|---|
| **Level 0** | Flat | `background: surface` | Konten dasar |
| **Level 1** | Tonal lift | `background: surface-variant` | Card default, section alt |
| **Level 2** | Paper card | `bg-paper border border-sage shadow-sm` | Card, dropdown, list item |
| **Level 3** | Glassmorphism | `backdrop-blur-xl bg-white/70 border border-sage/50 shadow-md` | Navbar floating, modal |
| **Level 4** | Elevated glass | `backdrop-blur-2xl bg-white/80 border border-sage/60 shadow-lg` | Dialog, FAB, toast |

**Shadow values:**
```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

---

## 7. Ikon (Lucide React)

Menggunakan paket ikon **Lucide React** sesuai konteks:

| Konteks | Ikon |
|---|---|
| Beranda | `Home`, `Sprout` |
| Profil Desa | `Building2`, `Landmark`, `ScrollText` |
| Berita | `Newspaper`, `FileText` |
| UMKM | `Store`, `ShoppingBag`, `Package` |
| Wisata | `MapPin`, `TreePine`, `Landmark`, `UtensilsCrossed` |
| Galeri | `Image`, `Images`, `Camera` |
| Infografis | `BarChart3`, `PieChart`, `TrendingUp` |
| IDM | `Award`, `Target`, `TrendingUp` |
| Kontak | `Phone`, `Mail`, `MapPin`, `MessageCircle`, `WhatsApp` |
| Pertanian | `Wheat`, `Sprout`, `Tractor` |
| Dashboard | `LayoutDashboard` |
| Edit | `Pencil`, `FileEdit` |
| Hapus | `Trash2` |
| Search | `Search` |
| Dark Mode | `Sun`, `Moon` |
| User | `User`, `Users`, `UserCog` |
| Navigasi | `ChevronDown`, `ChevronRight`, `Menu`, `X` |
| Feedback | `CheckCircle`, `AlertCircle`, `AlertTriangle`, `Info`, `Loader2` |

---

## 8. Component Design Tokens

### 8.1 Buttons

| Variant | Styling | Radius |
|---|---|---|
| **Filled Primary (Obsidian)** | `bg-[#171717] text-white hover:bg-black/90 h-10 px-6 font-semibold text-sm tracking-wide` | 4px |
| **Outlined** | `border border-sage text-obsidian hover:bg-linen h-10 px-6 font-semibold text-sm` | 4px |
| **Ghost / Text** | `text-obsidian hover:bg-linen h-10 px-3 font-semibold text-sm` | 4px |
| **Secondary (Hudson Blue)** | `bg-[#006496] text-white hover:bg-[#006496]/90 h-10 px-6 font-semibold text-sm` | 4px |
| **Icon Button** | `w-10 h-10 flex items-center justify-center hover:bg-linen rounded-full` | Full |

### 8.2 Cards

| Variant | Styling | Radius |
|---|---|---|
| **Paper** (default) | `bg-paper border border-sage rounded-[12px] shadow-sm` | 12px |
| **Elevated** | `bg-paper border border-sage rounded-[12px] shadow-md` | 12px |
| **Filled** | `bg-fog rounded-[8px]` | 8px |
| **Feature / Hero** | `bg-paper border border-sage rounded-[16px] shadow-md` | 16px |

### 8.3 Input Fields

| State | Styling | Radius |
|---|---|---|
| **Default** | `bg-paper border border-mist rounded-[4px] h-12 px-4 text-sm focus:outline-none` | 4px |
| **Focus** | `border-obsidian ring-1 ring-obsidian/10` | 4px |
| **Error** | `border-error ring-1 ring-error/10` | 4px |
| **Disabled** | `bg-ash/50 opacity-50 cursor-not-allowed` | 4px |

### 8.4 Chips / Badges

| Variant | Styling | Radius |
|---|---|---|
| **Filled** | `bg-fog text-obsidian text-xs font-semibold px-3 py-1` | 4px |
| **Outlined** | `border border-sage text-iron text-xs font-semibold px-3 py-1` | 4px |
| **Pill** | `bg-fog text-obsidian text-xs font-semibold px-4 py-1` | Full (9999px) |

### 8.5 Navigation — Floating Island

```css
/* Floating Navigation Island */
position: fixed;
top: 16px;
left: 50%;
transform: translateX(-50%);
z-index: 50;
background: #282834; /* Graphite Night */
color: white;
border-radius: 9999px; /* pill-shaped */
padding: 8px 24px;
backdrop-filter: blur(12px);
box-shadow: 0 4px 24px rgba(0,0,0,0.12);
font-family: 'Inter', sans-serif;
font-size: 13px;
font-weight: 600;
letter-spacing: 0.02em;
```

### 8.6 Sidebar / Drawer (Admin)

```css
/* Admin Sidebar */
width: 256px;
background: #ffffff; /* Paper */
border-right: 1px solid #dee2de; /* Sage */
active item: background #f1f3f1; /* Fog */
```

### 8.7 Separator / Divider

```css
/* Horizontal divider */
height: 1px;
background: #dee2de; /* Sage */
margin: 24px 0;
```

---

## 9. Page Layouts

### 9.1 Public Layout

```
┌──────────────────────────────────────────────────┐
│              ┌──────────────────┐                 │
│              │  Floating Nav    │  ← Graphite Night pill, centered
│              │ 🏠 ▾ ▾ ▾ ✉️     │  ← Source Serif 4 / Inter
│              └──────────────────┘                 │
├──────────────────────────────────────────────────┤
│                                                   │
│  Hero Section (min-h-[70vh])                      │
│  bg: gambar desa + dark overlay                   │
│  text: white, centered                            │
│  font: Source Serif 4                             │
│                                                   │
├──────────────────────────────────────────────────┤
│  Stats Section (spacing-4xl gap)                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ 2.75   │ │ 1.599  │ │  561   │ │   3    │    │
│  │ km²    │ │ Jiwa   │ │  KK    │ │ Dusun  │    │
│  │ Luas   │ │ Penddk │ │Kepala  │ │Dusun   │    │
│  └────────┘ └────────┘ └────────┘ └────────┘    │
│  Card Paper + Sage border, Icon Lucide            │
├──────────────────────────────────────────────────┤
│  Section: Berita Terbaru                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Card     │ │ Card     │ │ Card     │          │
│  │ Paper    │ │ Paper    │ │ Paper    │          │
│  └──────────┘ └──────────┘ └──────────┘          │
├──────────────────────────────────────────────────┤
│  Section: UMKM Unggulan                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Card     │ │ Card     │ │ Card     │          │
│  │ Paper    │ │ Paper    │ │ Paper    │          │
│  └──────────┘ └──────────┘ └──────────┘          │
├──────────────────────────────────────────────────┤
│  Section: Galeri Desa (Grid 4 kolom)              │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐                              │
│  │  │ │  │ │  │ │  │                              │
│  └──┘ └──┘ └──┘ └──┘                              │
├──────────────────────────────────────────────────┤
│  Footer (Graphite Night #282834)                  │
│  3 kolom: Logo + Links + Kontak                   │
│  Text putih, Inter 14px                           │
└──────────────────────────────────────────────────┘
```

### 9.2 Admin Layout

```
┌──────────────┬────────────────────────────────────────┐
│  Sidebar     │  Top Bar (Paper + Sage border-bottom)  │
│  (Paper)     ├────────────────────────────────────────┤
│              │                                         │
│  📊 Dashboard│  Content Area (bg-linen)               │
│  📰 Berita   │                                         │
│  🛍️ UMKM     │  ┌────────────────────────────────┐   │
│  🏞️ Wisata   │  │  Data Table / Form             │   │
│  🖼️ Galeri   │  │  Card Paper + Sage border      │   │
│  🏛️ Profil   │  │                                 │   │
│  📊 Infograf │  └────────────────────────────────┘   │
│  👥 Users    │                                         │
│              │                                         │
└──────────────┴────────────────────────────────────────┘
```

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Columns | Navbar Behavior |
|---|---|---|---|
| **Compact** | 0–599px | 1 kolom (mobile) | Hamburger menu, drawer from right |
| **Medium** | 600–839px | 2 kolom (tablet) | Floating nav tetap, item diperkecil |
| **Expanded** | 840–1199px | 3 kolom (laptop) | Floating nav full |
| **Large** | 1200–1599px | 3-4 kolom (desktop) | Floating nav full |
| **Extra Large** | 1600px+ | 4 kolom (wide) | Floating nav full |

Container max-width: **1200px** (content), dengan padding samping `spacing-lg` (24px) di mobile.

---

## 11. Animations & Motion

| Element | Duration | Easing | Notes |
|---|---|---|---|
| Button hover | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Background color transition |
| Card hover | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Border color subtle change |
| Modal enter | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Scale + fade |
| Drawer slide | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Slide from right |
| Toast / Snackbar | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Slide up + fade |
| Navbar scroll | 150ms | `ease-out` | Background opacity change |
| Page transition | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Fade |
| Floating nav appear | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Slide down on scroll up |

---

## 12. States & Feedback

### 12.1 Loading
- **Skeleton:** `animate-pulse bg-ash/50 rounded-[8px]`
- **Spinner:** Lucide `Loader2` dengan `animate-spin text-obsidian`
- **Skeleton card:** `bg-fog rounded-[12px] h-[200px] animate-pulse`

### 12.2 Empty State
```
┌───────────────────────────────────────┐
│                                       │
│         [Ikon Lucide 48px, iron]      │
│                                       │
│    Belum ada data                     │
│    Deskripsi singkat                  │
│                                       │
│    [Tombol Aksi (opsional)]           │
│                                       │
└───────────────────────────────────────┘
```

### 12.3 Error State
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️ [Ikon AlertCircle]         │
│                                       │
│    Terjadi kesalahan                  │
│    Silakan coba lagi                  │
│                                       │
│    [Coba Lagi] — Outlined button      │
│                                       │
└───────────────────────────────────────┘
```

### 12.4 Toast / Snackbar (Sonner)

| Type | Background | Border | Ikon |
|---|---|---|---|
| Success | `bg-white` | `border-l-4 border-[#2D6A4F]` | `CheckCircle` (hijau) |
| Error | `bg-white` | `border-l-4 border-error` | `AlertCircle` (merah) |
| Warning | `bg-white` | `border-l-4 border-[#F59E0B]` | `AlertTriangle` (kuning) |
| Info | `bg-white` | `border-l-4 border-hudson-blue` | `Info` (biru) |

---

## 13. Dark Mode Adaptation

Semua warna sudah memiliki pasangan dark mode di Stitch Natural CSS variables.

| Token | Light | Dark | 
|---|---|---|
| **Background** | `#f9faf7` (Linen) | `#111411` |
| **Surface** | `#ffffff` (Paper) | `#1a1a1a` |
| **Surface Variant** | `#f1f3f1` (Fog) | `#2e2e2e` |
| **Primary** | `#000000` (Carbon) | `#ffffff` (White) |
| **Secondary** | `#006496` (Hudson Blue) | `#7fc8ff` |

**Aturan transisi dark mode:**

1. Background: Linen `#f9faf7` → Dark `#111411`
2. Card Paper: White `#ffffff` → Dark surface `#1a1a1a` — **border Sage tetap** `#dee2de` → `#414943`
3. Text: Obsidian `#171717` → Light `#e1e3e0`
4. Primary: Carbon `#000000` → White `#ffffff`
5. Secondary (Hudson Blue): `#006496` → `#7fc8ff` (lebih cerah)
6. Glassmorphism: `bg-white/70` → `bg-black/60`
7. Gambar: `brightness-[0.85]` di dark mode
8. Sage border: `#dee2de` → `#414943`
9. Fog background: `#f1f3f1` → `#2e2e2e`

---

## 14. Accessibility (A11y)

| Requirement | Implementation |
|---|---|
| Color contrast (AA minimum) | Body ≥ 4.5:1, large text ≥ 3:1 — dijamin Stitch dynamic colors |
| Color contrast (AAA preferred) | Body ≥ 7:1, large text ≥ 4.5:1 — gunakan Obsidian on Paper |
| Keyboard navigation | Semua interactive element focusable via Tab |
| Focus indicator | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian` |
| Image alt text | Wajib di semua `<Image>` dan `<img>` |
| Semantic HTML | `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` |
| ARIA labels | Icon buttons pakai `aria-label`, nav pakai `aria-current="page"` |
| Screen reader | Toast announcements (`role="status"`), loading states |
| Touch targets | Minimum 44x44px untuk semua interactive element (mobile) |
| Reduced motion | `prefers-reduced-motion: reduce` — nonaktifkan animasi |

---

## 15. Implementation Guide

### 15.1 CSS Custom Properties (globals.css)

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Named Colors */
    --color-obsidian: #171717;
    --color-graphite-night: #282834;
    --color-paper: #ffffff;
    --color-linen: #f9faf7;
    --color-sage: #dee2de;
    --color-fog: #f1f3f1;
    --color-ash: #e8ebe8;
    --color-iron: #6b7280;
    --color-steel: #9ca3af;
    --color-carbon: #000000;
    --color-mist: #e5e7eb;
    --color-hudson-blue: #006496;

    /* Material 3 Dynamic Tokens */
    --md-sys-color-primary: #000000;
    --md-sys-color-on-primary: #ffffff;
    --md-sys-color-primary-container: #e8e8e8;
    --md-sys-color-on-primary-container: #000000;
    --md-sys-color-secondary: #006496;
    --md-sys-color-on-secondary: #ffffff;
    --md-sys-color-secondary-container: #cae6ff;
    --md-sys-color-on-secondary-container: #001e31;
    --md-sys-color-tertiary: #000000;
    --md-sys-color-on-tertiary: #ffffff;
    --md-sys-color-background: #f9faf7;
    --md-sys-color-on-background: #171717;
    --md-sys-color-surface: #ffffff;
    --md-sys-color-on-surface: #171717;
    --md-sys-color-surface-variant: #f1f3f1;
    --md-sys-color-on-surface-variant: #6b7280;
    --md-sys-color-outline: #dee2de;
    --md-sys-color-outline-variant: #e5e7eb;
    --md-sys-color-error: #ba1a1a;
    --md-sys-color-on-error: #ffffff;
    --md-sys-color-error-container: #ffdad6;
    --md-sys-color-on-error-container: #410002;
  }

  .dark {
    --md-sys-color-primary: #ffffff;
    --md-sys-color-on-primary: #000000;
    --md-sys-color-primary-container: #2e2e2e;
    --md-sys-color-on-primary-container: #ffffff;
    --md-sys-color-secondary: #7fc8ff;
    --md-sys-color-on-secondary: #00344e;
    --md-sys-color-secondary-container: #004a73;
    --md-sys-color-on-secondary-container: #cae6ff;
    --md-sys-color-tertiary: #ffffff;
    --md-sys-color-on-tertiary: #000000;
    --md-sys-color-background: #111411;
    --md-sys-color-on-background: #e1e3e0;
    --md-sys-color-surface: #1a1a1a;
    --md-sys-color-on-surface: #e1e3e0;
    --md-sys-color-surface-variant: #2e2e2e;
    --md-sys-color-on-surface-variant: #c2c8bd;
    --md-sys-color-outline: #8c9489;
    --md-sys-color-outline-variant: #414943;
    --md-sys-color-error: #ffb4ab;
    --md-sys-color-on-error: #690005;
    --md-sys-color-error-container: #93000a;
    --md-sys-color-on-error-container: #ffdad6;
  }
}
```

### 15.2 Tailwind Config Extension

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "var(--color-obsidian)",
        "graphite-night": "var(--color-graphite-night)",
        paper: "var(--color-paper)",
        linen: "var(--color-linen)",
        sage: "var(--color-sage)",
        fog: "var(--color-fog)",
        ash: "var(--color-ash)",
        iron: "var(--color-iron)",
        steel: "var(--color-steel)",
        carbon: "var(--color-carbon)",
        mist: "var(--color-mist)",
        "hudson-blue": "var(--color-hudson-blue)",

        /* Material 3 Tokens (shadcn/ui compatible) */
        primary: "var(--md-sys-color-primary)",
        "primary-foreground": "var(--md-sys-color-on-primary)",
        "primary-container": "var(--md-sys-color-primary-container)",
        "on-primary-container": "var(--md-sys-color-on-primary-container)",
        secondary: "var(--md-sys-color-secondary)",
        "secondary-foreground": "var(--md-sys-color-on-secondary)",
        "secondary-container": "var(--md-sys-color-secondary-container)",
        "on-secondary-container": "var(--md-sys-color-on-secondary-container)",
        tertiary: "var(--md-sys-color-tertiary)",
        "tertiary-foreground": "var(--md-sys-color-on-tertiary)",
        background: "var(--md-sys-color-background)",
        "background-foreground": "var(--md-sys-color-on-background)",
        surface: "var(--md-sys-color-surface)",
        "surface-foreground": "var(--md-sys-color-on-surface)",
        "surface-variant": "var(--md-sys-color-surface-variant)",
        "on-surface-variant": "var(--md-sys-color-on-surface-variant)",
        outline: "var(--md-sys-color-outline)",
        "outline-variant": "var(--md-sys-color-outline-variant)",
        muted: "var(--md-sys-color-surface-variant)",
        "muted-foreground": "var(--md-sys-color-on-surface-variant)",
        destructive: "var(--md-sys-color-error)",
        "destructive-foreground": "var(--md-sys-color-on-error)",
        border: "var(--md-sys-color-outline)",
        input: "var(--md-sys-color-outline-variant)",
        ring: "var(--md-sys-color-primary)",
        accent: "var(--md-sys-color-secondary)",
        "accent-foreground": "var(--md-sys-color-on-secondary)",
        card: "var(--md-sys-color-surface)",
        "card-foreground": "var(--md-sys-color-on-surface)",
        popover: "var(--md-sys-color-surface)",
        "popover-foreground": "var(--md-sys-color-on-surface)",
      },
      fontFamily: {
        headline: ["Source Serif 4", "serif"],
        body: ["Inter", "sans-serif"],
        display: ["Source Serif 4", "serif"],
        sans: ["Inter", "sans-serif"],
        serif: ["Source Serif 4", "serif"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "28px",
        "2xl": "9999px",
      },
      spacing: {
        "3xs": "2px",
        "2xs": "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "80px",
      },
      boxShadow: {
        "paper-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "paper-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "paper-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "24px",
          sm: "24px",
          md: "32px",
          lg: "40px",
          xl: "48px",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1200px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 15.3 Font Import

```ts
// app/layout.tsx
import { Source_Serif_4, Inter } from "next/font/google";

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
```

### 15.4 Tailwind Usage in Components

```tsx
// Example: Heading
<h1 className="font-display text-display-small text-obsidian dark:text-white font-semibold tracking-tight">
  Selamat Datang di Desa Padangloang
</h1>

// Example: Body text
<p className="font-body text-body-medium text-iron leading-relaxed">
  Desa Padangloang memiliki luas wilayah sekitar 2,75 km²...
</p>

// Example: Button
<button className="bg-obsidian text-white h-10 px-6 rounded-xs font-body text-sm font-semibold tracking-wide hover:bg-obsidian/90 transition-colors">
  Selengkapnya
</button>

// Example: Card
<div className="bg-paper border border-sage rounded-[12px] shadow-paper-sm p-md">
  <h3 className="font-display text-headline-small text-obsidian">Judul Card</h3>
  <p className="font-body text-body-medium text-iron mt-sm">Deskripsi...</p>
</div>

// Example: Input
<input
  className="bg-paper border border-mist rounded-xs h-12 px-4 text-sm font-body text-obsidian
             focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 focus:outline-none
             placeholder:text-steel"
  placeholder="Cari..."
/>

// Example: Glassmorphism navbar
<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50
                bg-graphite-night/90 backdrop-blur-xl
                rounded-full px-6 py-2
                shadow-paper-md
                font-body text-sm font-semibold text-white
                tracking-wider">
  {/* nav items */}
</nav>

// Example: Dark mode card
<div className="bg-paper dark:bg-[#1a1a1a] border border-sage dark:border-[#414943] rounded-[12px] p-md">
  {/* content */}
</div>
```

---

## 16. Checklist Penerapan Design System

- [ ] CSS custom properties Stitch diset di `globals.css` (light + dark)
- [ ] Tailwind config di-extend dengan Stitch tokens (colors, fonts, radius, shadow)
- [ ] Source Serif 4 + Inter di-import via `next/font/google` sebagai `--font-display` dan `--font-body`
- [ ] Semua komponen menggunakan token Stitch (bukan hex hardcoded kecuali named colors)
- [ ] Dark mode transisi mulus via `class` strategy + CSS variables
- [ ] Semua button pakai height `h-10` dan radius `rounded-xs` (4px)
- [ ] Card pakai `rounded-[12px]` dengan border Sage `border border-sage`
- [ ] Navbar menggunakan floating island (`fixed top-4 left-1/2 -translate-x-1/2 rounded-full bg-graphite-night`)
- [ ] Ikon dari Lucide React dengan mapping yang sudah ditentukan (Section 7)
- [ ] Responsive grid mengikuti breakpoint Stitch (max-width: 1200px container)
- [ ] Animasi pakai durasi & easing `cubic-bezier(0.4, 0, 0.2, 1)`
- [ ] Focus ring `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian`
- [ ] Glassmorphism pakai `backdrop-blur-xl bg-white/70` (light) / `bg-black/60` (dark)
- [ ] Input pakai radius `rounded-xs` (4px) dengan Mist border
- [ ] Separator / divider pakai Sage `bg-sage h-[1px]`

---

*Dokumen Design System — Program Kerja Pembuatan Website Profil Desa Padangloang, KKN Universitas Hasanuddin. Diselaraskan dengan Stitch Natural Design System (Editorial-First Theme).*

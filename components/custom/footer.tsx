import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil Desa", href: "/profil" },
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  { label: "Struktur Organisasi", href: "/profil/struktur" },
  { label: "Perangkat Desa", href: "/profil/perangkat" },
  { label: "Berita", href: "/news" },
  { label: "UMKM", href: "/umkm" },
  { label: "Wisata", href: "/wisata" },
  { label: "Galeri", href: "/galeri" },
  { label: "Infografis", href: "/infografis" },
  { label: "IDM", href: "/idm" },
  { label: "Kontak", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-[#282834] text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Logo Desa Padangloang"
                width={48}
                height={48}
                className="object-contain brightness-0 invert"
              />
              <div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[15px] font-extrabold tracking-tight">
                    DESA PADANGLOANG
                  </span>
                  <span className="text-[10px] font-bold tracking-wide text-white/60">
                    KEC. DUA PITUE · KAB. SIDRAP
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60 font-body">
              Website resmi Desa Padangloang, Kecamatan Dua Pitue, Kabupaten
              Sidenreng Rappang, Sulawesi Selatan. Menyajikan informasi desa,
              potensi UMKM, wisata, dan layanan publik.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-body text-sm tracking-wide">
              Navigasi
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <ul className="space-y-2 text-sm font-body">
                {navLinks.slice(0, 6).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 text-sm font-body">
                {navLinks.slice(6).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-body text-sm tracking-wide">
              Kontak & Lokasi
            </h4>
            <div className="space-y-3 text-sm font-body">
              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-white/50 mt-0.5 shrink-0"
                />
                <span className="text-white/60">
                  Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng
                  Rappang (Sidrap), Sulawesi Selatan
                </span>
              </div>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-white/50 shrink-0" />
                <a
                  href="mailto:desapadangloang@gmail.com"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  desapadangloang@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-white/50 shrink-0" />
                <a
                  href="https://wa.me/6280000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-200"
                >
                  WhatsApp Kantor Desa
                </a>
              </p>
              <div className="flex items-start gap-2 pt-1">
                <Clock size={16} className="text-white/50 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/70">Senin - Jumat</p>
                  <p className="text-white/50">08.00 - 16.00 WITA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/15" />

        <div className="pt-6 flex flex-col items-center gap-3 text-sm text-white/50 font-body sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Pemerintah Desa Padangloang. Hak
            cipta dilindungi.
          </p>
          <p className="text-white/40 text-xs">
            Dibangun oleh KKN Universitas Hasanuddin
          </p>
        </div>
      </div>
    </footer>
  );
}
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { MapPin, Compass, Clock } from "lucide-react";

interface DesaData {
  nama: string;
  sejarah: string;
  visi: string;
  misi: string;
  luasWilayah: number | null;
  jumlahPenduduk: number | null;
  jumlahKK: number | null;
  jumlahDusun: number | null;
  batasUtara: string | null;
  batasTimur: string | null;
  batasSelatan: string | null;
  batasBarat: string | null;
  fotoKepalaDesa: string | null;
}

async function getDesaData(): Promise<DesaData> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/desa`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Gagal mengambil data desa");
    return res.json();
  } catch {
    return {
      nama: "Desa Padangloang",
      sejarah: `<p>Desa Padangloang merupakan salah satu desa yang ada pada Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang, atau lebih dikenal dengan nama Kabupaten Sidrap. Sebelum berdiri sebagai Desa, Desa Padangloang merupakan hasil pemekaran dari Kelurahan Lancirang.</p>

<p>Pada tahun 1985 Padangloang terbentuk menjadi Desa persiapan, yang merupakan hasil pemekaran dari Kelurahan Lancirang yang terdiri dari 4 Dusun yaitu Dusun I Padangloang, Dusun II Salonase, Dusun III Lampe'e, Dusun IV Ajubissue. Kepala Desa persiapan di jabat oleh Hade. M pada tahun 1985-1990 yang di tunjuk langsung oleh Bupati Sidenreng Rappang A. Salipolo. SH. Pada tahun 1990-1991 Kepala Desa di gantikan oleh bapak Landikkang dan di tunjuk langsung oleh Bupati, dengan demikian kepemimpinannya hanya dalam masa 1 tahun dikarenakan Desa Padangloang telah di persiapkan menjadi desa definitif.</p>

<p>Pada tahun 1992 Padangloang resmi menjadi Desa definitif dan di tahun yang sama diadakan pemilihan pertama Kepala Desa yang di pilih langsung oleh masyarakat adalah Drs. Muh. Kaseng. AP yang menjabat pada tahun 1992-2005 dan merupakan Kepala Desa yang paling lama masa jabatannya. Pada tahun 1996 Desa Padangloang kembali dimekarkan menjadi 2 Desa yakni Padangloang dan Padangloang Alau yang dusun III Lampe'e masuk di wilayah Desa Padangloang Alau. Kemudian pada tahun 2006 dilakukan pemilihan Kepala Desa dimana pada saat itu yang terpilih kembali adalah Hade. M dan masa kepemimpinannya 2006-2012.</p>

<p>Tahun 2013 di lakukan kembali pemilihan, dan Kepala Desa terpilih adalah Hamsah. P. ST periode 2013-2019, kemudian 2020 dijabat oleh PLT Daris selama 8 bulan dikarenakan beliau juga masuk dalam pemilihan calon Kepala Desa berikutnya, dan pada sisa jabatannya dijabat 4 bulan olah PLT Jufri, kemudian setelahnya diadakan pemilihan untuk periode berikutnya yang terpilih adalah Syamsu Alam yang memimpin Desa Padangloang kedepannya pada 2021-2026.</p>

<h3 style="margin-top:2rem;font-family:'Source Serif 4',Georgia,serif;font-size:1.5rem;font-weight:600;color:#171717">Tabel 1. Kepala Desa dan Masa Pemerintahan</h3>

<div style="margin-top:1rem;overflow-x:auto">
  <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #dee2de">
    <thead>
      <tr style="background:#282834">
        <th style="padding:12px 16px;text-align:left;font-weight:600;color:white;font-size:0.875rem">NO</th>
        <th style="padding:12px 16px;text-align:left;font-weight:600;color:white;font-size:0.875rem">NAMA</th>
        <th style="padding:12px 16px;text-align:left;font-weight:600;color:white;font-size:0.875rem">JABATAN</th>
        <th style="padding:12px 16px;text-align:left;font-weight:600;color:white;font-size:0.875rem">PERIODE</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-top:1px solid #dee2de">
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">1</td>
        <td style="padding:12px 16px;color:#171717;font-weight:500;font-size:0.9375rem">HADE. M</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">Kepala Desa</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">1985-1990 & 2006-2012</td>
      </tr>
      <tr style="border-top:1px solid #dee2de">
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">2</td>
        <td style="padding:12px 16px;color:#171717;font-weight:500;font-size:0.9375rem">Drs. MUH. KASENG. AP</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">Kepala Desa</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">1992-2005</td>
      </tr>
      <tr style="border-top:1px solid #dee2de">
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">3</td>
        <td style="padding:12px 16px;color:#171717;font-weight:500;font-size:0.9375rem">HAMSAH. P. ST</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">Kepala Desa</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">2013-2019</td>
      </tr>
      <tr style="border-top:1px solid #dee2de">
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">4</td>
        <td style="padding:12px 16px;color:#171717;font-weight:500;font-size:0.9375rem">DARIS</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">PLT Kades</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">Januari - Agustus 2019</td>
      </tr>
      <tr style="border-top:1px solid #dee2de">
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">5</td>
        <td style="padding:12px 16px;color:#171717;font-weight:500;font-size:0.9375rem">MUH. JUFRI</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">PLT Kades</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">Oktober 2020 - Januari 2020</td>
      </tr>
      <tr style="border-top:1px solid #dee2de">
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">6</td>
        <td style="padding:12px 16px;color:#171717;font-weight:500;font-size:0.9375rem">SYAMSU ALAM</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">Kepala Desa</td>
        <td style="padding:12px 16px;color:#6b7280;font-size:0.9375rem">2021-Sekarang</td>
      </tr>
    </tbody>
  </table>
</div>

<p style="margin-top:1rem;font-size:0.875rem;font-style:italic;color:#6b7280">Sumber: Arsip Desa Padangloang.</p>`,
      visi: "Terwujudnya Desa Padangloang yang Maju, Mandiri, dan Sejahtera melalui Peningkatan Kualitas Sumber Daya Manusia, Pengembangan Potensi Lokal, dan Tata Kelola Pemerintahan yang Baik.",
      misi: "1. Meningkatkan kualitas pelayanan publik dan tata kelola pemerintahan desa yang transparan dan akuntabel.\n2. Mengembangkan potensi ekonomi lokal melalui pemberdayaan UMKM dan sektor pertanian.\n3. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan keterampilan.\n4. Membangun dan memelihara infrastruktur desa yang memadai.\n5. Melestarikan nilai-nilai budaya dan kearifan lokal.",
      luasWilayah: 2.75,
      jumlahPenduduk: 1599,
      jumlahKK: 561,
      jumlahDusun: 3,
      batasUtara: "Kecamatan Baranti",
      batasTimur: "Desa Kalosi",
      batasSelatan: "Kecamatan Panca Lautang",
      batasBarat: "Desa Bila",
      fotoKepalaDesa: null,
    };
  }
}

export default async function ProfilPage() {
  const desa = await getDesaData();

  return (
    <div className="min-h-screen bg-linen dark:bg-[#111411]">
      <Navbar variant="public" />

      <main className="pt-20">
        {/* ── Hero Section (compact) ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#282834] to-[#1a1a1a] py-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
              <MapPin className="h-3.5 w-3.5" />
              Kecamatan Dua Pitue, Kabupaten Sidrap
            </div>
            <h1 className="mt-5 font-display text-display-small font-semibold tracking-tight text-white md:text-display-medium">
              Sejarah {desa.nama}
            </h1>
            <p className="mx-auto mt-3 max-w-xl font-body text-body-large text-white/60">
              Perjalanan panjang Desa Padangloang dari masa ke masa — mulai
              dari pemekaran hingga menjadi desa definitif yang terus berkembang.
            </p>
          </div>
        </section>

        {/* ── Card Sejarah (fokus utama) ── */}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
                <Clock className="h-5 w-5 text-hudson-blue dark:text-[#7fc8ff]" />
              </div>
              <div>
                <p className="font-body text-label-large font-semibold uppercase tracking-widest text-hudson-blue dark:text-[#7fc8ff]">
                  Sejarah
                </p>
                <h2 className="font-display text-headline-medium font-semibold tracking-tight text-obsidian dark:text-white">
                  Riwayat Desa Padangloang
                </h2>
              </div>
            </div>

            <div className="mt-8 rounded-[16px] border border-sage bg-paper p-8 shadow-paper-sm transition-all hover:shadow-paper-md dark:border-[#414943] dark:bg-[#1a1a1a] md:p-12">
              <div
                className="profil-sejarah space-y-5 font-body text-body-large leading-relaxed text-iron dark:text-[#c2c8bd] [&_p]:leading-relaxed [&_p]:text-iron dark:[&_p]:text-[#c2c8bd]"
                dangerouslySetInnerHTML={{ __html: desa.sejarah }}
              />
            </div>
          </section>

          {/* ── Footer keterangan ── */}
          <p className="mt-8 text-center font-body text-body-small text-iron dark:text-[#c2c8bd]">
            Ingin mengetahui lebih lanjut? Kunjungi Kantor Desa Padangloang
            atau hubungi kami melalui halaman{" "}
            <a
              href="/kontak"
              className="font-semibold text-hudson-blue underline underline-offset-2 hover:text-hudson-blue/80 dark:text-[#7fc8ff]"
            >
              Kontak
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
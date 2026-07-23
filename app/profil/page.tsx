import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { MapPin, Users, Home, TreesIcon as Tree, Compass } from "lucide-react";

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
      // Fallback data
      return {
        nama: "Desa Padangloang",
        sejarah: `<p>Desa Padangloang merupakan salah satu desa yang ada pada Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang, atau lebih dikenal dengan nama Kabupaten Sidrap. Sebelum berdiri sebagai Desa, Desa Padangloang merupakan hasil pemekaran dari Kelurahan Lancirang.</p>

<p>Pada tahun 1985 Padangloang terbentuk menjadi Desa persiapan, yang merupakan hasil pemekaran dari Kelurahan Lancirang yang terdiri dari 4 Dusun yaitu Dusun I Padangloang, Dusun II Salonase, Dusun III Lampe'e, Dusun IV Ajubissue. Kepala Desa persiapan di jabat oleh Hade. M pada tahun 1985-1990 yang di tunjuk langsung oleh Bupati Sidenreng Rappang A. Salipolo. SH. Pada tahun 1990-1991 Kepala Desa di gantikan oleh bapak Landikkang dan di tunjuk langsung oleh Bupati, dengan demikian kepemimpinannya hanya dalam masa 1 tahun dikarenakan Desa Padangloang telah di persiapkan menjadi desa definitif.</p>

<p>Pada tahun 1992 Padangloang resmi menjadi Desa definitif dan di tahun yang sama diadakan pemilihan pertama Kepala Desa yang di pilih langsung oleh masyarakat adalah Drs. Muh. Kaseng. AP yang menjabat pada tahun 1992-2005 dan merupakan Kepala Desa yang paling lama masa jabatannya. Pada tahun 1996 Desa Padangloang kembali dimekarkan menjadi 2 Desa yakni Padangloang dan Padangloang Alau yang dusun III Lampe'e masuk di wilayah Desa Padangloang Alau. Kemudian pada tahun 2006 dilakukan pemilihan Kepala Desa dimana pada saat itu yang terpilih kembali adalah Hade. M dan masa kepemimpinannya 2006-2012.</p>

<p>Tahun 2013 di lakukan kembali pemilihan, dan Kepala Desa terpilih adalah Hamsah. P. ST periode 2013-2019, kemudian 2020 dijabat oleh PLT Daris selama 8 bulan dikarenakan beliau juga masuk dalam pemilihan calon Kepala Desa berikutnya, dan pada sisa jabatannya dijabat 4 bulan olah PLT Jufri, kemudian setelahnya diadakan pemilihan untuk periode berikutnya yang terpilih adalah Syamsu Alam yang memimpin Desa Padangloang kedepannya pada 2021-2026.</p>

<h3 class="mt-8 font-display text-headline-small font-semibold text-obsidian dark:text-white">Tabel 1. Kepala Desa dan Masa Pemerintahan</h3>

<div class="mt-4 overflow-x-auto">
  <table class="w-full border-collapse rounded-[8px] overflow-hidden border border-sage dark:border-[#414943]">
    <thead>
      <tr class="bg-graphite-night dark:bg-[#1a1a1a]">
        <th class="px-4 py-3 text-left font-body text-label-medium font-semibold text-white">NO</th>
        <th class="px-4 py-3 text-left font-body text-label-medium font-semibold text-white">NAMA</th>
        <th class="px-4 py-3 text-left font-body text-label-medium font-semibold text-white">JABATAN</th>
        <th class="px-4 py-3 text-left font-body text-label-medium font-semibold text-white">PERIODE</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-t border-sage dark:border-[#414943]">
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">1</td>
        <td class="px-4 py-3 font-body text-body-medium text-obsidian dark:text-white font-medium">HADE. M</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Kepala Desa</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">1985-1990 & 2006-2012</td>
      </tr>
      <tr class="border-t border-sage dark:border-[#414943]">
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">2</td>
        <td class="px-4 py-3 font-body text-body-medium text-obsidian dark:text-white font-medium">Drs. MUH. KASENG. AP</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Kepala Desa</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">1992-2005</td>
      </tr>
      <tr class="border-t border-sage dark:border-[#414943]">
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">3</td>
        <td class="px-4 py-3 font-body text-body-medium text-obsidian dark:text-white font-medium">HAMSAH. P. ST</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Kepala Desa</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">2013-2019</td>
      </tr>
      <tr class="border-t border-sage dark:border-[#414943]">
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">4</td>
        <td class="px-4 py-3 font-body text-body-medium text-obsidian dark:text-white font-medium">DARIS</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">PLT Kades</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Januari - Agustus 2019</td>
      </tr>
      <tr class="border-t border-sage dark:border-[#414943]">
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">5</td>
        <td class="px-4 py-3 font-body text-body-medium text-obsidian dark:text-white font-medium">MUH. JUFRI</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">PLT Kades</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Oktober 2020 - Januari 2020</td>
      </tr>
      <tr class="border-t border-sage dark:border-[#414943]">
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">6</td>
        <td class="px-4 py-3 font-body text-body-medium text-obsidian dark:text-white font-medium">SYAMSU ALAM</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Kepala Desa</td>
        <td class="px-4 py-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">Sekarang</td>
      </tr>
    </tbody>
  </table>
</div>

<p class="mt-4 text-sm italic text-iron dark:text-[#c2c8bd] font-body">Sumber: Arsip Desa Padangloang.</p>`,
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

function StatsCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[12px] border border-sage bg-paper p-6 shadow-paper-sm transition-all hover:shadow-paper-md dark:border-[#414943] dark:bg-[#1a1a1a]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fog text-obsidian dark:bg-[#2e2e2e] dark:text-white">
        {icon}
      </div>
      <div className="text-center">
        <p className="font-display text-headline-medium font-semibold text-obsidian dark:text-white">
          {value}
        </p>
        <p className="font-body text-body-medium text-iron dark:text-[#c2c8bd]">
          {label}
        </p>
      </div>
    </div>
  );
}

function BoundaryCard({
  arah,
  wilayah,
  icon,
}: {
  arah: string;
  wilayah: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[12px] border border-sage bg-paper p-5 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fog text-hudson-blue dark:bg-[#2e2e2e] dark:text-[#7fc8ff]">
        {icon}
      </div>
      <div>
        <p className="font-body text-label-large font-semibold text-obsidian dark:text-white">
          {arah}
        </p>
        <p className="font-body text-body-medium text-iron dark:text-[#c2c8bd]">
          {wilayah}
        </p>
      </div>
    </div>
  );
}

export default async function ProfilPage() {
  const desa = await getDesaData();

  const misiList = desa.misi
    .split("\n")
    .filter((m) => m.trim())
    .map((m) => m.replace(/^\d+\.\s*/, ""));

  const stats = [
    {
      icon: <MapPin className="h-5 w-5" />,
      value: `${desa.luasWilayah} km²`,
      label: "Luas Wilayah",
    },
    {
      icon: <Users className="h-5 w-5" />,
      value: desa.jumlahPenduduk?.toLocaleString() ?? "-",
      label: "Jumlah Penduduk",
    },
    {
      icon: <Home className="h-5 w-5" />,
      value: desa.jumlahKK?.toLocaleString() ?? "-",
      label: "Kepala Keluarga",
    },
    {
      icon: <Tree className="h-5 w-5" />,
      value: desa.jumlahDusun ?? "-",
      label: "Jumlah Dusun",
    },
  ];

  const boundaries = [
    { arah: "Utara", wilayah: desa.batasUtara ?? "-", icon: "N" },
    { arah: "Timur", wilayah: desa.batasTimur ?? "-", icon: "T" },
    { arah: "Selatan", wilayah: desa.batasSelatan ?? "-", icon: "S" },
    { arah: "Barat", wilayah: desa.batasBarat ?? "-", icon: "B" },
  ];

  return (
    <div className="min-h-screen bg-linen dark:bg-[#111411]">
      <Navbar variant="public" />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-graphite-night py-20 dark:bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-br from-hudson-blue/10 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
              <MapPin className="h-3.5 w-3.5" />
              Kecamatan Dua Pitue, Kabupaten Sidrap
            </div>
            <h1 className="mt-6 font-display text-display-small font-semibold tracking-tight text-white md:text-display-medium">
              Profil {desa.nama}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-body-large text-white/70">
              Mengenal lebih dekat tentang Desa Padangloang — sejarah, visi,
              misi, dan potensi yang dimiliki.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-5xl -mt-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} />
            ))}
          </div>
        </section>

        {/* Content Container */}
        <div className="mx-auto max-w-5xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
          {/* Sejarah */}
          <section>
            <div className="mb-2 inline-flex items-center gap-2 font-body text-label-large font-semibold uppercase tracking-widest text-hudson-blue dark:text-[#7fc8ff]">
              <Compass className="h-4 w-4" />
              Sejarah
            </div>
            <h2 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
              Sejarah Desa
            </h2>
            <div className="mt-8 rounded-[16px] border border-sage bg-paper p-8 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a] md:p-12">
              <div
                className="profil-sejarah font-body text-body-large leading-relaxed text-iron dark:text-[#c2c8bd]"
                dangerouslySetInnerHTML={{ __html: desa.sejarah }}
              />
            </div>
          </section>

          {/* Visi & Misi */}
          <section>
            <div className="mb-2 inline-flex items-center gap-2 font-body text-label-large font-semibold uppercase tracking-widest text-hudson-blue dark:text-[#7fc8ff]">
              <Compass className="h-4 w-4" />
              Visi & Misi
            </div>
            <h2 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
              Visi dan Misi Desa
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {/* Visi Card */}
              <div className="rounded-[16px] border border-sage bg-paper p-8 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
                <div className="mb-2 inline-flex h-8 items-center justify-center rounded-full bg-hudson-blue/10 px-3 text-label-medium font-semibold text-hudson-blue dark:bg-[#004a73] dark:text-[#7fc8ff]">
                  Visi
                </div>
                <p className="mt-4 font-body text-body-large leading-relaxed text-obsidian dark:text-white">
                  &ldquo;{desa.visi}&rdquo;
                </p>
              </div>

              {/* Misi Card */}
              <div className="rounded-[16px] border border-sage bg-paper p-8 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
                <div className="mb-2 inline-flex h-8 items-center justify-center rounded-full bg-fog px-3 text-label-medium font-semibold text-obsidian dark:bg-[#2e2e2e] dark:text-white">
                  Misi
                </div>
                <ol className="mt-4 space-y-3">
                  {misiList.map((misi, i) => (
                    <li key={i} className="flex gap-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fog text-label-small font-semibold text-obsidian dark:bg-[#2e2e2e] dark:text-white">
                        {i + 1}
                      </span>
                      {misi}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Batas Wilayah */}
          <section>
            <div className="mb-2 inline-flex items-center gap-2 font-body text-label-large font-semibold uppercase tracking-widest text-hudson-blue dark:text-[#7fc8ff]">
              <MapPin className="h-4 w-4" />
              Wilayah
            </div>
            <h2 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white">
              Batas Wilayah
            </h2>
            <p className="mt-3 font-body text-body-medium text-iron dark:text-[#c2c8bd]">
              Desa Padangloang berbatasan dengan wilayah berikut:
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {boundaries.map((b, i) => (
                <BoundaryCard key={i} {...b} icon={<span className="text-sm font-bold">{b.icon}</span>} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Image from "next/image";

const pejabat = [
  { no: 1, jabatan: "Komandan I", nama: "Mayor Inf H. Pieterz", tahun: "1950" },
  { no: 2, jabatan: "Komandan II", nama: "Mayor Inf J. E. Bolang", tahun: "1951" },
  { no: 3, jabatan: "Komandan III", nama: "Kapten Inf Usman Jafar", tahun: "1951" },
  { no: 4, jabatan: "Komandan IV", nama: "Kapten Inf M. Yusuf", tahun: "1951" },
  { no: 5, jabatan: "Komandan V", nama: "Kapten Inf W. E. Sumantri", tahun: "1954" },
  { no: 6, jabatan: "Komandan VI", nama: "Mayor Inf Syamsuddin. K", tahun: "1954 s.d 1958" },
  { no: 7, jabatan: "Komandan VII", nama: "Mayor Inf Edi Sabara", tahun: "1958 s.d 1960" },
  { no: 8, jabatan: "Komandan VIII", nama: "Mayor Inf Ahmad Lamo", tahun: "1960 s.d 1962" },
  { no: 9, jabatan: "Komandan IX", nama: "Mayor Inf A. R Malaka", tahun: "1962 s.d 1963" },
  { no: 10, jabatan: "Komandan X", nama: "Mayor Inf Z. A. Soegianto", tahun: "1963" },
  { no: 11, jabatan: "Komandan XI", nama: "Letkol Inf H. Nawing", tahun: "-" },
  { no: 12, jabatan: "Komandan XII", nama: "Letkol Inf Hasanuddin Oddang", tahun: "-" },
  { no: 13, jabatan: "Komandan XIII", nama: "Letkol CPM A. Gani", tahun: "-" },
  { no: 14, jabatan: "Komandan XIV", nama: "Letkol Inf A. Bustam", tahun: "1982 s.d 1984" },
  { no: 15, jabatan: "Komandan XV", nama: "Letkol Inf A. K. Sawong", tahun: "1984 s.d 1986" },
  { no: 16, jabatan: "Komandan XVI", nama: "Letkol Inf A. Jalal", tahun: "1986 s.d 1988" },
  { no: 17, jabatan: "Komandan XVII", nama: "Letkol Czi N. R. Natsir", tahun: "-" },
  { no: 18, jabatan: "Komandan XVIII", nama: "Letkol Inf Syamsul Alam", tahun: "-" },
  { no: 19, jabatan: "Komandan XIX", nama: "Letkol Inf Mardianto", tahun: "1989 s.d 1991" },
  { no: 20, jabatan: "Komandan XX", nama: "Letkol Inf Ahmad Sugeng", tahun: "1991 s.d 1993" },
  { no: 21, jabatan: "Komandan XXI", nama: "Letkol Inf Muh. Amir", tahun: "1993 s.d 1994" },
  { no: 22, jabatan: "Komandan XXII", nama: "Letkol Inf Syamsul Mappareppa", tahun: "1994 s.d 1995" },
  { no: 23, jabatan: "Komandan XXIII", nama: "Letkol Inf Herry. Z. D. Arifin", tahun: "1995 s.d 1996" },
  { no: 24, jabatan: "Komandan XXIV", nama: "Letkol Art Sabar Yudho Suroso", tahun: "1996 s.d 1997" },
  { no: 25, jabatan: "Komandan XXV", nama: "Letkol Inf Drs. S. Widjonarko, M. Sc", tahun: "1997 s.d 1999" },
  { no: 26, jabatan: "Komandan XXVI", nama: "Letkol Art Danu Nawawi", tahun: "1999 s.d 2000" },
  { no: 27, jabatan: "Komandan XXVII", nama: "Letkol Kav Mulyanto", tahun: "2000 s.d 2001" },
  { no: 28, jabatan: "Komandan XXVIII", nama: "Letkol Chb Soedarmo", tahun: "2001 s.d 2002" },
  { no: 29, jabatan: "Komandan XXIX", nama: "Letkol Czi Juwondo", tahun: "2002 s.d 2003" },
  { no: 30, jabatan: "Komandan XXX", nama: "Letkol Inf Sangkuriang", tahun: "2003 s.d 2004" },
  { no: 31, jabatan: "Komandan XXXI", nama: "Letkol Inf A. M. Putranto, S. Sos", tahun: "2004 s.d 2006" },
  { no: 32, jabatan: "Komandan XXXII", nama: "Letkol Inf Marga Taufiq", tahun: "2006 s.d 2009" },
  { no: 33, jabatan: "Komandan XXXIII", nama: "Letkol Inf Syaiful Anwar", tahun: "2009 s.d 2010" },
  { no: 34, jabatan: "Komandan XXXIV", nama: "Letkol Inf Agus Prangarso", tahun: "2010 s.d 2011" },
  { no: 35, jabatan: "Komandan XXXV", nama: "Letkol Arm Maryudi, S.Sos", tahun: "2011 s.d 2012" },
  { no: 36, jabatan: "Komandan XXXVI", nama: "Letkol Inf Firyawan, S.IP", tahun: "2012 s.d 2014" },
  { no: 37, jabatan: "Komandan XXXVII", nama: "Letkol Inf Budi Kurniawan", tahun: "2014" },
  { no: 38, jabatan: "Komandan XXXVIII", nama: "Letkol Arh Deni Sukwara, S.E.", tahun: "2014 s.d 2015" },
  { no: 39, jabatan: "Komandan XXXIX", nama: "Kolonel Inf Jefry Oktavian Rotty, S.E.", tahun: "2015 s.d 2016" },
  { no: 40, jabatan: "Komandan XXXX", nama: "Kolonel Kav Otto Sollu, S.E.", tahun: "2016 s.d 2018" },
  { no: 41, jabatan: "Komandan XLI", nama: "Kolonel Inf Andriyanto, S.E.", tahun: "2018 s.d 2019" },
  { no: 42, jabatan: "Komandan XLII", nama: "Kolonel Kav Dwi Irbaya Sandra, S.Sos.", tahun: "2020 s.d 2022" },
  { no: 43, jabatan: "Komandan XLIII", nama: "Kolonel Inf Nurman Syahreda, S.E.", tahun: "2022 s.d 2023" },
  { no: 44, jabatan: "Komandan XLIV", nama: "Kolonel Inf Lizardo Gumay, S.H., M.M., M.I.Pol.", tahun: "2023 s.d 2024" },
  { no: 45, jabatan: "Komandan XLV", nama: "Kolonel Inf Franki Susanto, S.E.", tahun: "2024 s.d 2025" },
  { no: 46, jabatan: "Komandan XLVI", nama: "Letkol Kav Ino Dwi Setyo Darmawan, S.E., M.Han.", tahun: "2025 s.d sekarang" },
];

export default function PejabatKodimPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-5xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Hero Image */}
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/logo.png"
              alt="Kodim 1408 Makassar"
              width={1200}
              height={600}
              className="mx-auto h-48 w-auto object-contain py-8 sm:h-64"
              priority
            />
          </div>

          {/* Article */}
          <article className="rounded-2xl bg-card p-8 shadow-xl md:p-12">
            <h1 className="mb-2 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Pejabat Kodim 1408/MKS
            </h1>
            <p className="mb-8 text-base font-semibold uppercase tracking-widest text-primary">
              Daftar Nama Komandan Kodim 1408/Makassar
            </p>

            <p className="mb-8 text-lg leading-relaxed text-foreground/70">
              Sejak berdirinya Komando Distrik Militer 1408/Makassar dari tahun
              1950 sampai dengan sekarang, berikut adalah daftar pejabat yang
              menjadi Komandan Kodim 1408/Makassar:
            </p>

            {/* Highlight current commander */}
            <div className="mb-10 rounded-xl border-2 border-primary bg-primary/5 p-6">
              <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">
                Komandan Saat Ini
              </p>
              <h2 className="text-2xl font-bold">
                Letkol Kav Ino Dwi Setyo Darmawan, S.E., M.Han.
              </h2>
              <p className="mt-1 text-foreground/70">
                Tahun 2025 s.d sekarang
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-foreground/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-foreground/10 bg-foreground/5">
                    <th className="px-4 py-3 font-semibold">No</th>
                    <th className="px-4 py-3 font-semibold">Nama</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                      Tahun Menjabat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pejabat.map((p) => (
                    <tr
                      key={p.no}
                      className={`border-b border-foreground/5 transition-colors hover:bg-foreground/5 ${
                        p.no === pejabat.length
                          ? "bg-primary/5 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">{p.no}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">{p.nama}</span>
                          <span className="block text-xs text-foreground/50 sm:hidden">
                            {p.tahun}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground/70 hidden sm:table-cell">
                        {p.tahun}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Closing */}
            <div className="mt-10 border-t border-foreground/10 pt-8">
              <blockquote className="rounded-r-lg border-l-4 border-primary bg-primary/5 py-2 pl-6">
                <p className="text-lg font-semibold italic text-primary">
                  &ldquo;TNI AD Profesional di Kota Metropolitan Timur —
                  Mengabdi dengan Hati, Bersama Membangun Negeri.&rdquo;
                </p>
              </blockquote>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

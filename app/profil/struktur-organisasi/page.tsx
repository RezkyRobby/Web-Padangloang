import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import Image from "next/image";

export default function StrukturOrganisasiPage() {
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
              Struktur Organisasi
            </h1>
            <p className="mb-8 text-base font-semibold uppercase tracking-widest text-primary">
              Kodim 1408/Makassar
            </p>

            <p className="mb-10 text-lg leading-relaxed text-foreground/70">
              Berikut adalah struktur organisasi Komando Distrik Militer
              1408/Makassar yang menggambarkan hierarki dan pembagian tugas
              dalam satuan.
            </p>

            {/* Structure Image */}
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/struktur-jabatan.jpg"
                alt="Struktur Organisasi Kodim 1408/Makassar"
                width={1600}
                height={1000}
                className="w-full h-auto"
              />
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

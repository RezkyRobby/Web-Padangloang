"use client";

import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function KontakPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: kirim pesan ke API
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
          {/* ─── HEADER ─── */}
          <section className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-obsidian dark:bg-white">
              <MessageCircle className="h-8 w-8 text-white dark:text-obsidian" />
            </div>
            <h1 className="font-display text-display-small font-semibold tracking-tight text-obsidian dark:text-white md:text-display-medium">
              Kontak & Layanan
            </h1>
            <p className="mt-3 font-body text-body-large text-iron">
              Hubungi Pemerintahan Desa Padangloang
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2">
            {/* ─── INFO KONTAK ─── */}
            <section className="space-y-6">
              <h2 className="font-display text-headline-medium font-semibold text-obsidian dark:text-white">
                Informasi Kontak
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-[12px] border border-sage bg-paper p-5 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-hudson-blue" />
                  <div>
                    <h3 className="font-body text-sm font-semibold text-obsidian dark:text-white">
                      Alamat
                    </h3>
                    <p className="font-body text-body-medium text-iron">
                      Kantor Desa Padangloang
                      <br />
                      Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang
                      <br />
                      Sulawesi Selatan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-[12px] border border-sage bg-paper p-5 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-hudson-blue" />
                  <div>
                    <h3 className="font-body text-sm font-semibold text-obsidian dark:text-white">
                      Telepon
                    </h3>
                    <p className="font-body text-body-medium text-iron">
                      (0421) XXX-XXXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-[12px] border border-sage bg-paper p-5 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-hudson-blue" />
                  <div>
                    <h3 className="font-body text-sm font-semibold text-obsidian dark:text-white">
                      Email
                    </h3>
                    <p className="font-body text-body-medium text-iron">
                      desapadangloang@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-[12px] border border-sage bg-paper p-5 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-hudson-blue" />
                  <div>
                    <h3 className="font-body text-sm font-semibold text-obsidian dark:text-white">
                      Jam Kerja
                    </h3>
                    <p className="font-body text-body-medium text-iron">
                      Senin - Jumat: 08.00 - 16.00 WITA
                      <br />
                      Sabtu: 08.00 - 12.00 WITA
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/6280000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-[#25D366] px-6 font-body text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#25D366]/90 md:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                Hubungi via WhatsApp
              </a>
            </section>

            {/* ─── FORM PESAN ─── */}
            <section>
              <h2 className="mb-6 font-display text-headline-medium font-semibold text-obsidian dark:text-white">
                Kirim Pesan
              </h2>

              {submitted ? (
                <div className="flex flex-col items-center justify-center rounded-[12px] border border-sage bg-paper p-10 text-center dark:border-[#414943] dark:bg-[#1a1a1a]">
                  <Send className="mb-4 h-12 w-12 text-hudson-blue" />
                  <h3 className="mb-2 font-display text-headline-small font-semibold text-obsidian dark:text-white">
                    Pesan Terkirim
                  </h3>
                  <p className="font-body text-body-medium text-iron">
                    Terima kasih, pesan Anda telah kami terima. Kami akan
                    merespon secepatnya.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 rounded-[12px] border border-sage bg-paper p-6 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a] md:p-8"
                >
                  <div>
                    <label className="mb-1.5 block font-body text-sm font-semibold text-obsidian dark:text-white">
                      Nama Lengkap
                    </label>
                    <input
                      required
                      className="h-12 w-full rounded-xs border border-mist bg-paper px-4 font-body text-sm text-obsidian placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 focus:outline-none dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-sm font-semibold text-obsidian dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="h-12 w-full rounded-xs border border-mist bg-paper px-4 font-body text-sm text-obsidian placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 focus:outline-none dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white"
                      placeholder="Masukkan email Anda"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-sm font-semibold text-obsidian dark:text-white">
                      Subjek
                    </label>
                    <input
                      required
                      className="h-12 w-full rounded-xs border border-mist bg-paper px-4 font-body text-sm text-obsidian placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 focus:outline-none dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white"
                      placeholder="Subjek pesan"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-body text-sm font-semibold text-obsidian dark:text-white">
                      Pesan
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full rounded-xs border border-mist bg-paper px-4 py-3 font-body text-sm text-obsidian placeholder:text-steel focus:border-obsidian focus:ring-1 focus:ring-obsidian/10 focus:outline-none dark:border-[#414943] dark:bg-[#1a1a1a] dark:text-white"
                      placeholder="Tulis pesan Anda..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xs bg-obsidian px-6 font-body text-sm font-semibold tracking-wide text-white transition-colors hover:bg-obsidian/90 dark:bg-white dark:text-obsidian dark:hover:bg-white/90"
                  >
                    <Send className="h-4 w-4" />
                    Kirim Pesan
                  </button>
                </form>
              )}
            </section>
          </div>

          {/* ─── GOOGLE MAPS ─── */}
          <section className="rounded-[12px] border border-sage bg-paper p-2 shadow-paper-sm dark:border-[#414943] dark:bg-[#1a1a1a]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127489.123!2d119.8!3d-3.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSidenreng%20Rappang!5e0!3m2!1sid!2sid!4v1"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Desa Padangloang"
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
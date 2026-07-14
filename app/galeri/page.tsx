"use client";

import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { Images } from "lucide-react";

export default function GaleriPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant="public" />
      <main className="flex min-h-[70vh] items-center justify-center pt-20 pb-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e]">
            <Images className="h-10 w-10 text-iron" />
          </div>
          <h1 className="mb-3 font-display text-headline-large font-semibold text-obsidian dark:text-white">
            Galeri
          </h1>
          <p className="font-body text-body-large text-iron">
            Halaman ini akan menampilkan galeri foto dan video kegiatan Desa Padangloang. Segera hadir.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
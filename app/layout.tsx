import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";

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

export const metadata: Metadata = {
  title: "Desa Padangloang — Sidrap",
  description:
    "Website resmi Desa Padangloang, Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang (Sidrap), Sulawesi Selatan. Menyajikan informasi profil desa, berita, UMKM, wisata, dan layanan masyarakat.",
  icons: {
    icon: "/favicon-16x16.png",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

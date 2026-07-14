import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const desa = await prisma.desa.findFirst();

    if (!desa) {
      return NextResponse.json(
        {
          nama: "Desa Padangloang",
          sejarah: "Desa Padangloang merupakan salah satu desa di Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang, Provinsi Sulawesi Selatan. Desa ini memiliki luas wilayah 2,75 km² yang terbagi dalam 3 dusun. Masyarakat Desa Padangloang hidup rukun dan damai dengan mayoritas mata pencaharian sebagai petani dan peternak.",
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
        },
        { status: 200 }
      );
    }

    return NextResponse.json(desa);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
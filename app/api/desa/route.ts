import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updateDesaSchema } from "@/lib/schemas/desa";

const fallbackDesa = {
  nama: "Desa Padangloang",
  sejarah:
    "Desa Padangloang merupakan salah satu desa di Kecamatan Dua Pitue, Kabupaten Sidenreng Rappang, Provinsi Sulawesi Selatan. Desa ini memiliki luas wilayah 2,75 km² yang terbagi dalam 3 dusun. Masyarakat Desa Padangloang hidup rukun dan damai dengan mayoritas mata pencaharian sebagai petani dan peternak.",
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

export async function GET() {
  try {
    const desa = await prisma.desa.findFirst();

    if (!desa) {
      return NextResponse.json(fallbackDesa, { status: 200 });
    }

    return NextResponse.json(desa);
  } catch (error) {
    console.error(error);
    return NextResponse.json(fallbackDesa, { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateDesaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    // Cari record yang sudah ada (Desa hanya 1 record)
    const existing = await prisma.desa.findFirst({ select: { id: true } });

    let data;
    if (existing) {
      data = await prisma.desa.update({
        where: { id: existing.id },
        data: parsed.data,
      });
    } else {
      // Jika belum ada record, buat baru dengan data dari body + seed defaults
      data = await prisma.desa.create({
        data: {
          nama: parsed.data.nama ?? fallbackDesa.nama,
          sejarah: parsed.data.sejarah ?? fallbackDesa.sejarah,
          visi: parsed.data.visi ?? fallbackDesa.visi,
          misi: parsed.data.misi ?? fallbackDesa.misi,
          luasWilayah: parsed.data.luasWilayah ?? fallbackDesa.luasWilayah,
          jumlahPenduduk: parsed.data.jumlahPenduduk ?? fallbackDesa.jumlahPenduduk,
          jumlahKK: parsed.data.jumlahKK ?? fallbackDesa.jumlahKK,
          jumlahDusun: parsed.data.jumlahDusun ?? fallbackDesa.jumlahDusun,
          batasUtara: parsed.data.batasUtara ?? fallbackDesa.batasUtara,
          batasTimur: parsed.data.batasTimur ?? fallbackDesa.batasTimur,
          batasSelatan: parsed.data.batasSelatan ?? fallbackDesa.batasSelatan,
          batasBarat: parsed.data.batasBarat ?? fallbackDesa.batasBarat,
          fotoKepalaDesa: parsed.data.fotoKepalaDesa ?? null,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
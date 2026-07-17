import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createUMKMSchema } from "@/lib/schemas/umkm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori")?.trim() ?? "";
    const q = searchParams.get("q")?.trim() ?? "";
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const where: Record<string, unknown> = {};
    if (kategori) where.kategori = kategori;
    if (q) where.namaProduk = { contains: q, mode: "insensitive" };

    const data = await prisma.uMKM.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createUMKMSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const data = await prisma.uMKM.create({
      data: {
        namaProduk: parsed.data.namaProduk,
        deskripsi: parsed.data.deskripsi,
        harga: parsed.data.harga ?? null,
        kategori: parsed.data.kategori,
        kontak: parsed.data.kontak,
        gambar: parsed.data.gambar || null,
        pemilik: parsed.data.pemilik,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
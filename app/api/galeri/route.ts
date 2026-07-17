import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createGaleriSchema } from "@/lib/schemas/galeri";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori")?.trim() ?? "";
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const where: Record<string, unknown> = {};
    if (kategori) where.kategori = kategori;

    const data = await prisma.galeri.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        uploadedBy: {
          select: { id: true, name: true, image: true },
        },
      },
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
    const parsed = createGaleriSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const data = await prisma.galeri.create({
      data: {
        judul: parsed.data.judul,
        gambar: parsed.data.gambar,
        kategori: parsed.data.kategori,
        uploadedById: parsed.data.uploadedById,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
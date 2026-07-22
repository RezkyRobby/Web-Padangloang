import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createLayananSchema } from "@/lib/schemas/layanan";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const q = searchParams.get("q")?.trim() ?? "";

    const where: Record<string, unknown> = {};
    // Default: hanya layanan aktif (untuk public)
    if (!all) where.isActive = true;
    if (q) where.nama = { contains: q, mode: "insensitive" };

    const data = await prisma.layanan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        formFields: {
          orderBy: { urutan: "asc" },
        },
        persyaratanList: {
          orderBy: { urutan: "asc" },
        },
        _count: {
          select: { permohonan: true },
        },
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createLayananSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const data = await prisma.layanan.create({
      data: {
        nama: parsed.data.nama,
        deskripsi: parsed.data.deskripsi || null,
        icon: parsed.data.icon || null,
        isActive: parsed.data.isActive,
        hanyaOffline: parsed.data.hanyaOffline,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPersyaratanSchema } from "@/lib/schemas/persyaratan";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await prisma.persyaratan.findMany({
      where: { layananId: id },
      orderBy: { urutan: "asc" },
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = createPersyaratanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    // Verify layanan exists
    const layanan = await prisma.layanan.findUnique({ where: { id } });
    if (!layanan) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.persyaratan.create({
      data: {
        layananId: id,
        nama: parsed.data.nama,
        contohGambar: parsed.data.contohGambar || null,
        templateFile: parsed.data.templateFile || null,
        urutan: parsed.data.urutan ?? 0,
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
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updatePersyaratanSchema } from "@/lib/schemas/persyaratan";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; persyaratanId: string }> },
) {
  try {
    const { persyaratanId } = await params;
    const body = await req.json();
    const parsed = updatePersyaratanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const existing = await prisma.persyaratan.findUnique({
      where: { id: persyaratanId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Persyaratan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.persyaratan.update({
      where: { id: persyaratanId },
      data: {
        ...(parsed.data.nama !== undefined ? { nama: parsed.data.nama } : {}),
        ...(parsed.data.contohGambar !== undefined
          ? { contohGambar: parsed.data.contohGambar || null }
          : {}),
        ...(parsed.data.templateFile !== undefined
          ? { templateFile: parsed.data.templateFile || null }
          : {}),
        ...(parsed.data.urutan !== undefined
          ? { urutan: parsed.data.urutan }
          : {}),
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; persyaratanId: string }> },
) {
  try {
    const { persyaratanId } = await params;

    const existing = await prisma.persyaratan.findUnique({
      where: { id: persyaratanId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Persyaratan tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.persyaratan.delete({ where: { id: persyaratanId } });

    return NextResponse.json({ message: "Persyaratan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
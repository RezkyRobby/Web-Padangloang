import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updatePerangkatDesaSchema } from "@/lib/schemas/perangkat-desa";

// GET /api/perangkat-desa/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await prisma.perangkatDesa.findUnique({
      where: { id },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
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

// PUT /api/perangkat-desa/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const parsed = updatePerangkatDesaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const existing = await prisma.perangkatDesa.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.perangkatDesa.update({
      where: { id },
      data: {
        ...(parsed.data.nama !== undefined ? { nama: parsed.data.nama } : {}),
        ...(parsed.data.jabatan !== undefined
          ? { jabatan: parsed.data.jabatan }
          : {}),
        ...(parsed.data.foto !== undefined ? { foto: parsed.data.foto } : {}),
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

// DELETE /api/perangkat-desa/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.perangkatDesa.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.perangkatDesa.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
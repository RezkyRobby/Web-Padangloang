import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updateLayananSchema } from "@/lib/schemas/layanan";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await prisma.layanan.findUnique({
      where: { id },
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

    if (!data) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateLayananSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const existing = await prisma.layanan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.layanan.update({
      where: { id },
      data: {
        ...(parsed.data.nama !== undefined ? { nama: parsed.data.nama } : {}),
        ...(parsed.data.deskripsi !== undefined
          ? { deskripsi: parsed.data.deskripsi }
          : {}),
        ...(parsed.data.icon !== undefined ? { icon: parsed.data.icon } : {}),
        ...(parsed.data.isActive !== undefined
          ? { isActive: parsed.data.isActive }
          : {}),
        ...(parsed.data.hanyaOffline !== undefined
          ? { hanyaOffline: parsed.data.hanyaOffline }
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const existing = await prisma.layanan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.layanan.delete({ where: { id } });

    return NextResponse.json({ message: "Layanan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
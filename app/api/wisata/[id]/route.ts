import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updateWisataSchema } from "@/lib/schemas/wisata";

// GET /api/wisata/[id]
// Retrieves a single wisata destination by id.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await prisma.wisata.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/wisata/[id]
// Partially updates a wisata destination by id.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const parsed = updateWisataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const existing = await prisma.wisata.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    const data = await prisma.wisata.update({
      where: { id },
      data: {
        ...(parsed.data.nama !== undefined ? { nama: parsed.data.nama } : {}),
        ...(parsed.data.deskripsi !== undefined ? { deskripsi: parsed.data.deskripsi } : {}),
        ...(parsed.data.lokasi !== undefined ? { lokasi: parsed.data.lokasi } : {}),
        ...(parsed.data.kategori !== undefined ? { kategori: parsed.data.kategori } : {}),
        ...(parsed.data.gambar !== undefined ? { gambar: parsed.data.gambar || null } : {}),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/wisata/[id]
// Deletes a wisata destination by id.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.wisata.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    await prisma.wisata.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
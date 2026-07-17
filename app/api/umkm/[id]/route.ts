import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updateUMKMSchema } from "@/lib/schemas/umkm";

// GET /api/umkm/[id]
// Retrieves a single UMKM product by id.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await prisma.uMKM.findUnique({ where: { id } });

    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/umkm/[id]
// Fully updates a UMKM product by id.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const body = await req.json();
    const parsed = updateUMKMSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const existing = await prisma.uMKM.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    const data = await prisma.uMKM.update({
      where: { id },
      data: {
        ...(parsed.data.namaProduk !== undefined ? { namaProduk: parsed.data.namaProduk } : {}),
        ...(parsed.data.deskripsi !== undefined ? { deskripsi: parsed.data.deskripsi } : {}),
        ...(parsed.data.harga !== undefined ? { harga: parsed.data.harga || null } : {}),
        ...(parsed.data.kategori !== undefined ? { kategori: parsed.data.kategori } : {}),
        ...(parsed.data.kontak !== undefined ? { kontak: parsed.data.kontak } : {}),
        ...(parsed.data.gambar !== undefined ? { gambar: parsed.data.gambar || null } : {}),
        ...(parsed.data.pemilik !== undefined ? { pemilik: parsed.data.pemilik } : {}),
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/umkm/[id]
// Deletes a UMKM product by id.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.uMKM.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    await prisma.uMKM.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
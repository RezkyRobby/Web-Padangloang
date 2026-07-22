import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const permohonan = await prisma.permohonan.findUnique({ where: { id } });
    if (!permohonan) {
      return NextResponse.json(
        { error: "Permohonan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.progressHistory.findMany({
      where: { permohonanId: id },
      orderBy: { createdAt: "asc" },
      include: { createdBy: { select: { id: true, name: true } } },
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
    const { status, catatan, createdById } = body;

    if (!status) {
      return NextResponse.json(
        { error: "status wajib diisi" },
        { status: 422 },
      );
    }

    if (!createdById) {
      return NextResponse.json(
        { error: "createdById wajib diisi" },
        { status: 422 },
      );
    }

    const permohonan = await prisma.permohonan.findUnique({ where: { id } });
    if (!permohonan) {
      return NextResponse.json(
        { error: "Permohonan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Buat progress history
    const progress = await prisma.progressHistory.create({
      data: {
        permohonanId: id,
        status,
        catatan: catatan || null,
        createdById,
      },
    });

    // Update status permohonan mengikuti progress terbaru
    await prisma.permohonan.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
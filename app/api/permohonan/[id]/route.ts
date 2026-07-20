import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await prisma.permohonan.findUnique({
      where: { id },
      include: {
        layanan: true,
        user: { select: { id: true, name: true, email: true, nik: true, phoneNumber: true } },
        data: { include: { formField: true } },
        progress: {
          orderBy: { createdAt: "asc" },
          include: { createdBy: { select: { id: true, name: true } } },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Permohonan tidak ditemukan" },
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
    const { status, layananId, catatan } = body;

    const existing = await prisma.permohonan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Permohonan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.permohonan.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(layananId !== undefined ? { layananId: layananId } : {}),
        ...(catatan !== undefined ? { catatan } : {}),
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
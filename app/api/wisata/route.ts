import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori")?.trim() ?? "";
    const q = searchParams.get("q")?.trim() ?? "";

    const where: Record<string, unknown> = {};
    if (kategori) where.kategori = kategori;
    if (q) where.nama = { contains: q, mode: "insensitive" };

    const data = await prisma.wisata.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
    const data = await prisma.wisata.create({ data: body });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
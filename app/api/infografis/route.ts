import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun");

    const where = tahun ? { tahun: parseInt(tahun) } : {};

    const data = await prisma.infografis.findMany({
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
    const data = await prisma.infografis.create({
      data: {
        judul: body.judul,
        tahun: body.tahun,
        dataJson: body.dataJson,
      },
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
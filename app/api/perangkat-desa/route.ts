import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPerangkatDesaSchema } from "@/lib/schemas/perangkat-desa";

export async function GET() {
  try {
    const data = await prisma.perangkatDesa.findMany({
      orderBy: { urutan: "asc" },
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
    const parsed = createPerangkatDesaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const data = await prisma.perangkatDesa.create({
      data: {
        nama: parsed.data.nama,
        jabatan: parsed.data.jabatan,
        foto: parsed.data.foto ?? null,
        urutan: parsed.data.urutan,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
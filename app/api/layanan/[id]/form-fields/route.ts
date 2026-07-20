import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createFormFieldSchema } from "@/lib/schemas/form-field";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const layanan = await prisma.layanan.findUnique({ where: { id } });
    if (!layanan) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.formField.findMany({
      where: { layananId: id },
      orderBy: { urutan: "asc" },
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
    const parsed = createFormFieldSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const layanan = await prisma.layanan.findUnique({ where: { id } });
    if (!layanan) {
      return NextResponse.json(
        { error: "Layanan tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.formField.create({
      data: {
        layananId: id,
        label: parsed.data.label,
        fieldType: parsed.data.fieldType,
        required: parsed.data.required,
        placeholder: parsed.data.placeholder || null,
        ...(parsed.data.options
          ? { options: parsed.data.options }
          : {}),
        urutan: parsed.data.urutan,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
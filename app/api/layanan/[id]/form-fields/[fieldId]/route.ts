import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { updateFormFieldSchema } from "@/lib/schemas/form-field";

export async function PUT(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; fieldId: string }> },
) {
  try {
    const { fieldId } = await params;
    const body = await req.json();
    const parsed = updateFormFieldSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const existing = await prisma.formField.findUnique({
      where: { id: fieldId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Form field tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.formField.update({
      where: { id: fieldId },
      data: {
        ...(parsed.data.label !== undefined
          ? { label: parsed.data.label }
          : {}),
        ...(parsed.data.fieldType !== undefined
          ? { fieldType: parsed.data.fieldType }
          : {}),
        ...(parsed.data.required !== undefined
          ? { required: parsed.data.required }
          : {}),
        ...(parsed.data.placeholder !== undefined
          ? { placeholder: parsed.data.placeholder }
          : {}),
        ...(parsed.data.options !== undefined
          ? { options: parsed.data.options }
          : {}),
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

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; fieldId: string }> },
) {
  try {
    const { fieldId } = await params;
    const existing = await prisma.formField.findUnique({
      where: { id: fieldId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Form field tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.formField.delete({ where: { id: fieldId } });

    return NextResponse.json({ message: "Form field berhasil dihapus" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
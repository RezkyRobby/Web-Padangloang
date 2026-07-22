import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateProfileSchema = z.object({
  userId: z.string().min(1, "userId wajib diisi"),
  nik: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId")?.trim() ?? "";

    if (!userId) {
      return NextResponse.json(
        { error: "userId wajib diisi" },
        { status: 422 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        nik: true,
        phoneNumber: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const { userId, nik, phoneNumber } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const data = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nik !== undefined ? { nik } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        nik: true,
        phoneNumber: true,
        role: true,
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
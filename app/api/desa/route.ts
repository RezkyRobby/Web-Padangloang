import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const desa = await prisma.desa.findFirst({
      select: {
        luasWilayah: true,
        jumlahPenduduk: true,
        jumlahKK: true,
        jumlahDusun: true,
      },
    });

    if (!desa) {
      return NextResponse.json(
        {
          luasWilayah: 2.75,
          jumlahPenduduk: 1599,
          jumlahKK: 561,
          jumlahDusun: 3,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(desa);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
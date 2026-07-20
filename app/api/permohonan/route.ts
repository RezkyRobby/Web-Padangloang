import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.trim() ?? "";
    const layananId = searchParams.get("layananId")?.trim() ?? "";
    const userId = searchParams.get("userId")?.trim() ?? "";
    const q = searchParams.get("q")?.trim() ?? "";
    const from = searchParams.get("from")?.trim() ?? "";
    const to = searchParams.get("to")?.trim() ?? "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (layananId) where.layananId = layananId;
    if (userId) where.userId = userId;
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }

    const data = await prisma.permohonan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        layanan: { select: { id: true, nama: true, icon: true } },
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { progress: true } },
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { layananId, jenisAjuan, userId, formData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId wajib diisi" },
        { status: 422 },
      );
    }

    if (!jenisAjuan || !["ONLINE", "OFFLINE"].includes(jenisAjuan)) {
      return NextResponse.json(
        { error: "jenisAjuan harus ONLINE atau OFFLINE" },
        { status: 422 },
      );
    }

    // Generate nomor tiket: PL-YYYYMMDD-XXX
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const count = await prisma.permohonan.count({
      where: { nomorTiket: { startsWith: `PL-${today}` } },
    });
    const nomorTiket = `PL-${today}-${String(count + 1).padStart(3, "0")}`;

    const permohonan = await prisma.permohonan.create({
      data: {
        nomorTiket,
        layananId: layananId || null,
        userId,
        jenisAjuan,
        status: "MENUNGGU",
        data: {
          create:
            Array.isArray(formData) && formData.length > 0
              ? formData.map(
                  (fd: { formFieldId: string; value: string }) => ({
                    formFieldId: fd.formFieldId,
                    value: fd.value,
                  }),
                )
              : undefined,
        },
      },
      include: {
        layanan: { select: { id: true, nama: true } },
        data: { include: { formField: true } },
      },
    });

    return NextResponse.json(permohonan, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
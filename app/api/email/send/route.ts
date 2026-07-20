import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const sendEmailSchema = z.object({
  to: z.string().email("Email tujuan tidak valid"),
  subject: z.string().min(1, "Subject wajib diisi"),
  text: z.string().optional(),
  html: z.string().optional(),
  from: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validasi gagal",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 422 },
      );
    }

    const { to, subject, text, html, from } = parsed.data;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text: text || "",
      html: html || "",
    });

    return NextResponse.json({
      message: "Email berhasil dikirim",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengirim email" },
      { status: 500 },
    );
  }
}
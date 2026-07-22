import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "@/lib/dal";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tipe file yang diizinkan — image dan PDF
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const PDF_TYPE = "application/pdf";
const ALLOWED_TYPES = [...IMAGE_TYPES, PDF_TYPE];

// Batas ukuran: 5 MB untuk image, 10 MB untuk PDF
const MAX_SIZE_IMAGE = 5 * 1024 * 1024;
const MAX_SIZE_PDF = 10 * 1024 * 1024;

// POST /api/upload
// Uploads an image or PDF file to Cloudinary. Requires authentication.
// Body: multipart/form-data — fields: file (image/PDF), folder (optional, default: "portal-berita")
// Image types: JPG, PNG, GIF, WebP — Max 5 MB
// PDF type: PDF — Max 10 MB
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (!authResult.ok) return authResult.response;

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string | null) ?? "portal-berita";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File tidak ditemukan atau tidak valid" },
        { status: 400 },
      );
    }

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Format file tidak didukung. Gunakan JPG, PNG, GIF, WebP (gambar) atau PDF (dokumen).",
        },
        { status: 400 },
      );
    }

    // Validasi ukuran — bedakan antara image dan PDF
    const isPdf = file.type === PDF_TYPE;
    const maxSize = isPdf ? MAX_SIZE_PDF : MAX_SIZE_IMAGE;

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `Ukuran file melebihi batas ${maxSizeMB} MB.` },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF upload via base64 langsung (Cloudinary raw)
    // Image upload via data URI
    let uploadResult;

    if (isPdf) {
      uploadResult = await cloudinary.uploader.upload(
        `data:${file.type};base64,${buffer.toString("base64")}`,
        {
          folder,
          resource_type: "raw",
          use_filename: true,
          unique_filename: true,
        },
      );
    } else {
      const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
      uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "image",
      });
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: isPdf ? "raw" : "image",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file. Coba lagi." },
      { status: 500 },
    );
  }
}

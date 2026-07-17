"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Store,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Constants ──────────────────────────────────────────────────────────────────

const KATEGORI_OPTIONS = [
  "Kuliner",
  "Kerajinan",
  "Pertanian",
  "Peternakan",
  "Perikanan",
  "Jasa",
  "Fashion",
  "Lainnya",
];

interface FormErrors {
  namaProduk?: string;
  deskripsi?: string;
  kategori?: string;
  kontak?: string;
  pemilik?: string;
  gambar?: string;
}

// ── Upload Progress Bar ────────────────────────────────────────────────────────

function UploadProgress({
  progress,
  status,
}: {
  progress: number;
  status: "idle" | "uploading" | "done" | "error";
}) {
  if (status === "idle") return null;

  const statusConfig = {
    uploading: {
      color: "bg-secondary",
      textColor: "text-secondary",
      label: `Mengupload... ${progress}%`,
    },
    done: {
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      label: "Upload selesai",
    },
    error: {
      color: "bg-destructive",
      textColor: "text-destructive",
      label: "Upload gagal",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.label}
        </span>
        {status === "done" && (
          <CheckCircle2 className="size-3.5 text-emerald-500" />
        )}
        {status === "error" && (
          <AlertTriangle className="size-3.5 text-destructive" />
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-fog dark:bg-[#2e2e2e] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${config.color}`}
          style={{ width: `${status === "done" ? 100 : progress}%` }}
        />
      </div>
    </div>
  );
}

// ── Image Preview ──────────────────────────────────────────────────────────────

function ImagePreview({
  src,
  onRemove,
}: {
  src: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative inline-block animate-in zoom-in-95 fade-in duration-300">
      <img
        src={src}
        alt="Preview"
        className="h-32 w-32 rounded-xl object-cover border-2 border-sage dark:border-[#414943]"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-md hover:bg-destructive/90 transition-colors"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

// ── Page Skeleton ──────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function EditUMKMPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form State ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    namaProduk: "",
    deskripsi: "",
    harga: "",
    kategori: "",
    kontak: "",
    pemilik: "",
  });

  // ── Fetch Existing Data ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/umkm/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            toast.error("UMKM tidak ditemukan");
            router.push("/dashboard/umkm");
            return;
          }
          throw new Error("Gagal memuat data");
        }
        const data = await res.json();
        setForm({
          namaProduk: data.namaProduk || "",
          deskripsi: data.deskripsi || "",
          harga: data.harga || "",
          kategori: data.kategori || "",
          kontak: data.kontak || "",
          pemilik: data.pemilik || "",
        });
        if (data.gambar) {
          setExistingImage(data.gambar);
          setImagePreview(data.gambar);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data UMKM");
        router.push("/dashboard/umkm");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  // ── Handle Input Change ───────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Handle File Upload ────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        gambar: "Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.",
      }));
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        gambar: "Ukuran file maksimal 5 MB.",
      }));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrors((prev) => ({ ...prev, gambar: undefined }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "umkm-padangloang");

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) =>
          Math.min(prev + Math.random() * 30, 90),
        );
      }, 300);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) throw new Error("Upload gagal");

      const data = await res.json();
      setUploadProgress(100);
      setUploadStatus("done");
      setUploadedImageUrl(data.url || data.secure_url);
      setExistingImage(null);

      toast.success("Gambar berhasil diupload", {
        description: "Gambar baru produk UMKM telah diganti.",
      });
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      setImagePreview(existingImage);
      setErrors((prev) => ({
        ...prev,
        gambar: "Gagal mengupload gambar. Coba lagi.",
      }));
      toast.error("Upload gagal", {
        description:
          "Terjadi kesalahan saat mengupload gambar. Silakan coba lagi.",
      });
    }
  };

  // ── Remove Image ──────────────────────────────────────────────────────────
  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImageUrl("__REMOVE__");
    setExistingImage(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Handle Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    // Build payload
    const gambarUrl =
      uploadedImageUrl === "__REMOVE__"
        ? null
        : uploadedImageUrl || existingImage || null;

    const payload = {
      namaProduk: form.namaProduk,
      deskripsi: form.deskripsi,
      harga: form.harga || null,
      kategori: form.kategori,
      kontak: form.kontak,
      gambar: gambarUrl,
      pemilik: form.pemilik,
    };

    try {
      const res = await fetch(`/api/umkm/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.details) {
          const fieldErrors: FormErrors = {};
          for (const [key, messages] of Object.entries(data.details)) {
            fieldErrors[key as keyof FormErrors] = (
              messages as string[]
            )[0];
          }
          setErrors(fieldErrors);
          toast.error("Validasi gagal", {
            description: "Periksa kembali form yang diisi.",
          });
          return;
        }
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast.success("UMKM berhasil diperbarui", {
        description: `"${data.namaProduk}" telah diperbarui.`,
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });

      router.push("/dashboard/umkm");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui UMKM", {
        description:
          "Terjadi kesalahan server. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading State ─────────────────────────────────────────────────────────

  if (loading) return <PageSkeleton />;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="shrink-0"
        >
          <Link href="/dashboard/umkm">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Pencil className="size-5 text-secondary" />
            Edit UMKM
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Perbarui data produk "{form.namaProduk}"
          </p>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Informasi Produk ──────────────────────────────────────────────── */}
        <Card className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Store className="size-4 text-secondary" />
              Informasi Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nama Produk */}
            <div className="space-y-2">
              <Label htmlFor="namaProduk">
                Nama Produk <span className="text-destructive">*</span>
              </Label>
              <Input
                id="namaProduk"
                name="namaProduk"
                placeholder="Contoh: Keripik Pisang Coklat"
                value={form.namaProduk}
                onChange={handleChange}
                className={`border-sage dark:border-[#414943] ${
                  errors.namaProduk ? "border-destructive" : ""
                }`}
              />
              {errors.namaProduk && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.namaProduk}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">
                Deskripsi <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                placeholder="Deskripsikan produk UMKM secara detail..."
                rows={4}
                value={form.deskripsi}
                onChange={handleChange}
                className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none border-sage dark:border-[#414943] ${
                  errors.deskripsi ? "border-destructive" : ""
                }`}
              />
              {errors.deskripsi && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.deskripsi}
                </p>
              )}
            </div>

            {/* Kategori + Harga — side by side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="kategori">
                  Kategori <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.kategori}
                  onValueChange={(v) => {
                    setForm((prev) => ({ ...prev, kategori: v }));
                    if (errors.kategori)
                      setErrors((prev) => ({
                        ...prev,
                        kategori: undefined,
                      }));
                  }}
                >
                  <SelectTrigger
                    className={`border-sage dark:border-[#414943] ${
                      errors.kategori ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {KATEGORI_OPTIONS.map((kat) => (
                      <SelectItem key={kat} value={kat}>
                        {kat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kategori && (
                  <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.kategori}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="harga">Harga</Label>
                <Input
                  id="harga"
                  name="harga"
                  placeholder="Contoh: 15000"
                  value={form.harga}
                  onChange={handleChange}
                  className="border-sage dark:border-[#414943]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Kontak & Pemilik ──────────────────────────────────────────────── */}
        <Card className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">
              Kontak & Pemilik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pemilik">
                Nama Pemilik <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pemilik"
                name="pemilik"
                placeholder="Nama pemilik UMKM"
                value={form.pemilik}
                onChange={handleChange}
                className={`border-sage dark:border-[#414943] ${
                  errors.pemilik ? "border-destructive" : ""
                }`}
              />
              {errors.pemilik && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.pemilik}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kontak">
                Kontak (WhatsApp/Telepon){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="kontak"
                name="kontak"
                placeholder="Contoh: 081234567890"
                value={form.kontak}
                onChange={handleChange}
                className={`border-sage dark:border-[#414943] ${
                  errors.kontak ? "border-destructive" : ""
                }`}
              />
              {errors.kontak && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.kontak}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Upload Gambar ─────────────────────────────────────────────────── */}
        <Card className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ImageIcon className="size-4 text-secondary" />
              Gambar Produk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <ImagePreview
                src={imagePreview}
                onRemove={handleRemoveImage}
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sage dark:border-[#414943] px-6 py-10 transition-all duration-200 hover:border-secondary/50 hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50 group"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="size-6 text-steel dark:text-[#8c9489] group-hover:text-secondary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Klik untuk upload gambar
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF, atau WebP — Maks 5 MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <UploadProgress
              progress={uploadProgress}
              status={uploadStatus}
            />

            {errors.gambar && (
              <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.gambar}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Actions ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-t border-sage dark:border-[#414943] pt-6">
          <Button
            type="submit"
            disabled={submitting}
            className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {submitting ? "Menyimpan..." : "Perbarui UMKM"}
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-sage dark:border-[#414943]"
            disabled={submitting}
          >
            <Link href="/dashboard/umkm">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
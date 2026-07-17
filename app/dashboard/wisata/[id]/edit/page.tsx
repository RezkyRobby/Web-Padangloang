"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { updateWisataSchema } from "@/lib/schemas/wisata";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ImageIcon,
  Loader2,
  MapPin,
  Mountain,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type FormData = z.infer<typeof updateWisataSchema>;
type FormErrors = Record<string, string[]>;

interface WisataItem {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  kategori: "WISATA_ALAM" | "KULINER" | "BUDAYA";
  gambar: string | null;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Loading Skeleton                                                           */
/* -------------------------------------------------------------------------- */

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page Component                                                             */
/* -------------------------------------------------------------------------- */

export default function EditWisataPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalItem, setOriginalItem] = useState<WisataItem | null>(null);

  const [form, setForm] = useState<FormData>({
    nama: "",
    deskripsi: "",
    lokasi: "",
    kategori: "WISATA_ALAM",
    gambar: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  /* ----- Fetch existing data -------------------------------------------- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wisata/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Wisata tidak ditemukan");
          router.push("/dashboard/wisata");
          return;
        }
        throw new Error("Gagal memuat data");
      }
      const data: WisataItem = await res.json();
      setOriginalItem(data);
      setForm({
        nama: data.nama,
        deskripsi: data.deskripsi,
        lokasi: data.lokasi,
        kategori: data.kategori,
        gambar: data.gambar || "",
      });
      if (data.gambar) setImagePreview(data.gambar);
    } catch {
      toast.error("Gagal memuat data wisata");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ----- Handlers -------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: [] }));
  };

  const handleSelectChange = (value: string) => {
    setForm((prev) => ({ ...prev, kategori: value as FormData["kategori"] }));
  };

  /* ----- Image Upload ---------------------------------------------------- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      toast.error("Format gambar harus JPG, PNG, WebP, atau AVIF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 10 MB");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 75));
      }, 200);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Upload gagal");
      }

      const data = await res.json();
      setUploadProgress(100);
      setForm((prev) => ({ ...prev, gambar: data.url }));
      toast.success("Gambar berhasil diupload");
    } catch (err) {
      // Revert to previous image
      setImagePreview(originalItem?.gambar || null);
      setForm((prev) => ({ ...prev, gambar: originalItem?.gambar || "" }));
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadProgress(0);
    setForm((prev) => ({ ...prev, gambar: "" }));
  };

  /* ----- Submit ---------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Only send changed fields
    const changed: Record<string, unknown> = {};
    if (form.nama !== originalItem?.nama) changed.nama = form.nama;
    if (form.deskripsi !== originalItem?.deskripsi)
      changed.deskripsi = form.deskripsi;
    if (form.lokasi !== originalItem?.lokasi) changed.lokasi = form.lokasi;
    if (form.kategori !== originalItem?.kategori)
      changed.kategori = form.kategori;
    if (form.gambar !== (originalItem?.gambar || ""))
      changed.gambar = form.gambar || null;

    const parsed = updateWisataSchema.safeParse(changed);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      const flat = z.flattenError(parsed.error);
      for (const [key, msgs] of Object.entries(flat.fieldErrors)) {
        fieldErrors[key] = msgs;
      }
      setErrors(fieldErrors);
      toast.error("Mohon periksa kembali form yang diisi");
      return;
    }

    if (Object.keys(parsed.data).length === 0) {
      toast.info("Tidak ada perubahan yang disimpan");
      router.push("/dashboard/wisata");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/wisata/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 422 && errData.details) {
          setErrors(errData.details);
          throw new Error("Validasi server gagal");
        }
        throw new Error(errData.error || "Gagal menyimpan");
      }
      toast.success("Wisata berhasil diperbarui");
      router.push("/dashboard/wisata");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="animate-in fade-in-50 duration-300">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Edit Wisata</h1>
          <p className="text-sm text-muted-foreground">Memuat data…</p>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 fade-in-50 duration-500">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 gap-1"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        Kembali
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Wisata</h1>
        <p className="text-sm text-muted-foreground">
          Edit data wisata "{originalItem?.nama}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Informasi Wisata --- */}
        <Card className="animate-in slide-in-from-bottom-2 fade-in-50 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <Mountain className="size-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Informasi Wisata</h2>
                <p className="text-xs text-muted-foreground">
                  Edit nama, lokasi, kategori, dan deskripsi wisata
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama Wisata</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Contoh: Air Terjun Bantimurung"
                value={form.nama ?? ""}
                onChange={handleChange}
              />
              {errors.nama && (
                <p className="mt-1 text-xs text-destructive animate-in slide-in-from-top-1 fade-in duration-200">
                  {errors.nama[0]}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="kategori">Kategori</Label>
                <Select
                  value={form.kategori ?? "WISATA_ALAM"}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="kategori">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WISATA_ALAM">Wisata Alam</SelectItem>
                    <SelectItem value="KULINER">Kuliner</SelectItem>
                    <SelectItem value="BUDAYA">Budaya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lokasi">Lokasi</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="lokasi"
                    name="lokasi"
                    placeholder="Contoh: Dusun Pattiro"
                    value={form.lokasi ?? ""}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
                {errors.lokasi && (
                  <p className="mt-1 text-xs text-destructive animate-in slide-in-from-top-1 fade-in duration-200">
                    {errors.lokasi[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={5}
                placeholder="Deskripsikan wisata ini secara lengkap…"
                value={form.deskripsi ?? ""}
                onChange={handleChange}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Minimal 10 karakter
              </p>
              {errors.deskripsi && (
                <p className="mt-1 text-xs text-destructive animate-in slide-in-from-top-1 fade-in duration-200">
                  {errors.deskripsi[0]}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- Upload Gambar --- */}
        <Card
          className="animate-in slide-in-from-bottom-2 fade-in-50 duration-300"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <ImageIcon className="size-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Gambar Wisata</h2>
                <p className="text-xs text-muted-foreground">
                  Upload gambar baru atau hapus gambar yang ada
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={600}
                  height={340}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                    title="Hapus gambar"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <label
                    htmlFor="file-upload-edit"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                    title="Ganti gambar"
                  >
                    <Upload className="size-4" />
                  </label>
                </div>
                {uploading && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="file-upload-edit"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition hover:border-primary hover:bg-primary/5 ${
                  uploading
                    ? "pointer-events-none opacity-50"
                    : "border-muted-foreground/25"
                }`}
              >
                {uploading ? (
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-3 size-8 animate-spin text-muted-foreground" />
                    <p className="text-sm font-medium">Mengupload…</p>
                    <div className="mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {uploadProgress}%
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-3 size-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Klik untuk upload gambar
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Format JPG, PNG, WebP, atau AVIF (maks 10 MB)
                    </p>
                  </>
                )}
              </label>
            )}
            <input
              ref={fileInputRef}
              id="file-upload-edit"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </CardContent>
        </Card>

        {/* --- Actions --- */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Batal
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {submitting ? "Menyimpan…" : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
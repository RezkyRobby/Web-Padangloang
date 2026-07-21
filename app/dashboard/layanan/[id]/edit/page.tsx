"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Icon Options ───────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  { value: "FileText", label: "Dokumen" },
  { value: "FileCheck", label: "Verifikasi" },
  { value: "ScrollText", label: "Surat" },
  { value: "Home", label: "Rumah" },
  { value: "Users", label: "Penduduk" },
  { value: "Landmark", label: "Pemerintahan" },
  { value: "Shield", label: "Keamanan" },
  { value: "UserCheck", label: "Verifikasi Warga" },
  { value: "MapPin", label: "Lokasi" },
  { value: "Briefcase", label: "Bisnis" },
  { value: "Heart", label: "Kesehatan" },
  { value: "Building2", label: "Bangunan" },
  { value: "GraduationCap", label: "Pendidikan" },
  { value: "Stethoscope", label: "Medis" },
  { value: "Leaf", label: "Pertanian" },
  { value: "Globe", label: "Global" },
  { value: "Mail", label: "Surat" },
  { value: "Phone", label: "Telepon" },
];

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

// ── Loading Skeleton ──────────────────────────────────────────────────────────

function FormSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-9 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function EditLayananPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Upload state for template file
  const [templateFileName, setTemplateFileName] = useState<string | null>(null);
  const [uploadedTemplateUrl, setUploadedTemplateUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "done" | "error"
  >("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form State ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    icon: "",
    isActive: true,
    hanyaOffline: false,
  });

  const [persyaratan, setPersyaratan] = useState<string[]>([""]);

  // ── Fetch Data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const res = await fetch(`/api/layanan/${id}`);
        if (!res.ok) throw new Error("Gagal memuat data");

        const data = await res.json();

        setForm({
          nama: data.nama || "",
          deskripsi: data.deskripsi || "",
          icon: data.icon || "",
          isActive: data.isActive ?? true,
          hanyaOffline: data.hanyaOffline ?? false,
        });

        setPersyaratan(
          Array.isArray(data.persyaratan) && data.persyaratan.length > 0
            ? data.persyaratan
            : [""],
        );

        if (data.templateFile) {
          setTemplateFileName("Template terpasang");
          setUploadedTemplateUrl(data.templateFile);
          setUploadStatus("done");
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data", {
          description: "Tidak dapat memuat data layanan.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLayanan();
  }, [id]);

  // ── Handle Input Change ───────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Handle Persyaratan ─────────────────────────────────────────────────────
  const handlePersyaratanChange = (index: number, value: string) => {
    const updated = [...persyaratan];
    updated[index] = value;
    setPersyaratan(updated);
  };

  const addPersyaratan = () => {
    setPersyaratan((prev) => [...prev, ""]);
  };

  const removePersyaratan = (index: number) => {
    if (persyaratan.length <= 1) return;
    setPersyaratan((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Handle File Upload ────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type — only PDF
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        templateFile: "Format file tidak didukung. Gunakan PDF.",
      }));
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        templateFile: "Ukuran file maksimal 10 MB.",
      }));
      return;
    }

    setTemplateFileName(file.name);

    // Upload to Cloudinary
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrors((prev) => ({ ...prev, templateFile: undefined }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "layanan-padangloang");

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
      setUploadedTemplateUrl(data.url || data.secure_url);

      toast.success("Template berhasil diupload", {
        description: "File template layanan siap digunakan.",
      });
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
      setTemplateFileName(null);
      setErrors((prev) => ({
        ...prev,
        templateFile: "Gagal mengupload file. Coba lagi.",
      }));
      toast.error("Upload gagal", {
        description:
          "Terjadi kesalahan saat mengupload file. Silakan coba lagi.",
      });
    }
  };

  // ── Remove File ──────────────────────────────────────────────────────────
  const handleRemoveFile = () => {
    setTemplateFileName(null);
    setUploadedTemplateUrl("");
    setUploadStatus("idle");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    if (!form.nama.trim()) newErrors.nama = "Nama layanan wajib diisi";
    if (!form.icon) newErrors.icon = "Pilih icon untuk layanan";

    const filtered = persyaratan.filter((p) => p.trim() !== "");
    if (filtered.length === 0) {
      newErrors.persyaratan = "Minimal satu persyaratan harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handle Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const filteredPersyaratan = persyaratan.filter((p) => p.trim() !== "");

    const payload = {
      nama: form.nama.trim(),
      deskripsi: form.deskripsi.trim() || null,
      icon: form.icon || null,
      isActive: form.isActive,
      hanyaOffline: form.hanyaOffline,
      persyaratan: filteredPersyaratan,
      templateFile: uploadedTemplateUrl || null,
    };

    try {
      const res = await fetch(`/api/layanan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.details) {
          const fieldErrors: Record<string, string | undefined> = {};
          for (const [key, messages] of Object.entries(data.details)) {
            fieldErrors[key] = (messages as string[])[0];
          }
          setErrors(fieldErrors);
          toast.error("Validasi gagal", {
            description: "Periksa kembali form yang diisi.",
          });
          return;
        }
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast.success("Layanan berhasil diperbarui", {
        description: `"${data.nama}" telah diupdate.`,
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });

      router.push("/dashboard/layanan");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui layanan", {
        description: "Terjadi kesalahan server. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render: Loading ────────────────────────────────────────────────────────

  if (loading) return <FormSkeleton />;

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
          <Link href="/dashboard/layanan">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Edit Layanan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Perbarui informasi layanan desa Padangloang.
          </p>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Informasi Layanan ──────────────────────────────────────────────── */}
        <Card className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Pencil className="size-4 text-secondary" />
              Informasi Layanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nama Layanan */}
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Layanan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Contoh: Surat Keterangan Domisili"
                value={form.nama}
                onChange={handleChange}
                className={`border-sage dark:border-[#414943] ${
                  errors.nama ? "border-destructive" : ""
                }`}
              />
              {errors.nama && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.nama}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                placeholder="Deskripsikan layanan ini secara detail..."
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

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">
                Icon <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.icon}
                onValueChange={(v) => {
                  setForm((prev) => ({ ...prev, icon: v }));
                  if (errors.icon)
                    setErrors((prev) => ({
                      ...prev,
                      icon: undefined,
                    }));
                }}
              >
                <SelectTrigger
                  className={`border-sage dark:border-[#414943] ${
                    errors.icon ? "border-destructive" : ""
                  }`}
                >
                  <SelectValue placeholder="Pilih icon layanan" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.icon && (
                <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                  {errors.icon}
                </p>
              )}
            </div>

            {/* Toggles */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-sage dark:border-[#414943] p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Status Aktif</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Layanan dapat diakses oleh pengguna
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    form.isActive
                      ? "bg-emerald-500"
                      : "bg-ash dark:bg-[#414943]"
                  }`}
                >
                  <span
                    className={`inline-block size-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      form.isActive ? "translate-x-[22px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-sage dark:border-[#414943] p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Hanya Offline</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pengguna hanya bisa datang langsung
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      hanyaOffline: !prev.hanyaOffline,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    form.hanyaOffline
                      ? "bg-amber-500"
                      : "bg-ash dark:bg-[#414943]"
                  }`}
                >
                  <span
                    className={`inline-block size-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                      form.hanyaOffline ? "translate-x-[22px]" : "translate-x-[2px]"
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Persyaratan ────────────────────────────────────────────────────── */}
        <Card className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="size-4 text-secondary" />
              Persyaratan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Daftar persyaratan yang perlu disiapkan pengguna untuk layanan ini.
            </p>
            {persyaratan.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Persyaratan ${index + 1}`}
                  value={item}
                  onChange={(e) =>
                    handlePersyaratanChange(index, e.target.value)
                  }
                  className="flex-1 border-sage dark:border-[#414943]"
                />
                {persyaratan.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removePersyaratan(index)}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPersyaratan}
              className="gap-1.5 border-sage dark:border-[#414943]"
            >
              <Plus className="size-3.5" />
              Tambah Persyaratan
            </Button>
            {errors.persyaratan && (
              <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.persyaratan}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Upload Template File ──────────────────────────────────────────── */}
        <Card className="border-sage dark:border-[#414943]">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Upload className="size-4 text-secondary" />
              Template File (PDF)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Upload file template PDF yang bisa diunduh oleh pengguna sebagai referensi
              (contoh: formulir surat keterangan, contoh pengisian, dll.)
            </p>
            {templateFileName ? (
              <div className="relative inline-block animate-in zoom-in-95 fade-in duration-300">
                <div className="flex items-center gap-3 rounded-xl border-2 border-sage dark:border-[#414943] p-4 pr-12">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fog dark:bg-[#2e2e2e]">
                    <FileText className="size-5 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {templateFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {uploadStatus === "done" ? "Upload berhasil" : "PDF"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow-md hover:bg-destructive/90 transition-colors"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sage dark:border-[#414943] px-6 py-10 transition-all duration-200 hover:border-secondary/50 hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50 group"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="size-6 text-steel dark:text-[#8c9489] group-hover:text-secondary transition-colors" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Klik untuk upload file
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF — Maks 10 MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <UploadProgress
              progress={uploadProgress}
              status={uploadStatus}
            />

            {errors.templateFile && (
              <p className="text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.templateFile}
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
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            asChild
            className="border-sage dark:border-[#414943]"
            disabled={submitting}
          >
            <Link href="/dashboard/layanan">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
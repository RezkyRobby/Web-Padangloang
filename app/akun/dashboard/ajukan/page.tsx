"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  AlertCircle,
  Building2,
  Download,
  Eye,
  X,
  CheckSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/custom/navbar";
import { cn } from "@/lib/utils";

// --- Types ---
interface PersyaratanItem {
  id: string;
  nama: string;
  contohGambar: string | null;
  templateFile: string | null;
  urutan: number;
}

interface Layanan {
  id: string;
  nama: string;
  deskripsi: string | null;
  icon: string | null;
  hanyaOffline: boolean;
  persyaratanList: PersyaratanItem[];
  formFields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  fieldType:
    | "TEXT"
    | "NUMBER"
    | "TEXTAREA"
    | "DATE"
    | "FILE_UPLOAD"
    | "SELECT"
    | "RADIO"
    | "CHECKBOX";
  required: boolean;
  placeholder: string | null;
  options: string[] | null;
  urutan: number;
}

type Step = "pilih" | "persyaratan" | "online";

type CheckedState = boolean | "indeterminate";

// --- Icon helper ---
function LayananIcon({ icon }: { icon: string | null }) {
  if (icon) {
    return <span className="text-xl">{icon}</span>;
  }
  return <FileText className="size-5" />;
}

export default function AjukanPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>("pilih");
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Data
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Online form
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewNama, setPreviewNama] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    fetchLayanan();
  }, [session, isPending, router]);

  async function fetchLayanan() {
    try {
      const res = await fetch("/api/layanan?all=false");
      if (!res.ok) throw new Error("Gagal memuat layanan");
      const data: Layanan[] = await res.json();
      setLayananList(data);
    } catch {
      toast.error("Gagal memuat daftar layanan");
    } finally {
      setLoadingLayanan(false);
    }
  }

  function handlePilih(id: string) {
    const lay = layananList.find((l) => l.id === id);
    if (!lay) return;
    setSelectedLayanan(lay);
    setConfirmed(false);
    setStep("persyaratan");
  }

  async function handleOfflineSubmit() {
    if (!selectedLayanan || !session?.user) return;
    if (!confirmed) {
      toast.error("Pastikan Anda sudah mencentang konfirmasi persyaratan");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/permohonan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layananId: selectedLayanan.id,
          jenisAjuan: "OFFLINE",
          userId: session.user.id,
          formData: [],
        }),
      });
      if (!res.ok) throw new Error("Gagal membuat pengajuan");
      const data = await res.json();
      toast.success("Tiket berhasil dibuat! Silakan datang ke kantor desa.");
      router.push(`/akun/dashboard/permohonan/${data.id}`);
    } catch {
      toast.error("Gagal membuat pengajuan offline");
      setSubmitting(false);
    }
  }

  async function handleOnlineSubmit() {
    if (!selectedLayanan || !session?.user) return;
    // Validasi required
    const missing: string[] = [];
    for (const f of selectedLayanan.formFields) {
      const val = formValues[f.id];
      if (f.required && (!val || val.trim() === "")) {
        missing.push(f.label);
      }
    }
    if (missing.length > 0) {
      toast.error(`Field wajib belum diisi: ${missing.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      const formData = selectedLayanan.formFields
        .filter((f) => formValues[f.id] && formValues[f.id].trim() !== "")
        .map((f) => ({ formFieldId: f.id, value: formValues[f.id] }));

      const res = await fetch("/api/permohonan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layananId: selectedLayanan.id,
          jenisAjuan: "ONLINE",
          userId: session.user.id,
          formData,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengirim pengajuan");
      const data = await res.json();
      toast.success("Pengajuan online berhasil dikirim!");
      router.push(`/akun/dashboard/permohonan/${data.id}`);
    } catch {
      toast.error("Gagal mengirim pengajuan online");
      setSubmitting(false);
    }
  }

  async function handleFileUpload(fieldId: string, file: File) {
    setUploadingId(fieldId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload gagal");
      const data = await res.json();
      setFormValues((prev) => ({ ...prev, [fieldId]: data.url }));
      toast.success("File berhasil diunggah");
    } catch {
      toast.error("Gagal mengunggah file");
    } finally {
      setUploadingId(null);
    }
  }

  // ── Preview + Download ──────────────────────────────────────────────────

  function openPreview(url: string, nama: string) {
    setPreviewUrl(url);
    setPreviewNama(nama);
    setPreviewOpen(true);
  }

  async function handleDownload() {
    if (!previewUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      // Paksa nama file berakhiran .pdf agar browser mengenali sebagai PDF
      const cleanName = previewNama.replace(/[^a-zA-Z0-9-_]/g, "_");
      a.download = `${cleanName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Gagal mendownload berkas");
    } finally {
      setDownloading(false);
    }
  }

  // --- Loading / Auth guard ---
  if (isPending || loadingLayanan) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-foreground/40" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-24 md:px-8">
        {/* Header + Steps */}
        <div className="mb-8">
          <Link
            href="/akun/dashboard"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Ajukan Layanan</h1>
          <p className="mt-1 text-sm text-foreground/50">
            Pilih layanan, siapkan berkas, dan ajukan permohonan Anda.
          </p>

          {/* Step indicator */}
          <div className="mt-6 flex items-center gap-2">
            <StepBadge
              num={1}
              label="Pilih Layanan"
              active={step === "pilih"}
              done={step !== "pilih"}
            />
            <div className="h-px flex-1 bg-border" />
            <StepBadge
              num={2}
              label="Persyaratan"
              active={step === "persyaratan"}
              done={step === "online"}
            />
            <div className="h-px flex-1 bg-border" />
            <StepBadge
              num={3}
              label="Isi Form"
              active={step === "online"}
              done={false}
            />
          </div>
        </div>

        {/* STEP 1: Pilih Layanan */}
        {step === "pilih" && (
          <div>
            {layananList.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <FileText className="size-10 text-foreground/30" />
                  <p className="text-sm text-foreground/50">
                    Belum ada layanan yang tersedia.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {layananList.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handlePilih(l.id)}
                    className="group flex items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LayananIcon icon={l.icon} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {l.nama}
                        </h3>
                        {l.hanyaOffline && (
                          <Badge variant="secondary" className="text-[10px]">
                            Offline
                          </Badge>
                        )}
                      </div>
                      {l.deskripsi && (
                        <p className="mt-1 line-clamp-2 text-xs text-foreground/50">
                          {l.deskripsi}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="size-4 shrink-0 self-center text-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground/60" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Persyaratan + Konfirmasi */}
        {step === "persyaratan" && selectedLayanan && (
          <div className="space-y-4">
            <button
              onClick={() => {
                setStep("pilih");
                setSelectedLayanan(null);
              }}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Ganti Layanan
            </button>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LayananIcon icon={selectedLayanan.icon} />
                  </div>
                  <div>
                    <CardTitle>{selectedLayanan.nama}</CardTitle>
                    {selectedLayanan.deskripsi && (
                      <p className="mt-0.5 text-sm text-foreground/50">
                        {selectedLayanan.deskripsi}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Persyaratan Cards */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckSquare className="size-4 text-primary" />
                    Persyaratan & Berkas
                  </h4>
                  {selectedLayanan.persyaratanList &&
                  selectedLayanan.persyaratanList.length > 0 ? (
                    <div className="space-y-3">
                      {selectedLayanan.persyaratanList
                        .sort((a, b) => a.urutan - b.urutan)
                        .map((p) => (
                          <div
                            key={p.id}
                            className="rounded-lg border border-sage/50 dark:border-[#414943]/50 bg-card p-4 space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="size-4 shrink-0 text-green-600 dark:text-green-400" />
                              <span className="font-semibold text-sm text-foreground">
                                {p.nama}
                              </span>
                            </div>

                            {/* Contoh Gambar */}
                            {p.contohGambar && (
                              <div className="space-y-1.5">
                                <p className="text-xs text-foreground/50 flex items-center gap-1.5">
                                  <Eye className="size-3" />
                                  Contoh file yang disiapkan:
                                </p>
                                <button
                                  type="button"
                                  onClick={() => window.open(p.contohGambar!, "_blank")}
                                  className="group relative w-full aspect-video rounded-lg overflow-hidden border border-sage/30 dark:border-[#414943]/30"
                                >
                                  <Image
                                    src={p.contohGambar}
                                    alt={`Contoh ${p.nama}`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <Eye className="size-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                  </div>
                                </button>
                              </div>
                            )}

                            {/* Template File */}
                            {p.templateFile && (
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => openPreview(p.templateFile!, p.nama)}
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                                >
                                  <Eye className="size-3.5" />
                                  Lihat & Download Berkas
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/40">
                      Tidak ada persyaratan khusus.
                    </p>
                  )}
                </div>

                <Separator />

                {/* Checkbox konfirmasi */}
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-foreground/5">
                  <Checkbox
                    checked={confirmed}
                    onCheckedChange={(v: CheckedState) =>
                      setConfirmed(v === true)
                    }
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground/80">
                    Saya sudah menyiapkan <strong>semua berkas</strong> yang
                    diperlukan di atas dan memahami alur pengajuan layanan ini.
                  </span>
                </label>

                {/* Pilihan jenis ajuan */}
                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    disabled={!confirmed || submitting}
                    onClick={handleOfflineSubmit}
                    className="flex h-auto flex-col items-start gap-1 p-4 text-left"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <Building2 className="size-4" />
                      Datang ke Kantor (Offline)
                    </span>
                    <span className="text-xs font-normal text-foreground/50">
                      Buat tiket lalu bawa berkas ke kantor desa.
                    </span>
                  </Button>

                  <Button
                    variant="default"
                    disabled={
                      !confirmed || submitting || selectedLayanan.hanyaOffline
                    }
                    onClick={() => setStep("online")}
                    className="flex h-auto flex-col items-start gap-1 p-4 text-left"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <FileText className="size-4" />
                      Isi Mandiri (Online)
                    </span>
                    <span className="text-xs font-normal text-foreground/60">
                      {selectedLayanan.hanyaOffline
                        ? "Layanan ini hanya tersedia offline."
                        : "Isi formulir langsung dari sini."}
                    </span>
                  </Button>
                </div>

                {!confirmed && (
                  <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="size-3.5" />
                    Centang konfirmasi persyaratan untuk melanjutkan.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: Online form */}
        {step === "online" && selectedLayanan && (
          <div className="space-y-4">
            <button
              onClick={() => setStep("persyaratan")}
              className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Persyaratan
            </button>

            <Card>
              <CardHeader>
                <CardTitle>Isi Formulir — {selectedLayanan.nama}</CardTitle>
                <p className="text-sm text-foreground/50">
                  Lengkapi data di bawah ini dengan benar.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {selectedLayanan.formFields.length === 0 ? (
                  <p className="text-sm text-foreground/50">
                    Tidak ada field form untuk diisi.
                  </p>
                ) : (
                  selectedLayanan.formFields
                    .sort((a, b) => a.urutan - b.urutan)
                    .map((field) => (
                      <FormFieldRenderer
                        key={field.id}
                        field={field}
                        value={formValues[field.id] ?? ""}
                        onChange={(v) =>
                          setFormValues((prev) => ({
                            ...prev,
                            [field.id]: v,
                          }))
                        }
                        uploading={uploadingId === field.id}
                        onFileUpload={(file) =>
                          handleFileUpload(field.id, file)
                        }
                      />
                    ))
                )}

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("persyaratan")}
                    disabled={submitting}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleOnlineSubmit} disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowRight className="size-4" />
                    )}
                    Kirim Pengajuan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Preview Modal ── */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                {previewNama}
              </DialogTitle>
              <DialogDescription>
                Preview file — klik Download untuk menyimpan berkas.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-center rounded-lg border bg-muted/50 min-h-[300px] max-h-[60vh] overflow-hidden">
              {previewUrl ? (
                <iframe
                  src={previewUrl + "#toolbar=1"}
                  className="w-full h-[60vh] rounded-lg"
                  title={`Preview ${previewNama}`}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 py-12 text-foreground/40">
                  <FileText className="size-12" />
                  <p className="text-sm">Tidak ada file untuk dipreview</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Tutup
              </Button>
              <Button onClick={handleDownload} disabled={downloading} className="gap-2">
                {downloading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                Download Berkas (.pdf)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// --- Step badge ---
function StepBadge({
  num,
  label,
  active,
  done,
}: {
  num: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
          done
            ? "bg-green-600 text-white"
            : active
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/10 text-foreground/50",
        )}
      >
        {done ? <CheckCircle2 className="size-4" /> : num}
      </div>
      <span
        className={cn(
          "hidden text-sm font-medium sm:inline",
          active || done ? "text-foreground" : "text-foreground/40",
        )}
      >
        {label}
      </span>
    </div>
  );
}

// --- Form field renderer ---
function FormFieldRenderer({
  field,
  value,
  onChange,
  uploading,
  onFileUpload,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
  uploading: boolean;
  onFileUpload: (file: File) => void;
}) {
  const fieldId = `field-${field.id}`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className="flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </Label>

      {(field.fieldType === "TEXT" || field.fieldType === "NUMBER") && (
        <Input
          id={fieldId}
          type={field.fieldType === "NUMBER" ? "number" : "text"}
          placeholder={field.placeholder ?? ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )}

      {field.fieldType === "TEXTAREA" && (
        <Textarea
          id={fieldId}
          placeholder={field.placeholder ?? ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
        />
      )}

      {field.fieldType === "DATE" && (
        <Input
          id={fieldId}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      )}

      {field.fieldType === "SELECT" && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={fieldId}>
            <SelectValue
              placeholder={field.placeholder ?? "Pilih salah satu"}
            />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.fieldType === "RADIO" && (
        <RadioGroup value={value} onValueChange={onChange}>
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              htmlFor={`${fieldId}-${opt}`}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <RadioGroupItem value={opt} id={`${fieldId}-${opt}`} />
              {opt}
            </label>
          ))}
        </RadioGroup>
      )}

      {field.fieldType === "CHECKBOX" && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={fieldId}
            checked={value === "true"}
            onCheckedChange={(v: CheckedState) =>
              onChange(v === true ? "true" : "")
            }
          />
          <label htmlFor={fieldId} className="text-sm text-foreground/70">
            {field.placeholder ?? "Ya"}
          </label>
        </div>
      )}

      {field.fieldType === "FILE_UPLOAD" && (
        <div className="space-y-2">
          <Input
            id={fieldId}
            type="file"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileUpload(file);
            }}
            className="cursor-pointer"
          />
          {uploading && (
            <p className="flex items-center gap-1.5 text-xs text-foreground/50">
              <Loader2 className="size-3.5 animate-spin" />
              Mengunggah...
            </p>
          )}
          {value && !uploading && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="size-3.5" />
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate underline"
              >
                File terunggah
              </a>
              <button
                type="button"
                onClick={() => onChange("")}
                className="ml-auto text-foreground/40 hover:text-foreground"
                aria-label="Hapus file"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X,
  FileText,
  ImageIcon,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// ── Types ──────────────────────────────────────────────────────────────────────

interface FormField {
  id: string;
  label: string;
  fieldType: string;
  required: boolean;
  placeholder: string | null;
  options: string[] | null;
  urutan: number;
  createdAt: string;
}

interface Persyaratan {
  id: string;
  nama: string;
  contohGambar: string | null;
  templateFile: string | null;
  urutan: number;
  createdAt: string;
}

interface Layanan {
  id: string;
  nama: string;
  formFields: FormField[];
  persyaratanList: Persyaratan[];
}

// ── Constants ──────────────────────────────────────────────────────────────────

const FIELD_TYPE_LABELS: Record<string, string> = {
  TEXT: "Teks",
  NUMBER: "Angka",
  TEXTAREA: "Textarea",
  DATE: "Tanggal",
  FILE_UPLOAD: "Upload File",
  SELECT: "Pilihan (Dropdown)",
  RADIO: "Pilihan (Radio)",
  CHECKBOX: "Centang",
};

const FIELD_TYPE_OPTIONS = [
  "TEXT",
  "NUMBER",
  "TEXTAREA",
  "DATE",
  "FILE_UPLOAD",
  "SELECT",
  "RADIO",
  "CHECKBOX",
] as const;

// ── Helper ─────────────────────────────────────────────────────────────────────

const getFieldTypeBadge = (type: string) => {
  const colors: Record<string, string> = {
    TEXT: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    NUMBER:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
    TEXTAREA:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    DATE: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
    FILE_UPLOAD:
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
    SELECT:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    RADIO: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
    CHECKBOX:
      "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
  };
  return colors[type] || "bg-fog text-obsidian dark:text-[#e1e3e0]";
};

// ── Skeleton ───────────────────────────────────────────────────────────────────

const FieldSkeleton = () => (
  <TableRow>
    <TableCell colSpan={8} className="p-0">
      <div className="flex items-center gap-4 px-4 py-3">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
);

const PersyaratanSkeleton = () => (
  <TableRow>
    <TableCell colSpan={5} className="p-0">
      <div className="flex items-center gap-4 px-4 py-3">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
);

// ── Empty States ──────────────────────────────────────────────────────────────

const EmptyFieldsState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex size-20 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-5">
      <Pencil className="size-8 text-steel dark:text-[#8c9489]" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">
      Belum ada field formulir
    </h3>
    <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
      Tambahkan field-field yang diperlukan untuk formulir layanan ini.
    </p>
    <Button onClick={onAdd} className="gap-2 animate-in zoom-in-95 duration-300">
      <Plus className="size-4" />
      Tambah Field Pertama
    </Button>
  </div>
);

const EmptyPersyaratanState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex size-20 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-5">
      <FileText className="size-8 text-steel dark:text-[#8c9489]" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">
      Belum ada persyaratan
    </h3>
    <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
      Tambahkan persyaratan yang harus dipenuhi untuk layanan ini.
    </p>
    <Button onClick={onAdd} className="gap-2 animate-in zoom-in-95 duration-300">
      <Plus className="size-4" />
      Tambah Persyaratan Pertama
    </Button>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function FormBuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const layananId = params.id;

  const [layanan, setLayanan] = useState<Layanan | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [persyaratanList, setPersyaratanList] = useState<Persyaratan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("fields");

  // Field Dialog
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<FormField | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formFieldType, setFormFieldType] = useState<string>("TEXT");
  const [formRequired, setFormRequired] = useState(false);
  const [formPlaceholder, setFormPlaceholder] = useState("");
  const [formUrutan, setFormUrutan] = useState(0);
  const [formOptions, setFormOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState("");

  // Persyaratan Dialog
  const [persyaratanDialogOpen, setPersyaratanDialogOpen] = useState(false);
  const [editPersyaratan, setEditPersyaratan] = useState<Persyaratan | null>(null);
  const [deletePersyaratanDialogOpen, setDeletePersyaratanDialogOpen] = useState(false);
  const [persyaratanToDelete, setPersyaratanToDelete] = useState<Persyaratan | null>(null);
  const [persyaratanNama, setPersyaratanNama] = useState("");
  const [persyaratanContohGambar, setPersyaratanContohGambar] = useState("");
  const [persyaratanTemplateFile, setPersyaratanTemplateFile] = useState("");
  const [persyaratanUrutan, setPersyaratanUrutan] = useState(0);
  const [uploadingGambar, setUploadingGambar] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ── Preview state ────────────────────────────────────────────────────────────
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewNama, setPreviewNama] = useState("");

  // ── Preview + Download ──────────────────────────────────────────────────────

  const openPreview = (url: string, nama: string) => {
    setPreviewUrl(url);
    setPreviewNama(nama);
    setPreviewOpen(true);
  };

  const handleDownload = useCallback(async () => {
    if (!previewUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
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
  }, [previewUrl, previewNama]);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/layanan/${layananId}`);
      if (!res.ok) {
        toast.error("Layanan tidak ditemukan");
        router.push("/dashboard/layanan");
        return;
      }
      const data: Layanan = await res.json();
      setLayanan(data);
      setFields(data.formFields || []);
      setPersyaratanList(data.persyaratanList || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [layananId, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Upload ─────────────────────────────────────────────────────────────────

  const uploadFile = async (file: File, type: "gambar" | "template") => {
    if (type === "gambar") setUploadingGambar(true);
    else setUploadingTemplate(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal upload");
      }
      const data = await res.json();
      return data.url as string;
    } catch (error) {
      console.error(error);
      toast.error(`Gagal upload ${type === "gambar" ? "gambar" : "file template"}`);
      return null;
    } finally {
      if (type === "gambar") setUploadingGambar(false);
      else setUploadingTemplate(false);
    }
  };

  // ── Field CRUD ──────────────────────────────────────────────────────────────

  const openAddFieldDialog = () => {
    setEditField(null);
    setFormLabel("");
    setFormFieldType("TEXT");
    setFormRequired(false);
    setFormPlaceholder("");
    setFormUrutan(fields.length);
    setFormOptions([]);
    setOptionInput("");
    setFieldDialogOpen(true);
  };

  const openEditFieldDialog = (field: FormField) => {
    setEditField(field);
    setFormLabel(field.label);
    setFormFieldType(field.fieldType);
    setFormRequired(field.required);
    setFormPlaceholder(field.placeholder || "");
    setFormUrutan(field.urutan);
    setFormOptions(field.options || []);
    setOptionInput("");
    setFieldDialogOpen(true);
  };

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (!trimmed) return;
    if (formOptions.includes(trimmed)) {
      toast.error("Opsi sudah ada");
      return;
    }
    setFormOptions((prev) => [...prev, trimmed]);
    setOptionInput("");
  };

  const removeOption = (index: number) => {
    setFormOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldSubmit = async () => {
    if (!formLabel || formLabel.length < 2) {
      toast.error("Label minimal 2 karakter");
      return;
    }
    const needsOptions = ["SELECT", "RADIO", "CHECKBOX"].includes(formFieldType);
    if (needsOptions && formOptions.length === 0) {
      toast.error("Tipe ini memerlukan minimal satu opsi");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        label: formLabel,
        fieldType: formFieldType,
        required: formRequired,
        placeholder: formPlaceholder || undefined,
        urutan: formUrutan,
      };
      if (needsOptions) body.options = formOptions;

      let res: Response;
      if (editField) {
        res = await fetch(`/api/layanan/${layananId}/form-fields/${editField.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/layanan/${layananId}/form-fields`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan");
      }
      toast.success(
        editField ? "Field berhasil diperbarui" : "Field berhasil ditambahkan",
        { icon: <CheckCircle2 className="size-4 text-green-500" /> },
      );
      setFieldDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan field", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        icon: <AlertTriangle className="size-4" />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldDelete = async () => {
    if (!fieldToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/layanan/${layananId}/form-fields/${fieldToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Field berhasil dihapus", {
        description: `"${fieldToDelete.label}" telah dihapus.`,
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });
      setDeleteDialogOpen(false);
      setFieldToDelete(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus field", { icon: <AlertTriangle className="size-4" /> });
    } finally {
      setDeleting(false);
    }
  };

  const moveField = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    const current = fields[index];
    const target = fields[newIndex];
    try {
      await Promise.all([
        fetch(`/api/layanan/${layananId}/form-fields/${current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urutan: target.urutan }),
        }),
        fetch(`/api/layanan/${layananId}/form-fields/${target.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urutan: current.urutan }),
        }),
      ]);
      const updated = [...fields];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      updated.forEach((f, i) => (f.urutan = i));
      setFields(updated);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah urutan");
      fetchData();
    }
  };

  // ── Persyaratan CRUD ────────────────────────────────────────────────────────

  const openAddPersyaratanDialog = () => {
    setEditPersyaratan(null);
    setPersyaratanNama("");
    setPersyaratanContohGambar("");
    setPersyaratanTemplateFile("");
    setPersyaratanUrutan(persyaratanList.length);
    setPersyaratanDialogOpen(true);
  };

  const openEditPersyaratanDialog = (p: Persyaratan) => {
    setEditPersyaratan(p);
    setPersyaratanNama(p.nama);
    setPersyaratanContohGambar(p.contohGambar || "");
    setPersyaratanTemplateFile(p.templateFile || "");
    setPersyaratanUrutan(p.urutan);
    setPersyaratanDialogOpen(true);
  };

  const handlePersyaratanSubmit = async () => {
    if (!persyaratanNama || persyaratanNama.length < 2) {
      toast.error("Nama persyaratan minimal 2 karakter");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        nama: persyaratanNama,
        urutan: persyaratanUrutan,
      };
      if (persyaratanContohGambar) body.contohGambar = persyaratanContohGambar;
      if (persyaratanTemplateFile) body.templateFile = persyaratanTemplateFile;

      let res: Response;
      if (editPersyaratan) {
        res = await fetch(`/api/layanan/${layananId}/persyaratan/${editPersyaratan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/layanan/${layananId}/persyaratan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan");
      }
      toast.success(
        editPersyaratan ? "Persyaratan berhasil diperbarui" : "Persyaratan berhasil ditambahkan",
        { icon: <CheckCircle2 className="size-4 text-green-500" /> },
      );
      setPersyaratanDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan persyaratan", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        icon: <AlertTriangle className="size-4" />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePersyaratanDelete = async () => {
    if (!persyaratanToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/layanan/${layananId}/persyaratan/${persyaratanToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Persyaratan berhasil dihapus", {
        description: `"${persyaratanToDelete.nama}" telah dihapus.`,
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      });
      setDeletePersyaratanDialogOpen(false);
      setPersyaratanToDelete(null);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus persyaratan", { icon: <AlertTriangle className="size-4" /> });
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/dashboard/layanan">
                <ArrowLeft className="mr-1 size-3.5" />
                Kembali
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {loading ? "Memuat..." : `Form Builder: ${layanan?.nama ?? ""}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat..." : `${fields.length} field · ${persyaratanList.length} persyaratan`}
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-sage dark:border-[#414943] bg-fog/30 dark:bg-[#2e2e2e]/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hudson-blue/10 dark:bg-hudson-blue/20">
              <Pencil className="size-4 text-hudson-blue" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Kelola Formulir & Persyaratan</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Atur field formulir dan persyaratan layanan. Setiap persyaratan bisa memiliki
                contoh gambar dan file template yang bisa diunduh user.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="fields" className="gap-2">
              <Pencil className="size-3.5" />
              Field Formulir
              {fields.length > 0 && (
                <span className="ml-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium">
                  {fields.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="persyaratan" className="gap-2">
              <FileText className="size-3.5" />
              Persyaratan
              {persyaratanList.length > 0 && (
                <span className="ml-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium">
                  {persyaratanList.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          {activeTab === "fields" && (
            <Button onClick={openAddFieldDialog} className="gap-2">
              <Plus className="size-4" /> Tambah Field
            </Button>
          )}
          {activeTab === "persyaratan" && (
            <Button onClick={openAddPersyaratanDialog} className="gap-2">
              <Plus className="size-4" /> Tambah Persyaratan
            </Button>
          )}
        </div>

        {/* ── TAB: FIELDS ── */}
        <TabsContent value="fields" className="mt-0 space-y-4">
          <Card className="overflow-hidden border-sage dark:border-[#414943]">
            <Table>
              <TableHeader>
                <TableRow className="bg-fog/50 dark:bg-[#2e2e2e]/50">
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="hidden sm:table-cell">Required</TableHead>
                  <TableHead className="hidden md:table-cell">Placeholder</TableHead>
                  <TableHead className="hidden lg:table-cell">Opsi</TableHead>
                  <TableHead className="w-28 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <FieldSkeleton key={i} />)
                ) : fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <EmptyFieldsState onAdd={openAddFieldDialog} />
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, idx) => (
                    <TableRow
                      key={field.id}
                      className="group transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50"
                    >
                      <TableCell className="pr-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveField(idx, "up")}
                            disabled={idx === 0}
                            className="text-steel hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Naik"
                          >
                            <ChevronUp className="size-3" />
                          </button>
                          <button
                            onClick={() => moveField(idx, "down")}
                            disabled={idx === fields.length - 1}
                            className="text-steel hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Turun"
                          >
                            <ChevronDown className="size-3" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">{field.label}</span>
                        {field.required && <span className="text-destructive text-xs font-bold ml-1">*</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[11px] font-medium ${getFieldTypeBadge(field.fieldType)}`}>
                          {FIELD_TYPE_LABELS[field.fieldType] || field.fieldType}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {field.required ? (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-medium">
                            Wajib
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {field.placeholder || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {field.options && field.options.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {field.options.slice(0, 3).map((opt, i) => (
                              <Badge key={i} variant="outline" className="text-[10px] border-sage dark:border-[#414943]">
                                {opt}
                              </Badge>
                            ))}
                            {field.options.length > 3 && (
                              <span className="text-[10px] text-steel">+{field.options.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="icon" className="size-8 hover:bg-background" onClick={() => openEditFieldDialog(field)} title="Edit">
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => { setFieldToDelete(field); setDeleteDialogOpen(true); }} title="Hapus">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ── TAB: PERSYARATAN ── */}
        <TabsContent value="persyaratan" className="mt-0 space-y-4">
          <Card className="overflow-hidden border-sage dark:border-[#414943]">
            <Table>
              <TableHeader>
                <TableRow className="bg-fog/50 dark:bg-[#2e2e2e]/50">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Nama Persyaratan</TableHead>
                  <TableHead>Contoh Gambar</TableHead>
                  <TableHead>File Template</TableHead>
                  <TableHead className="w-28 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <PersyaratanSkeleton key={i} />)
                ) : persyaratanList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <EmptyPersyaratanState onAdd={openAddPersyaratanDialog} />
                    </TableCell>
                  </TableRow>
                ) : (
                  persyaratanList.map((p, idx) => (
                    <TableRow key={p.id} className="group transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50">
                      <TableCell className="text-sm text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-foreground">{p.nama}</span>
                      </TableCell>
                      <TableCell>
                        {p.contohGambar ? (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-medium">
                            <ImageIcon className="mr-1 size-3" /> Ada
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {p.templateFile ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-[11px] font-medium">
                              <FileText className="mr-1 size-3" /> Ada
                            </Badge>
                            <button
                              type="button"
                              onClick={() => openPreview(p.templateFile!, p.nama)}
                              className="text-[11px] text-primary hover:underline font-medium"
                            >
                              Preview
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="icon" className="size-8 hover:bg-background" onClick={() => openEditPersyaratanDialog(p)} title="Edit">
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => { setPersyaratanToDelete(p); setDeletePersyaratanDialogOpen(true); }} title="Hapus">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Field Dialog ── */}
      <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editField ? "Edit Field" : "Tambah Field Baru"}</DialogTitle>
            <DialogDescription>
              {editField
                ? "Ubah field formulir untuk layanan ini."
                : "Buat field baru untuk formulir layanan."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Label */}
            <div className="grid gap-2">
              <Label htmlFor="field-label">Label Field</Label>
              <Input
                id="field-label"
                placeholder="Contoh: Nama Lengkap, NIK, Alamat"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
              />
            </div>

            {/* Tipe */}
            <div className="grid gap-2">
              <Label htmlFor="field-type">Tipe Field</Label>
              <Select value={formFieldType} onValueChange={setFormFieldType}>
                <SelectTrigger id="field-type">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type} value={type}>
                      {FIELD_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Required */}
            <div className="flex items-center gap-3">
              <Switch
                id="field-required"
                checked={formRequired}
                onCheckedChange={setFormRequired}
              />
              <Label htmlFor="field-required" className="cursor-pointer">
                Wajib diisi (required)
              </Label>
            </div>

            {/* Placeholder */}
            <div className="grid gap-2">
              <Label htmlFor="field-placeholder">Placeholder (opsional)</Label>
              <Input
                id="field-placeholder"
                placeholder="Teks petunjuk di dalam input"
                value={formPlaceholder}
                onChange={(e) => setFormPlaceholder(e.target.value)}
              />
            </div>

            {/* Urutan */}
            <div className="grid gap-2">
              <Label htmlFor="field-urutan">Urutan</Label>
              <Input
                id="field-urutan"
                type="number"
                min={0}
                value={formUrutan}
                onChange={(e) => setFormUrutan(Number(e.target.value))}
              />
            </div>

            {/* Options (for SELECT, RADIO, CHECKBOX) */}
            {["SELECT", "RADIO", "CHECKBOX"].includes(formFieldType) && (
              <div className="grid gap-2">
                <Label>Opsi Pilihan</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tambah opsi..."
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addOption} className="shrink-0">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                {formOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formOptions.map((opt, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 pr-1">
                        {opt}
                        <button onClick={() => removeOption(i)} className="ml-1 text-muted-foreground hover:text-destructive">
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleFieldSubmit} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editField ? "Simpan Perubahan" : "Tambah Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Field Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Field</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus field{" "}
              <strong className="text-foreground">{fieldToDelete?.label}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleFieldDelete} disabled={deleting} className="gap-2">
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Persyaratan Dialog ── */}
      <Dialog open={persyaratanDialogOpen} onOpenChange={setPersyaratanDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editPersyaratan ? "Edit Persyaratan" : "Tambah Persyaratan Baru"}</DialogTitle>
            <DialogDescription>
              {editPersyaratan
                ? "Ubah persyaratan untuk layanan ini."
                : "Tambah persyaratan baru untuk layanan ini."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Nama */}
            <div className="grid gap-2">
              <Label htmlFor="persyaratan-nama">Nama Persyaratan</Label>
              <Input
                id="persyaratan-nama"
                placeholder="Contoh: Fotokopi KTP, KK, Surat Pengantar RT"
                value={persyaratanNama}
                onChange={(e) => setPersyaratanNama(e.target.value)}
              />
            </div>

            {/* Urutan */}
            <div className="grid gap-2">
              <Label htmlFor="persyaratan-urutan">Urutan</Label>
              <Input
                id="persyaratan-urutan"
                type="number"
                min={0}
                value={persyaratanUrutan}
                onChange={(e) => setPersyaratanUrutan(Number(e.target.value))}
              />
            </div>

            {/* Contoh Gambar */}
            <div className="grid gap-2">
              <Label>Contoh Gambar (opsional)</Label>
              {persyaratanContohGambar && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-sage dark:border-[#414943] mb-2">
                  <Image
                    src={persyaratanContohGambar}
                    alt="Preview contoh gambar"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPersyaratanContohGambar("")}
                    className="absolute top-2 right-2 size-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="URL gambar (atau upload)"
                  value={persyaratanContohGambar}
                  onChange={(e) => setPersyaratanContohGambar(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingGambar}
                  className="shrink-0 gap-2"
                  onClick={async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = async () => {
                      const file = input.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file, "gambar");
                      if (url) setPersyaratanContohGambar(url);
                    };
                    input.click();
                  }}
                >
                  {uploadingGambar ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImageIcon className="size-4" />
                  )}
                  Upload
                </Button>
              </div>
            </div>

            {/* File Template */}
            <div className="grid gap-2">
              <Label>File Template (PDF, opsional)</Label>
              {persyaratanTemplateFile && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-fog/50 dark:bg-[#2e2e2e]/50 border border-sage dark:border-[#414943] mb-2">
                  <FileText className="size-4 text-hudson-blue shrink-0" />
                  <a
                    href={persyaratanTemplateFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-hudson-blue hover:underline truncate flex-1"
                  >
                    {persyaratanTemplateFile.split("/").pop() || "Lihat file"}
                  </a>
                  <button
                    type="button"
                    onClick={() => setPersyaratanTemplateFile("")}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="URL file template (atau upload)"
                  value={persyaratanTemplateFile}
                  onChange={(e) => setPersyaratanTemplateFile(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingTemplate}
                  className="shrink-0 gap-2"
                  onClick={async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf";
                    input.onchange = async () => {
                      const file = input.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file, "template");
                      if (url) setPersyaratanTemplateFile(url);
                    };
                    input.click();
                  }}
                >
                  {uploadingTemplate ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                  Upload PDF
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPersyaratanDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handlePersyaratanSubmit} disabled={submitting} className="gap-2">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {editPersyaratan ? "Simpan Perubahan" : "Tambah Persyaratan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Persyaratan Dialog ── */}
      <Dialog open={deletePersyaratanDialogOpen} onOpenChange={setDeletePersyaratanDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Persyaratan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus persyaratan{" "}
              <strong className="text-foreground">{persyaratanToDelete?.nama}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePersyaratanDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handlePersyaratanDelete} disabled={deleting} className="gap-2">
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    </div>
  );
}

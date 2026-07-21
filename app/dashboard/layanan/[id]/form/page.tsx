"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

function getFieldTypeBadge(type: string) {
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
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function FieldSkeleton() {
  return (
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
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex size-20 items-center justify-center rounded-full bg-fog dark:bg-[#2e2e2e] mb-5">
        <Pencil className="size-8 text-steel dark:text-[#8c9489]" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Belum ada field formulir
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Tambahkan field-field yang diperlukan untuk formulir layanan ini, seperti
        Nama Lengkap, NIK, Alamat, dan lainnya.
      </p>
      <Button
        onClick={onAdd}
        className="gap-2 animate-in zoom-in-95 duration-300"
      >
        <Plus className="size-4" />
        Tambah Field Pertama
      </Button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function FormBuilderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const layananId = params.id;

  const [fields, setFields] = useState<FormField[]>([]);
  const [layananNama, setLayananNama] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editField, setEditField] = useState<FormField | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<FormField | null>(null);

  // Form inputs
  const [formLabel, setFormLabel] = useState("");
  const [formFieldType, setFormFieldType] = useState<string>("TEXT");
  const [formRequired, setFormRequired] = useState(false);
  const [formPlaceholder, setFormPlaceholder] = useState("");
  const [formUrutan, setFormUrutan] = useState(0);
  const [formOptions, setFormOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState("");

  // ── Fetch data ───────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [layananRes, fieldsRes] = await Promise.all([
        fetch(`/api/layanan/${layananId}`),
        fetch(`/api/layanan/${layananId}/form-fields`),
      ]);

      if (!layananRes.ok) {
        toast.error("Layanan tidak ditemukan");
        router.push("/dashboard/layanan");
        return;
      }

      const layananData = await layananRes.json();
      const fieldsData: FormField[] = await fieldsRes.json();

      setLayananNama(layananData.nama || "");
      setFields(fieldsData);
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

  // ── Dialog open for add ──────────────────────────────────────────────────────

  const openAddDialog = () => {
    setEditField(null);
    setFormLabel("");
    setFormFieldType("TEXT");
    setFormRequired(false);
    setFormPlaceholder("");
    setFormUrutan(fields.length);
    setFormOptions([]);
    setOptionInput("");
    setDialogOpen(true);
  };

  // ── Dialog open for edit ─────────────────────────────────────────────────────

  const openEditDialog = (field: FormField) => {
    setEditField(field);
    setFormLabel(field.label);
    setFormFieldType(field.fieldType);
    setFormRequired(field.required);
    setFormPlaceholder(field.placeholder || "");
    setFormUrutan(field.urutan);
    setFormOptions(field.options || []);
    setOptionInput("");
    setDialogOpen(true);
  };

  // ── Add option ───────────────────────────────────────────────────────────────

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

  // ── Submit form ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
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
      if (needsOptions) {
        body.options = formOptions;
      }

      let res: Response;
      if (editField) {
        res = await fetch(
          `/api/layanan/${layananId}/form-fields/${editField.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          },
        );
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
        editField
          ? "Field berhasil diperbarui"
          : "Field berhasil ditambahkan",
        {
          icon: <CheckCircle2 className="size-4 text-green-500" />,
        },
      );

      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan field", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
        icon: <AlertTriangle className="size-4" />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!fieldToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/layanan/${layananId}/form-fields/${fieldToDelete.id}`,
        { method: "DELETE" },
      );
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
      toast.error("Gagal menghapus field", {
        icon: <AlertTriangle className="size-4" />,
      });
    } finally {
      setDeleting(false);
    }
  };

  // ── Reorder ──────────────────────────────────────────────────────────────────

  const moveField = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const currentField = fields[index];
    const targetField = fields[newIndex];

    try {
      await Promise.all([
        fetch(`/api/layanan/${layananId}/form-fields/${currentField.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urutan: targetField.urutan }),
        }),
        fetch(`/api/layanan/${layananId}/form-fields/${targetField.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urutan: currentField.urutan }),
        }),
      ]);

      // Optimistic update
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

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/dashboard/layanan">
                <ArrowLeft className="mr-1 size-3.5" />
                Kembali ke Layanan
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {loading ? "Memuat..." : `Form Builder: ${layananNama}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat data..." : `${fields.length} field form`}
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="size-4" />
          Tambah Field
        </Button>
      </div>

      {/* ── Info Card ─────────────────────────────────────────────────────────── */}
      <Card className="border-sage dark:border-[#414943] bg-fog/30 dark:bg-[#2e2e2e]/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hudson-blue/10 dark:bg-hudson-blue/20">
              <Pencil className="size-4 text-hudson-blue" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Kelola Field Formulir
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Atur field-field yang akan muncul pada formulir pengajuan layanan
                ini. Urutkan field dengan tombol panah, tambah field baru, atau
                edit field yang sudah ada. Untuk tipe SELECT, RADIO, dan CHECKBOX,
                Anda perlu menambahkan opsi pilihan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
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
              Array.from({ length: 5 }).map((_, i) => (
                <FieldSkeleton key={i} />
              ))
            ) : fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-0">
                  <EmptyState onAdd={openAddDialog} />
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field, idx) => (
                <TableRow
                  key={field.id}
                  className="group transition-colors hover:bg-fog/50 dark:hover:bg-[#2e2e2e]/50 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    animationFillMode: "both",
                  }}
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
                  <TableCell className="text-sm text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {field.label}
                      </span>
                      {field.required && (
                        <span className="text-destructive text-xs font-bold">
                          *
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-[11px] font-medium ${getFieldTypeBadge(field.fieldType)}`}
                    >
                      {FIELD_TYPE_LABELS[field.fieldType] || field.fieldType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {field.required ? (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] font-medium"
                      >
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
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-[10px] border-sage dark:border-[#414943] text-iron"
                          >
                            {opt}
                          </Badge>
                        ))}
                        {field.options.length > 3 && (
                          <span className="text-[10px] text-steel">
                            +{field.options.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:bg-background"
                        onClick={() => openEditDialog(field)}
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setFieldToDelete(field);
                          setDeleteDialogOpen(true);
                        }}
                        title="Hapus"
                      >
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

      {/* ── Add/Edit Dialog ────────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editField ? "Edit Field" : "Tambah Field Baru"}
            </DialogTitle>
            <DialogDescription>
              {editField
                ? "Ubah pengaturan field formulir layanan ini."
                : "Tambahkan field baru ke formulir layanan ini."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">
                Label Field <span className="text-destructive">*</span>
              </Label>
              <Input
                id="label"
                placeholder="Contoh: Nama Lengkap"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                className="border-sage dark:border-[#414943] bg-background"
              />
            </div>

            {/* Field Type */}
            <div className="space-y-2">
              <Label htmlFor="fieldType">
                Tipe Input <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formFieldType}
                onValueChange={(v) => setFormFieldType(v)}
              >
                <SelectTrigger
                  id="fieldType"
                  className="border-sage dark:border-[#414943] bg-background"
                >
                  <SelectValue placeholder="Pilih tipe field" />
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

            {/* Placeholder */}
            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder (opsional)</Label>
              <Input
                id="placeholder"
                placeholder="Teks petunjuk dalam field"
                value={formPlaceholder}
                onChange={(e) => setFormPlaceholder(e.target.value)}
                className="border-sage dark:border-[#414943] bg-background"
              />
            </div>

            {/* Required */}
            <div className="flex items-center justify-between rounded-lg border border-sage dark:border-[#414943] p-4">
              <div className="space-y-0.5">
                <Label htmlFor="required" className="text-sm font-semibold">
                  Wajib Diisi
                </Label>
                <p className="text-xs text-muted-foreground">
                  User harus mengisi field ini
                </p>
              </div>
              <Switch
                id="required"
                checked={formRequired}
                onCheckedChange={setFormRequired}
              />
            </div>

            {/* Options (only for SELECT/RADIO/CHECKBOX) */}
            {["SELECT", "RADIO", "CHECKBOX"].includes(formFieldType) && (
              <div className="space-y-3 rounded-lg border border-sage dark:border-[#414943] p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">
                    Opsi Pilihan <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Masukkan opsi-opsi yang akan tersedia untuk dipilih user
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 min-h-8">
                  {formOptions.length === 0 ? (
                    <span className="text-xs text-steel italic">
                      Belum ada opsi
                    </span>
                  ) : (
                    formOptions.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-fog dark:bg-[#2e2e2e] px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {opt}
                        <button
                          onClick={() => removeOption(i)}
                          className="text-steel hover:text-destructive transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add option input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ketik opsi lalu tambah..."
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                    className="border-sage dark:border-[#414943] bg-background flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={!optionInput.trim()}
                    className="shrink-0 border-sage dark:border-[#414943]"
                  >
                    <Plus className="mr-1 size-3.5" />
                    Tambah
                  </Button>
                </div>
              </div>
            )}

            {/* Urutan */}
            <div className="space-y-2">
              <Label htmlFor="urutan">Urutan</Label>
              <Input
                id="urutan"
                type="number"
                min={0}
                value={formUrutan}
                onChange={(e) => setFormUrutan(parseInt(e.target.value) || 0)}
                className="border-sage dark:border-[#414943] bg-background w-24"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-sage dark:border-[#414943]"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : editField ? (
                <Pencil className="mr-2 size-4" />
              ) : (
                <Plus className="mr-2 size-4" />
              )}
              {editField ? "Perbarui" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ──────────────────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md animate-in zoom-in-95 fade-in duration-200">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus field{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{fieldToDelete?.label}&rdquo;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-sage dark:border-[#414943]"
              onClick={() => {
                setDeleteDialogOpen(false);
                setFieldToDelete(null);
              }}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

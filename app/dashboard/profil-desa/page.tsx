"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Save, Loader2, Plus, Trash2, Pencil, Upload,
  CheckCircle2, AlertTriangle, Users, Building2, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================
interface DesaData {
  id: string; nama: string; sejarah: string; visi: string; misi: string;
  luasWilayah: number | null; jumlahPenduduk: number | null;
  jumlahKK: number | null; jumlahDusun: number | null;
  batasUtara: string | null; batasTimur: string | null;
  batasSelatan: string | null; batasBarat: string | null;
  fotoKepalaDesa: string | null; createdAt: string; updatedAt: string;
}
interface PerangkatDesa {
  id: string; nama: string; jabatan: string; foto: string | null;
  urutan: number; createdAt: string; updatedAt: string;
}

// =============================================================================
// Upload Progress
// =============================================================================
function UploadProgress({ progress, status }: {
  progress: number; status: "idle" | "uploading" | "done" | "error";
}) {
  if (status === "idle") return null;
  const c = {
    uploading: { color: "bg-obsidian", tc: "text-obsidian", label: `Mengupload... ${progress}%` },
    done: { color: "bg-emerald-500", tc: "text-emerald-500", label: "Upload selesai" },
    error: { color: "bg-destructive", tc: "text-destructive", label: "Upload gagal" },
  }[status];
  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${c.tc}`}>{c.label}</span>
        {status === "done" && <CheckCircle2 className="size-3.5 text-emerald-500" />}
        {status === "error" && <AlertTriangle className="size-3.5 text-destructive" />}
      </div>
      <div className="h-1.5 w-full rounded-full bg-fog dark:bg-[#2e2e2e] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ease-out ${c.color}`}
          style={{ width: `${status === "error" ? 100 : progress}%` }} />
      </div>
    </div>
  );
}

// =============================================================================
// Perangkat Form Modal
// =============================================================================
function PerangkatFormModal({ open, onOpenChange, onSuccess, editItem }: {
  open: boolean; onOpenChange: (o: boolean) => void; onSuccess: () => void;
  editItem: PerangkatDesa | null;
}) {
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [upProgress, setUpProgress] = useState(0);
  const [upStatus, setUpStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!editItem;

  useEffect(() => {
    if (editItem && open) {
      setNama(editItem.nama); setJabatan(editItem.jabatan);
      setFotoUrl(editItem.foto || ""); setUpStatus(editItem.foto ? "done" : "idle");
      setErrors({});
    } else if (!open) resetForm();
  }, [editItem, open]);

  function resetForm() {
    setNama(""); setJabatan(""); setFotoUrl(""); setIsUploading(false);
    setUpProgress(0); setUpStatus("idle"); setErrors({}); setIsSubmitting(false);
  }

  function simulateProgress() {
    setUpStatus("uploading"); setUpProgress(0);
    const iv = setInterval(() => setUpProgress(p => { if (p >= 90) { clearInterval(iv); return 90; } return p + 10; }), 150);
    return iv;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploading(true); setErrors({});
    const iv = simulateProgress();
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      clearInterval(iv);
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Upload gagal"); }
      const data = await res.json();
      setFotoUrl(data.url); setUpProgress(100); setUpStatus("done");
      toast.success("Foto berhasil diupload");
    } catch (err: unknown) {
      clearInterval(iv);
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setUpStatus("error"); setErrors(p => ({ ...p, foto: msg }));
      toast.error(msg);
    } finally { setIsUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ne: Record<string, string> = {};
    if (!nama.trim() || nama.trim().length < 2) ne.nama = "Nama minimal 2 karakter";
    if (!jabatan.trim() || jabatan.trim().length < 2) ne.jabatan = "Jabatan minimal 2 karakter";
    if (Object.keys(ne).length > 0) { setErrors(ne); return; }
    setIsSubmitting(true);
    try {
      const payload = { nama: nama.trim(), jabatan: jabatan.trim(), foto: fotoUrl || null };
      const res = isEdit && editItem
        ? await fetch(`/api/perangkat-desa/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/perangkat-desa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Gagal menyimpan"); }
      toast.success(isEdit ? "Perangkat desa berhasil diupdate" : "Perangkat desa berhasil ditambahkan");
      resetForm(); onOpenChange(false); onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally { setIsSubmitting(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
            {isEdit ? "Edit Perangkat Desa" : "Tambah Perangkat Desa"}
          </DialogTitle>
          <DialogDescription className="text-iron">
            {isEdit ? "Perbarui data perangkat desa" : "Tambahkan perangkat desa baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-lg mt-md">
          <div className="space-y-xs">
            <Label className="text-sm font-semibold text-obsidian dark:text-white">Foto</Label>
            <div className="flex items-start gap-md">
              <div className="relative shrink-0">
                {fotoUrl ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-sage dark:border-[#414943]">
                    <Image src={fotoUrl} alt="Foto perangkat" fill className="object-cover" />
                    {upStatus === "done" && <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-fog dark:bg-[#2e2e2e] flex items-center justify-center border-2 border-dashed border-sage dark:border-[#414943]">
                    <Users className="w-8 h-8 text-steel" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xs border border-sage dark:border-[#414943] cursor-pointer hover:bg-fog/50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-obsidian dark:text-white">
                  <Upload className="w-4 h-4" />{fotoUrl ? "Ganti Foto" : "Upload Foto"}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                </label>
                {fotoUrl && <button type="button" onClick={() => { setFotoUrl(""); setUpStatus("idle"); if (fileRef.current) fileRef.current.value = ""; }} className="ml-2 text-xs text-destructive hover:underline">Hapus foto</button>}
              </div>
            </div>
            <UploadProgress progress={upProgress} status={upStatus} />
            {errors.foto && <p className="text-xs text-destructive">{errors.foto}</p>}
          </div>
          <div className="space-y-xs">
            <Label className="text-sm font-semibold text-obsidian dark:text-white">Nama <span className="text-destructive">*</span></Label>
            <Input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap" className={cn("h-10 rounded-xs", errors.nama && "border-destructive")} />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
          </div>
          <div className="space-y-xs">
            <Label className="text-sm font-semibold text-obsidian dark:text-white">Jabatan <span className="text-destructive">*</span></Label>
            <Input value={jabatan} onChange={e => setJabatan(e.target.value)} placeholder="Contoh: Kepala Desa" className={cn("h-10 rounded-xs", errors.jabatan && "border-destructive")} />
            {errors.jabatan && <p className="text-xs text-destructive">{errors.jabatan}</p>}
          </div>
          <div className="flex gap-sm pt-md border-t border-sage dark:border-[#414943]">
            <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false); }} className="flex-1 h-10 rounded-xs" disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isUploading || isSubmitting} className="flex-1 h-10 rounded-xs bg-obsidian hover:bg-obsidian/90 text-white">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : <><Save className="w-4 h-4 mr-2" />{isEdit ? "Update" : "Simpan"}</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// Main Page
// =============================================================================
export default function DashboardProfilDesaPage() {
  const [desa, setDesa] = useState<DesaData | null>(null);
  const [perangkat, setPerangkat] = useState<PerangkatDesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDesa, setIsSavingDesa] = useState(false);
  const [formDesa, setFormDesa] = useState<Partial<DesaData>>({});
  const [error, setError] = useState<string | null>(null);
  const [perangkatOpen, setPerangkatOpen] = useState(false);
  const [editPerangkat, setEditPerangkat] = useState<PerangkatDesa | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const [upFotoProgress, setUpFotoProgress] = useState(0);
  const [upFotoStatus, setUpFotoStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const fotoRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const [dr, pr] = await Promise.all([fetch("/api/desa"), fetch("/api/perangkat-desa")]);
      if (dr.ok) {
        const dd = await dr.json(); const d = Array.isArray(dd) ? dd[0] : dd;
        if (d) { setDesa(d); setFormDesa({ nama: d.nama, sejarah: d.sejarah, visi: d.visi, misi: d.misi, luasWilayah: d.luasWilayah, jumlahPenduduk: d.jumlahPenduduk, jumlahKK: d.jumlahKK, jumlahDusun: d.jumlahDusun, batasUtara: d.batasUtara, batasTimur: d.batasTimur, batasSelatan: d.batasSelatan, batasBarat: d.batasBarat, fotoKepalaDesa: d.fotoKepalaDesa }); }
      }
      if (pr.ok) { const pd = await pr.json(); setPerangkat(Array.isArray(pd) ? pd : []); }
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Terjadi kesalahan"); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSaveDesa() {
    if (!desa) return; setIsSavingDesa(true);
    try {
      const res = await fetch("/api/desa", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formDesa) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Gagal menyimpan"); }
      setDesa(await res.json()); toast.success("Profil desa berhasil disimpan");
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Gagal menyimpan profil desa"); }
    finally { setIsSavingDesa(false); }
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setIsUploadingFoto(true); setUpFotoStatus("uploading"); setUpFotoProgress(0);
    const iv = setInterval(() => setUpFotoProgress(p => { if (p >= 90) { clearInterval(iv); return 90; } return p + 10; }), 150);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      clearInterval(iv);
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Upload gagal"); }
      const data = await res.json();
      setFormDesa(p => ({ ...p, fotoKepalaDesa: data.url }));
      setUpFotoProgress(100); setUpFotoStatus("done");
      toast.success("Foto kepala desa berhasil diupload");
    } catch (err: unknown) { clearInterval(iv); setUpFotoStatus("error"); toast.error(err instanceof Error ? err.message : "Upload gagal"); }
    finally { setIsUploadingFoto(false); }
  }

  async function handleDeletePerangkat() {
    if (!deleteId) return; setIsDeleting(true);
    try {
      const res = await fetch(`/api/perangkat-desa/${deleteId}`, { method: "DELETE" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Gagal menghapus"); }
      toast.success("Perangkat desa berhasil dihapus");
      setPerangkat(p => p.filter(i => i.id !== deleteId)); setDeleteId(null);
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Gagal menghapus"); }
    finally { setIsDeleting(false); }
  }

  if (isLoading) return (
    <div className="animate-in fade-in duration-300 space-y-lg">
      <Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mt-lg">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-[12px]" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-4xl text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-md"><AlertTriangle className="w-8 h-8 text-destructive" /></div>
      <h3 className="font-display text-headline-small text-obsidian dark:text-white">Gagal memuat data</h3>
      <p className="text-iron text-sm mt-1">{error}</p>
      <Button onClick={fetchData} variant="outline" className="mt-lg h-10 rounded-xs"><Loader2 className="w-4 h-4 mr-2" />Coba Lagi</Button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
        <div>
          <h1 className="font-display text-display-small text-obsidian dark:text-white tracking-tight">Profil Desa</h1>
          <p className="text-iron text-sm mt-1">Edit data desa dan kelola perangkat desa</p>
        </div>
        <Button onClick={handleSaveDesa} disabled={isSavingDesa} className="h-10 rounded-xs bg-obsidian hover:bg-obsidian/90 text-white self-start">
          {isSavingDesa ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : <><Save className="w-4 h-4 mr-2" />Simpan Perubahan</>}
        </Button>
      </div>

      <Tabs defaultValue="data-desa" className="w-full">
        <TabsList className="mb-lg bg-fog dark:bg-[#2e2e2e] p-1 rounded-xs inline-flex h-auto">
          <TabsTrigger value="data-desa" className="rounded-xs data-[state=active]:bg-paper dark:data-[state=active]:bg-[#1a1a1a] data-[state=active]:shadow-paper-sm px-4 py-2 text-sm font-semibold"><Building2 className="w-4 h-4 mr-2" />Data Desa</TabsTrigger>
          <TabsTrigger value="perangkat" className="rounded-xs data-[state=active]:bg-paper dark:data-[state=active]:bg-[#1a1a1a] data-[state=active]:shadow-paper-sm px-4 py-2 text-sm font-semibold"><Users className="w-4 h-4 mr-2" />Perangkat Desa</TabsTrigger>
        </TabsList>

        {/* TAB: Data Desa */}
        <TabsContent value="data-desa" className="space-y-lg">
          {/* Foto Kepala Desa */}
          <Card className="rounded-[12px] border border-sage dark:border-[#414943] shadow-paper-sm">
            <CardHeader><CardTitle className="text-lg font-display text-obsidian dark:text-white">Foto Kepala Desa</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-start gap-lg">
                <div className="relative shrink-0">
                  {formDesa.fotoKepalaDesa ? (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-sage dark:border-[#414943] ring-4 ring-fog dark:ring-[#2e2e2e]">
                      <Image src={formDesa.fotoKepalaDesa} alt="Foto kepala desa" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-fog dark:bg-[#2e2e2e] flex items-center justify-center border-2 border-dashed border-sage dark:border-[#414943]"><Users className="w-10 h-10 text-steel" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xs border border-sage dark:border-[#414943] cursor-pointer hover:bg-fog/50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-obsidian dark:text-white">
                    <Upload className="w-4 h-4" />{formDesa.fotoKepalaDesa ? "Ganti Foto" : "Upload Foto"}
                    <input ref={fotoRef} type="file" accept="image/*" onChange={handleFotoUpload} className="hidden" disabled={isUploadingFoto} />
                  </label>
                  {formDesa.fotoKepalaDesa && <button type="button" onClick={() => setFormDesa(p => ({ ...p, fotoKepalaDesa: undefined }))} className="ml-2 text-xs text-destructive hover:underline">Hapus foto</button>}
                  <UploadProgress progress={upFotoProgress} status={upFotoStatus} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informasi Dasar */}
          <Card className="rounded-[12px] border border-sage dark:border-[#414943] shadow-paper-sm">
            <CardHeader><CardTitle className="text-lg font-display text-obsidian dark:text-white">Informasi Dasar</CardTitle></CardHeader>
            <CardContent className="space-y-lg">
              <div className="space-y-xs">
                <Label className="text-sm font-semibold text-obsidian dark:text-white">Nama Desa</Label>
                <Input value={formDesa.nama || ""} onChange={e => setFormDesa(p => ({ ...p, nama: e.target.value }))} className="h-10 rounded-xs" />
              </div>
              <div className="space-y-xs">
                <Label className="text-sm font-semibold text-obsidian dark:text-white">Sejarah</Label>
                <Textarea value={formDesa.sejarah || ""} onChange={e => setFormDesa(p => ({ ...p, sejarah: e.target.value }))} rows={5} className="rounded-xs resize-y" />
              </div>
              <div className="space-y-xs">
                <Label className="text-sm font-semibold text-obsidian dark:text-white">Visi</Label>
                <Textarea value={formDesa.visi || ""} onChange={e => setFormDesa(p => ({ ...p, visi: e.target.value }))} rows={3} className="rounded-xs resize-y" />
              </div>
              <div className="space-y-xs">
                <Label className="text-sm font-semibold text-obsidian dark:text-white">Misi</Label>
                <Textarea value={formDesa.misi || ""} onChange={e => setFormDesa(p => ({ ...p, misi: e.target.value }))} rows={4} className="rounded-xs resize-y" />
              </div>
            </CardContent>
          </Card>

          {/* Statistik */}
          <Card className="rounded-[12px] border border-sage dark:border-[#414943] shadow-paper-sm">
            <CardHeader><CardTitle className="text-lg font-display text-obsidian dark:text-white">Statistik Desa</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Luas Wilayah (km&sup2;)</Label>
                  <Input type="number" step="0.01" value={formDesa.luasWilayah ?? ""} onChange={e => setFormDesa(p => ({ ...p, luasWilayah: e.target.value ? parseFloat(e.target.value) : null }))} className="h-10 rounded-xs" />
                </div>
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Jumlah Penduduk</Label>
                  <Input type="number" value={formDesa.jumlahPenduduk ?? ""} onChange={e => setFormDesa(p => ({ ...p, jumlahPenduduk: e.target.value ? parseInt(e.target.value) : null }))} className="h-10 rounded-xs" />
                </div>
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Jumlah KK</Label>
                  <Input type="number" value={formDesa.jumlahKK ?? ""} onChange={e => setFormDesa(p => ({ ...p, jumlahKK: e.target.value ? parseInt(e.target.value) : null }))} className="h-10 rounded-xs" />
                </div>
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Jumlah Dusun</Label>
                  <Input type="number" value={formDesa.jumlahDusun ?? ""} onChange={e => setFormDesa(p => ({ ...p, jumlahDusun: e.target.value ? parseInt(e.target.value) : null }))} className="h-10 rounded-xs" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batas Wilayah */}
          <Card className="rounded-[12px] border border-sage dark:border-[#414943] shadow-paper-sm">
            <CardHeader><CardTitle className="text-lg font-display text-obsidian dark:text-white">Batas Wilayah</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Batas Utara</Label>
                  <Input value={formDesa.batasUtara || ""} onChange={e => setFormDesa(p => ({ ...p, batasUtara: e.target.value }))} className="h-10 rounded-xs" />
                </div>
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Batas Timur</Label>
                  <Input value={formDesa.batasTimur || ""} onChange={e => setFormDesa(p => ({ ...p, batasTimur: e.target.value }))} className="h-10 rounded-xs" />
                </div>
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Batas Selatan</Label>
                  <Input value={formDesa.batasSelatan || ""} onChange={e => setFormDesa(p => ({ ...p, batasSelatan: e.target.value }))} className="h-10 rounded-xs" />
                </div>
                <div className="space-y-xs">
                  <Label className="text-sm font-semibold text-obsidian dark:text-white">Batas Barat</Label>
                  <Input value={formDesa.batasBarat || ""} onChange={e => setFormDesa(p => ({ ...p, batasBarat: e.target.value }))} className="h-10 rounded-xs" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Perangkat Desa */}
        <TabsContent value="perangkat" className="space-y-lg">
          <div className="flex justify-end">
            <Button onClick={() => { setEditPerangkat(null); setPerangkatOpen(true); }} className="h-10 rounded-xs bg-obsidian hover:bg-obsidian/90 text-white">
              <Plus className="w-4 h-4 mr-2" />Tambah Perangkat
            </Button>
          </div>

          {perangkat.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4xl text-center">
              <div className="w-20 h-20 rounded-full bg-fog dark:bg-[#2e2e2e] flex items-center justify-center mb-md"><Users className="w-10 h-10 text-steel" /></div>
              <h3 className="font-display text-headline-small text-obsidian dark:text-white">Belum ada perangkat desa</h3>
              <p className="text-iron text-sm mt-1">Tambahkan data perangkat desa untuk ditampilkan di halaman publik</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {perangkat.map((p, idx) => (
                <div key={p.id} className="animate-in fade-in zoom-in-95 duration-300 rounded-[12px] border border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a] shadow-paper-sm hover:shadow-paper-md transition-all duration-250 overflow-hidden" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="p-lg flex items-start gap-md">
                    <div className="relative shrink-0">
                      {p.foto ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sage dark:border-[#414943]">
                          <Image src={p.foto} alt={p.nama} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-fog dark:bg-[#2e2e2e] flex items-center justify-center"><Users className="w-6 h-6 text-steel" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body text-sm font-semibold text-obsidian dark:text-white line-clamp-1">{p.nama}</h3>
                      <p className="text-xs text-steel mt-0.5">{p.jabatan}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditPerangkat(p); setPerangkatOpen(true); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-fog dark:hover:bg-[#2e2e2e] transition-colors text-iron hover:text-obsidian dark:hover:text-white" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors text-iron hover:text-destructive" title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Perangkat Form Modal */}
      <PerangkatFormModal open={perangkatOpen} onOpenChange={setPerangkatOpen} onSuccess={fetchData} editItem={editPerangkat} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v: boolean) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Perangkat Desa?</AlertDialogTitle>
            <AlertDialogDescription>Data ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-10 rounded-xs" disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePerangkat} disabled={isDeleting} className="h-10 rounded-xs bg-destructive hover:bg-destructive/90">
              {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menghapus...</> : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
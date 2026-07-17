"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import {
  Search,
  Plus,
  Trash2,
  ImageIcon,
  Layers,
  AlertCircle,
  Loader2,
  Upload,
  X,
  Filter,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ────────────────────────────────────── Types ──────────────────────────────────────
interface GaleriItem {
  id: string;
  judul: string;
  gambar: string;
  kategori: string;
  uploadedById: string;
  uploadedBy?: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const KATEGORI_LIST = [
  "Kegiatan Desa",
  "Infrastruktur",
  "Pertanian",
  "Budaya",
  "Pemerintahan",
  "Lainnya",
];

// ────────────────────────────────────── Components ─────────────────────────────────
function UploadModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const { data: session } = authClient.useSession();
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_LIST[0]);
  const [gambarUrl, setGambarUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setJudul("");
    setKategori(KATEGORI_LIST[0]);
    setGambarUrl("");
    setPreviewUrl(null);
    setErrors({});
    setIsUploading(false);
    setIsSubmitting(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview lokal
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload gagal");
      }

      const data = await res.json();
      setGambarUrl(data.url);
      toast.success("Gambar berhasil diupload");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload gagal";
      setErrors({ gambar: msg });
      toast.error(msg);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    const newErrors: Record<string, string> = {};
    if (!judul.trim() || judul.trim().length < 3)
      newErrors.judul = "Judul minimal 3 karakter";
    if (!gambarUrl) newErrors.gambar = "Upload gambar terlebih dahulu";
    if (!kategori) newErrors.kategori = "Pilih kategori";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: judul.trim(),
          gambar: gambarUrl,
          kategori,
          uploadedById: session.user.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan");
      }

      toast.success("Foto berhasil ditambahkan ke galeri");
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-headline-small text-obsidian dark:text-white">
            Upload Foto Galeri
          </DialogTitle>
          <DialogDescription className="text-iron">
            Tambahkan foto baru ke galeri desa. Format JPG, PNG, atau WebP.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-lg mt-md">
          {/* Upload area */}
          <div className="space-y-xs">
            <Label className="text-sm font-semibold text-obsidian dark:text-white">
              Foto <span className="text-destructive">*</span>
            </Label>
            {previewUrl ? (
              <div className="relative group rounded-[12px] overflow-hidden border border-sage dark:border-[#414943]">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={480}
                  height={320}
                  className="w-full h-56 object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-white">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm font-medium animate-pulse">
                        Mengupload...
                      </span>
                    </div>
                  </div>
                )}
                {!isUploading && gambarUrl && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full animate-in zoom-in duration-300">
                      ✓ Terupload
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setGambarUrl("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <label
                className={cn(
                  "flex flex-col items-center justify-center gap-sm p-2xl rounded-[12px] border-2 border-dashed cursor-pointer transition-all duration-200",
                  errors.gambar
                    ? "border-destructive bg-destructive/5"
                    : "border-sage dark:border-[#414943] hover:border-obsidian dark:hover:border-white hover:bg-fog/50 dark:hover:bg-white/5",
                )}
              >
                <div className="w-14 h-14 rounded-full bg-fog dark:bg-[#2e2e2e] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-iron" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-obsidian dark:text-white">
                    Klik untuk upload gambar
                  </p>
                  <p className="text-xs text-iron mt-1">
                    JPG, PNG, WebP (max 5MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.gambar && (
              <p className="text-xs text-destructive">{errors.gambar}</p>
            )}
          </div>

          {/* Judul */}
          <div className="space-y-xs">
            <Label className="text-sm font-semibold text-obsidian dark:text-white">
              Judul Foto <span className="text-destructive">*</span>
            </Label>
            <Input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Gotong Royong RW 02"
              className={cn(
                "h-10 rounded-xs",
                errors.judul && "border-destructive",
              )}
            />
            {errors.judul && (
              <p className="text-xs text-destructive">{errors.judul}</p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-xs">
            <Label className="text-sm font-semibold text-obsidian dark:text-white">
              Kategori <span className="text-destructive">*</span>
            </Label>
            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger className="h-10 rounded-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KATEGORI_LIST.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && (
              <p className="text-xs text-destructive">{errors.kategori}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-sm pt-md border-t border-sage dark:border-[#414943]">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="flex-1 h-10 rounded-xs"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isUploading || isSubmitting}
              className="flex-1 h-10 rounded-xs bg-obsidian hover:bg-obsidian/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DetailModal({
  item,
  open,
  onOpenChange,
}: {
  item: GaleriItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden">
        <div className="relative">
          <Image
            src={item.gambar}
            alt={item.judul}
            width={720}
            height={480}
            className="w-full max-h-[60vh] object-contain bg-[#111411]"
          />
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-lg">
          <h3 className="font-display text-headline-small text-obsidian dark:text-white">
            {item.judul}
          </h3>
          <div className="flex items-center gap-sm mt-sm text-sm text-iron">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-fog dark:bg-[#2e2e2e] text-xs font-semibold">
              <Layers className="w-3 h-3" />
              {item.kategori}
            </span>
            <span>
              {new Date(item.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {item.uploadedBy && (
            <p className="text-xs text-steel mt-sm">
              Diupload oleh: {item.uploadedBy.name}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────── Main Page ─────────────────────────────────────
export default function DashboardGaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<GaleriItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterKategori) params.set("kategori", filterKategori);
      params.set("limit", "50");

      const res = await fetch(`/api/galeri?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data galeri");

      const data = await res.json();
      setItems(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filterKategori]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.judul.toLowerCase().includes(q) ||
      item.kategori.toLowerCase().includes(q)
    );
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/galeri/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus");
      }
      toast.success("Foto berhasil dihapus");
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
        <div>
          <h1 className="font-display text-display-small text-obsidian dark:text-white tracking-tight">
            Galeri
          </h1>
          <p className="text-iron text-sm mt-1">
            Kelola koleksi foto kegiatan dan potensi desa
          </p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xs bg-obsidian hover:bg-obsidian/90 text-white self-start">
              <Plus className="w-4 h-4 mr-2" />
              Upload Foto
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-sm mb-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel" />
          <Input
            placeholder="Cari foto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xs"
          />
        </div>
        <Select
          value={filterKategori}
          onValueChange={(v) => setFilterKategori(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-xs">
            <Filter className="w-4 h-4 mr-2 text-steel" />
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {KATEGORI_LIST.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-iron self-center whitespace-nowrap">
          {filteredItems.length} foto
        </span>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="rounded-[12px] h-48 w-full animate-pulse bg-ash/50 dark:bg-[#2e2e2e]"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-4xl text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-md">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-display text-headline-small text-obsidian dark:text-white">
            Terjadi kesalahan
          </h3>
          <p className="text-iron text-sm mt-1 max-w-sm">{error}</p>
          <Button
            onClick={fetchData}
            variant="outline"
            className="mt-lg h-10 rounded-xs"
          >
            <Loader2 className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-4xl text-center">
          <div className="w-20 h-20 rounded-full bg-fog dark:bg-[#2e2e2e] flex items-center justify-center mb-md">
            <ImageIcon className="w-10 h-10 text-steel" />
          </div>
          <h3 className="font-display text-headline-small text-obsidian dark:text-white">
            {search || filterKategori
              ? "Tidak ada foto ditemukan"
              : "Belum ada foto di galeri"}
          </h3>
          <p className="text-iron text-sm mt-1 max-w-sm">
            {search || filterKategori
              ? "Coba ubah kata kunci atau filter kategori"
              : "Upload foto pertama untuk memulai galeri desa"}
          </p>
          {!search && !filterKategori && (
            <Button
              onClick={() => setUploadOpen(true)}
              className="mt-lg h-10 rounded-xs bg-obsidian hover:bg-obsidian/90 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Foto Pertama
            </Button>
          )}
        </div>
      )}

      {/* Grid galeri */}
      {!isLoading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-[12px] overflow-hidden border border-sage dark:border-[#414943] bg-paper dark:bg-[#1a1a1a] shadow-paper-sm hover:shadow-paper-md transition-all duration-250 animate-in zoom-in-95 duration-300"
            >
              {/* Gambar */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.gambar}
                  alt={item.judul}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-250 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setDetailItem(item);
                      setDetailOpen(true);
                    }}
                    className="w-9 h-9 bg-white/90 hover:bg-white text-obsidian rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                    title="Lihat"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="w-9 h-9 bg-white/90 hover:bg-destructive hover:text-white text-obsidian rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Foto &ldquo;{item.judul}&rdquo; akan dihapus
                          permanen. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-10 rounded-xs">
                          Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => setDeleteId(item.id)}
                          className="h-10 rounded-xs bg-destructive hover:bg-destructive/90"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {/* Info */}
              <div className="p-sm">
                <h3 className="font-body text-sm font-semibold text-obsidian dark:text-white line-clamp-1">
                  {item.judul}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-iron bg-fog dark:bg-[#2e2e2e] px-2 py-0.5 rounded-full">
                    {item.kategori}
                  </span>
                  <span className="text-xs text-steel">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      <UploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={fetchData}
      />

      {/* Detail modal */}
      <DetailModal
        item={detailItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v: boolean) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto ini akan dihapus permanen. Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="h-10 rounded-xs"
              disabled={isDeleting}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-10 rounded-xs bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
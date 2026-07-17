"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExternalLink,
  ImageIcon,
  MapPin,
  Mountain,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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

const KATEGORI_LABEL: Record<WisataItem["kategori"], string> = {
  WISATA_ALAM: "Wisata Alam",
  KULINER: "Kuliner",
  BUDAYA: "Budaya",
};

const KATEGORI_ICON: Record<WisataItem["kategori"], React.ReactNode> = {
  WISATA_ALAM: <Mountain className="size-4" />,
  KULINER: <UtensilsCrossed className="size-4" />,
  BUDAYA: <ShoppingBag className="size-4" />,
};

const KATEGORI_VARIANT: Record<
  WisataItem["kategori"],
  "default" | "secondary" | "outline"
> = {
  WISATA_ALAM: "default",
  KULINER: "secondary",
  BUDAYA: "outline",
};

/* -------------------------------------------------------------------------- */
/* Skeleton Table                                                             */
/* -------------------------------------------------------------------------- */

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty State                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  search,
  kategori,
  onClear,
}: {
  search: string;
  kategori: string;
  onClear: () => void;
}) {
  const hasFilter = search !== "" || kategori !== "";
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in-50 duration-500">
      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-muted">
        <Mountain className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">
        {hasFilter ? "Tidak ada wisata ditemukan" : "Belum ada data wisata"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasFilter
          ? "Coba ubah filter atau kata kunci pencarian."
          : "Klik tombol Tambah Wisata untuk menambahkan destinasi wisata pertama."}
      </p>
      {hasFilter && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onClear}
        >
          Reset Filter
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page Component                                                             */
/* -------------------------------------------------------------------------- */

export default function WisataListPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<WisataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (kategori) params.set("kategori", kategori);
      if (search.trim()) params.set("q", search.trim());

      const res = await fetch(`/api/wisata?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat data");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Gagal memuat data wisata");
    } finally {
      setLoading(false);
    }
  }, [search, kategori]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ----- Delete ---------------------------------------------------------- */
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/wisata/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Wisata berhasil dihapus");
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus wisata");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setKategori("");
  };

  /* ----- Helpers --------------------------------------------------------- */
  const truncate = (text: string, max = 80) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  return (
    <div className="animate-in slide-in-from-right-4 fade-in-50 duration-500">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Wisata</h1>
          <p className="text-sm text-muted-foreground">
            Tambah, edit, dan kelola destinasi wisata Desa Padangloang
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/wisata/new")}
          className="gap-2"
        >
          <Plus className="size-4" />
          Tambah Wisata
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Cari wisata…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={kategori}
            onValueChange={(val) => setKategori(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="WISATA_ALAM">Wisata Alam</SelectItem>
              <SelectItem value="KULINER">Kuliner</SelectItem>
              <SelectItem value="BUDAYA">Budaya</SelectItem>
            </SelectContent>
          </Select>
          {(search || kategori) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Reset
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            Daftar Wisata
            {!loading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({data.length})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : data.length === 0 ? (
            <EmptyState
              search={search}
              kategori={kategori}
              onClear={clearFilters}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Nama Wisata</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="hidden md:table-cell">Lokasi</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Deskripsi
                  </TableHead>
                  <TableHead className="w-[120px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow
                    key={item.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      {item.gambar ? (
                        <div className="relative size-10 overflow-hidden rounded-lg border">
                          <Image
                            src={item.gambar}
                            alt={item.nama}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <ImageIcon className="size-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.nama}</p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={KATEGORI_VARIANT[item.kategori]}
                        className="gap-1"
                      >
                        {KATEGORI_ICON[item.kategori]}
                        {KATEGORI_LABEL[item.kategori]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3" />
                        {item.lokasi}
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {truncate(item.deskripsi)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Lihat"
                          onClick={() =>
                            window.open(`/wisata/${item.id}`, "_blank")
                          }
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          onClick={() =>
                            router.push(`/dashboard/wisata/${item.id}/edit`)
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Hapus"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Wisata</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data wisata beserta gambar
              akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteId(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Menghapus…" : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
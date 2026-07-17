import { z } from "zod";

export const updateDesaSchema = z.object({
  nama: z.string().min(1, "Nama desa wajib diisi").optional(),
  sejarah: z.string().min(10, "Sejarah minimal 10 karakter").optional(),
  visi: z.string().min(10, "Visi minimal 10 karakter").optional(),
  misi: z.string().min(10, "Misi minimal 10 karakter").optional(),
  luasWilayah: z
    .number()
    .positive("Luas wilayah harus positif")
    .optional()
    .nullable(),
  jumlahPenduduk: z
    .number()
    .int()
    .positive("Jumlah penduduk harus positif")
    .optional()
    .nullable(),
  jumlahKK: z
    .number()
    .int()
    .positive("Jumlah KK harus positif")
    .optional()
    .nullable(),
  jumlahDusun: z
    .number()
    .int()
    .positive("Jumlah dusun harus positif")
    .optional()
    .nullable(),
  batasUtara: z.string().optional().nullable(),
  batasTimur: z.string().optional().nullable(),
  batasSelatan: z.string().optional().nullable(),
  batasBarat: z.string().optional().nullable(),
  fotoKepalaDesa: z.string().url("URL foto tidak valid").optional().nullable(),
});

export type UpdateDesaInput = z.infer<typeof updateDesaSchema>;
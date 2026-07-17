import { z } from "zod";

export const wisataKategoriEnum = z.enum(["WISATA_ALAM", "KULINER", "BUDAYA"]);

export const createWisataSchema = z.object({
  nama: z.string().min(3, "Nama wisata minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  kategori: wisataKategoriEnum,
  gambar: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type CreateWisataInput = z.infer<typeof createWisataSchema>;

export const updateWisataSchema = z.object({
  nama: z.string().min(3, "Nama wisata minimal 3 karakter").optional(),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter").optional(),
  lokasi: z.string().min(1, "Lokasi wajib diisi").optional(),
  kategori: wisataKategoriEnum.optional(),
  gambar: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type UpdateWisataInput = z.infer<typeof updateWisataSchema>;
export type CreateWisataFormErrors = Partial<
  Record<keyof CreateWisataInput, string[]>
>;
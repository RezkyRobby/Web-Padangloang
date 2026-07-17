import { z } from "zod";

export const createGaleriSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  gambar: z.string().url("URL gambar tidak valid"),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  uploadedById: z.string().min(1, "Uploader wajib diisi"),
});

export type CreateGaleriInput = z.infer<typeof createGaleriSchema>;

export const updateGaleriSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").optional(),
  gambar: z.string().url("URL gambar tidak valid").optional(),
  kategori: z.string().min(1, "Kategori wajib diisi").optional(),
});

export type UpdateGaleriInput = z.infer<typeof updateGaleriSchema>;
export type CreateGaleriFormErrors = Partial<
  Record<keyof CreateGaleriInput, string[]>
>;
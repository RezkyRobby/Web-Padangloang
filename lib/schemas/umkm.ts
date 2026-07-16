import { z } from "zod";

export const createUMKMSchema = z.object({
  namaProduk: z.string().min(3, "Nama produk minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  harga: z.string().optional(),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  kontak: z.string().min(1, "Kontak wajib diisi"),
  gambar: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
  pemilik: z.string().min(2, "Pemilik minimal 2 karakter"),
});

export type CreateUMKMInput = z.infer<typeof createUMKMSchema>;

export const updateUMKMSchema = z.object({
  namaProduk: z.string().min(3, "Nama produk minimal 3 karakter").optional(),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter").optional(),
  harga: z.string().optional(),
  kategori: z.string().min(1, "Kategori wajib diisi").optional(),
  kontak: z.string().min(1, "Kontak wajib diisi").optional(),
  gambar: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
  pemilik: z.string().min(2, "Pemilik minimal 2 karakter").optional(),
});

export type UpdateUMKMInput = z.infer<typeof updateUMKMSchema>;
export type CreateUMKMFormErrors = Partial<
  Record<keyof CreateUMKMInput, string[]>
>;
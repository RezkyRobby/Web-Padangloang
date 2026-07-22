import { z } from "zod";

export const createPersyaratanSchema = z.object({
  nama: z.string().min(1, "Nama persyaratan wajib diisi"),
  contohGambar: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
  templateFile: z
    .string()
    .url("URL file tidak valid")
    .or(z.literal(""))
    .optional(),
  urutan: z.number().int().optional().default(0),
});

export type CreatePersyaratanInput = z.infer<typeof createPersyaratanSchema>;

export const updatePersyaratanSchema = z.object({
  nama: z.string().min(1, "Nama persyaratan wajib diisi").optional(),
  contohGambar: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.literal(""))
    .optional(),
  templateFile: z
    .string()
    .url("URL file tidak valid")
    .or(z.literal(""))
    .optional(),
  urutan: z.number().int().optional(),
});

export type UpdatePersyaratanInput = z.infer<typeof updatePersyaratanSchema>;
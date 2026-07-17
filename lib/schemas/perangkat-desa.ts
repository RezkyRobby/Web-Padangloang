import { z } from "zod";

export const createPerangkatDesaSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  jabatan: z.string().min(3, "Jabatan minimal 3 karakter"),
  foto: z.string().url("URL foto tidak valid").or(z.literal("")).optional(),
  urutan: z.number().int().min(0, "Urutan tidak boleh negatif").default(0),
});

export type CreatePerangkatDesaInput = z.infer<typeof createPerangkatDesaSchema>;

export const updatePerangkatDesaSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").optional(),
  jabatan: z.string().min(3, "Jabatan minimal 3 karakter").optional(),
  foto: z.string().url("URL foto tidak valid").or(z.literal("")).optional(),
  urutan: z.number().int().min(0, "Urutan tidak boleh negatif").optional(),
});

export type UpdatePerangkatDesaInput = z.infer<typeof updatePerangkatDesaSchema>;
export type CreatePerangkatDesaFormErrors = Partial<
  Record<keyof CreatePerangkatDesaInput, string[]>
>;
import { z } from "zod";

export const createLayananSchema = z.object({
  nama: z.string().min(3, "Nama layanan minimal 3 karakter"),
  deskripsi: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  hanyaOffline: z.boolean().optional().default(false),
  persyaratan: z.array(z.string()).optional(),
  templateFile: z
    .string()
    .url("URL template tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type CreateLayananInput = z.infer<typeof createLayananSchema>;

export const updateLayananSchema = z.object({
  nama: z.string().min(3, "Nama layanan minimal 3 karakter").optional(),
  deskripsi: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  hanyaOffline: z.boolean().optional(),
  persyaratan: z.array(z.string()).optional(),
  templateFile: z
    .string()
    .url("URL template tidak valid")
    .or(z.literal(""))
    .optional(),
});

export type UpdateLayananInput = z.infer<typeof updateLayananSchema>;
export type CreateLayananFormErrors = Partial<
  Record<keyof CreateLayananInput, string[]>
>;
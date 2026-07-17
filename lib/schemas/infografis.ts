import { z } from "zod";

// Prisma Json type bisa berupa object, array, string, number, boolean, null
export const createInfografisSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  tahun: z
    .number()
    .int("Tahun harus bilangan bulat")
    .positive("Tahun harus positif"),
  dataJson: z.any(),
});

export type CreateInfografisInput = z.infer<typeof createInfografisSchema>;

export const updateInfografisSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").optional(),
  tahun: z
    .number()
    .int("Tahun harus bilangan bulat")
    .positive("Tahun harus positif")
    .optional(),
  dataJson: z.any().optional(),
});

export type UpdateInfografisInput = z.infer<typeof updateInfografisSchema>;
export type CreateInfografisFormErrors = Partial<
  Record<keyof CreateInfografisInput, string[]>
>;
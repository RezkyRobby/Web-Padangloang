import { z } from "zod";

export const breakingNewsSchema = z.object({
  text: z
    .string()
    .min(3, "Teks minimal 3 karakter")
    .max(300, "Teks maksimal 300 karakter"),
  labelLink: z.string().max(200, "Link label maksimal 200 karakter").nullish(),
  postId: z.string().cuid("Post ID tidak valid").nullish(),
  isActive: z.boolean().default(true),
});

export const updateBreakingNewsSchema = breakingNewsSchema
  .partial()
  .extend({ id: z.string().cuid("ID tidak valid") });

export type BreakingNewsInput = z.infer<typeof breakingNewsSchema>;
export type UpdateBreakingNewsInput = z.infer<typeof updateBreakingNewsSchema>;
export type BreakingNewsFormErrors = Partial<
  Record<keyof BreakingNewsInput, string[]>
>;

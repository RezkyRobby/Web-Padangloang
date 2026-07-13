import { z } from "zod";

export const ROLES = ["USER", "EDITOR", "ADMIN"] as const;

export const roleSchema = z.enum(ROLES, {
  error: "Role tidak valid. Pilih USER, EDITOR, atau ADMIN.",
});

export type Role = z.infer<typeof roleSchema>;

export const updateUserRoleSchema = z.object({
  id: z.string().min(1, "Parameter id diperlukan"),
  role: roleSchema,
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

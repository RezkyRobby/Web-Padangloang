import { z } from "zod";

export const createFormFieldSchema = z.object({
  label: z.string().min(2, "Label minimal 2 karakter"),
  fieldType: z.enum([
    "TEXT",
    "NUMBER",
    "TEXTAREA",
    "DATE",
    "FILE_UPLOAD",
    "SELECT",
    "RADIO",
    "CHECKBOX",
  ]),
  required: z.boolean().optional().default(false),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  urutan: z.number().int().optional().default(0),
});

export type CreateFormFieldInput = z.infer<typeof createFormFieldSchema>;

export const updateFormFieldSchema = z.object({
  label: z.string().min(2, "Label minimal 2 karakter").optional(),
  fieldType: z
    .enum([
      "TEXT",
      "NUMBER",
      "TEXTAREA",
      "DATE",
      "FILE_UPLOAD",
      "SELECT",
      "RADIO",
      "CHECKBOX",
    ])
    .optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  urutan: z.number().int().optional(),
});

export type UpdateFormFieldInput = z.infer<typeof updateFormFieldSchema>;
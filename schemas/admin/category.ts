import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Le nom de la catégorie doit avoir au moins 3 caractères."),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Le nom doit avoir au moins 3 caractères." })
    .optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

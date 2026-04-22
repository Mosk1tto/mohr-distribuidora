import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres."),
  slug: z.string().min(2, "O slug precisa ter pelo menos 2 caracteres."),
  imageUrl: z.string().url("Informe uma URL válida.").nullable().optional(),
  price: z.coerce.number().positive("O preço precisa ser maior que zero."),
  stockQuantity: z.coerce
    .number()
    .int("O estoque precisa ser um número inteiro.")
    .min(0, "O estoque não pode ser negativo."),
  isActive: z.coerce.boolean().optional(),
  categoryId: z.string().min(1, "Selecione uma categoria."),
  description: z.string().nullable().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
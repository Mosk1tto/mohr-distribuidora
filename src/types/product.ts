import type { Category } from "./category";

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
};
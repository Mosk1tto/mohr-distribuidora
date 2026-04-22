export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  categoryId: string | null;
  description?: string | null;
  category: Category | null;
};
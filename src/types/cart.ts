import type { Product } from "./product";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

export type AddToCartPayload = {
  product: Product;
  quantity?: number;
};
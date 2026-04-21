export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartProduct = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  stockQuantity: number;
  categoryName?: string;
};
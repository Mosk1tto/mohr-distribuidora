"use client";

import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

type AddToCartButtonProps = {
  productId: string;
  productName?: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  productName = "Produto",
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem, getQuantity } = useCart();
  const { addToast } = useToast();
  const quantity = getQuantity(productId);

  function handleAddToCart() {
    addItem(productId);
    addToast(`${productName} adicionado ao carrinho!`, "success", 2000);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {quantity > 0 ? `Adicionar mais (${quantity})` : "Adicionar ao carrinho"}
    </button>
  );
}
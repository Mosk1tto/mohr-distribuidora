"use client";

import { useCart } from "@/hooks/use-cart";

type AddToCartButtonProps = {
  productId: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem, getQuantity } = useCart();
  const quantity = getQuantity(productId);

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {quantity > 0 ? `Adicionar mais (${quantity})` : "Adicionar ao carrinho"}
    </button>
  );
}
"use client";

import { useState } from "react";
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
  const { addItem, decreaseItem, getQuantity } = useCart();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const quantity = getQuantity(productId);

  function handleAddToCart() {
    setIsAdding(true);
    addItem(productId);
    addToast(`${productName} adicionado ao carrinho!`, "success", 2000);
    setTimeout(() => setIsAdding(false), 300);
  }

  if (quantity > 0) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-2 py-1">
        <button
          type="button"
          onClick={() => decreaseItem(productId)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-medium text-slate-700 transition hover:bg-slate-100"
        >
          −
        </button>
        <span className="text-sm font-semibold text-slate-900">{quantity}</span>
        <button
          type="button"
          onClick={() => addItem(productId)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-medium text-slate-700 transition hover:bg-slate-100"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isAdding ? "Adicionando..." : "Adicionar ao carrinho"}
    </button>
  );
}
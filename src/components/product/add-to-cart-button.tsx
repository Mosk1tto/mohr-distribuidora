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
  const { addItem, getQuantity } = useCart();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const quantity = getQuantity(productId);

  async function handleAddToCart() {
    setIsAdding(true);
    
    try {
      addItem(productId);
      addToast(`${productName} adicionado ao carrinho!`, "success", 2000);
    } finally {
      // Simula um pequeno delay para melhor feedback visual
      setTimeout(() => {
        setIsAdding(false);
      }, 300);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isAdding ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
          Adicionando...
        </>
      ) : quantity > 0 ? (
        `Adicionar mais (${quantity})`
      ) : (
        "Adicionar ao carrinho"
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
"use client";

import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="aspect-[4/3] rounded-xl bg-slate-100" />

      <div className="mt-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-600">{product.category?.name ?? "Categoria"}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-bold text-emerald-700">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>

          <span className="text-xs font-medium text-slate-500">
            Estoque: {product.stockQuantity}
          </span>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={() => addToCart({ product, quantity: 1 })}
        >
          Adicionar ao carrinho
        </Button>
      </div>
    </article>
  );
}
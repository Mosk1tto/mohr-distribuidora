import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/currency";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 5;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sem imagem
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-lg bg-black px-3 py-1 text-sm font-semibold text-white">
              Fora de estoque
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 rounded-lg bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
            Estoque baixo
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-500">
            {product.category?.name ?? "Sem categoria"}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span className="text-base font-semibold text-emerald-700">
            {formatCurrency(product.price)}
          </span>
          <span
            className={
              isOutOfStock
                ? "text-red-600 font-semibold"
                : isLowStock
                ? "text-amber-600 font-semibold"
                : ""
            }
          >
            {isOutOfStock
              ? "Sem estoque"
              : `Estoque: ${product.stockQuantity}`}
          </span>
        </div>

        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-300 px-4 py-2 text-sm font-medium text-slate-500 cursor-not-allowed"
          >
            Fora de estoque
          </button>
        ) : (
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            disabled={false}
          />
        )}
      </div>
    </article>
  );
}
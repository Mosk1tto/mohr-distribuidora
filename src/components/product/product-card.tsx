import Image from "next/image";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils/currency";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
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
          <span>Estoque: {product.stockQuantity}</span>
        </div>

        <AddToCartButton
          productId={product.id}
          disabled={product.stockQuantity <= 0}
        />
      </div>
    </article>
  );
}
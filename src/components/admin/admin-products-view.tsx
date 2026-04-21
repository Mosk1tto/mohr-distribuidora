"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types/product";

type AdminProductsViewProps = {
  products: Product[];
  categories: {
    id: string;
    name: string;
  }[];
};

export function AdminProductsView({
  products,
  categories,
}: AdminProductsViewProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleEdit(product: Product) {
    setSelectedProduct(product);
  }

  function handleCancelEdit() {
    setSelectedProduct(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProductForm
          categories={categories}
          selectedProduct={selectedProduct}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Produtos cadastrados
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Clique em editar para alterar um produto existente.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6">
            <p className="text-slate-600">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
              >
                {/* Miniatura */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      —
                    </div>
                  )}
                </div>

                {/* Dados */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500">{product.slug}</p>
                  <div className="mt-1 space-y-0.5 text-sm text-slate-600">
                    <p>Preço: R$ {Number(product.price).toFixed(2)}</p>
                    <p>Estoque: {product.stockQuantity}</p>
                    <p>Categoria: {product.category?.name ?? "Sem categoria"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Editar
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
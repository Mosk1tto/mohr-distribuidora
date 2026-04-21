"use client";

import { useState } from "react";
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
                className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
              >
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-500">{product.slug}</p>

                  <div className="mt-2 space-y-1 text-sm text-slate-600">
                    <p>Preço: R$ {Number(product.price).toFixed(2)}</p>
                    <p>Estoque: {product.stockQuantity}</p>
                    <p>
                      Categoria: {product.category?.name ?? "Sem categoria"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleEdit(product)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
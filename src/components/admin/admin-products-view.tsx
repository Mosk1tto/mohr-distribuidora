"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types/product";

type AdminProductsViewProps = {
  products: Product[];
  categories: {
    id: string;
    name: string;
  }[];
  initialQuery?: string;
};

export function AdminProductsView({
  products,
  categories,
  initialQuery = "",
}: AdminProductsViewProps) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  function handleEdit(product: Product) {
    setSelectedProduct(product);
  }

  function handleCancelEdit() {
    setSelectedProduct(null);
  }

  async function handleDelete(productId: string) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

    setDeletingId(productId);
    setDeleteError(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Erro ao excluir produto.");
      }

      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    router.push(`/admin/products?${params.toString()}`);
  }

  function handleClearSearch() {
    setSearchQuery("");
    router.push("/admin/products");
  }

  // Filtrar produtos localmente também (para UX instantânea)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Busca */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Buscar
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Limpar
            </button>
          )}
        </form>

        {deleteError ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-600">{deleteError}</p>
          </div>
        ) : null}

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6">
            <p className="text-slate-600">
              {products.length === 0
                ? "Nenhum produto cadastrado ainda."
                : "Nenhum produto encontrado com os filtros informados."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
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

                {/* Botões */}
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                  >
                    {deletingId === product.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
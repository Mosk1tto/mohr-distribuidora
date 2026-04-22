"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CatalogFiltersProps = {
  categories: { id: string; name: string; slug: string }[];
  initialQuery: string;
  initialCategory: string;
  initialOrder: string;
};

export function CatalogFilters({
  categories,
  initialQuery,
  initialCategory,
  initialOrder,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [order, setOrder] = useState(initialOrder);

  function updateUrl(nextQuery: string, nextCategory: string, nextOrder: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    if (nextCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    if (nextOrder) {
      params.set("order", nextOrder);
    } else {
      params.delete("order");
    }

    router.push(`/products?${params.toString()}`);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl(query, category, order);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  function handleCategoryChange(value: string) {
    setCategory(value);
    updateUrl(query, value, order);
  }

  function handleOrderChange(value: string) {
    setOrder(value);
    updateUrl(query, category, value);
  }

  function clearFilters() {
    setQuery("");
    setCategory("");
    setOrder("");
    router.push("/products");
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Buscar produto</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: detergente"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Categoria</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange("")}
              className={`rounded-full px-3 py-1 text-sm font-medium transition border ${
                category === ""
                  ? "bg-slate-900 text-white border-slate-900"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todas
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryChange(item.slug)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition border ${
                  category === item.slug
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Ordenar por</span>
          <select
            value={order}
            onChange={(e) => handleOrderChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
          >
            <option value="">Mais recentes</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
            <option value="name_asc">A → Z</option>
            <option value="name_desc">Z → A</option>
          </select>
        </div>

        <div className="flex items-end gap-3">

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
}
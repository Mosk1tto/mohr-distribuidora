"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type CatalogFiltersProps = {
  categories: { id: string; name: string }[];
  initialQuery: string;
  initialCategory: string;
};

export function CatalogFilters({
  categories,
  initialQuery,
  initialCategory,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  function updateUrl(nextQuery: string, nextCategory: string) {
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

    router.push(`/products?${params.toString()}`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl(query, category);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    updateUrl(query, value);
  }

  function clearFilters() {
    setQuery("");
    setCategory("");
    router.push("/products");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_240px_auto]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Buscar produto</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: detergente"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Categoria</span>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Buscar
          </button>

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
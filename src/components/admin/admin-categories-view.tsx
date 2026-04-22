"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import type { Category } from "@/types/category";

type AdminCategoriesViewProps = {
  categories: Category[];
};

export function AdminCategoriesView({ categories }: AdminCategoriesViewProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleEdit(category: Category) {
    setSelectedCategory(category);
  }

  function handleCancelEdit() {
    setSelectedCategory(null);
  }

  async function handleDelete(categoryId: string) {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta categoria? Produtos associados não serão deletados."
      )
    ) {
      return;
    }

    setDeletingId(categoryId);
    setDeleteError(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Erro ao excluir categoria.");
      }

      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <CategoryForm
          selectedCategory={selectedCategory}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Categorias cadastradas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Clique em editar para alterar uma categoria existente.
          </p>
        </div>

        {deleteError ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-600">{deleteError}</p>
          </div>
        ) : null}

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6">
            <p className="text-slate-600">Nenhuma categoria cadastrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <article
                key={category.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {category.emoji && <span className="mr-2">{category.emoji}</span>}
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500">{category.slug}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                  >
                    {deletingId === category.id ? "Excluindo..." : "Excluir"}
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
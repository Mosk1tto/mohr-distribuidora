"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/types/category";

type CategoryFormProps = {
  selectedCategory: Category | null;
  onCancelEdit: () => void;
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-"); // Remove hífens duplicados
}

export function CategoryForm({
  selectedCategory,
  onCancelEdit,
}: CategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(selectedCategory?.name ?? "");
  const [slug, setSlug] = useState(selectedCategory?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(selectedCategory?.name ?? "");
    setSlug(selectedCategory?.slug ?? "");
    setError(null);
    setSuccessMessage(null);
  }, [selectedCategory]);

  function handleNameChange(value: string) {
    setName(value);
    // Gerar slug automaticamente
    setSlug(generateSlug(value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      if (!name.trim() || !slug.trim()) {
        throw new Error("Preencha o nome da categoria.");
      }

      const payload = {
        id: selectedCategory?.id,
        name: name.trim(),
        slug: slug.trim(),
      };

      const response = await fetch("/api/admin/categories", {
        method: selectedCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Erro ao salvar categoria.");
      }

      setSuccessMessage(
        selectedCategory
          ? "Categoria atualizada com sucesso!"
          : "Categoria criada com sucesso!"
      );

      setName("");
      setSlug("");

      setTimeout(() => {
        router.refresh();
        onCancelEdit();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {selectedCategory ? "Editar categoria" : "Nova categoria"}
        </h2>

        {selectedCategory ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Cancelar edição
          </button>
        ) : null}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Nome</span>
        <input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2"
          placeholder="Ex: Limpeza Geral"
        />
      </label>

      {slug && (
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-600">
            <strong>Slug:</strong> <code className="font-mono">{slug}</code>
          </p>
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm text-rose-600">{error}</p>
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-sm text-emerald-600">{successMessage}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {saving
          ? "Salvando..."
          : selectedCategory
          ? "Atualizar categoria"
          : "Criar categoria"}
      </button>
    </form>
  );
}
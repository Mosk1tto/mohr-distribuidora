"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/types/category";

type CategoryFormProps = {
  selectedCategory: Category | null;
  onCancelEdit: () => void;
};

type FormErrors = {
  name?: string;
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
  const { addToast } = useToast();

  const [name, setName] = useState(selectedCategory?.name ?? "");
  const [slug, setSlug] = useState(selectedCategory?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setName(selectedCategory?.name ?? "");
    setSlug(selectedCategory?.slug ?? "");
    setError(null);
    setSuccessMessage(null);
    setErrors({});
  }, [selectedCategory]);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
    if (errors.name) setErrors({ ...errors, name: undefined });
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nome da categoria é obrigatório";
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      addToast("Corrija os erros indicados", "error", 3000);
      return;
    }

    setSaving(true);

    try {
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

      const message = selectedCategory
        ? "Categoria atualizada com sucesso!"
        : "Categoria criada com sucesso!";

      setSuccessMessage(message);
      addToast(message, "success", 2000);

      setName("");
      setSlug("");

      setTimeout(() => {
        router.refresh();
        onCancelEdit();
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      setError(message);
      addToast(message, "error", 3000);
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
        <span className="text-sm font-medium text-slate-700">
          Nome <span className="text-red-600">*</span>
        </span>
        <input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={`w-full rounded-xl border px-4 py-2 outline-none transition ${
            errors.name
              ? "border-red-300 focus:border-red-400"
              : "border-slate-200 focus:border-slate-400"
          }`}
          placeholder="Ex: Limpeza Geral"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
      </label>

      {slug && (
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-600">
            <strong>Slug:</strong> <code className="font-mono">{slug}</code>
          </p>
        </div>
      )}

      {error ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
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
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
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
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createProductAction } from "@/app/admin/products/actions";

type ProductFormProps = {
  categories: { id: string; name: string }[];
};

export function ProductForm({ categories }: ProductFormProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createProductAction(formData);
    setMessage(result.message);

    if (result.ok) {
      const form = document.getElementById("product-form") as HTMLFormElement | null;
      form?.reset();
    }
  }

  return (
    <form
      id="product-form"
      action={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Nome</span>
          <input
            name="name"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            placeholder="Ex.: Detergente Líquido"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input
            name="slug"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            placeholder="detergente-liquido"
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Imagem (URL)</span>
          <input
            name="imageUrl"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            placeholder="https://..."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Preço</span>
          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            placeholder="0,00"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Estoque</span>
          <input
            name="stockQuantity"
            type="number"
            step="1"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            placeholder="0"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Categoria</span>
          <select
            name="categoryId"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 md:col-span-2">
          <input name="isActive" type="checkbox" defaultChecked />
          <span className="text-sm font-medium text-slate-700">Produto ativo</span>
        </label>
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}

      <Button type="submit">Salvar produto</Button>
    </form>
  );
}
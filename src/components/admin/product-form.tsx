"use client";

import { useMemo, useState } from "react";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";

type ProductFormProps = {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (values: ProductFormData) => Promise<void> | void;
};

export function ProductForm({ initialValues, onSubmit }: ProductFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialValues?.name ?? "",
    slug: initialValues?.slug ?? "",
    imageUrl: initialValues?.imageUrl ?? null,
    price: initialValues?.price ?? 0,
    stockQuantity: initialValues?.stockQuantity ?? 0,
    isActive: initialValues?.isActive ?? true,
    categoryId: initialValues?.categoryId ?? "",
  });

  const previewSlug = useMemo(() => formData.slug, [formData.slug]);

  const handleChange = (
    field: keyof ProductFormData,
    value: string | number | boolean | null
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = productSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString();
        if (key) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Nome</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ex.: Detergente Líquido"
          />
          {errors.name ? <p className="text-sm text-rose-600">{errors.name}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            value={formData.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="detergente-liquido"
          />
          {errors.slug ? <p className="text-sm text-rose-600">{errors.slug}</p> : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Imagem (URL)</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            value={formData.imageUrl ?? ""}
            onChange={(e) =>
              handleChange("imageUrl", e.target.value ? e.target.value : null)
            }
            placeholder="https://..."
          />
          {errors.imageUrl ? <p className="text-sm text-rose-600">{errors.imageUrl}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Preço</span>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            value={formData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            placeholder="0,00"
          />
          {errors.price ? <p className="text-sm text-rose-600">{errors.price}</p> : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Estoque</span>
          <input
            type="number"
            step="1"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            value={formData.stockQuantity}
            onChange={(e) => handleChange("stockQuantity", Number(e.target.value))}
            placeholder="0"
          />
          {errors.stockQuantity ? (
            <p className="text-sm text-rose-600">{errors.stockQuantity}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Categoria ID</span>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
            value={formData.categoryId}
            onChange={(e) => handleChange("categoryId", e.target.value)}
            placeholder="cat-1"
          />
          {errors.categoryId ? (
            <p className="text-sm text-rose-600">{errors.categoryId}</p>
          ) : null}
        </label>

        <label className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
          <span className="text-sm font-medium text-slate-700">Produto ativo</span>
        </label>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">Slug atual: {previewSlug || "—"}</p>
        <Button type="submit">Salvar produto</Button>
      </div>
    </form>
  );
}
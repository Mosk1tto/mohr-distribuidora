"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
  selectedProduct: Product | null;
  onCancelEdit: () => void;
};

export function ProductForm({
  categories,
  selectedProduct,
  onCancelEdit,
}: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(selectedProduct?.name ?? "");
  const [slug, setSlug] = useState(selectedProduct?.slug ?? "");
  const [price, setPrice] = useState(String(selectedProduct?.price ?? ""));
  const [stockQuantity, setStockQuantity] = useState(
    String(selectedProduct?.stockQuantity ?? "")
  );
  const [categoryId, setCategoryId] = useState(selectedProduct?.categoryId ?? "");
  const [imageUrl, setImageUrl] = useState(selectedProduct?.imageUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(selectedProduct?.name ?? "");
    setSlug(selectedProduct?.slug ?? "");
    setPrice(String(selectedProduct?.price ?? ""));
    setStockQuantity(String(selectedProduct?.stockQuantity ?? ""));
    setCategoryId(selectedProduct?.categoryId ?? "");
    setImageUrl(selectedProduct?.imageUrl ?? "");
    setImageFile(null);
    setError(null);
  }, [selectedProduct]);

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return imageUrl || null;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Erro ao enviar imagem.");
      }

      const uploadedImageUrl = data.imageUrl as string;

      setImageUrl(uploadedImageUrl);
      return uploadedImageUrl;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const finalImageUrl = await uploadImage();

      const payload = {
        id: selectedProduct?.id,
        name,
        slug,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        categoryId,
        imageUrl: finalImageUrl,
      };

      const response = await fetch("/api/admin/products", {
        method: selectedProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Erro ao salvar produto.");
      }

      router.push("/admin/products");
      router.refresh();
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
          {selectedProduct ? "Editar produto" : "Novo produto"}
        </h2>

        {selectedProduct ? (
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
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Slug</span>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Preço</span>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Estoque</span>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Categoria</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Imagem</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2"
        />
      </label>

      {imageUrl ? (
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="mb-3 text-sm text-slate-500">Prévia atual</p>
          <img
            src={imageUrl}
            alt={name || "Prévia da imagem do produto"}
            className="h-40 w-40 rounded-xl object-cover"
          />
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={saving || uploadingImage}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {uploadingImage
          ? "Enviando imagem..."
          : saving
          ? "Salvando..."
          : "Salvar produto"}
      </button>
    </form>
  );
}
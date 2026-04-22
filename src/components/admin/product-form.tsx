"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/product";

type ProductFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
  selectedProduct: Product | null;
  onCancelEdit: () => void;
};

type FormErrors = {
  name?: string;
  price?: string;
  stockQuantity?: string;
  categoryId?: string;
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

export function ProductForm({
  categories,
  selectedProduct,
  onCancelEdit,
}: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState(selectedProduct?.name ?? "");
  const [slug, setSlug] = useState(selectedProduct?.slug ?? "");
  const [price, setPrice] = useState(String(selectedProduct?.price ?? ""));
  const [stockQuantity, setStockQuantity] = useState(
    String(selectedProduct?.stockQuantity ?? "")
  );
  const [categoryId, setCategoryId] = useState(selectedProduct?.categoryId ?? "");
  const [imageUrl, setImageUrl] = useState(selectedProduct?.imageUrl ?? "");
  const [description, setDescription] = useState(selectedProduct?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setName(selectedProduct?.name ?? "");
    setSlug(selectedProduct?.slug ?? "");
    setPrice(String(selectedProduct?.price ?? ""));
    setStockQuantity(String(selectedProduct?.stockQuantity ?? ""));
    setCategoryId(selectedProduct?.categoryId ?? "");
    setImageUrl(selectedProduct?.imageUrl ?? "");
    setDescription(selectedProduct?.description ?? "");
    setImageFile(null);
    setError(null);
    setSuccessMessage(null);
    setErrors({});
  }, [selectedProduct]);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
    if (errors.name) setErrors({ ...errors, name: undefined });
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Preço deve ser maior que 0";
    }

    if (!stockQuantity || Number(stockQuantity) < 0) {
      newErrors.stockQuantity = "Estoque não pode ser negativo";
    }

    if (!categoryId) {
      newErrors.categoryId = "Selecione uma categoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleUploadImageOnly() {
    if (!imageFile) {
      setError("Selecione uma imagem primeiro.");
      return;
    }

    if (!selectedProduct?.id) {
      setError("Nenhum produto selecionado.");
      return;
    }

    setUploadingImage(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Upload da imagem
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message ?? "Erro ao enviar imagem.");
      }

      const uploadedImageUrl = uploadData.imageUrl as string;
      setImageUrl(uploadedImageUrl);
      setImageFile(null);

      // 2. Atualizar APENAS a imagem no banco
      const updateResponse = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedProduct.id,
          name: selectedProduct.name,
          slug: selectedProduct.slug,
          price: selectedProduct.price,
          stockQuantity: selectedProduct.stockQuantity,
          categoryId: selectedProduct.categoryId,
          imageUrl: uploadedImageUrl,
        }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(updateData.message ?? "Erro ao salvar imagem.");
      }

      setSuccessMessage("Imagem atualizada com sucesso!");
      addToast("Imagem atualizada com sucesso!", "success", 2000);
      router.refresh();

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      setError(message);
      addToast(message, "error", 3000);
    } finally {
      setUploadingImage(false);
    }
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
      let finalImageUrl = imageUrl;

      // Se tem arquivo novo, faz upload antes
      if (imageFile) {
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

        finalImageUrl = data.imageUrl as string;
      }

      const payload = {
        id: selectedProduct?.id,
        name: name.trim(),
        slug: slug.trim(),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        categoryId,
        imageUrl: finalImageUrl,
        description: description.trim() || null,
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

      const message = selectedProduct
        ? "Produto atualizado com sucesso!"
        : "Produto criado com sucesso!";

      setSuccessMessage(message);
      addToast(message, "success", 2000);

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
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
          placeholder="Ex: Detergente Neutro"
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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Preço <span className="text-red-600">*</span>
          </span>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) setErrors({ ...errors, price: undefined });
            }}
            className={`w-full rounded-xl border px-4 py-2 outline-none transition ${
              errors.price
                ? "border-red-300 focus:border-red-400"
                : "border-slate-200 focus:border-slate-400"
            }`}
            aria-invalid={!!errors.price}
          />
          {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Estoque <span className="text-red-600">*</span>
          </span>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => {
              setStockQuantity(e.target.value);
              if (errors.stockQuantity)
                setErrors({ ...errors, stockQuantity: undefined });
            }}
            className={`w-full rounded-xl border px-4 py-2 outline-none transition ${
              errors.stockQuantity
                ? "border-red-300 focus:border-red-400"
                : "border-slate-200 focus:border-slate-400"
            }`}
            aria-invalid={!!errors.stockQuantity}
          />
          {errors.stockQuantity && (
            <p className="text-xs text-red-600">{errors.stockQuantity}</p>
          )}
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Categoria <span className="text-red-600">*</span>
        </span>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            if (errors.categoryId)
              setErrors({ ...errors, categoryId: undefined });
          }}
          className={`w-full rounded-xl border px-4 py-2 outline-none transition ${
            errors.categoryId
              ? "border-red-300 focus:border-red-400"
              : "border-slate-200 focus:border-slate-400"
          }`}
          aria-invalid={!!errors.categoryId}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-600">{errors.categoryId}</p>
        )}
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Descrição <span className="text-xs text-slate-500">(opcional)</span>
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Ex: Produto concentrado, rende até 100 lavagens..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400 resize-none"
        />
      </label>

      <div className="space-y-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Imagem <span className="text-xs text-slate-500">(opcional)</span>
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2"
          />
        </label>

        {selectedProduct && imageFile && (
          <button
            type="button"
            onClick={handleUploadImageOnly}
            disabled={uploadingImage}
            className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
          >
            {uploadingImage ? "Atualizando imagem..." : "Atualizar imagem"}
          </button>
        )}
      </div>

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
        disabled={saving || uploadingImage}
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {uploadingImage
          ? "Enviando imagem..."
          : saving
          ? "Salvando..."
          : selectedProduct
          ? "Atualizar produto"
          : "Criar produto"}
      </button>
    </form>
  );
}
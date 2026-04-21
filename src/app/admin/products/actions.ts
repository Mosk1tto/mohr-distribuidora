"use server";

import { revalidatePath } from "next/cache";
import { productSchema } from "@/lib/validations/product";
import { createClient } from "@/lib/supabase/server";

export async function createProductAction(formData: FormData) {
  const rawData = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    imageUrl: formData.get("imageUrl")
      ? String(formData.get("imageUrl"))
      : null,
    price: Number(formData.get("price") ?? 0),
    stockQuantity: Number(formData.get("stockQuantity") ?? 0),
    isActive: formData.get("isActive") === "on",
    categoryId: String(formData.get("categoryId") ?? ""),
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Dados inválidos.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("products").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    image_url: parsed.data.imageUrl,
    price: parsed.data.price,
    stock_quantity: parsed.data.stockQuantity,
    is_active: parsed.data.isActive ?? true,
    category_id: parsed.data.categoryId,
  });

  if (error) {
    console.error("Supabase insert error:", error);

    return {
      ok: false,
      message: `Erro ao salvar produto: ${error.message}`,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    ok: true,
    message: "Produto salvo com sucesso.",
  };
}

export async function updateProductAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  const rawData = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    imageUrl: formData.get("imageUrl")
      ? String(formData.get("imageUrl"))
      : null,
    price: Number(formData.get("price") ?? 0),
    stockQuantity: Number(formData.get("stockQuantity") ?? 0),
    isActive: formData.get("isActive") === "on",
    categoryId: String(formData.get("categoryId") ?? ""),
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success || !id) {
    return {
      ok: false,
      message: "Dados inválidos para atualização.",
      errors: parsed.success ? {} : parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      image_url: parsed.data.imageUrl,
      price: parsed.data.price,
      stock_quantity: parsed.data.stockQuantity,
      is_active: parsed.data.isActive ?? true,
      category_id: parsed.data.categoryId,
    })
    .eq("id", id);

  if (error) {
    console.error("Supabase update error:", error);

    return {
      ok: false,
      message: `Erro ao atualizar produto: ${error.message}`,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    ok: true,
    message: "Produto atualizado com sucesso.",
  };
}

export async function deleteProductAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return {
      ok: false,
      message: "ID do produto não informado.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);

    return {
      ok: false,
      message: `Erro ao excluir produto: ${error.message}`,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    ok: true,
    message: "Produto excluído com sucesso.",
  };
}
import { redirect } from "next/navigation";
import { AdminProductsView } from "@/components/admin/admin-products-view";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          `
            id,
            name,
            slug,
            image_url,
            price,
            stock_quantity,
            is_active,
            category_id,
            category:categories (
              id,
              name,
              slug
            )
          `
        )
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").order("name", { ascending: true }),
    ]);

  if (productsError || categoriesError) {
    throw new Error("Erro ao carregar dados do admin.");
  }

  const products: Product[] =
    productsData?.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.image_url,
      price: Number(product.price),
      stockQuantity: product.stock_quantity,
      isActive: product.is_active,
      categoryId: product.category_id,
      category: Array.isArray(product.category)
        ? product.category[0] ?? null
        : product.category,
    })) ?? [];

  const categories =
    categoriesData?.map((category) => ({
      id: category.id,
      name: category.name,
    })) ?? [];

  return <AdminProductsView products={products} categories={categories} />;
}
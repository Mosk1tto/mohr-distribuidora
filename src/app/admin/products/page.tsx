import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

type AdminProductsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  let productsQuery = supabase
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
    .order("created_at", { ascending: false });

  if (query) {
    productsQuery = productsQuery.ilike("name", `%${query}%`);
  }

  const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      productsQuery,
      supabase
        .from("categories")
        .select("id, name, slug, created_at")
        .order("name", { ascending: true }),
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

  const categories: Category[] =
    categoriesData?.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.created_at,
    })) ?? [];

  return (
    <AdminDashboard
      products={products}
      categories={categories}
      initialQuery={query}
    />
  );
}
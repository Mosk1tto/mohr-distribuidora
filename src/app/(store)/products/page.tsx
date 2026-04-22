import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { CatalogFilters } from "@/components/product/catalog-filters";
import type { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/server";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";

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
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (query) {
    productsQuery = productsQuery.ilike("name", `%${query}%`);
  }

  if (category) {
  const { data: categoryData } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category)
    .single();

  if (categoryData?.id) {
    productsQuery = productsQuery.eq("category_id", categoryData.id);
  }
}

  const [{ data, error }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      productsQuery,
      supabase.from("categories").select("id, name").order("name", { ascending: true }),
    ]);

  if (error || categoriesError) {
    throw new Error("Erro ao carregar produtos.");
  }

  const products: Product[] =
    data?.map((product) => ({
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
    categoriesData?.map((item) => ({
      id: item.id,
      name: item.name,
    })) ?? [];

  return (
    <main className="px-4 py-8 md:px-6 md:py-10">
      <Container className="space-y-6 px-0">
        <SectionTitle
          eyebrow="Catálogo"
          title="Produtos"
          description="Encontre os itens ideais para o seu pedido."
        />

        <CatalogFilters
          categories={categories}
          initialQuery={query}
          initialCategory={category}
        />

        <p className="text-sm text-slate-500">
          {products.length}{" "}
          {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          {query && <> para <strong>"{query}"</strong></>}
        </p>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-slate-600">
              Nenhum produto encontrado com os filtros informados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Button href="/cart" variant="secondary">
          Ver carrinho
        </Button>
      </Container>
    </main>
  );
}
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
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

  if (error) {
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

  return (
    <main className="px-6 py-10">
      <Container className="space-y-6 px-0">
        <SectionTitle
          eyebrow="Catálogo"
          title="Produtos"
          description="Aqui ficará o catálogo público da Mohr Distribuidora."
        />

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-slate-600">
              Nenhum produto ativo foi encontrado no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
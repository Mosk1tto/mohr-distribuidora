import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
    params: Promise<{ slug: string }>;
};

type ProductRow = {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    image_url: string | null;
    stock_quantity: number;
    is_active: boolean;
    description: string | null;
    category: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
        id,
        name,
        slug,
        price,
        image_url,
        stock_quantity,
        is_active,
        description,
        category:categories ( name, slug )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

    if (productError) {
    console.error("Erro ao buscar produto:", productError.message);
    }

    const typedProduct = product as unknown as ProductRow | null;
    if (!typedProduct) notFound();

    const categoryName = Array.isArray(typedProduct.category)
        ? typedProduct.category[0]?.name
        : typedProduct.category?.name;

    const categorySlug = Array.isArray(typedProduct.category)
        ? typedProduct.category[0]?.slug
        : typedProduct.category?.slug;

    const isOutOfStock = typedProduct.stock_quantity <= 0;
    const isLowStock = typedProduct.stock_quantity > 0 && typedProduct.stock_quantity < 5;

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="px-4 py-8 md:px-6">
                <div className="mx-auto max-w-5xl">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                        <Link href="/products" className="hover:text-slate-700 transition">
                            Produtos
                        </Link>
                        {categoryName && (
                            <>
                                <span>/</span>
                                <Link
                                    href={`/products?category=${categorySlug}`}
                                    className="hover:text-slate-700 transition"
                                >
                                    {categoryName}
                                </Link>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{typedProduct.name}</span>
                    </nav>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Imagem */}
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                            {typedProduct.image_url ? (
                                <img
                                    src={typedProduct.image_url}
                                    alt={typedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
                                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                                        <path d="M3 16l5-5 4 4 3-3 6 6" strokeWidth="1.5" strokeLinecap="round" />
                                        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                                    </svg>
                                    <span className="text-sm">Sem imagem</span>
                                </div>
                            )}

                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <span className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">
                                        Fora de estoque
                                    </span>
                                </div>
                            )}

                            {isLowStock && !isOutOfStock && (
                                <div className="absolute top-3 right-3 rounded-lg bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
                                    Estoque baixo
                                </div>
                            )}
                        </div>

                        {/* Informações */}
                        <div className="flex flex-col gap-4">
                            {categoryName && (
                                <Link
                                    href={`/products?category=${categorySlug}`}
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition w-fit"
                                >
                                    {categoryName}
                                </Link>
                            )}

                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                                {typedProduct.name}
                            </h1>

                            <p className="text-3xl font-bold text-emerald-600">
                                {formatCurrency(Number(typedProduct.price))}
                            </p>

                            {typedProduct.description && (
                                <p className="text-sm text-slate-600 leading-relaxed">
                                {typedProduct.description}
                                </p>
                            )}

                            <div className="text-sm text-slate-500">
                                {isOutOfStock ? (
                                    <span className="text-red-600 font-medium">Fora de estoque</span>
                                ) : isLowStock ? (
                                    <span className="text-amber-600 font-medium">
                                        Restam apenas {typedProduct.stock_quantity} unidades
                                    </span>
                                ) : (
                                    <span>Em estoque: {typedProduct.stock_quantity} unidades</span>
                                )}
                            </div>

                            <div className="pt-2">
                                {isOutOfStock ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-300 px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed"
                                    >
                                        Fora de estoque
                                    </button>
                                ) : (
                                    <AddToCartButton
                                        productId={typedProduct.id}
                                        productName={typedProduct.name}
                                    />
                                )}
                            </div>

                            <Link
                                href="/products"
                                className="text-sm text-slate-500 hover:text-slate-700 transition text-center"
                            >
                                ← Voltar ao catálogo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
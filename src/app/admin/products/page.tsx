"use client";

import { ProductForm } from "@/components/admin/product-form";

const mockProducts = [
  {
    id: "1",
    name: "Detergente Líquido",
    slug: "detergente-liquido",
    price: 7.9,
    stockQuantity: 24,
    isActive: true,
  },
  {
    id: "2",
    name: "Água Sanitária",
    slug: "agua-sanitaria",
    price: 12.5,
    stockQuantity: 18,
    isActive: true,
  },
  {
    id: "3",
    name: "Desinfetante",
    slug: "desinfetante",
    price: 9.99,
    stockQuantity: 12,
    isActive: false,
  },
];

export default function AdminProductsPage() {
  return (
    <main className="p-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Administração
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Produtos
            </h1>
            <p className="mt-2 text-slate-600">
              Cadastre, edite e remova produtos do catálogo.
            </p>
          </div>

          <ProductForm
            onSubmit={async (values) => {
              console.log("Salvar produto:", values);
            }}
          />
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Resumo rápido
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Total de produtos</span>
                <strong>{mockProducts.length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Ativos</span>
                <strong>{mockProducts.filter((p) => p.isActive).length}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Estoque total</span>
                <strong>
                  {mockProducts.reduce((sum, p) => sum + p.stockQuantity, 0)}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Produtos cadastrados
            </h2>

            <div className="mt-4 space-y-3">
              {mockProducts.map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500">{product.slug}</p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {product.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>R$ {product.price.toFixed(2).replace(".", ",")}</span>
                    <span>Estoque: {product.stockQuantity}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
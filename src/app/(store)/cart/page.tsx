import Link from "next/link";

export default function CartPage() {
  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Carrinho
          </h1>
          <p className="text-slate-600">
            Aqui o cliente verá os itens adicionados antes de finalizar pelo
            WhatsApp.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
          <p className="text-slate-600">
            Seu carrinho ainda está vazio nesta versão inicial.
          </p>

          <Link
            href="/products"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Ir para produtos
          </Link>
        </div>
      </section>
    </main>
  );
}
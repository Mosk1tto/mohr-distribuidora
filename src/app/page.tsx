export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          Projeto em construção
        </span>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Mohr Distribuidora
          </h1>
          <p className="max-w-2xl text-slate-600">
            E-commerce B2B/B2C de produtos de limpeza com catálogo público,
            carrinho, checkout via WhatsApp e painel administrativo.
          </p>
        </div>
      </section>
    </main>
  );
}
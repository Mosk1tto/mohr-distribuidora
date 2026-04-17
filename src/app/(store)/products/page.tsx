export default function ProductsPage() {
  return (
    <main className="px-6 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Produtos
          </h1>
          <p className="text-slate-600">
            Aqui ficará o catálogo público da Mohr Distribuidora.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Detergente Líquido
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Exemplo de card de produto para a estrutura inicial.
            </p>
            <p className="mt-4 font-medium text-emerald-700">R$ 7,90</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Água Sanitária
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Outro produto fictício para validar layout e espaçamento.
            </p>
            <p className="mt-4 font-medium text-emerald-700">R$ 12,50</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Desinfetante
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Depois estes cards virão do banco de dados.
            </p>
            <p className="mt-4 font-medium text-emerald-700">R$ 9,99</p>
          </article>
        </div>
      </section>
    </main>
  );
}
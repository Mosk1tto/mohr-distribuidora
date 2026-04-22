import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">

      <section
        style={{ background: "linear-gradient(135deg, rgb(34, 202, 158) 0%, #10d9a0 50%, #06b6d4 100%)" }}
        className="px-4 py-14 sm:py-20 text-white"
      >
        <Container className="flex flex-col items-center text-center gap-6">
          <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
            🧴 Revenda de Produtos de Limpeza
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
            Limpeza de qualidade para sua casa e negócio
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-xl">
            Produtos selecionados, preços justos e pedido fácil pelo WhatsApp. Conheça o catálogo da Mohr Distribuidora.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-base font-bold text-emerald-700 transition hover:bg-emerald-50 shadow-lg"
            >
              Ver catálogo completo
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Meu carrinho
            </Link>
          </div>
        </Container>
      </section>

      {/* Categorias */}
      <section className="px-4 py-12 sm:py-16 bg-slate-50">
        <Container className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Categorias
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Encontre o que precisa rapidinho
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { emoji: "🧹", label: "Limpeza Geral", slug: "limpeza-geral" },
              { emoji: "🪣", label: "Higiene", slug: "higiene" },
              { emoji: "🌸", label: "Perfumados", slug: "perfumados" },
              { emoji: "✨", label: "Ver tudo", slug: "" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug ? `/products?category=${cat.slug}` : "/products"}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-emerald-300 hover:shadow-md"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-semibold text-slate-700">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Produtos em destaque */}
      <section className="px-4 py-12 sm:py-16 bg-white">
        <Container className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Mais vendidos
              </h2>
              <p className="text-slate-500 text-sm">Os favoritos dos nossos clientes</p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition whitespace-nowrap"
            >
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: "Detergente Neutro", category: "Limpeza Geral", price: "R$ 4,99", emoji: "🍋" },
              { name: "Água Sanitária", category: "Limpeza Geral", price: "R$ 12,50", emoji: "💧" },
              { name: "Desinfetante", category: "Perfumados", price: "R$ 9,99", emoji: "🌸" },
              { name: "Sabão em Pó", category: "Limpeza Geral", price: "R$ 18,90", emoji: "✨" },
            ].map((product) => (
              <Link
                key={product.name}
                href="/products"
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden transition hover:shadow-md hover:border-emerald-200"
              >
                <div className="flex items-center justify-center bg-slate-50 aspect-square text-5xl group-hover:bg-emerald-50 transition">
                  {product.emoji}
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate-400">{product.category}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-emerald-600 mt-1">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefícios */}
      <section className="px-4 py-12 sm:py-16 bg-slate-50">
        <Container className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            Por que comprar aqui?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                emoji: "💬",
                title: "Pedido pelo WhatsApp",
                desc: "Simples, rápido e sem complicação. Finalize seu pedido direto no WhatsApp.",
              },
              {
                emoji: "📦",
                title: "Produtos selecionados",
                desc: "Trabalhamos só com marcas de qualidade para garantir a melhor experiência.",
              },
              {
                emoji: "💰",
                title: "Preços justos",
                desc: "Preços competitivos para pessoa física e jurídica.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-3 rounded-2xl bg-white border border-slate-200 p-6"
              >
                <span className="text-4xl">{item.emoji}</span>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section
        style={{ background: "linear-gradient(135deg, #1e40af 0%, #0a9e76 100%)" }}
        className="px-4 py-14 sm:py-20 text-white"
      >
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold max-w-xl">
            Pronto para fazer seu pedido?
          </h2>
          <p className="text-white/90 max-w-lg text-sm sm:text-base">
            Navegue pelo catálogo, adicione ao carrinho e finalize pelo WhatsApp em segundos.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-base font-bold text-emerald-700 transition hover:bg-emerald-50 shadow-lg"
          >
            Explorar catálogo
          </Link>
        </Container>
      </section>

    </main>
  );
}
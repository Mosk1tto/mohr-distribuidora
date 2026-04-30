import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  MessageCircle,
  Package,
  ShieldCheck,
  SprayCan,
  Droplets,
  Shield,
  Home,
  Heart,
  BrushCleaning,
  ShoppingBasket,
} from "lucide-react";

type FeaturedProduct = {
  id: string;
  name: string;
  price: number | string;
  image_url: string | null;
  slug: string;
  category: { name: string } | { name: string }[] | null;
};

function getCategoryIcon(slug?: string, name?: string) {
  const key = `${slug ?? ""} ${name ?? ""}`.toLowerCase();

  if (key.includes("desinf") || key.includes("bacter")) {
    return <Shield size={22} className="text-[#426b52]" />;
  }

  if (key.includes("deterg") || key.includes("lava") || key.includes("sab")) {
    return <Droplets size={22} className="text-[#426b52]" />;
  }

  if (
    key.includes("limpeza pesada") ||
    key.includes("multiuso") ||
    key.includes("removedor")
  ) {
    return <SprayCan size={22} className="text-[#426b52]" />;
  }

  if (
    key.includes("casa") ||
    key.includes("cozinha") ||
    key.includes("banheiro")
  ) {
    return <Home size={22} className="text-[#426b52]" />;
  }

  if (
    key.includes("vassoura") ||
    key.includes("rodo") ||
    key.includes("escova")
  ) {
    return <BrushCleaning size={22} className="text-[#426b52]" />;
  }

  if (
    key.includes("mercado") ||
    key.includes("utilidade") ||
    key.includes("geral")
  ) {
    return <ShoppingBasket size={22} className="text-[#426b52]" />;
  }

  return <Package size={22} className="text-[#426b52]" />;
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categoriesData }, { data: featuredData }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, emoji")
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select(`id, name, price, image_url, slug, category:categories ( name )`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const categories = categoriesData ?? [];
  const featuredProducts = (featuredData ?? []) as FeaturedProduct[];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#fafaf8" }}>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="overflow-hidden py-10 sm:py-16"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="mx-auto max-w-screen-xl flex flex-col lg:flex-row items-center gap-10 px-4 sm:px-8 lg:pl-16 lg:pr-0">
          {/* Texto — esquerda */}
          <div className="flex-1 space-y-6 text-center lg:text-left shrink-0">
            <FadeIn direction="up">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-700"
                style={{ backgroundColor: "#d1fae5" }}
              >
                <Heart
                  size={12}
                  className="fill-emerald-500 text-emerald-500"
                />
                Bem-vindo à Mohr Distribuidora
              </span>
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Tudo em{" "}
                <span className="relative inline-block">
                  <span className="relative z-10" style={{ color: "var(--brand)" }}>
                    higiene e limpeza,
                  </span>
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M2 6 Q50 2 100 5 Q150 8 198 4"
                      stroke="var(--brand)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                a uma mensagem de distância
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                Navegue pelo catálogo, escolha o que precisar e finalize seu
                pedido direto no WhatsApp.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "var(--brand)", transition: "var(--transition-ui)" }}
                >
                  Ver produtos
                  <ArrowRight size={16} />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Imagem — direita */}
          <FadeIn
            direction="left"
            delay={0.15}
            className="w-full lg:w-[48%] shrink-0"
          >
            <Image
              src="/prateleira.webp"
              alt="Prateleira com produtos de limpeza organizados"
              width={1600}
              height={1200}
              priority
              className="w-full h-auto"
            />
          </FadeIn>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────── */}
      <section className="px-4 py-16 bg-white">
        <Container className="space-y-10">
          <FadeIn direction="up">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Como fazer seu pedido?
              </h2>
              <p className="text-slate-500">É simples assim 👇</p>
            </div>
          </FadeIn>

          <div className="flex flex-col sm:flex-row items-start gap-0">
            {[
              {
                step: "01",
                icon: <Package size={20} />,
                title: "Escolha os produtos",
                desc: "Navegue pelo catálogo e adicione o que precisar ao carrinho.",
              },
              {
                step: "02",
                icon: <ShieldCheck size={20} />,
                title: "Revise seu pedido",
                desc: "Confira os itens e informe seu nome e telefone.",
              },
              {
                step: "03",
                icon: <MessageCircle size={20} />,
                title: "Finalize no WhatsApp",
                desc: "Com um clique, seu pedido vai direto para nosso WhatsApp.",
              },
            ].map((item, i, arr) => (
              <FadeIn
                key={item.step}
                direction="up"
                delay={i * 0.15}
                className="flex-1"
              >
                <div className="flex flex-col gap-4 p-6">
                  {/* Número + linha conectora */}
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold text-xs tracking-widest"
                      style={{
                        color: "var(--brand)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {item.step}
                    </span>
                    {i < arr.length - 1 && (
                      <div
                        className="hidden sm:block h-px flex-1"
                        style={{
                          background:
                            "linear-gradient(to right, var(--brand-muted), transparent)",
                        }}
                      />
                    )}
                  </div>
                  {/* Ícone sem fundo colorido */}
                  <div style={{ color: "var(--brand)" }}>{item.icon}</div>
                  {/* Texto */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1 text-sm">
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CATEGORIAS ────────────────────────────────────── */}
      <section className="px-4 py-16" style={{ backgroundColor: "#f0fdf6" }}>
        <Container className="space-y-10">
          <FadeIn direction="up">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                O que você procura?
              </h2>
              <p className="text-slate-500 text-sm">
                Clique em uma categoria para ver os produtos
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <FadeIn key={cat.id} direction="up" delay={i * 0.07}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-start gap-3 rounded-xl border bg-white p-5 transition hover:shadow-md hover:-translate-y-0.5 duration-200"
                  style={{ borderColor: "#d1fae5" }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef3ec]">
                    {getCategoryIcon(cat.slug, cat.name)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition">
                    {cat.name}
                  </span>
                </Link>
              </FadeIn>
            ))}
            <FadeIn direction="up" delay={categories.length * 0.07}>
              <Link
                href="/products"
                className="group flex flex-col items-start gap-3 rounded-xl border border-dashed bg-white p-5 transition hover:shadow-md hover:-translate-y-0.5 duration-200"
                style={{ borderColor: "#6ee7b7" }}
              >
                <Package
                  size={22}
                  className="text-slate-400 group-hover:text-emerald-500 transition"
                />
                <span className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition">
                  Ver tudo →
                </span>
              </Link>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* ── PRODUTOS EM DESTAQUE ──────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-white px-4 py-16">
          <Container className="space-y-10">
            <FadeIn direction="up">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Destaque da semana
                  </h2>
                  <p className="text-sm text-slate-500">
                    Seleção especial para você
                  </p>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
                >
                  Ver todos <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {featuredProducts.map((product, i) => {
                const categoryName = Array.isArray(product.category)
                  ? product.category[0]?.name
                  : product.category?.name;

                return (
                  <FadeIn key={product.id} direction="up" delay={i * 0.12}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group flex flex-col rounded-xl border overflow-hidden bg-white transition hover:shadow-lg hover:-translate-y-1 duration-300"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <div
                        className="relative aspect-square overflow-hidden"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition group-hover:scale-105 duration-500"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package size={48} className="text-slate-200" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1">
                        <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                          {categoryName ?? "Sem categoria"}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 leading-snug">
                          {product.name}
                        </p>
                        <p className="text-base font-bold text-emerald-600 mt-1">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(product.price))}
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>

            <div className="sm:hidden text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600"
              >
                Ver todos os produtos <ArrowRight size={14} />
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section
        className="grain-overlay relative overflow-hidden px-4 py-20 text-white"
        style={{ backgroundColor: "#064e3b" }}
      >
        <Container className="relative z-10">
          <FadeIn direction="up">
            <div className="flex flex-col items-center text-center gap-6 max-w-xl mx-auto">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
                className="text-emerald-300"
                style={{ animation: "draw-check 0.6s ease forwards" }}
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="126"
                  strokeDashoffset="0"
                  opacity="0.3"
                />
                <path
                  d="M14 24l7 7 13-14"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="30"
                  strokeDashoffset="30"
                  style={{
                    animation: "draw-check-path 0.5s 0.2s ease forwards",
                  }}
                />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                Seu pedido está a um clique de distância
              </h2>
              <p className="text-emerald-100 text-base leading-relaxed">
                Sem cadastro, sem complicação. Escolha, adicione ao carrinho e
                finalize direto no WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 shadow-lg active:scale-95"
                >
                  Ver catálogo
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/5546999218016"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-95"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}

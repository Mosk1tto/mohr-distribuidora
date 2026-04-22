"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { CartProduct } from "@/types/cart";
import { formatCurrency } from "@/lib/utils/currency";

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem, clearCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
  }>({});
  const [showDetails, setShowDetails] = useState(true);

  const cartIds = useMemo(() => items.map((item) => item.productId), [items]);

  useEffect(() => {
    async function loadCartProducts() {
      if (cartIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch("/api/whatsapp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            mode: "cart",
          }),
        });

        const data = await response.json();
        setProducts(data.items ?? []);
      } catch {
        addToast("Erro ao carregar o carrinho. Tente novamente.", "error", 4000);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadCartProducts();
  }, [items, cartIds.length]);

  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  function validateForm(): boolean {
    const newErrors: typeof errors = {};

    if (!customerName.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (customerName.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!customerPhone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (customerPhone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCheckout() {
    if (!validateForm()) {
      addToast("Corrija os erros abaixo", "error", 3000);
      return;
    }

    setCheckoutError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          mode: "checkout",
          customerName,
          customerPhone,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Não foi possível finalizar o pedido.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao finalizar pedido";
      setCheckoutError(message);
      addToast(message, "error", 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClearCart() {
    if (
      window.confirm(
        "Tem certeza que deseja limpar o carrinho? Esta ação não pode ser desfeita."
      )
    ) {
      clearCart();
      addToast("Carrinho limpo", "info", 2000);
      setTimeout(() => router.push("/"), 800);
    }
  }

  function handleRemoveItem(productId: string, productName: string) {
    removeItem(productId);
    addToast(`${productName} removido do carrinho`, "info", 1500);
  }

  // Se carrinho vazio
  if (!loading && products.length === 0) {
    return (
      <main className="px-4 py-12 md:px-6">
        <div className="mx-auto max-w-2xl flex flex-col items-center justify-center gap-6 text-center min-h-[60vh]">
          <div className="text-5xl">🛒</div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Carrinho vazio</h1>
            <p className="text-slate-600 mt-2">
              Adicione produtos ao carrinho para começar seu pedido
            </p>
          </div>
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Explorar catálogo
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      {/* Sticky Summary (Mobile) */}
      <div className="sticky top-0 z-10 md:hidden bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Subtotal</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(subtotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="text-xs font-medium text-slate-600 px-3 py-1 rounded-lg bg-slate-100 transition hover:bg-slate-200"
          >
            {showDetails ? "Ocultar" : "Mostrar"} itens
          </button>
        </div>
      </div>

      <div className="px-4 py-8 md:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Cabeçalho */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Carrinho
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              Seu pedido
            </h1>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-slate-600">Carregando carrinho...</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Itens + Formulário */}
              <div className="lg:col-span-2 space-y-6">
                {/* Produtos */}
                {showDetails !== false && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-slate-900 md:block hidden">
                      Itens do pedido
                    </h2>
                    <div className="space-y-3">
                      {products.map((item) => (
                        <article
                          key={item.productId}
                          className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                        >
                          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                📦
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-base font-semibold text-slate-900 leading-tight">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {item.categoryName ?? "Sem categoria"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.productId, item.name)}
                                className="text-xs font-medium text-rose-600 transition hover:text-rose-700 whitespace-nowrap"
                              >
                                Remover
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                              <span>{formatCurrency(item.price)} cada</span>
                              <span className="font-semibold text-slate-900">
                                {formatCurrency(item.price * item.quantity)} total
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => decreaseItem(item.productId)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm transition hover:bg-slate-50"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => addItem(item.productId)}
                              disabled={item.quantity >= item.stockQuantity}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulário */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Seus dados
                  </h2>

                  <div className="space-y-4">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">
                        Nome <span className="text-red-600">*</span>
                      </span>
                      <input
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition ${
                          errors.name
                            ? "border-red-300 focus:border-red-400"
                            : "border-slate-200 focus:border-slate-400"
                        }`}
                        placeholder="Seu nome"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600">{errors.name}</p>
                      )}
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">
                        Telefone <span className="text-red-600">*</span>
                      </span>
                      <input
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        className={`w-full rounded-xl border px-4 py-2 text-sm outline-none transition ${
                          errors.phone
                            ? "border-red-300 focus:border-red-400"
                            : "border-slate-200 focus:border-slate-400"
                        }`}
                        placeholder="(49) 99999-9999"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-600">{errors.phone}</p>
                      )}
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">
                        Observações <span className="text-xs text-slate-500">(opcional)</span>
                      </span>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ex.: entrega pela manhã, retirar no balcão, etc."
                      />
                    </label>
                  </div>
                </section>
              </div>

              {/* Resumo + CTA (Sidebar em desktop) */}
              <div className="hidden lg:flex flex-col gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sticky top-20">
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
                    Resumo do pedido
                  </h3>

                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-base font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {checkoutError ? (
                    <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3">
                      <p className="text-xs text-red-600">{checkoutError}</p>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            style={{
                              display: "inline-block",
                              width: "12px",
                              height: "12px",
                              border: "2px solid rgba(255,255,255,0.3)",
                              borderTop: "2px solid white",
                              borderRadius: "50%",
                              animation: "spin 0.6s linear infinite",
                            }}
                          />
                          Abrindo WhatsApp...
                        </>
                      ) : (
                        "Finalizar no WhatsApp"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Mobile (Footer) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3">
            <div className="mx-auto max-w-5xl space-y-2">
              {checkoutError ? (
                <div className="rounded-lg border border-red-300 bg-red-50 p-2">
                  <p className="text-xs text-red-600">{checkoutError}</p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: "12px",
                        height: "12px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                    Abrindo WhatsApp...
                  </>
                ) : (
                  `Finalizar • ${formatCurrency(total)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
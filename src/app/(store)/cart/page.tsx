"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import type { CartProduct } from "@/types/cart";
import { formatCurrency } from "@/lib/utils/currency";

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const cartIds = useMemo(() => items.map((item) => item.productId), [items]);

  useEffect(() => {
    async function loadCartProducts() {
      if (cartIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

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
      setLoading(false);
    }

    loadCartProducts();
  }, [items, cartIds.length]);

  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    setCheckoutError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setCheckoutError("Preencha nome e telefone antes de finalizar.");
      return;
    }

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
      setCheckoutError(data.message ?? "Não foi possível finalizar o pedido.");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Carrinho
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Seu pedido
          </h1>
          <p className="mt-2 text-slate-600">
            Revise os itens e informe seus dados para finalizar no WhatsApp.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">Carregando carrinho...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-slate-600">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {products.map((item) => (
                <article
                  key={item.productId}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {item.categoryName ?? "Sem categoria"}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Unitário: {formatCurrency(item.price)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Subtotal: {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
                    >
                      Remover
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseItem(item.productId)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-lg"
                    >
                      -
                    </button>

                    <span className="min-w-8 text-center font-medium text-slate-900">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => addItem(item.productId)}
                      disabled={item.quantity >= item.stockQuantity}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      +
                    </button>

                    <span className="ml-2 text-sm text-slate-500">
                      Estoque disponível: {item.stockQuantity}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Seus dados
              </h2>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Nome</span>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
                    placeholder="Seu nome"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Telefone</span>
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
                    placeholder="(49) 99999-9999"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Observações
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-slate-400"
                    placeholder="Ex.: entrega pela manhã, retirar no balcão, etc."
                  />
                </label>
              </div>
            </section>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-base text-slate-600">Total</span>
                <strong className="text-xl text-slate-900">
                  {formatCurrency(total)}
                </strong>
              </div>

              {checkoutError ? (
                <p className="mt-4 text-sm text-rose-600">{checkoutError}</p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Finalizar no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar carrinho
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
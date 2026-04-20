"use client";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const whatsappMessage = buildWhatsAppMessage(cart.items, cart.totalPrice);
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  return (
    <main className="px-6 py-10">
      <Container className="space-y-6 px-0">
        <SectionTitle
          eyebrow="Checkout"
          title="Carrinho"
          description="Aqui o cliente vê os itens antes de finalizar pelo WhatsApp."
        />

        {cart.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-slate-600">
              Seu carrinho ainda está vazio nesta versão inicial.
            </p>

            <div className="mt-4">
              <Button href="/products">Ir para produtos</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <article
                  key={item.productId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="text-sm font-medium text-rose-600"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remover
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-1 text-sm"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span className="min-w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-1 text-sm"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total de itens</span>
                <span className="font-medium">{cart.totalItems}</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-600">Total</span>
                <span className="text-lg font-bold text-emerald-700">
                  R$ {cart.totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/products" variant="secondary">
                  Continuar comprando
                </Button>

                <Button onClick={clearCart}>Limpar carrinho</Button>

                <Button
                  href={whatsappUrl}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Finalizar no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
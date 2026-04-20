import type { CartItem } from "@/types/cart";
import { siteConfig } from "@/lib/constants/site";

export function formatCurrencyBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function buildWhatsAppMessage(items: CartItem[], totalPrice: number) {
  const lines = [
    "Olá! Gostaria de finalizar meu pedido.",
    "",
    "Itens:",
    ...items.map(
      (item) =>
        `- ${item.name} x${item.quantity} — ${formatCurrencyBRL(
          item.price * item.quantity
        )}`
    ),
    "",
    `Total: ${formatCurrencyBRL(totalPrice)}`,
  ];

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string) {
  const phone = siteConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
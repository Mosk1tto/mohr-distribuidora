import { formatCurrency } from "@/lib/utils/currency";
import type { CartProduct } from "@/types/cart";

type CustomerCheckoutData = {
  customerName: string;
  customerPhone: string;
  notes?: string;
};

export function buildWhatsAppMessage(
  items: CartProduct[],
  customer: CustomerCheckoutData
) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const lines = [
    "Olá! Gostaria de fazer um pedido.",
    "",
    `Nome: ${customer.customerName}`,
    `Telefone: ${customer.customerPhone}`,
    customer.notes?.trim() ? `Observações: ${customer.notes.trim()}` : null,
    "",
    "Itens do pedido:",
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.name} | Qtd: ${item.quantity} | Unitário: ${formatCurrency(
          item.price
        )} | Subtotal: ${formatCurrency(item.price * item.quantity)}`
    ),
    "",
    `Total: ${formatCurrency(total)}`,
  ];

  return lines.filter(Boolean).join("\n");
}
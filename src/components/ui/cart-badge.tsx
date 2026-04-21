"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export function CartBadge() {
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
    >
      Carrinho
      {totalItems > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
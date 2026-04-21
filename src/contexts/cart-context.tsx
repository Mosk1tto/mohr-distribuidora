"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/cart";

type CartContextType = {
  items: CartItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "mohr-distribuidora-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) return;

    try {
      const parsed = JSON.parse(storedCart) as CartItem[];
      setItems(parsed);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(productId: string) {
    setItems((current) => {
      const existingItem = current.find((item) => item.productId === productId);

      if (existingItem) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
  }

  function decreaseItem(productId: string) {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function getQuantity(productId: string) {
    return items.find((item) => item.productId === productId)?.quantity ?? 0;
  }

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      decreaseItem,
      clearCart,
      getQuantity,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
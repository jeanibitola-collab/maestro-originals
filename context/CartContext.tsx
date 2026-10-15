"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

const MAX_QTY = 20; // keep in step with the limit in the payment route

export type CartItem = Product & { quantity: number; size: string; key: string };

type CartContextType = {
  items: CartItem[];
  addItem: (p: Product, size: string) => void;
  increaseItem: (key: string) => void;
  decreaseItem: (key: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      if (Array.isArray(saved)) {
        // Older carts had no sizes, so only keep items that have one
        setItems(
          saved.filter((i) => i && typeof i.size === "string" && typeof i.key === "string")
        );
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  const addItem = (p: Product, size: string) =>
    setItems((prev) => {
      const key = `${p.id}-${size}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) } : i
        );
      }
      return [...prev, { ...p, size, key, quantity: 1 }];
    });

  const increaseItem = (key: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) } : i
      )
    );

  const decreaseItem = (key: string) =>
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );

  const removeItem = (key: string) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, increaseItem, decreaseItem, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
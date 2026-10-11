"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

type CartItem = Product & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addItem: (p: Product) => void;
  removeItem: (id: number) => void;
  total: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load the saved cart once when the app starts
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Save the cart whenever it changes (but only after loading)
  useEffect(() => {
    if (loaded) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, loaded]);

  const addItem = (p: Product) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        return prev.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...p, quantity: 1 }];
    });

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
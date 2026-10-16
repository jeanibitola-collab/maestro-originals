"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

type ProductsContextType = {
  products: Product[];
  ready: boolean; // true once the first load has finished
  failed: boolean; // true if the products couldn't be loaded
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Bad response"))))
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products ?? []);
        setReady(true);
      })
      .catch((e) => {
        console.error("Could not load products", e);
        if (cancelled) return;
        setFailed(true);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, ready, failed }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
}
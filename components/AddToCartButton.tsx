"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Add to cart
    </button>
  );
}
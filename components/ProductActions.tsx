"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function onAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--background)] p-3 md:static md:border-0 md:bg-transparent md:p-0">
      <div className="mx-auto flex max-w-7xl gap-3">
        <button
          onClick={onAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 font-semibold text-white transition-colors hover:bg-orange-500"
        >
          <FaCartShopping />
          {added ? "Added to cart ✓" : "Add to cart"}
        </button>
        {added && (
          <Link
            href="/cart"
            className="flex items-center rounded-lg border px-5 font-semibold"
          >
            View cart
          </Link>
        )}
      </div>
    </div>
  );
}
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";
import { SIZE_LABEL, getSizes } from "@/data/sizes";
import type { Product } from "@/data/products";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const sizes = getSizes(product);
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  function onAdd() {
    if (!size) {
      setNeedSize(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addItem(product, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      {/* Size picker */}
      <div ref={sizeRef} className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold">Select size ({SIZE_LABEL})</p>
          {size && (
            <p className="text-sm opacity-70">
              Selected: {SIZE_LABEL} {size}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => {
                setSize(s);
                setNeedSize(false);
              }}
              className={`min-w-12 rounded-lg border px-4 py-2 font-medium transition-colors ${
                size === s
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "hover:bg-gray-500/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {needSize && <p className="mt-2 text-sm text-red-500">Please choose a size first.</p>}
      </div>

      {/* Add to cart: fixed to the bottom on phones */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--background)] p-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
        <div className="mx-auto flex max-w-7xl gap-3">
          <button
            onClick={onAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 py-3 font-semibold text-white transition-colors hover:bg-orange-500"
          >
            <FaCartShopping />
            {added ? "Added to cart ✓" : "Add to cart"}
          </button>
          {added && (
            <Link href="/cart" className="flex items-center rounded-lg border px-5 font-semibold">
              View cart
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
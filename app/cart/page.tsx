"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegTrashCan, FaPhone, FaPlus, FaMinus } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import type { Product } from "@/data/products";
import ProductRow from "@/components/ProductRow";

// Replace with your real phone number
const PHONE = "+234 812 298 7435";

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem, total } = useCart();
  const [recentIds, setRecentIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      setRecentIds(JSON.parse(localStorage.getItem("recent") || "[]"));
    } catch {}
  }, []);

  const count = items.reduce((n, i) => n + i.quantity, 0);

  const recent = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  const alsoViewed = products
    .filter((p) => !items.some((i) => i.id === p.id))
    .slice(0, 8);

  const label =
    "bg-gray-500/10 px-4 py-3 text-sm font-semibold uppercase opacity-80";

  return (
    <main className="mx-auto max-w-3xl pb-12">
      {items.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <h1 className="mb-2 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mb-6 opacity-70">Browse our shoes and add your favorites.</p>
          <Link
            href="/shoes"
            className="rounded-full bg-orange-600 px-6 py-3 font-medium text-white"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <h2 className={label}>Cart summary</h2>
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-lg font-semibold">Subtotal</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>

          <h2 className={label}>Cart ({count})</h2>

          {items.map((i) => {
            const discount = i.oldPrice
              ? Math.round((1 - i.price / i.oldPrice) * 100)
              : 0;
            return (
              <div key={i.id} className="border-b px-4 py-4">
                <div className="flex gap-4">
                  <Link href={`/products/${i.id}`} className="relative h-28 w-28 shrink-0">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    {discount > 0 && (
                      <span className="absolute right-1 top-1 rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                        -{discount}%
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${i.id}`}
                      className="line-clamp-2 text-sm font-medium"
                    >
                      {i.name}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-baseline gap-2">
                      <span className="text-xl font-bold">${i.price.toFixed(2)}</span>
                      {i.oldPrice && (
                        <span className="text-sm line-through opacity-60">
                          ${i.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Handmade by Maestro Originals
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => removeItem(i.id)}
                    className="flex items-center gap-2 font-medium text-orange-600"
                  >
                    <FaRegTrashCan /> Remove
                  </button>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decreaseItem(i.id)}
                      disabled={i.quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/30 disabled:opacity-40"
                    >
                      <FaMinus />
                    </button>
                    <span className="w-6 text-center font-medium">{i.quantity}</span>
                    <button
                      onClick={() => addItem(i)}
                      aria-label="Increase quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white shadow"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 px-4 py-5">
            <a
              href={`tel:${PHONE}`}
              aria-label="Call us"
              className="flex h-14 w-16 items-center justify-center rounded-lg border-2 border-orange-600 text-orange-600"
            >
              <FaPhone />
            </a>
            <Link
         href="/checkout"
         className="flex flex-1 items-center justify-center rounded-lg bg-orange-600 text-lg font-semibold text-white transition-colors hover:bg-orange-500"
>
         Checkout (${total.toFixed(2)})
            </Link>
          </div>
        </>
      )}

      <ProductRow title="Recently viewed" items={recent} />
      <ProductRow title="Customers also viewed" items={alsoViewed} />
    </main>
  );
}
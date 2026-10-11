"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";

const filters = [
  { label: "All", value: "all" },
  { label: "Shoes", value: "shoes" },
  { label: "Sandals", value: "sandals" },
  { label: "Slides", value: "slides" },
];

export default function WomenPage() {
  const [active, setActive] = useState("all");

  const items = products.filter(
    (p) => p.category === "women" && (active === "all" || p.type === active)
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Centered title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-serif">Women</h1>
        <p className="mt-2 opacity-70">Handmade shoes for her</p>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              active === f.value
                ? "border-orange-600 bg-orange-600 text-white"
                : "hover:bg-gray-500/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {items.length === 0 ? (
        <p className="opacity-70">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
          {items.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="relative">
             <FavoriteButton id={p.id} />
            <img
                 src={p.image}
                 alt={p.name}
            className="aspect-square w-full rounded-lg object-cover transition-opacity group-hover:opacity-90" />
            </div>
              <h2 className="mt-3 truncate text-sm font-medium">{p.name}</h2>
              <p className="font-semibold">${p.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
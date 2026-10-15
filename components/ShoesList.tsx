"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";
import { formatPrice } from "@/lib/format";

const groups = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
];

export default function ShoesList() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase().trim();
  const type = params.get("type");
  const [group, setGroup] = useState(params.get("category") ?? "all");

  const items = products.filter(
    (p) =>
      (group === "all" || p.category === group) &&
      (!type || p.type === type) &&
      (!q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q))
  );

  const title = q
    ? `Results for “${q}”`
    : type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "All shoes";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
        {(q || type) && (
          <Link href="/shoes" className="mt-2 inline-block text-sm underline">
            Clear filters
          </Link>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {groups.map((g) => (
          <button
            key={g.value}
            onClick={() => setGroup(g.value)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
              group === g.value
                ? "border-orange-600 bg-orange-600 text-white"
                : "hover:bg-gray-500/20"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="opacity-70">No shoes found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="relative">
                <FavoriteButton id={p.id} />
                <img
                  src={p.image}
                  alt={p.name}
                  className="aspect-square w-full rounded-lg object-cover transition-opacity group-hover:opacity-90"
                />
              </div>
              <h2 className="mt-3 truncate text-sm font-medium">{p.name}</h2>
              <p className="font-semibold">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
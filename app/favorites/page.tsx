"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";
import { formatPrice } from "@/lib/format";

export default function FavoritesPage() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      setIds(JSON.parse(localStorage.getItem("favorites") || "[]"));
    } catch {}
  }, []);

  const items = products.filter((p) => ids.includes(p.id));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-center font-serif text-4xl md:text-5xl">Favorites</h1>

      {items.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 opacity-70">You haven't saved any shoes yet.</p>
          <Link href="/shoes" className="rounded-full bg-orange-600 px-6 py-3 font-medium text-white">
            Browse shoes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="relative">
                <FavoriteButton id={p.id} />
                <img
                  src={p.image}
                  alt={p.name}
                  className="aspect-square w-full rounded-lg object-cover"
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
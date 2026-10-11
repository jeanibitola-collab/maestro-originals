import Link from "next/link";
import type { Product } from "@/data/products";

export default function ProductGrid({
  title,
  items,
}: {
  title: string;
  items: Product[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link href="/shoes" className="text-sm underline">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group relative border rounded-lg p-3 transition-shadow hover:shadow-lg"
          >
            <span className="absolute top-5 left-5 z-10 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
              Handmade
            </span>
            <span className="absolute top-5 right-5 z-10 text-xl" aria-hidden>
              ♡
            </span>
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-56 object-cover rounded transition-opacity group-hover:opacity-90"
            />
            <h3 className="mt-3 font-semibold">{p.name}</h3>
            <p className="font-medium">${p.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
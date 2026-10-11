import Link from "next/link";
import type { Product } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";

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
    className="group border rounded-lg p-3 transition-shadow hover:shadow-lg"
  >
    <div className="relative">
      <span className="absolute left-2 top-2 z-10 rounded-full bg-orange-600 px-2 py-1 text-xs text-white">
        Handmade
      </span>
      <FavoriteButton id={p.id} />
      <img
        src={p.image}
        alt={p.name}
        className="h-56 w-full rounded object-cover transition-opacity group-hover:opacity-90"
      />
    </div>
    <h3 className="mt-3 font-semibold">{p.name}</h3>
    <p className="font-medium">${p.price.toFixed(2)}</p>
  </Link>
))}
      </div>
    </section>
  );
}
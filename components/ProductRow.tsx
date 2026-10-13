import Link from "next/link";
import type { Product } from "@/data/products";

export default function ProductRow({
  title,
  items,
}: {
  title: string;
  items: Product[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-6 border-t py-6">
      <h2 className="mb-4 px-4 text-xl font-semibold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2">
        {items.map((p) => {
          const discount = p.oldPrice
            ? Math.round((1 - p.price / p.oldPrice) * 100)
            : 0;
          return (
            <Link key={p.id} href={`/products/${p.id}`} className="w-40 shrink-0 md:w-48">
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="aspect-square w-full rounded-lg object-cover"
                />
                {discount > 0 && (
                  <span className="absolute right-2 top-2 rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                    -{discount}%
                  </span>
                )}
              </div>
              <p className="mt-2 truncate text-sm">{p.name}</p>
              <p className="font-bold">${p.price.toFixed(2)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductActions from "@/components/ProductActions";
import FavoriteButton from "@/components/FavoriteButton";
import ProductGrid from "@/components/ProductGrid";

async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  // Related shoes: same category first, same type first within that
  const same = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const related = [
    ...same.filter((p) => p.type === product.type),
    ...same.filter((p) => p.type !== product.type),
  ].slice(0, 4);

  const section = "border-t py-4";
  const summary = "flex cursor-pointer list-none items-center justify-between font-semibold";

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 md:px-6 md:pb-12">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm opacity-70">
          <Link href="/" className="hover:underline">Home</Link>
          {product.category && (
            <>
              {" / "}
              <Link href={`/${product.category}`} className="capitalize hover:underline">
                {product.category}
              </Link>
            </>
          )}
          {" / "}
          <span>{product.name}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Photo */}
          <div className="group relative">
            <FavoriteButton id={product.id} />
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full rounded-xl object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white">
              Handmade by Maestro Originals
            </span>
            <h1 className="mt-3 text-2xl font-semibold md:text-3xl">{product.name}</h1>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
              {product.oldPrice && (
                <>
                  <p className="text-lg line-through opacity-60">
                    ${product.oldPrice.toFixed(2)}
                  </p>
                  <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-6">
              <ProductActions product={product} />
            </div>

            {/* Info sections */}
            <div className="mt-8">
              <details open className={section}>
                <summary className={summary}>Description</summary>
                <p className="mt-3 opacity-80">{product.description}</p>
              </details>

              <details className={section}>
                <summary className={summary}>Delivery</summary>
                <p className="mt-3 opacity-80">
                  Replace this with your real delivery details: areas you
                  deliver to, fees, and how long it takes.{" "}
                  <Link href="/shipping" className="underline">
                    Full shipping info
                  </Link>
                </p>
              </details>

              <details className={section}>
                <summary className={summary}>Return policy</summary>
                <p className="mt-3 opacity-80">
                  Replace this with your real return rules: how many days, the
                  condition shoes must be in, and how to start a return.{" "}
                  <Link href="/returns" className="underline">
                    Full returns policy
                  </Link>
                </p>
              </details>
            </div>
          </div>
        </div>
      </main>

      {related.length > 0 && <ProductGrid title="You may also like" items={related} />}
    </>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
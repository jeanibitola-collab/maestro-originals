import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCircleCheck, FaRotateLeft, FaScissors, FaShieldHalved, FaTruckFast } from "react-icons/fa6";
import { products } from "@/data/products";
import { DELIVERY_FEE, DELIVERY_TIME, RETURN_DAYS, getContent } from "@/data/productContent";
import ProductActions from "@/components/ProductActions";
import FavoriteButton from "@/components/FavoriteButton";
import ProductGrid from "@/components/ProductGrid";
import RecentTracker from "@/components/RecentTracker";
import Reviews from "@/components/Reviews";
import { formatPrice } from "@/lib/format";

const badges = [
  { Icon: FaScissors, text: "Handmade by local artisans" },
  { Icon: FaTruckFast, text: `Delivery in ${DELIVERY_TIME}` },
  { Icon: FaRotateLeft, text: `${RETURN_DAYS}-day returns` },
  { Icon: FaShieldHalved, text: "Secure checkout" },
];

async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  const content = getContent(product.type);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const same = products.filter((p) => p.id !== product.id && p.category === product.category);
  const related = [
    ...same.filter((p) => p.type === product.type),
    ...same.filter((p) => p.type !== product.type),
  ].slice(0, 4);

  const specs = (
    [
      ["Product code", `MO-${String(product.id).padStart(4, "0")}`],
      product.category && ["Category", product.category === "women" ? "Women" : "Men"],
      ["Style", content.label],
      ["Made by", "Maestro Originals"],
      ["Finish", "Hand-finished"],
      ["Delivery", DELIVERY_TIME],
      ["Delivery fee", DELIVERY_FEE],
      ["Returns", `${RETURN_DAYS} days from delivery`],
    ] as ([string, string] | "" | undefined)[]
  ).filter((s): s is [string, string] => Boolean(s));

  const section = "border-t py-4";
  const summary = "flex cursor-pointer list-none items-center justify-between font-semibold";

  return (
    <>
      <RecentTracker id={product.id} />
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
          <div className="group relative md:sticky md:top-6 md:self-start">
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

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              {product.oldPrice && (
                <>
                  <p className="text-lg line-through opacity-60">{formatPrice(product.oldPrice)}</p>
                  <span className="rounded bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-6">
              <ProductActions product={product} />
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {badges.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <Icon className="shrink-0 text-lg text-orange-600" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Info sections */}
            <div className="mt-8">
              <details open className={section}>
                <summary className={summary}>Description</summary>
                <p className="mt-3 font-medium">{product.description}</p>
                <p className="mt-2 opacity-80">{content.story}</p>
              </details>

              <details className={section}>
                <summary className={summary}>Delivery</summary>
                <p className="mt-3 opacity-80">
                  Orders are delivered in {DELIVERY_TIME}. Delivery fee: {DELIVERY_FEE.toLowerCase()}.{" "}
                  <Link href="/shipping" className="underline">Full shipping info</Link>
                </p>
              </details>

              <details className={section}>
                <summary className={summary}>Return policy</summary>
                <p className="mt-3 opacity-80">
                  Return unworn shoes in their original packaging within {RETURN_DAYS} days of delivery
                  for a refund or exchange.{" "}
                  <Link href="/returns" className="underline">Full returns policy</Link>
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Highlights and specifications */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Why you&apos;ll love it</h2>
            <ul className="space-y-3">
              {content.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <FaCircleCheck className="mt-1 shrink-0 text-orange-600" />
                  <span className="opacity-90">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Specifications</h2>
            <dl className="divide-y rounded-xl border">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="opacity-60">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Care */}
        <section className="mt-12 rounded-xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Care guide</h2>
          <ol className="list-decimal space-y-2 pl-5 opacity-90">
            {content.care.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </section>
      </main>

      <Reviews />

      {related.length > 0 && <ProductGrid title="You may also like" items={related} />}
    </>
  );
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl grid gap-4 px-6 py-6 lg:grid-cols-3">
      {/* Big banner with background image */}
      <div
        className="relative lg:col-span-2 min-h-80 rounded-lg overflow-hidden bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: "url('/Hero.jpg')" }}
      >
        {/* Dark overlay so the text stays readable */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">
            Handmade shoes, made to last
          </h1>
          <Link
            href="/shoes"
            className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium"
          >
            Shop now
          </Link>
        </div>
      </div>

      {/* Smaller promo tile */}
      <Link
        href="/shoes?type=slides"
        className="relative min-h-80 md:min-h-87.5 rounded-lg overflow-hidden bg-cover bg-center flex items-end"
        style={{ backgroundImage: "url('/promo.jpg')" }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="relative z-10 p-4 text-white">
          <p className="text-xl font-semibold">New slippers collection</p>
          <p className="text-sm">Shop now</p>
        </div>
      </Link>
    </section>
  );
}
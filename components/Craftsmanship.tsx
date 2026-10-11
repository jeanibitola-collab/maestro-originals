import Link from "next/link";

export default function Craftsmanship() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
      <div
        className="min-h-[360px] rounded-lg bg-cover bg-center bg-gray-700"
        style={{ backgroundImage: "url('/Hero.jpg')" }}
      />
      <div>
        <h2 className="text-3xl font-serif mb-4">
          Crafted by hand, built to last
        </h2>
        <p className="mb-4 opacity-80">
          Every pair at Maestro Originals starts with carefully chosen leather
          and ends in the hands of a skilled maker. We cut, stitch, and finish
          each shoe ourselves, so you get comfort and quality that mass
          production can't match.
        </p>
        <Link
          href="/about"
          className="inline-block bg-orange-600 text-white px-6 py-3 rounded-full font-medium"
        >
          Read our story
        </Link>
      </div>
    </section>
  );
}
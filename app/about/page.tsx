import Link from "next/link";

const values = [
  {
    title: "Handcrafted",
    text: "Every shoe is cut, stitched, and finished by hand. We never rush a pair to meet a quota.",
  },
  {
    title: "Quality materials",
    text: "We choose leather and soles for comfort and durability, so your shoes look good and age well.",
  },
  {
    title: "Made locally",
    text: "Each purchase supports skilled local makers and helps keep a valuable trade alive.",
  },
];

const steps = [
  {
    title: "Design",
    text: "Every style starts as a sketch and a paper pattern, drawn to fit the shape of a real foot.",
  },
  {
    title: "Cut",
    text: "Leather is selected and cut by hand, so each piece is used where it performs best.",
  },
  {
    title: "Stitch and shape",
    text: "The pieces are stitched together and shaped over a last, which gives the shoe its fit.",
  },
  {
    title: "Finish",
    text: "Soles are attached, edges are polished, and every pair is inspected before it ships.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* Intro */}
      <header className="mb-14 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">About Maestro Originals</h1>
        <p className="mt-4 text-lg opacity-70">Handmade shoes, made to last.</p>
      </header>

      {/* Story */}
      <section className="mx-auto mb-16 max-w-3xl space-y-5 text-lg leading-relaxed">
        <h2 className="font-serif text-3xl">Our story</h2>
        <p className="opacity-80">
          Maestro Originals began in a small workshop with a simple belief: a good pair of shoes
          should be made by someone who cares how it fits, how it looks, and how long it lasts.
          Every pair we sell is cut, stitched, and finished by hand by local makers.
        </p>
        <p className="opacity-80">
          We are proud to be a local brand. We work with skilled artisans, choose materials we can
          inspect ourselves, and make shoes in small batches, so each pair gets proper attention
          instead of being rushed down a production line.
        </p>
        <p className="opacity-80">
          From classic boots and loafers to easy slides and sandals, we make shoes for people who
          notice the details and want something that lasts well beyond one season.
        </p>
      </section>

      {/* What we stand for */}
      <section className="mb-16">
        <h2 className="mb-8 text-center font-serif text-3xl">What we stand for</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border p-6">
              <h3 className="mb-2 text-lg font-semibold text-orange-600">{v.title}</h3>
              <p className="opacity-80">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How a pair is made */}
      <section className="mb-16">
        <h2 className="mb-8 text-center font-serif text-3xl">How a pair is made</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title}>
              <p className="mb-1 text-sm font-bold text-orange-600">Step {i + 1}</p>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm opacity-80">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promise and call to action */}
      <section className="rounded-2xl border p-10 text-center">
        <h2 className="mb-3 font-serif text-3xl">Our promise</h2>
        <p className="mx-auto mb-8 max-w-2xl opacity-80">
          We stand behind what we make. If something isn&apos;t right, get in touch and we will do
          our best to put it right.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/shoes"
            className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-500"
          >
            Browse our shoes
          </Link>
          <Link
            href="/contact"
            className="rounded-full border px-6 py-3 font-semibold transition-colors hover:bg-gray-500/20"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
const reviews = [
  { name: "Customer name", text: "Replace this with a real customer review." },
  { name: "Customer name", text: "Replace this with a real customer review." },
  { name: "Customer name", text: "Replace this with a real customer review." },
];

export default function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">What our customers say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="border rounded-lg p-6">
            <p className="mb-4">“{r.text}”</p>
            <p className="font-semibold text-sm">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
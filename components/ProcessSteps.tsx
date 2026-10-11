const steps = [
  { title: "Design", text: "Every style begins as a sketch and a paper pattern.", image: "/step1.png" },
  { title: "Cut and stitch", text: "Leather is cut and stitched by hand.", image: "/step2.png" },
  { title: "Finish", text: "Each pair is polished and inspected before shipping.", image: "/step3.jpg" },
];

export default function ProcessSteps() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">How your shoes are made</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={s.title} className="text-center">
            <div
              className="h-56 rounded-lg bg-cover bg-center bg-gray-700"
              style={{ backgroundImage: `url('${s.image}')` }}
            />
            <p className="mt-4 text-orange-600 font-bold">Step {i + 1}</p>
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="text-sm opacity-70">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
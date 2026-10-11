const benefits = [
  { icon: "🧵", title: "Handcrafted", text: "Made by skilled artisans" },
  { icon: "👞", title: "Genuine leather", text: "Quality materials that last" },
  { icon: "🚚", title: "Free delivery", text: "On orders over $100" },
  { icon: "🔒", title: "Secure checkout", text: "Pay safely online" },
];

export default function BenefitsStrip() {
  return (
    <section className="border-y">
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {benefits.map((b) => (
          <div key={b.title}>
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-sm opacity-70">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
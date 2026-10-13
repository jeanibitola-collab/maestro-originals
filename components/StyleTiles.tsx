import Link from "next/link";

const styles = [
  { name: "Boots", type: "shoes", image: "/boot4.jpg" },
  { name: "Loafers", type: "shoes", image: "/image4.jpg" },
  { name: "Sandals", type: "sandals", image: "/image6.jpg" },
  { name: "Oxfords", type: "shoes", image: "/Hero.jpg" },
];

export default function StyleTiles() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">Shop by style</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styles.map((s) => (
          <Link
            key={s.name}
            href={`/shoes?type=${s.type}`}
            className="group text-center"
          >
            <div
              className="aspect-square rounded-2xl bg-cover bg-center bg-gray-700 transition-transform group-hover:scale-[1.03]"
              style={{ backgroundImage: `url('${s.image}')` }}
            />
            <p className="mt-3 font-medium">{s.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
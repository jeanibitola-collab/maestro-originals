import { FaStar } from "react-icons/fa6";

// Sample reviews for the demo site. Replace them with real customer reviews before launch.
const SHOW_DEMO_NOTICE = true;

const reviews = [
  {
    name: "Chidi Okeke",
    city: "Lagos",
    shoe: "Brown Chelsea Boot",
    rating: 5,
    text: "The leather feels solid and the stitching is neat. I wore them to a wedding and got compliments all evening.",
  },
  {
    name: "Amaka Nwosu",
    city: "Abuja",
    shoe: "Nude Birken Slides",
    rating: 5,
    text: "So comfortable straight out of the box. No break-in needed, and the colour goes with everything.",
  },
  {
    name: "Tunde Adeyemi",
    city: "Ibadan",
    shoe: "Black Penny Loafer",
    rating: 4,
    text: "Great quality for the price. They were a little snug at first but have softened up nicely after a week.",
  },
  {
    name: "Funke Balogun",
    city: "Lagos",
    shoe: "Brown Chelsea Boot",
    rating: 5,
    text: "I asked a few questions about sizing and got a reply within minutes. The pair arrived exactly as pictured.",
  },
  {
    name: "Ibrahim Sani",
    city: "Kano",
    shoe: "Black Penny Loafer",
    rating: 5,
    text: "Finally a local brand that makes shoes that look this sharp. I've already ordered a second pair.",
  },
  {
    name: "Ngozi Eze",
    city: "Port Harcourt",
    shoe: "Nude Birken Slides",
    rating: 4,
    text: "Lovely finish and light to wear. Delivery took a little longer than I hoped, but the shoes were worth the wait.",
  },
];

export default function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-center text-2xl font-bold">What our customers say</h2>
      

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="flex flex-col rounded-lg border p-6">
            <div className="mb-3 flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <FaStar
                  key={n}
                  className={n <= r.rating ? "text-[#fac30a]" : "opacity-20"}
                />
              ))}
            </div>
            <p className="mb-4 flex-1">“{r.text}”</p>
            <div>
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs opacity-60">
                {r.city} · {r.shoe}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
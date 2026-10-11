import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoryNav() {
  return (
    <nav className="grid grid-cols-2 px-6 py-3">
      {categories.map((c) => (
        <Link
          key={c.name}
          href={c.href}
          className="flex items-center justify-center gap-3 border py-4 text-2xl font-semibold hover:bg-orange-600 hover:text-white transition-colors"
        >
          <span aria-hidden>{c.icon}</span>
          <span>{c.name}</span>
        </Link>
      ))}
    </nav>
  );
}
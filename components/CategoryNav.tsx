"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

export default function CategoryNav() {
  const pathname = usePathname();

  // Hide the Men/Women menu on the cart page
  if (pathname !== "/") return null;

  return (
    <nav className="mx-auto grid max-w-7xl grid-cols-2 px-6 py-3">
      {categories.map((c) => (
        <Link
          key={c.name}
          href={c.href}
          className="flex items-center justify-center gap-3 border py-4 text-2xl font-semibold transition-colors hover:bg-orange-600 hover:text-white"
        >
          <span aria-hidden>{c.icon}</span>
          <span>{c.name}</span>
        </Link>
      ))}
    </nav>
  );
}
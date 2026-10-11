"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { items } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const count = items.reduce((n, i) => n + i.quantity, 0);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/shoes?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="flex items-center gap-4 px-6 py-3">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 text-4xl font-bold">
  <span className="mix-blend-screen">
    <span className="block bg-orange-600">
      <img
        src="/logo.png"
        alt=""
        className="h-12 w-12 object-contain mix-blend-multiply"
      />
    </span>
  </span>
  <span>Maestro Originals</span>
</Link>

      {/* Rounded search bar */}
      <form
        onSubmit={onSearch}
        className="flex flex-1 items-center border-2 border-white rounded-full pr-1"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for shoes"
          className="flex-1 bg-transparent px-4 py-2 outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="w-9 h-9 rounded-full bg-black-600 text-white"
        >
          🔍
        </button>
      </form>

      {/* Right side */}
      <span className="hidden sm:block text-sm font-medium">Sign in</span>
      <span aria-label="Favorites">♡</span>
      <Link href="/cart" className="whitespace-nowrap">
        🛒 {count}
      </Link>
    </header>
  );
}
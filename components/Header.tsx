"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass, FaHeart, FaCartShopping, FaShoePrints } from "react-icons/fa6";
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
    <header className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-3">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 text-4xl font-bold">
        <FaShoePrints className="-rotate-90 text-xl text-orange-600 md:text-2xl" />
        <span>Maestro Originals</span>
      </Link>

      {/* Search bar */}
      <form
        onSubmit={onSearch}
        className="relative flex h-12 flex-1 items-center overflow-hidden rounded-full border-2 border-current"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for shoes"
          className="h-full flex-1 bg-transparent pl-5 pr-16 outline-none placeholder:text-gray-500"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1 bottom-1 flex w-9 items-center justify-center rounded-full bg-orange-600 text-white transition-all duration-200 hover:right-0 hover:top-0 hover:bottom-0 hover:w-14 hover:rounded-none hover:bg-orange-400"
        >
          <FaMagnifyingGlass />
        </button>
      </form>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <button className="hidden rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-500/20 sm:block">
          Sign in
        </button>

        <button
          aria-label="Favorites"
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors hover:bg-gray-500/20"
        >
          <FaHeart />
        </button>

        <Link
          href="/cart"
          aria-label="Cart"
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors hover:bg-gray-500/20"
        >
          <FaCartShopping />
          {count > 0 && (
            <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
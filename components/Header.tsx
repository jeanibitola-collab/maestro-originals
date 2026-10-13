"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass, FaHeart, FaCartShopping, FaBoxOpen, FaRegUser } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const M_SIZE = "1.6em"; // size of the big M
const M_SHIFT = "0.1em"; // + moves the M down, - moves it up
export default function Header() {
  const { user, loading, signIn, logOut } = useAuth();
  const [userMenu, setUserMenu] = useState(false);
  const { items } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const count = items.reduce((n, i) => n + i.quantity, 0);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/shoes?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 md:flex-nowrap md:px-6">
      {/* Logo */}
    {/* Logo */}
<Link href="/" aria-label="Maestro Originals home" className="shrink-0">
  <Image
    src="/maestro-logo-black.png"
    alt="Maestro Originals"
    width={1405}
    height={530}
    priority
    style={{ height: 80, width: "auto", maxWidth: "none" }}
  />
</Link>

      {/* Search: its own row on phones, inline on desktop */}
      <form
        onSubmit={onSearch}
        className="relative order-last flex h-12 w-full items-center overflow-hidden rounded-full border-2 border-current md:order-none md:w-auto md:flex-1"
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
      <div className="ml-auto flex items-center gap-1 md:ml-0">
        {!loading && user ? (
  <div className="relative">
    <button
      onClick={() => setUserMenu(!userMenu)}
      aria-label="Account"
      className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-gray-500/20"
    >
      {user.photoURL ? (
        <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full" />
      ) : (
        <FaRegUser /> 
      )}
    </button>
    {userMenu && (
      <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-[var(--background)] p-3 shadow-lg">
        <p className="truncate font-medium">{user.displayName}</p>
        <p className="mb-3 truncate text-sm opacity-70">{user.email}</p>
        
     <Link
  href="/account"
  onClick={() => setUserMenu(false)}
  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
>
  <FaRegUser />
  My account
</Link>

<Link
  href="/orders"
  onClick={() => setUserMenu(false)}
  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
>
  <FaBoxOpen />
  Orders
</Link>
        <button
          onClick={() => { logOut(); setUserMenu(false); }}
          className="w-full rounded-lg border py-2 text-sm font-medium hover:bg-gray-500/20"
        >
          Sign out
        </button>
      </div>
    )}
  </div>
) : (
  <button
    onClick={signIn}
    aria-label="Sign in"
    className="flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors hover:bg-gray-500/20 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm sm:font-medium"
  >
    <FaRegUser className="sm:hidden" />
    <span className="hidden sm:inline">Sign in</span>
  </button>
)}

        <Link href="/favorites"
          aria-label="Favorites"
          className="flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors hover:bg-gray-500/20"
        >
          <FaHeart />
        </Link>

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
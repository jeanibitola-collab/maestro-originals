"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <nav className="flex justify-between p-4 border-b">
      <Link href="/" className="font-bold">
        MyShop
      </Link>
      <Link href="/cart">Cart ({count})</Link>
    </nav>
  );
}
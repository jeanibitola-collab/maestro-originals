"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
      <p className="mb-4">Your payment was successful.</p>
      <Link href="/" className="underline">
        Continue shopping
      </Link>
    </main>
  );
}
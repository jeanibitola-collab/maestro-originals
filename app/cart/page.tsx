"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, total } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // go to Stripe
      } else {
        alert(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch {
      alert("Could not reach the server");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <main className="p-8">Your cart is empty.</main>;
  }

  return (
    <main className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Your cart</h1>

      {items.map((i) => (
        <div key={i.id} className="flex justify-between border-b py-2">
          <span>
            {i.name} × {i.quantity}
          </span>
          <span>${(i.price * i.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(i.id)}>Remove</button>
        </div>
      ))}

      <p className="font-bold mt-4">Total: ${total.toFixed(2)}</p>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-4 bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Redirecting..." : "Checkout"}
      </button>
    </main>
  );
}
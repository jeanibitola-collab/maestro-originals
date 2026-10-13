"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaArrowLeft } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";

const DELIVERY_FEE: number = 0; // set your real delivery fee here

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  // Paystack needs an email, so we use the signed-in customer's email
  const email = user?.email ?? "";

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const grandTotal = total + DELIVERY_FEE;

  async function confirmOrder() {
    if (!email) {
      setError("Please sign in to place your order.");
      return;
    }
    setError("");
    setRedirecting(true);

    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, items }),
      });

      const text = await res.text();
      let data: { authorization_url?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error ?? `Checkout failed (status ${res.status})`);
      }

      window.location.href = data.authorization_url;
    } catch (e) {
      setRedirecting(false);
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    }
  }

  // Screen shown while sending the customer to Paystack
  if (redirecting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
        <h1 className="mb-2 text-xl font-semibold">Redirecting you to pay</h1>
        <p className="max-w-sm opacity-80">
          Please do not refresh this page or click the Back button. We are
          redirecting you to Paystack.
        </p>
        <p className="mt-8 max-w-sm text-sm opacity-60">
          Please note: we will never ask you for your password, PIN, CVV or
          full card details over the phone or by email.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Your cart is empty</h1>
        <Link
          href="/shoes"
          className="mt-4 inline-block rounded-full bg-orange-600 px-6 py-3 font-medium text-white"
        >
          Start shopping
        </Link>
      </main>
    );
  }

  const section =
    "bg-gray-500/10 px-4 py-3 text-sm font-semibold uppercase opacity-80";
  const confirmClass =
    "mt-4 w-full rounded-lg bg-orange-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-orange-500";

  return (
    <main className="mx-auto max-w-2xl pb-12">
      <div className="flex items-center gap-4 border-b px-4 py-4">
        <button onClick={() => router.push("/cart")} aria-label="Back to cart">
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-semibold">Place your order</h1>
      </div>

      <h2 className={section}>Order summary</h2>
      <div className="space-y-2 px-4 py-4">
        <div className="flex justify-between">
          <span>Item&apos;s total ({count})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fees</span>
          <span>{DELIVERY_FEE === 0 ? "Free" : `$${DELIVERY_FEE.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <h2 className={section}>Payment method</h2>
      <div className="px-4 py-4">
        <p className="font-medium">Pay securely online with Paystack</p>
        <p className="text-sm opacity-70">
          You will be taken to Paystack&apos;s secure page to complete payment.
        </p>
      </div>

      <h2 className={section}>
        Shipment ({count} {count === 1 ? "item" : "items"})
      </h2>
      <div className="px-4 py-4">
        {items.map((i) => (
          <div key={i.id} className="flex gap-3 border-b py-3 last:border-0">
            <img src={i.image} alt={i.name} className="h-16 w-16 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{i.name}</p>
              <p className="text-sm opacity-70">Qty: {i.quantity}</p>
            </div>
            <p className="font-semibold">${(i.price * i.quantity).toFixed(2)}</p>
          </div>
        ))}

        <Link href="/cart" className="mt-3 block text-center font-semibold text-orange-600">
          Modify cart
        </Link>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {/* Confirm order, directly below Modify cart */}
        {!loading && !user ? (
  <button onClick={signIn} className={confirmClass}>
    Sign in to place your order
  </button>
) : (
  <button onClick={confirmOrder} className={confirmClass}>
    Confirm order
  </button>
)}
      </div>

      <Link href="/shoes" className="block px-4 py-3 text-sm text-orange-600">
        ‹ Go back &amp; continue shopping
      </Link>
    </main>
  );
}
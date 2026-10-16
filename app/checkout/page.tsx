"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDocFromServer } from "firebase/firestore";
import { FaArrowLeft } from "react-icons/fa6";
import { db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { DELIVERY_FEE_AMOUNT } from "@/data/shipping";
import { formatPrice } from "@/lib/format";
import { formatSize } from "@/data/sizes";

type Delivery = { name: string; phone: string; address: string };

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  const [delivery, setDelivery] = useState<Delivery>({ name: "", phone: "", address: "" });
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [detailsError, setDetailsError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  // Load the customer's saved delivery details
  useEffect(() => {
  if (!user) {
    setDetailsLoaded(false);
    return;
  }

  const currentUser = user;
  const fallbackName = user.displayName ?? "";
  let cancelled = false;

  setDetailsLoaded(false);
  setDetailsError(false);

  async function load(attempt: number) {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch("/api/account/delivery", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const d = await res.json();
      if (cancelled) return;
      console.log("Delivery details loaded:", { hasPhone: !!d.phone, hasAddress: !!d.address });
      setDelivery({
        name: d.name || fallbackName,
        phone: d.phone || "",
        address: d.address || "",
      });
      setDetailsLoaded(true);
    } catch (e) {
      console.error("Could not load delivery details", e);
      if (cancelled) return;
      if (attempt < 3) {
        setTimeout(() => load(attempt + 1), 1500 * attempt);
      } else {
        setDetailsError(true);
        setDetailsLoaded(true);
      }
    }
  }

  load(1);
  return () => {
    cancelled = true;
  };
}, [user, reloadKey]);

useEffect(() => {
  const onShow = (e: PageTransitionEvent) => {
    if (e.persisted) setReloadKey((k) => k + 1);
  };
  window.addEventListener("pageshow", onShow);
  return () => window.removeEventListener("pageshow", onShow);
}, []);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const grandTotal = total + DELIVERY_FEE_AMOUNT;
  const missing = [
    !delivery.name && "name",
    !delivery.phone && "phone number",
    !delivery.address && "delivery address",
  ].filter(Boolean) as string[];
  const profileMissing = [!delivery.name && "name", !delivery.address && "address"]
  .filter(Boolean)
  .join(" and ");
  const detailsComplete = missing.length === 0;

  async function confirmOrder() {
    if (!user) return;
    if (!detailsComplete) {
      setError("Please add your delivery details first.");
      return;
    }
    setError("");
    setRedirecting(true);

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, size: i.size, quantity: i.quantity })),
          delivery,
        }),
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
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  // Screen shown while sending the customer to Paystack
  if (redirecting) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] px-6 text-center">
        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
        <h1 className="mb-2 text-xl font-semibold">Redirecting you to pay</h1>
        <p className="max-w-sm opacity-80">
          Please do not refresh this page or click the Back button. We are redirecting you to Paystack.
        </p>
        <p className="mt-8 max-w-sm text-sm opacity-60">
          Please note: we will never ask you for your password, PIN, CVV or full card details over the
          phone or by email.
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

  const section = "bg-gray-500/10 px-4 py-3 text-sm font-semibold uppercase opacity-80";
  const confirmClass =
    "mt-4 w-full rounded-lg bg-orange-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-50";

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
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery fees</span>
          <span>{DELIVERY_FEE_AMOUNT === 0 ? "Free" : `${formatPrice(DELIVERY_FEE_AMOUNT)}`}</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>

      <h2 className={section}>Payment method</h2>
      <div className="px-4 py-4">
        <p className="font-medium">Pay securely online with Paystack</p>
        <p className="text-sm opacity-70">
          You will be taken to Paystack&apos;s secure page to complete payment.
        </p>
      </div>

      <h2 className={section}>Delivery details</h2>

<div className="px-4 py-4">
  {loading || (user && !detailsLoaded) ? (
    <p className="opacity-70">Loading...</p>
  ) : !user ? (
  <p className="opacity-70">Sign in to add your delivery details.</p>
) : detailsError ? (
  <div>
    <p className="mb-3 text-sm">We couldn&apos;t load your saved delivery details.</p>
    <button
      onClick={() => setReloadKey((k) => k + 1)}
      className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-gray-500/20"
    >
      Try again
    </button>
  </div>
) : (
  
    <div className="space-y-4">
      {(delivery.name || delivery.phone || delivery.address) && (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {delivery.name && <p className="font-medium">{delivery.name}</p>}
            {delivery.phone && <p className="text-sm opacity-80">{delivery.phone}</p>}
            {delivery.address && (
              <p className="whitespace-pre-line text-sm opacity-80">{delivery.address}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 text-sm font-semibold text-orange-600">
            {delivery.address && <Link href="/account/profile">Change address</Link>}
            {delivery.phone && <Link href="/account/phone">Change phone</Link>}
          </div>
        </div>
      )}

      {!detailsComplete && (
        <div>
          <p className="mb-3 text-sm">
            Add your {missing.join(" and ")} so we know where to deliver.
          </p>
          <div className="flex flex-wrap gap-3">
            {profileMissing && (
              <Link
                href="/account/profile"
                className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-gray-500/20"
              >
                Add {profileMissing}
              </Link>
            )}
            {!delivery.phone && (
              <Link
                href="/account/phone"
                className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-gray-500/20"
              >
                Add phone number
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )}
</div>

      <h2 className={section}>
        Shipment ({count} {count === 1 ? "item" : "items"})
      </h2>
      <div className="px-4 py-4">
        {items.map((i) => (
  <div key={i.key} className="flex gap-3 border-b py-3 last:border-0">
    <img src={i.image} alt={i.name} className="h-16 w-16 rounded object-cover" />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm">{i.name}</p>
      <p className="text-sm opacity-70">
        Size: {formatSize(i.size)} · Qty: {i.quantity}
      </p>
    </div>
    <p className="font-semibold">{formatPrice(i.price * i.quantity)}</p>
  </div>
))}

        <Link href="/cart" className="mt-3 block text-center font-semibold text-orange-600">
          Modify cart
        </Link>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        {!loading && !user ? (
          <button onClick={signIn} className={confirmClass}>
            Sign in to place your order
          </button>
        ) : (
          <button
            onClick={confirmOrder}
            disabled={loading || !detailsLoaded || !detailsComplete}
            className={confirmClass}
          >
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
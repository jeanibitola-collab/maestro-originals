"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useCart } from "@/context/CartContext";

type Phase = "checking" | "paid" | "pending" | "failed" | "problem";

function SuccessContent() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  const { clearCart } = useCart();
  const [phase, setPhase] = useState<Phase>("checking");
  const [attemptKey, setAttemptKey] = useState(0);

  useEffect(() => {
    if (!reference) {
      setPhase("problem");
      return;
    }
    let cancelled = false;
    setPhase("checking");

    async function check(attempt: number) {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "paid") {
          clearCart();
          setPhase("paid");
        } else if (data.status === "failed") {
          setPhase("failed");
        } else if (data.status === "pending") {
          if (attempt < 5) setTimeout(() => check(attempt + 1), 3000);
          else setPhase("pending");
        } else {
          setPhase("problem");
        }
      } catch {
        if (!cancelled) setPhase("problem");
      }
    }

    check(1);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, attemptKey]);

  const button =
    "rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-500";
  const outline = "rounded-full border px-6 py-3 font-semibold hover:bg-gray-500/20";

  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      {phase === "checking" && (
        <>
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
          <h1 className="mb-2 text-2xl font-semibold">Confirming your payment</h1>
          <p className="opacity-70">Please don&apos;t close this page. This only takes a moment.</p>
        </>
      )}

      {phase === "paid" && (
        <>
          <FaCircleCheck className="mx-auto mb-4 text-6xl text-green-500" />
          <h1 className="mb-2 font-serif text-3xl">Thank you for your order!</h1>
          <p className="opacity-80">Your payment was successful and your order has been received.</p>
          <p className="mt-4 text-sm opacity-70">
            Order number: <span className="font-semibold">{reference}</span>
          </p>
          <p className="mt-2 text-sm opacity-70">We&apos;ll contact you with delivery updates.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/orders" className={button}>View my orders</Link>
            <Link href="/shoes" className={outline}>Continue shopping</Link>
          </div>
        </>
      )}

      {phase === "pending" && (
        <>
          <h1 className="mb-2 text-2xl font-semibold">Your payment is still processing</h1>
          <p className="opacity-80">
            This can take a few minutes. Your order number is <span className="font-semibold">{reference}</span>.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => setAttemptKey((k) => k + 1)} className={button}>Check again</button>
            <Link href="/contact" className={outline}>Contact us</Link>
          </div>
        </>
      )}

      {phase === "failed" && (
        <>
          <FaCircleXmark className="mx-auto mb-4 text-6xl text-red-500" />
          <h1 className="mb-2 text-2xl font-semibold">Payment not completed</h1>
          <p className="opacity-80">We didn&apos;t receive your payment, so no order was placed. Your cart is still saved.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/checkout" className={button}>Try again</Link>
            <Link href="/contact" className={outline}>Contact us</Link>
          </div>
        </>
      )}

      {phase === "problem" && (
        <>
          <h1 className="mb-2 text-2xl font-semibold">We couldn&apos;t confirm your payment</h1>
          <p className="opacity-80">
            If money left your account, please contact us
            {reference ? <> with your order number <span className="font-semibold">{reference}</span></> : null}
            , and we&apos;ll sort it out.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className={button}>Contact us</Link>
            <Link href="/orders" className={outline}>My orders</Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Loading...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
"use client";

import { useState } from "react";

export default function PayButton({ email, amount }: { email: string; amount: number }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount }),
      });
      const data = await res.json();
      window.location.href = data.authorization_url;
    } catch {
      alert("Could not start payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button onClick={handlePay} disabled={loading}>
      {loading ? "Redirecting..." : "Pay now"}
    </button>
  );
}
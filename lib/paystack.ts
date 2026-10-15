import { FieldValue } from "firebase-admin/firestore";
import { getAdmin } from "@/lib/firebase-admin";

export type PaymentStatus = "paid" | "pending" | "failed" | "not_found" | "mismatch";

const PAID_STATES = ["paid", "processing", "shipped", "delivered"];

// Asks Paystack whether this order was really paid, then updates the order.
// Safe to call more than once for the same order.
export async function confirmPayment(reference: string): Promise<PaymentStatus> {
  if (!/^MO-[A-F0-9]{10}$/.test(reference)) return "not_found";

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Missing Paystack key");

  const { db } = getAdmin();
  const ref = db.collection("orders").doc(reference);
  const snap = await ref.get();
  if (!snap.exists) return "not_found";

  const order = snap.data()!;
  if (PAID_STATES.includes(order.status)) return "paid";
  if (order.status === "payment_mismatch") return "mismatch";
  if (order.status !== "awaiting_payment") return "failed";

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" }
  );
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.status || !body.data) return "pending";

  const tx = body.data;

  if (tx.status === "success") {
    const expected = Math.round(Number(order.total) * 100);
    const info = {
      id: tx.id ?? null,
      channel: tx.channel ?? null,
      currency: tx.currency ?? null,
      amount: tx.amount ?? null,
      paidAt: tx.paid_at ?? null,
    };

    if (tx.amount !== expected) {
      console.error("Payment amount mismatch", { reference, expected, paid: tx.amount });
      await ref.update({ status: "payment_mismatch", paystack: info });
      return "mismatch";
    }

    await ref.update({ status: "paid", paidAt: FieldValue.serverTimestamp(), paystack: info });
    return "paid";
  }

  if (["failed", "abandoned", "reversed"].includes(tx.status)) return "failed";
  return "pending";
}
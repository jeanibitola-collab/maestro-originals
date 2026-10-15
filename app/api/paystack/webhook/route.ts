import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/paystack";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  // Check the request really came from Paystack
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(raw).digest("hex");

  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(raw);
    if (event.event === "charge.success" && typeof event.data?.reference === "string") {
      // Re-check with Paystack instead of trusting the message body
      await confirmPayment(event.data.reference);
    }
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ ok: false }, { status: 500 }); // Paystack will retry
  }

  return NextResponse.json({ ok: true });
}
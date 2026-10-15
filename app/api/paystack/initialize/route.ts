import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdmin } from "@/lib/firebase-admin";
import { products } from "@/data/products";
import { DELIVERY_FEE_AMOUNT } from "@/data/shipping";

type Body = {
  items?: { id?: number; quantity?: number }[];
  delivery?: { name?: string; phone?: string; address?: string };
};

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return fail("Payment isn't set up yet (missing Paystack key).", 500);

    // 1. Who is ordering? Check their sign-in token.
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return fail("Please sign in to place your order.", 401);

    const { auth, db } = getAdmin();
    let uid: string;
    let email: string;
    try {
      const decoded = await auth.verifyIdToken(token);
      if (!decoded.email) return fail("Your account needs an email address.", 400);
      uid = decoded.uid;
      email = decoded.email;
    } catch {
      return fail("Your sign-in has expired. Please sign in again.", 401);
    }

    // 2. Check the cart and work out the real prices on the server
    const body = (await req.json()) as Body;
    const lines: { id: number; name: string; image: string; price: number; quantity: number }[] = [];

    for (const raw of body.items ?? []) {
      const product = products.find((p) => p.id === Number(raw.id));
      const quantity = Number(raw.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return fail("Your cart has an invalid item. Please refresh and try again.", 400);
      }
      lines.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }
    if (lines.length === 0) return fail("Your cart is empty.", 400);

    // 3. Check the delivery details
    const name = body.delivery?.name?.trim() ?? "";
    const phone = body.delivery?.phone?.trim() ?? "";
    const address = body.delivery?.address?.trim() ?? "";
    if (!name || !phone || !address) {
      return fail("Please add your name, phone number, and delivery address.", 400);
    }
    if (name.length > 100 || phone.length > 30 || address.length > 400) {
      return fail("Some delivery details are too long.", 400);
    }

    // 4. Total, in the smallest currency unit for Paystack (for example kobo)
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const total = Math.round((subtotal + DELIVERY_FEE_AMOUNT) * 100) / 100;
    const amount = Math.round(total * 100);

    // 5. Save the order as "awaiting payment"
    const reference = `MO-${randomBytes(5).toString("hex").toUpperCase()}`;
    await db.collection("orders").doc(reference).set({
      reference,
      uid,
      email,
      status: "awaiting_payment",
      items: lines,
      subtotal,
      deliveryFee: DELIVERY_FEE_AMOUNT,
      total,
      delivery: { name, phone, address },
      createdAt: FieldValue.serverTimestamp(),
    });

    // 6. Start the payment with Paystack
    const origin = req.headers.get("origin") ?? new URL(req.url).origin;
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference,
        callback_url: `${origin}/success`,
        metadata: { uid, orderReference: reference, name, phone },
      }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.status || !data.data?.authorization_url) {
      console.error("Paystack initialize failed:", data);
      await db.collection("orders").doc(reference).delete();
      return fail(data?.message ?? "We couldn't start the payment. Please try again.", 502);
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url, reference });
  } catch (e) {
    console.error("Checkout error:", e);
    const message =
      e instanceof Error && e.message.startsWith("Firebase Admin")
        ? e.message
        : "Something went wrong. Please try again.";
    return fail(message, 500);
  }
}
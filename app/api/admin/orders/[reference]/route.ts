import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdmin } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-auth";

const TARGETS = ["processing", "shipped", "delivered", "cancelled", "returned"];
// Only paid orders can be moved around. Unpaid ones are left alone on purpose.
const EDITABLE_FROM = ["paid", "processing", "shipped", "delivered", "cancelled", "returned"];

export async function PATCH(req: Request, ctx: { params: Promise<{ reference: string }> }) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const { reference } = await ctx.params;
    if (!/^MO-[A-F0-9]{10}$/.test(reference)) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const body = (await req.json().catch(() => ({}))) as { status?: string };
    if (!body.status || !TARGETS.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const { db } = getAdmin();
    const ref = db.collection("orders").doc(reference);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (!EDITABLE_FROM.includes(snap.data()!.status)) {
      return NextResponse.json(
        { error: "This order hasn't been paid, so its status can't be changed." },
        { status: 409 }
      );
    }

    await ref.update({
      status: body.status,
      updatedAt: FieldValue.serverTimestamp(),
      statusHistory: FieldValue.arrayUnion({
        status: body.status,
        at: new Date().toISOString(),
        by: admin.email,
      }),
    });

    return NextResponse.json({ status: body.status });
  } catch (e) {
    console.error("Admin update error:", e);
    return NextResponse.json({ error: "Could not update the order." }, { status: 500 });
  }
}
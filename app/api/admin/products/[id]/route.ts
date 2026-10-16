import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdmin } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-auth";
import { parseProductInput } from "@/lib/product-validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const { id } = await ctx.params;
    if (!/^\d+$/.test(id)) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const { db } = getAdmin();
    const ref = db.collection("products").doc(id);
    if (!(await ref.get()).exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => null);

    // Quick toggle: only the stock switch was sent
    const keys = body && typeof body === "object" ? Object.keys(body) : [];
    if (keys.length === 1 && keys[0] === "inStock" && typeof body.inStock === "boolean") {
      await ref.update({ inStock: body.inStock, updatedAt: FieldValue.serverTimestamp() });
      return NextResponse.json({ ok: true });
    }

    const parsed = parseProductInput(body);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const { oldPrice, ...rest } = parsed.data;
    await ref.update({
      ...rest,
      oldPrice: oldPrice ?? FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin update product error:", e);
    return NextResponse.json({ error: "Could not update the product." }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const { id } = await ctx.params;
    if (!/^\d+$/.test(id)) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const { db } = getAdmin();
    await db.collection("products").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Admin delete product error:", e);
    return NextResponse.json({ error: "Could not delete the product." }, { status: 500 });
  }
}
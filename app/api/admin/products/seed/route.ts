import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdmin } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-auth";
import { products } from "@/data/products";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const { db } = getAdmin();

    // Only import into an empty collection, so nothing is ever overwritten
    const existing = await db.collection("products").limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Products have already been imported." }, { status: 409 });
    }

    const batch = db.batch();
    let maxId = 0;
    for (const p of products) {
      maxId = Math.max(maxId, p.id);
      batch.set(db.collection("products").doc(String(p.id)), {
        id: p.id,
        name: p.name,
        price: p.price,
        ...(p.oldPrice ? { oldPrice: p.oldPrice } : {}),
        image: p.image,
        description: p.description ?? "",
        category: p.category ?? "men",
        type: p.type ?? "shoes",
        sizes: p.sizes ?? [],
        inStock: true,
        hideOnHome: !!p.hideOnHome,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    batch.set(db.collection("meta").doc("products"), { nextId: maxId + 1 });
    await batch.commit();

    return NextResponse.json({ imported: products.length });
  } catch (e) {
    console.error("Seed products error:", e);
    const detail = process.env.NODE_ENV !== "production" && e instanceof Error ? ` (${e.message})` : "";
    return NextResponse.json({ error: `Could not import the products.${detail}` }, { status: 500 });
  }
}
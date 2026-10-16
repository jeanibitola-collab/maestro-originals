import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdmin } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-auth";
import { parseProductInput } from "@/lib/product-validation";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const { db } = getAdmin();
    const snap = await db.collection("products").orderBy("id").get();

    const products = snap.docs.map((d) => {
      const p = d.data();
      return {
        id: Number(p.id),
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice,
        image: p.image,
        description: p.description ?? "",
        category: p.category ?? "men",
        type: p.type ?? "shoes",
        sizes: p.sizes ?? [],
        inStock: p.inStock !== false,
        hideOnHome: !!p.hideOnHome,
      };
    });

    return NextResponse.json({ products });
  } catch (e) {
    if ((e as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") throw e;
    console.error("Admin products error:", e);
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const parsed = parseProductInput(await req.json().catch(() => null));
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const { db } = getAdmin();
    const counter = db.collection("meta").doc("products");
    const { oldPrice, ...rest } = parsed.data;

    // A counter means an ID is never used twice, even after a product is deleted
    const id = await db.runTransaction(async (t) => {
      const snap = await t.get(counter);
      let next = snap.exists ? Number(snap.data()!.nextId) : 0;
      if (!next) {
        const last = await t.get(db.collection("products").orderBy("id", "desc").limit(1));
        next = (last.empty ? 0 : Number(last.docs[0].data().id)) + 1;
      }
      t.set(counter, { nextId: next + 1 });
      t.create(db.collection("products").doc(String(next)), {
        id: next,
        ...rest,
        ...(oldPrice ? { oldPrice } : {}),
        createdAt: FieldValue.serverTimestamp(),
      });
      return next;
    });

    return NextResponse.json({ id });
  } catch (e) {
    console.error("Admin add product error:", e);
    return NextResponse.json({ error: "Could not add the product." }, { status: 500 });
  }
}
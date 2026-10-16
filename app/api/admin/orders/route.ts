import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (admin instanceof NextResponse) return admin;

    const { db } = getAdmin();
    const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(200).get();

    const orders = snap.docs.map((d) => {
      const o = d.data();
      return {
        reference: d.id,
        status: o.status ?? "unknown",
        createdAt: o.createdAt?.toDate?.().toISOString() ?? null,
        email: o.email ?? "",
        total: o.total ?? 0,
        items: o.items ?? [],
        delivery: o.delivery ?? {},
      };
    });

    return NextResponse.json({ orders });
  } catch (e) {
  if ((e as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") throw e;
  console.error("Admin orders error:", e);
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}
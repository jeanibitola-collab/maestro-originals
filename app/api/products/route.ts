import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  // Reading a request header makes this route run fresh on every request,
  // so the products aren't frozen into the build.
  void req.headers.get("accept");

  try {
    const { db } = getAdmin();
    const snap = await db.collection("products").orderBy("id").get();

    const products = snap.docs.map((d) => {
      const p = d.data();
      return {
        id: Number(p.id),
        name: p.name,
        price: p.price,
        ...(p.oldPrice ? { oldPrice: p.oldPrice } : {}),
        image: p.image,
        description: p.description ?? "",
        category: p.category ?? "men",
        type: p.type ?? "shoes",
        ...(Array.isArray(p.sizes) && p.sizes.length > 0 ? { sizes: p.sizes } : {}),
        inStock: p.inStock !== false,
        hideOnHome: !!p.hideOnHome,
      };
    });

    return NextResponse.json(
      { products },
      // Lets Vercel reuse the answer for 30 seconds, which keeps your database reads low
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch (e) {
    if ((e as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") throw e;
    console.error("Products error:", e);
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}
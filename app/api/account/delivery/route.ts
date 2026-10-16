import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

    const { auth, db } = getAdmin();

    let uid: string;
    let displayName = "";
    try {
      const decoded = await auth.verifyIdToken(token);
      uid = decoded.uid;
      displayName = typeof decoded.name === "string" ? decoded.name : "";
    } catch {
      return NextResponse.json({ error: "Your sign-in has expired. Please sign in again." }, { status: 401 });
    }

    const snap = await db.collection("users").doc(uid).get();
    const d = snap.data() ?? {};

    return NextResponse.json(
      {
        name: d.name || displayName,
        phone: d.phone || "",
        address: d.address || "",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    if ((e as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") throw e;
    console.error("Delivery details error:", e);
    return NextResponse.json({ error: "Could not load your details." }, { status: 500 });
  }
}
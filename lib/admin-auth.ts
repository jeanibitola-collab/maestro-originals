import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/firebase-admin";

// Checks that the request comes from a signed-in, verified admin.
// Returns the admin's email, or a ready-made error response.
export async function requireAdmin(req: Request): Promise<{ email: string } | NextResponse> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const { auth } = getAdmin();

  try {
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email?.toLowerCase();
    // email_verified stops someone creating an account with the admin's address without owning it
    if (!email || !decoded.email_verified || !allowed.includes(email)) {
      return NextResponse.json({ error: "You don't have access to this page." }, { status: 403 });
    }
    return { email };
  } catch {
    return NextResponse.json({ error: "Your sign-in has expired. Please sign in again." }, { status: 401 });
  }
}
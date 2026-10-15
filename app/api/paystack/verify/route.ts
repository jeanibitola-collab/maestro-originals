import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/paystack";

export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get("reference") ?? "";
  try {
    const status = await confirmPayment(reference);
    return NextResponse.json({ status });
  } catch (e) {
    console.error("Verify error:", e);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
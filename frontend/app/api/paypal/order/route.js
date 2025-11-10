import { NextResponse } from "next/server";

export async function POST(req) {
  return NextResponse.json(
    { error: "PayPal order creation not wired yet." },
    { status: 501 }
  );
}
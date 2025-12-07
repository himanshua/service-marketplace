// filepath: c:\Users\Dell\Documents\ServiceMarketplace\frontend\app\api\visitors\route.js
import { NextResponse } from "next/server";
import { getVisitorsCollection } from "@/lib/mongo";

const geoUrl = (ip) => (ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/");

export async function POST(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.ip || "";

  const res = await fetch(geoUrl(ip), {
    headers: { "User-Agent": "ServiceMarketplace/1.0" },
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ error: "geo failed" }, { status: 500 });

  const data = await res.json();
  const payload = {
    city: data.city || "",
    country: data.country_name || "",
    countryCode: data.country || "",
    createdAt: new Date(),
  };
  if (!payload.city && !payload.country) return NextResponse.json({ ok: true });

  const col = await getVisitorsCollection();
  await col.insertOne(payload);

  return NextResponse.json({ ok: true });
}

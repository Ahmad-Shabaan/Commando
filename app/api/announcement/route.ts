import { NextResponse } from "next/server";
import sql from "@/lib/db";

let cachedData: unknown = null;
let cachedTimestamp = 0;
const CACHE_TTL = 60_000;

export async function GET() {
  const now = Date.now();
  if (cachedData !== null && now - cachedTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedData, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  }
  try {
    const [row] = await sql`SELECT id, title, message, type, link, created_at FROM announcements ORDER BY id DESC LIMIT 1`;
    const result = row ?? null;
    cachedData = result;
    cachedTimestamp = now;
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  } catch {
    return NextResponse.json(null, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  }
}

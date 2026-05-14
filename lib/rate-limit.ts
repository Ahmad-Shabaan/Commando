import { NextRequest } from "next/server";
import sql from "@/lib/db";
import crypto from "crypto";

const DAILY_LIMIT = 5;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return ip;
}

function getFingerprint(request: NextRequest): string {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "";
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const raw = `${ip}|${userAgent}|${acceptLanguage}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

export async function checkRateLimit(request: NextRequest): Promise<RateLimitResult> {
  try {
    const ip = getClientIp(request);
    const fingerprintHash = getFingerprint(request);
    const today = new Date().toISOString().slice(0, 10);

    const [row] = await sql`
      SELECT count FROM rate_limits
      WHERE (fingerprint_hash = ${fingerprintHash} OR ip = ${ip})
        AND date = ${today}::date
      LIMIT 1
    `;

    const currentCount = row?.count ?? 0;
    const allowed = currentCount < DAILY_LIMIT;

    if (allowed) {
      if (currentCount === 0) {
        await sql`
          INSERT INTO rate_limits (ip, fingerprint_hash, count, date)
          VALUES (${ip}, ${fingerprintHash}, 1, ${today}::date)
        `;
      } else {
        await sql`
          UPDATE rate_limits
          SET count = count + 1
          WHERE (fingerprint_hash = ${fingerprintHash} OR ip = ${ip})
            AND date = ${today}::date
        `;
      }
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      allowed,
      remaining: Math.max(0, DAILY_LIMIT - currentCount - (allowed ? 1 : 0)),
      resetAt: tomorrow.toISOString(),
    };
  } catch {
    return { allowed: true, remaining: DAILY_LIMIT, resetAt: "" };
  }
}

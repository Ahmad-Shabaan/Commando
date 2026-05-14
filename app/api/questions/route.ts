import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { questionSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const rows = await sql`SELECT id, title, created_at FROM questions ORDER BY created_at ASC`;
    return NextResponse.json(rows, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimit = await checkRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "لقد وصلت للحد اليومي (5 أسئلة في اليوم)",
        remaining: 0,
        resetAt: rateLimit.resetAt,
      },
      { status: 429 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { title } = parsed.data;

  try {
    const [row] = await sql`
      INSERT INTO questions (title) VALUES (${title})
      RETURNING id, title, created_at
    `;
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
  }
}

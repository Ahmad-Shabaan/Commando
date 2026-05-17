import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { answerSchema } from "@/lib/validation";
import { getCachedAnswers, setCachedAnswers, invalidateCache } from "@/lib/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const questionIdParam = searchParams.get("questionId");

  if (!questionIdParam) {
    return NextResponse.json({ error: "questionId is required" }, { status: 400 });
  }

  const questionId = parseInt(questionIdParam);
  if (isNaN(questionId) || questionId <= 0) {
    return NextResponse.json({ error: "questionId must be a positive integer" }, { status: 400 });
  }

  const cached = getCachedAnswers<unknown[]>(questionId);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  }

  try {
    const rows = await sql`
      SELECT id, question_id, content, content_items, is_short, created_at FROM answers
      WHERE question_id = ${questionId}
      ORDER BY is_short DESC, created_at ASC
    `;
    setCachedAnswers(questionId, rows);
    return NextResponse.json(rows, {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { questionId, content, content_items } = parsed.data;

  try {
    if (content_items) {
      const [row] = await sql`
        INSERT INTO answers (question_id, content, content_items)
        VALUES (${questionId}, '', ${JSON.stringify(content_items)})
        RETURNING id, question_id, content, content_items, is_short, created_at
      `;
      invalidateCache(questionId);
      return NextResponse.json(row, { status: 201 });
    }

    const [row] = await sql`
      INSERT INTO answers (question_id, content)
      VALUES (${questionId}, ${content})
      RETURNING id, question_id, content, content_items, is_short, created_at
    `;
    invalidateCache(questionId);
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
  }
}

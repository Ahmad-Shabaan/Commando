import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT id, title, created_at FROM questions ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  let body: { title?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const [row] = await sql`
      INSERT INTO questions (title) VALUES (${title.trim()})
      RETURNING id, title, created_at
    `;
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database connection failed" }, { status: 503 });
  }
}

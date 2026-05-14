import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/answers/route";
import { NextRequest } from "next/server";
import { clearAllCache } from "@/lib/cache";

const mockAnswers = [
  { id: 1, question_id: 1, content: "إجابة نموذجية", created_at: "2026-05-14T10:00:00Z" },
  { id: 2, question_id: 1, content: "إجابة أخرى", created_at: "2026-05-14T11:00:00Z" },
];

vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

vi.mock("@/lib/cache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/cache")>("@/lib/cache");
  return { ...actual };
});

import sql from "@/lib/db";

beforeEach(() => {
  vi.clearAllMocks();
  clearAllCache();
});

describe("GET /api/answers", () => {
  it("returns answers for a valid questionId", async () => {
    vi.mocked(sql).mockResolvedValue(mockAnswers);

    const request = new NextRequest("http://localhost:3000/api/answers?questionId=1");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body).toEqual(mockAnswers);
  });

  it("returns empty array when no answers exist", async () => {
    vi.mocked(sql).mockResolvedValue([]);

    const request = new NextRequest("http://localhost:3000/api/answers?questionId=999");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns 400 when questionId is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/answers");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("questionId is required");
  });

  it("handles database error and returns empty array", async () => {
    vi.mocked(sql).mockRejectedValue(new Error("DB down"));

    const request = new NextRequest("http://localhost:3000/api/answers?questionId=1");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });
});

describe("POST /api/answers", () => {
  it("creates an answer and returns 201", async () => {
    const newAnswer = { id: 3, question_id: 1, content: "إجابة جديدة", created_at: "2026-05-14T12:00:00Z" };
    vi.mocked(sql).mockResolvedValue([newAnswer]);

    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: JSON.stringify({ questionId: 1, content: "إجابة جديدة" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(newAnswer);
  });

  it("rejects empty content with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: JSON.stringify({ questionId: 1, content: "" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Content is required");
  });

  it("rejects missing content with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: JSON.stringify({ questionId: 1 }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("rejects non-positive questionId with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: JSON.stringify({ questionId: 0, content: "محتوى" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("questionId must be a positive integer");
  });

  it("rejects invalid JSON body with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: "not-json",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid JSON body");
  });

  it("handles database error during insert with 503", async () => {
    vi.mocked(sql).mockRejectedValue(new Error("DB down"));

    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: JSON.stringify({ questionId: 1, content: "إجابة جديدة" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toBe("Database connection failed");
  });

  it("invalidates cache after successful creation", async () => {
    const newAnswer = { id: 3, question_id: 1, content: "إجابة جديدة", created_at: "2026-05-14T12:00:00Z" };
    vi.mocked(sql).mockResolvedValue([newAnswer]);

    const request = new NextRequest("http://localhost:3000/api/answers", {
      method: "POST",
      body: JSON.stringify({ questionId: 1, content: "إجابة جديدة" }),
    });

    await POST(request);

    const cached = (await import("@/lib/cache")).getCachedAnswers(1);
    expect(cached).toBeNull();
  });
});

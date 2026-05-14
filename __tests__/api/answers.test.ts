import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/answers/route";
import { NextRequest } from "next/server";

const mockAnswers = [
  { id: 1, question_id: 1, content: "إجابة نموذجية", created_at: "2026-05-14T10:00:00Z" },
  { id: 2, question_id: 1, content: "إجابة أخرى", created_at: "2026-05-14T11:00:00Z" },
];

vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

import sql from "@/lib/db";

beforeEach(() => {
  vi.clearAllMocks();
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

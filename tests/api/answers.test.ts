import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, mockGetCached, mockSetCached, mockInvalidateCache } = vi.hoisted(() => ({
  mockDb: vi.fn(),
  mockGetCached: vi.fn(),
  mockSetCached: vi.fn(),
  mockInvalidateCache: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ default: mockDb }));
vi.mock("@/lib/cache", () => ({
  getCachedAnswers: mockGetCached,
  setCachedAnswers: mockSetCached,
  invalidateCache: mockInvalidateCache,
}));

import { GET, POST } from "@/app/api/answers/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/answers", () => {
  it("returns answers for valid questionId", async () => {
    mockGetCached.mockReturnValue(null);
    mockDb.mockResolvedValue([
      { id: 1, question_id: 1, content: "الإجابة الأولى", created_at: "2024-01-01" },
    ]);

    const request = new Request("http://localhost:3000/api/answers?questionId=1");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toHaveProperty("content", "الإجابة الأولى");
  });

  it("returns cached answers when available", async () => {
    mockGetCached.mockReturnValue([
      { id: 1, question_id: 1, content: "مخبأ", created_at: "2024-01-01" },
    ]);

    const request = new Request("http://localhost:3000/api/answers?questionId=1");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].content).toBe("مخبأ");
    expect(mockDb).not.toHaveBeenCalled();
  });

  it("returns 400 when questionId is missing", async () => {
    const request = new Request("http://localhost:3000/api/answers");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 400 when questionId is not a number", async () => {
    const request = new Request("http://localhost:3000/api/answers?questionId=abc");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 400 when questionId is zero or negative", async () => {
    const request = new Request("http://localhost:3000/api/answers?questionId=0");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns empty array on DB error", async () => {
    mockGetCached.mockReturnValue(null);
    mockDb.mockRejectedValue(new Error("DB error"));

    const request = new Request("http://localhost:3000/api/answers?questionId=1");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });
});

describe("POST /api/answers", () => {
  it("creates an answer with valid data", async () => {
    mockDb.mockResolvedValue([
      { id: 1, question_id: 1, content: "إجابة صحيحة", created_at: "2024-01-01" },
    ]);

    const request = new Request("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: 1, content: "إجابة صحيحة" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toHaveProperty("content", "إجابة صحيحة");
    expect(mockInvalidateCache).toHaveBeenCalledWith(1);
  });

  it("rejects missing questionId", async () => {
    const request = new Request("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "إجابة بدون سؤال" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects invalid questionId (zero)", async () => {
    const request = new Request("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: 0, content: "إجابة" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects empty content", async () => {
    const request = new Request("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: 1, content: "" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects content over 2000 characters", async () => {
    const longContent = "أ".repeat(2001);
    const request = new Request("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: 1, content: longContent }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects invalid JSON body", async () => {
    const request = new Request("http://localhost:3000/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });
});

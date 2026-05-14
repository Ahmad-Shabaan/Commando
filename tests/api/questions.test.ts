import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDb, mockCheckRateLimit } = vi.hoisted(() => ({
  mockDb: vi.fn(),
  mockCheckRateLimit: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ default: mockDb }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: mockCheckRateLimit }));

import { GET, POST } from "@/app/api/questions/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/questions", () => {
  it("returns questions list", async () => {
    mockDb.mockResolvedValue([
      { id: 1, title: "سؤال تجريبي", created_at: "2024-01-01" },
      { id: 2, title: "سؤال آخر", created_at: "2024-01-02" },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0]).toHaveProperty("title", "سؤال تجريبي");
  });

  it("returns empty array on DB error", async () => {
    mockDb.mockRejectedValue(new Error("DB connection failed"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });
});

describe("POST /api/questions", () => {
  it("creates a question with valid data", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetAt: "" });
    mockDb.mockResolvedValue([
      { id: 1, title: "ما هو موعد الفحص الطبي؟", created_at: "2024-01-01" },
    ]);

    const request = new Request("http://localhost:3000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "ما هو موعد الفحص الطبي؟" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toHaveProperty("title", "ما هو موعد الفحص الطبي؟");
  });

  it("rejects empty title", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 5, resetAt: "" });

    const request = new Request("http://localhost:3000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects whitespace-only title", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 5, resetAt: "" });

    const request = new Request("http://localhost:3000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "   " }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects unsafe content containing script tags", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 5, resetAt: "" });

    const request = new Request("http://localhost:3000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "<script>alert('xss')</script>" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("rejects title over 500 characters", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 5, resetAt: "" });

    const longTitle = "أ".repeat(501);
    const request = new Request("http://localhost:3000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: longTitle }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toHaveProperty("error");
  });

  it("returns 429 when rate limit exceeded", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetAt: "" });

    const request = new Request("http://localhost:3000/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "سؤال جديد" }),
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body).toHaveProperty("error");
  });

  it("rejects invalid JSON body", async () => {
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 5, resetAt: "" });

    const request = new Request("http://localhost:3000/api/questions", {
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

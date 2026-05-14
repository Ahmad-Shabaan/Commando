import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/questions/route";
import { NextRequest } from "next/server";

const mockRows = [
  { id: 1, title: "سؤال تجريبي", created_at: "2026-05-14T10:00:00Z" },
  { id: 2, title: "سؤال آخر", created_at: "2026-05-14T11:00:00Z" },
];

vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

import sql from "@/lib/db";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/questions", () => {
  it("returns questions ordered by newest first", async () => {
    vi.mocked(sql).mockResolvedValue(mockRows);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockRows);
    expect(sql).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining("SELECT")])
    );
  });

  it("handles database error and returns empty array", async () => {
    vi.mocked(sql).mockRejectedValue(new Error("DB down"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });
});

describe("POST /api/questions", () => {
  it("creates a question and returns 201", async () => {
    const newQuestion = { id: 3, title: "سؤال جديد", created_at: "2026-05-14T12:00:00Z" };
    vi.mocked(sql).mockResolvedValue([newQuestion]);

    const request = new NextRequest("http://localhost:3000/api/questions", {
      method: "POST",
      body: JSON.stringify({ title: "سؤال جديد" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(newQuestion);
  });

  it("rejects empty title with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/questions", {
      method: "POST",
      body: JSON.stringify({ title: "" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Title is required");
  });

  it("rejects whitespace-only title with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/questions", {
      method: "POST",
      body: JSON.stringify({ title: "   " }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Title is required");
  });

  it("rejects missing title with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/questions", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Title is required");
  });

  it("rejects invalid JSON body with 400", async () => {
    const request = new NextRequest("http://localhost:3000/api/questions", {
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

    const request = new NextRequest("http://localhost:3000/api/questions", {
      method: "POST",
      body: JSON.stringify({ title: "سؤال جديد" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toBe("Database connection failed");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import QuestionFeed from "@/components/QuestionFeed";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("QuestionFeed", () => {
  it("shows loading state on mount", () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Promise(() => {})
    );

    render(<QuestionFeed />);

    expect(screen.getByText("جاري تحميل الأسئلة...")).toBeDefined();
  });

  it("shows empty state when no questions exist", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<QuestionFeed />);

    const emptyMessage = await screen.findByText("لا توجد أسئلة بعد. كن أول من يطرح سؤالًا!");
    expect(emptyMessage).toBeDefined();
  });

  it("renders questions when data is fetched", async () => {
    const mockQuestions = [
      { id: 1, title: "السؤال الأول", created_at: "2026-01-01T00:00:00Z" },
      { id: 2, title: "السؤال الثاني", created_at: "2026-01-02T00:00:00Z" },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockQuestions,
    } as Response);

    render(<QuestionFeed />);

    expect(await screen.findByText("السؤال الأول")).toBeDefined();
    expect(await screen.findByText("السؤال الثاني")).toBeDefined();
  });

  it("shows empty state on fetch error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    render(<QuestionFeed />);

    const emptyMessage = await screen.findByText("لا توجد أسئلة بعد. كن أول من يطرح سؤالًا!");
    expect(emptyMessage).toBeDefined();
  });
});

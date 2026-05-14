import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AnswerList from "@/components/AnswerList";

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AnswerList", () => {
  it("shows loading state on mount", () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Promise(() => {})
    );

    render(<AnswerList questionId={1} />);

    expect(screen.getByText("جاري تحميل الإجابات...")).toBeDefined();
  });

  it("shows empty state when no answers exist", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<AnswerList questionId={1} />);

    const emptyMessage = await screen.findByText("لا توجد إجابات بعد.");
    expect(emptyMessage).toBeDefined();
  });

  it("renders answers when data is fetched", async () => {
    const mockAnswers = [
      { id: 1, question_id: 1, content: "الإجابة الأولى", created_at: "2026-01-01T00:00:00Z" },
      { id: 2, question_id: 1, content: "الإجابة الثانية", created_at: "2026-01-02T00:00:00Z" },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnswers,
    } as Response);

    render(<AnswerList questionId={1} />);

    expect(await screen.findByText("الإجابة الأولى")).toBeDefined();
    expect(await screen.findByText("الإجابة الثانية")).toBeDefined();
  });

  it("shows empty state on fetch error", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    render(<AnswerList questionId={1} />);

    const emptyMessage = await screen.findByText("لا توجد إجابات بعد.");
    expect(emptyMessage).toBeDefined();
  });
});

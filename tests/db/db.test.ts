import { describe, it, expect } from "vitest";
import { questionSchema, answerSchema } from "@/lib/validation";
import { findDuplicate } from "@/lib/duplicate-detection";
import {
  getCachedAnswers,
  setCachedAnswers,
  invalidateCache,
  clearAllCache,
} from "@/lib/cache";

const validQuestions = [
  { id: 1, title: "ما هو موعد الفحص الطبي؟" },
  { id: 2, title: "كيف أستعد للخدمة العسكرية؟" },
];

describe("questionSchema", () => {
  it("accepts valid Arabic question", () => {
    const result = questionSchema.safeParse({ title: "ما هو موعد الفحص الطبي؟" });
    expect(result.success).toBe(true);
  });

  it("accepts valid mixed question", () => {
    const result = questionSchema.safeParse({ title: "What is the date?" });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = questionSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only title", () => {
    const result = questionSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects title with script tags", () => {
    const result = questionSchema.safeParse({
      title: "<script>alert('xss')</script>",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 500 characters", () => {
    const longTitle = "أ".repeat(501);
    const result = questionSchema.safeParse({ title: longTitle });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from title", () => {
    const result = questionSchema.safeParse({ title: "  سؤال مع فراغات  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("سؤال مع فراغات");
    }
  });
});

describe("answerSchema", () => {
  it("accepts valid answer", () => {
    const result = answerSchema.safeParse({
      questionId: 1,
      content: "هذه إجابة صحيحة",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = answerSchema.safeParse({ questionId: 1, content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects content over 2000 characters", () => {
    const longContent = "أ".repeat(2001);
    const result = answerSchema.safeParse({ questionId: 1, content: longContent });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive questionId", () => {
    const result = answerSchema.safeParse({
      questionId: 0,
      content: "إجابة",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer questionId", () => {
    const result = answerSchema.safeParse({
      questionId: 1.5,
      content: "إجابة",
    });
    expect(result.success).toBe(false);
  });
});

describe("findDuplicate", () => {
  it("detects exact duplicate", () => {
    const result = findDuplicate("ما هو موعد الفحص الطبي؟", validQuestions);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(1);
  });

  it("detects similar question with different diacritics", () => {
    const result = findDuplicate("ما هو موعد الفحص الطبي", validQuestions);
    expect(result).not.toBeNull();
  });

  it("returns null for completely different question", () => {
    const result = findDuplicate("كم عدد أيام الإجازة؟", validQuestions);
    expect(result).toBeNull();
  });

  it("returns null for empty input", () => {
    const result = findDuplicate("", validQuestions);
    expect(result).toBeNull();
  });

  it("returns null when no questions exist", () => {
    const result = findDuplicate("سؤال جديد", []);
    expect(result).toBeNull();
  });
});

describe("cache utilities", () => {
  beforeEach(() => {
    clearAllCache();
  });

  it("stores and retrieves cached data", () => {
    const data = [{ id: 1, content: "إجابة" }];
    setCachedAnswers(1, data);
    const cached = getCachedAnswers<typeof data>(1);
    expect(cached).toEqual(data);
  });

  it("returns null for uncached questionId", () => {
    const cached = getCachedAnswers(999);
    expect(cached).toBeNull();
  });

  it("invalidates cache for specific questionId", () => {
    setCachedAnswers(1, [{ id: 1, content: "إجابة" }]);
    invalidateCache(1);
    const cached = getCachedAnswers(1);
    expect(cached).toBeNull();
  });

  it("does not affect other entries on invalidation", () => {
    setCachedAnswers(1, [{ id: 1, content: "إجابة 1" }]);
    setCachedAnswers(2, [{ id: 2, content: "إجابة 2" }]);
    invalidateCache(1);
    expect(getCachedAnswers(1)).toBeNull();
    expect(getCachedAnswers(2)).not.toBeNull();
  });

  it("clears all cache entries", () => {
    setCachedAnswers(1, [{ id: 1, content: "إجابة" }]);
    setCachedAnswers(2, [{ id: 2, content: "إجابة أخرى" }]);
    clearAllCache();
    expect(getCachedAnswers(1)).toBeNull();
    expect(getCachedAnswers(2)).toBeNull();
  });
});

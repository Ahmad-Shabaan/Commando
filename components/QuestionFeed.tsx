"use client";

import { useEffect, useState, useMemo } from "react";
import { useDebouncedSearch, filterQuestions } from "@/hooks/useDebouncedSearch";
import { MessageSquare, Search } from "lucide-react";
import { setQuestions } from "@/lib/question-store";
import FeedAnimation from "./FeedAnimation";
import FeedAccordion from "./FeedAccordion";
import type { Question } from "@/lib/types";

export default function QuestionFeed({ initialQuestions = [] }: { initialQuestions?: Question[] }) {
  const [questions, setLocalQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(initialQuestions.length === 0);
  const [openValue, setOpenValue] = useState<string | null>(null);
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(350);

  useEffect(() => {
    async function fetchQuestions() {
      if (initialQuestions.length > 0) {
        setQuestions(initialQuestions);
        return;
      }
      try {
        const res = await fetch("/api/questions");
        if (res.ok) {
          const data = await res.json();
          setLocalQuestions(data);
          setQuestions(data);
        }
      } catch {
        setLocalQuestions([]);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [initialQuestions]);

  useEffect(() => {
    let frameId: ReturnType<typeof requestAnimationFrame> | null = null;
    function handleScrollTo(e: Event) {
      const customEvent = e as CustomEvent<{ questionId: number }>;
      setOpenValue(String(customEvent.detail.questionId));
      frameId = requestAnimationFrame(() => {
        const el = document.querySelector(`[data-question-id="${customEvent.detail.questionId}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
    window.addEventListener("scroll-to-question", handleScrollTo as EventListener);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll-to-question", handleScrollTo as EventListener);
    };
  }, []);

  const filteredQuestions = useMemo(
    () => filterQuestions(questions, debouncedQuery),
    [questions, debouncedQuery]
  );

  if (loading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm" role="status" aria-label="Loading questions">
        <div className="h-8 w-48 bg-surface-container rounded-lg mb-8 animate-pulse" />
        <div className="h-12 w-full bg-surface-container rounded-xl mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
        <span className="sr-only">جاري تحميل الأسئلة...</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-headline-sm md:text-headline-md text-primary mb-8 flex items-center gap-3 font-bold">
        الأسئلة الشائعة
      </h2>

      <div className="relative mb-8 group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors pointer-events-none" size={22} aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن سؤالك هنا..."
          aria-label="ابحث عن سؤال"
          className="w-full bg-surface border-2 border-outline-variant/40 focus:ring-4 focus:ring-primary/10 focus:border-primary text-on-surface text-body-lg px-4 pr-12 py-3.5 rounded-xl transition-all outline-none shadow-sm"
        />
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-low rounded-xl border border-outline-variant/20 border-dashed" role="status">
          <Search size={40} className="mx-auto text-outline-variant mb-4 opacity-50" aria-hidden="true" />
          <p className="text-title-md text-on-surface-variant font-medium">
            {debouncedQuery ? "عذراً، لم نجد نتائج تطابق بحثك" : "لا توجد أسئلة بعد. كن أول من يطرح سؤالًا!"}
          </p>
        </div>
      ) : (
        <FeedAnimation key={openValue}>
          <FeedAccordion questions={filteredQuestions} openValue={openValue} />
        </FeedAnimation>
      )}
    </div>
  );
}

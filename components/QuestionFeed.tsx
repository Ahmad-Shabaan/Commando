"use client";

import { useEffect, useState, useMemo } from "react";
import { useDebouncedSearch, filterQuestions } from "@/hooks/useDebouncedSearch";
import { Search } from "lucide-react";
import { setQuestions } from "@/lib/question-store";
import FeedAnimation from "./FeedAnimation";
import FeedAccordion from "./FeedAccordion";

interface Question {
  id: number;
  title: string;
  created_at: string;
}

export default function QuestionFeed() {
  const [questions, setLocalQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [openValue, setOpenValue] = useState<string | null>(null);
  const { query, setQuery, debouncedQuery } = useDebouncedSearch(350);

  useEffect(() => {
    async function fetchQuestions() {
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
  }, []);

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
    if (frameId) cancelAnimationFrame(frameId)
    window.addEventListener("scroll-to-question", handleScrollTo as EventListener);
    return () => window.removeEventListener("scroll-to-question", handleScrollTo as EventListener);

  }, []);

  const filteredQuestions = useMemo(
    () => filterQuestions(questions, debouncedQuery),
    [questions, debouncedQuery]
  );

  if (loading) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8">
        <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2">
          الأسئلة الشائعة
        </h3>
        <p className="text-body-md text-on-surface-variant">
          جاري تحميل الأسئلة...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8">
      <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2">
        الأسئلة الشائعة
      </h3>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن عنوان السؤال..."
          className="w-full bg-surface-container-low border-0 border-b-2 border-secondary focus:ring-0 focus:border-primary text-on-surface text-body-md px-4 pr-10 py-3 rounded-t-lg transition-colors outline-none"
        />
      </div>

      {filteredQuestions.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">
          {debouncedQuery ? "لا توجد نتائج للبحث" : "لا توجد أسئلة بعد. كن أول من يطرح سؤالًا!"}
        </p>
      ) : (
        <FeedAnimation key={openValue}>
          <FeedAccordion questions={filteredQuestions} openValue={openValue} />
        </FeedAnimation>
      )}
    </div>
  );
}

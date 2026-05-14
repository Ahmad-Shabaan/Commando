"use client";

import { useEffect, useState } from "react";
import FeedAnimation from "./FeedAnimation";
import FeedAccordion from "./FeedAccordion";

interface Question {
  id: number;
  title: string;
  created_at: string;
}

export default function QuestionFeed() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions");
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

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

  if (questions.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8">
        <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2">
          الأسئلة الشائعة
        </h3>
        <p className="text-body-md text-on-surface-variant">
          لا توجد أسئلة بعد. كن أول من يطرح سؤالًا!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8">
      <h3 className="text-headline-md text-primary mb-6 flex items-center gap-2">
        الأسئلة الشائعة
      </h3>
      <FeedAnimation>
        <FeedAccordion questions={questions} />
      </FeedAnimation>
    </div>
  );
}

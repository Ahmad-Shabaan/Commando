"use client";

import { useEffect, useState } from "react";

interface Answer {
  id: number;
  question_id: number;
  content: string;
  created_at: string;
}

export default function AnswerList({ questionId }: { questionId: number }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnswers() {
      try {
        const res = await fetch(`/api/answers?questionId=${questionId}`);
        const data = await res.json();
        setAnswers(data);
      } catch {
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAnswers();
  }, [questionId]);

  if (loading) {
    return (
      <div className="p-4 pt-0 text-on-surface-variant">
        جاري تحميل الإجابات...
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="p-4 pt-0 text-on-surface-variant  text-base md:text-lg">
        لا توجد إجابات بعد.
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4 list-none">
      {answers.map((answer) => (
        <div key={answer.id} className="flex items-start gap-2 text-base md:text-lg">
          <span className="text-primary shrink-0 mt-0.5">•</span>
          <span>{answer.content}</span>
        </div>
      ))}
    </div>
  );
}

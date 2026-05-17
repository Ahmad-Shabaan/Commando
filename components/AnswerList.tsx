"use client";

import { useEffect, useState } from "react";
import { ScrollText, ChevronLeft } from "lucide-react";
import AnswerContent from "./AnswerContent";
import type { Answer } from "@/lib/types";
import { parseContentItems } from "@/lib/types";
import Link from "next/link";

export default function AnswerList({ questionId, questionSlug }: { questionId: number, questionSlug: string | null }) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnswers() {
      try {
        const res = await fetch(`/api/answers?questionId=${questionId}`);
        const data = await res.json();
        setAnswer(data[0]);
      } catch {
        setAnswer(null);
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

  if (answer === null) {
    return (
      <div className="p-4 pt-0 text-on-surface-variant text-base md:text-lg">
        لا توجد إجابات بعد.
      </div>
    );
  }

  return (
    <>
      <div className="mt-4">

        <div className="space-y-4 mt-4 list-none">
          {answer && (
            <div className="flex items-start gap-2 text-base md:text-lg">
              <span className="block flex-1 min-w-0">
                {answer.content}
              </span>
              <ScrollText className="size-4 shrink-0 mt-1 text-outline-variant" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
      {!answer.is_short && questionSlug && (
        <div className="mt-6 pt-5 border-t border-outline-variant/10 flex justify-end">
          <Link
            href={`/tajneed/${questionSlug}`}
            className="inline-flex items-center gap-2 text-primary font-bold text-label-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-lg"
          >
            اقرأ الإجابة الكاملة
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}

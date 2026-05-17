"use client";

import { useEffect, useState } from "react";

interface Question {
  id: number;
  title: string;
}

interface Answer {
  id: number;
  question_id: number;
  content: string;
  content_items?: unknown;
}

function flattenJsonLd(a: Answer): string {
  if (!a.content_items) return a.content;
  const items = Array.isArray(a.content_items)
    ? a.content_items
    : typeof a.content_items === "string"
      ? (() => { try { return JSON.parse(a.content_items); } catch { return []; } })()
      : [];
  if (Array.isArray(items) && items.length > 0) {
    return items.map((i: any) => i.text || i.label || "").join(" ");
  }
  return a.content;
}

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Renders FAQ structured data (JSON-LD) dynamically from the DB.
 * Fetches all questions and their answers, then injects FAQPage schema
 * for Google Rich Results (FAQ snippets, People Also Ask).
 */
export default function FaqJsonLd() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    async function buildFaqSchema() {
      try {
        const questionsRes = await fetch("/api/questions");
        if (!questionsRes.ok) return;
        const questions: Question[] = await questionsRes.json();

        const faqEntries: FaqItem[] = [];

        // Fetch answers for each question in parallel
        const answerPromises = questions.map(async (q) => {
          try {
            const answersRes = await fetch(`/api/answers?questionId=${q.id}`);
            if (!answersRes.ok) return null;
            const answers: Answer[] = await answersRes.json();
            if (answers.length === 0) return null;

            const combinedAnswer = answers.map((a) => flattenJsonLd(a)).join(" ");
            return { question: q.title, answer: combinedAnswer };
          } catch {
            return null;
          }
        });

        const results = await Promise.all(answerPromises);
        for (const result of results) {
          if (result) faqEntries.push(result);
        }

        setFaqItems(faqEntries);
      } catch {
        // Silently fail — structured data is progressive enhancement
      }
    }

    buildFaqSchema();
  }, []);

  if (faqItems.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

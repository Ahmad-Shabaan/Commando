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

            // Combine all answers into one text for the schema
            const combinedAnswer = answers.map((a) => a.content).join(" ");
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

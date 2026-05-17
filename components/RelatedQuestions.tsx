import sql from "@/lib/db";
import Link from "next/link";
import { ChevronLeft, FileText } from "lucide-react";

export default async function RelatedQuestions({ currentQuestionId }: { currentQuestionId: number }) {
  const relatedQuestions = await sql`
    SELECT id, title, slug 
    FROM questions 
    WHERE id != ${currentQuestionId} AND slug IS NOT NULL
    ORDER BY RANDOM() 
    LIMIT 3
  `;

  if (!relatedQuestions.length) return null;

  return (
    <section className="mt-12 md:mt-16 pt-8 border-t border-outline-variant/20">
      <h2 className="text-title-lg md:text-headline-sm text-primary font-bold mb-6 flex items-center gap-2">
        <FileText size={24} className="text-primary/70" aria-hidden="true" />
        قد يهمك أيضاً:
      </h2>
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 md:grid-cols-3">
        {relatedQuestions.map((q, idx) => (
          <Link
            href={`/tajneed/${q.slug}`}
            key={q.id}
            className="block group h-full animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
            style={{ animationDelay: `${Math.min(idx * 75, 500)}ms` }}
          >
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
              <h3 className="text-title-md text-on-surface group-hover:text-primary transition-colors line-clamp-3 mb-6 leading-snug font-bold">
                {q.title}
              </h3>
              <div className="flex items-center text-primary text-label-md font-bold mt-auto group-hover:translate-x-[-4px] transition-transform duration-300">
                اقرأ الإجابة
                <ChevronLeft size={18} className="mr-1" strokeWidth={2.5} aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

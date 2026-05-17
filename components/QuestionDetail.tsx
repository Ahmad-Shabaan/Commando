import { HelpCircle, MessageSquarePlus, ScrollText, SendHorizontal } from "lucide-react";
import Link from "next/link";
import ShortAnswer from "./ShortAnswer";
import AnswerContent from "./AnswerContent";
import type { Question, Answer } from "@/lib/types";
import { parseContentItems, flattenAnswerItems } from "@/lib/types";

export default function QuestionDetail({
  question,
  shortAnswer,
  detailedAnswers,
}: {
  question: Question;
  shortAnswer: Answer | null;
  detailedAnswers: Answer[];
}) {
  return (
    <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 border-b border-outline-variant/20 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 md:p-2.5 rounded-full text-primary shrink-0 mt-1 shadow-sm">
            <HelpCircle size={22} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-display-sm md:text-display-md text-primary font-bold leading-tight md:leading-tight">
            {question.title}
          </h1>
        </div>
      </header>

      {shortAnswer && <ShortAnswer content={flattenAnswerItems(shortAnswer)} />}

      {detailedAnswers.length > 0 && (
        <section className="space-y-6">
          {detailedAnswers.map((answer) => {
            const items = parseContentItems(answer.content_items, answer.content);
            return (
              <div
                key={answer.id}
                className="bg-surface-container-low border border-outline-variant/20 p-6 md:p-8 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <ScrollText size={20} className="text-primary" aria-hidden="true" />
                  <h2 className="text-title-md text-primary font-bold">إجابة تفصيلية:</h2>
                </div>
                <AnswerContent items={items} />
              </div>
            );
          })}
        </section>
      )}

      <div className="mt-10 md:mt-12 text-center bg-gradient-to-br from-primary/5 to-surface-container-low rounded-2xl border border-primary/20 p-8 md:p-10 shadow-sm">
        <div className="inline-flex items-center justify-center bg-primary/10 w-12 h-12 rounded-full mb-4 text-primary">
          <MessageSquarePlus className="size-5 sm:size-6" aria-hidden="true" />
        </div>
        <h2 className="text-headline-sm md:text-headline-md text-primary font-bold mb-4">
          هل لديك سؤال آخر؟
        </h2>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">
          إذا لم تجد إجابة وافية لسؤالك، يمكنك طرحه مباشرة وسيقوم مجتمعنا والخبراء بالإجابة عليه في أقرب وقت.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-label-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
        >
          <SendHorizontal className="size-5" aria-hidden="true" />
          اطرح سؤالك الآن
        </Link>
      </div>
    </article>
  );
}

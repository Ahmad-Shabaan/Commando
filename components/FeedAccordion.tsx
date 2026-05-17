import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import QuestionCard from "./QuestionCard";
import AnswerList from "./AnswerList";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Question } from "@/lib/types";

export default function FeedAccordion({
  questions,
  openValue,
}: {
  questions: Question[];
  openValue?: string | null;
}) {
  return (
    <Accordion className="space-y-4" defaultValue={openValue ? [openValue] : []}>
      {questions.map((question) => (
        <AccordionItem
          key={question.id}
          value={String(question.id)}
          className="text-right bg-surface border-2 border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-primary/40 data-open:border-primary/50 relative group/accordion"
          data-animate-feed
          data-question-id={question.id}
        >
          {question.slug && (
            <Link href={`/tajneed/${question.slug}`} className="sr-only">
              {question.title}
            </Link>
          )}
          <AccordionTrigger className="text-label-lg md:text-title-md p-5 md:p-6 cursor-pointer text-on-surface justify-between w-full flex items-center data-open:bg-surface-container-lowest transition-colors hover:bg-surface-container-lowest">
            <QuestionCard question={question} />
          </AccordionTrigger>
          <AccordionContent className="bg-surface-container-lowest p-5 md:p-6 pt-0 text-on-surface-variant border-t border-outline-variant/10">
            <AnswerList questionId={question.id} questionSlug={question.slug} />
            {/* questionSlug={question.slug */}
            {/* {question.slug && (
              <div className="mt-6 pt-5 border-t border-outline-variant/10 flex justify-end">
                <Link
                  href={`/tajneed/${question.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-bold text-label-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-lg"
                >
                  اقرأ الإجابة الكاملة
                  <ChevronLeft size={18} strokeWidth={2.5} aria-hidden="true" />
                </Link>
              </div>
            )} */}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

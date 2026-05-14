import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import QuestionCard from "./QuestionCard";
import AnswerList from "./AnswerList";

interface Question {
  id: number;
  title: string;
  created_at: string;
}

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
          className="text-right bg-surface-container-low rounded-xl border border-outline-variant/20 overflow-hidden shadow-md"
          data-animate-feed
          data-question-id={question.id}
        >
          <AccordionTrigger className="text-label-md p-4 cursor-pointer text-on-surface justify-between w-full flex items-center data-open:bg-surface-container transition-colors hover:bg-surface-container">
            <QuestionCard question={question} />
          </AccordionTrigger>
          <AccordionContent className="bg-surface p-4 pt-0 text-on-surface-variant border-t border-outline-variant/10">
            <AnswerList questionId={question.id} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

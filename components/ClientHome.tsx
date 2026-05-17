"use client";

import QuestionFeed from "./QuestionFeed";
import AddQuestionForm from "./AddQuestionForm";
import type { Question } from "@/lib/types";

export default function ClientHome({ initialQuestions }: { initialQuestions: Question[] }) {
  return (
    <div className="container w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-8">
        <QuestionFeed initialQuestions={initialQuestions} />
      </div>
      <div className="lg:col-span-4">
        <div className="sticky top-[100px]">
          <AddQuestionForm />
        </div>
      </div>
    </div>
  );
}

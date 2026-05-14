"use client";

import dynamic from "next/dynamic";

const QuestionFeed = dynamic(() => import("./QuestionFeed"), { ssr: false });
const AddQuestionForm = dynamic(() => import("./AddQuestionForm"), { ssr: false });

export default function ClientHome() {
  return (
    <div className="container w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 grid grid-cols-1 md:grid-cols-12 gap-gutter" suppressHydrationWarning>
      <div className="md:col-span-8 space-y-8" suppressHydrationWarning>
        <QuestionFeed />
      </div>
      <div className="md:col-span-4" suppressHydrationWarning>
        <div className="sticky top-[100px]" suppressHydrationWarning>
          <AddQuestionForm />
        </div>
      </div>
    </div>
  );
}

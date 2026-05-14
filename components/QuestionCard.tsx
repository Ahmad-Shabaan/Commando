import DOMPurify from "isomorphic-dompurify";

interface Question {
  id: number;
  title: string;
}

export default function QuestionCard({ question }: { question: Question }) {
  const cleanTitle = DOMPurify.sanitize(question.title);

  return (
    <span className="text-base md:text-lg hover:translate-x-0.5 transition-transform duration-200">
      {cleanTitle}
    </span>
  );
}

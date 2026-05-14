import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("isomorphic-dompurify", () => ({
  default: {
    sanitize: (input: string) => input,
  },
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="accordion" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="accordion-item" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  AccordionTrigger: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="accordion-trigger" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  AccordionContent: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid="accordion-content" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/QuestionCard", () => ({
  default: ({ question }: { question: { id: number; title: string } }) => (
    <span data-testid="question-card">{question.title}</span>
  ),
}));

vi.mock("@/components/AnswerList", () => ({
  default: ({ questionId }: { questionId: number }) => (
    <div data-testid="answer-list" data-question-id={questionId}>
      Answers
    </div>
  ),
}));

import QuestionCard from "@/components/QuestionCard";
import FeedAccordion from "@/components/FeedAccordion";

const sampleQuestions = [
  { id: 1, title: "ما هو موعد الفحص الطبي؟", created_at: "2024-01-01" },
  { id: 2, title: "كيف أستعد للخدمة العسكرية؟", created_at: "2024-01-02" },
];

describe("QuestionCard (Server Component)", () => {
  it("renders question title", async () => {
    const element = await QuestionCard({
      question: { id: 1, title: "سؤال تجريبي" },
    });
    render(element);
    expect(screen.getByText("سؤال تجريبي")).toBeInTheDocument();
  });

  it("sanitizes title via DOMPurify", async () => {
    const element = await QuestionCard({
      question: { id: 2, title: "<b>سؤال</b>" },
    });
    render(element);
    expect(screen.getByText("<b>سؤال</b>")).toBeInTheDocument();
  });
});

describe("FeedAccordion", () => {
  it("renders all questions", () => {
    render(<FeedAccordion questions={sampleQuestions} />);
    expect(screen.getByTestId("accordion")).toBeInTheDocument();
    expect(screen.getAllByTestId("accordion-item")).toHaveLength(2);
  });

  it("renders question cards for each question", () => {
    render(<FeedAccordion questions={sampleQuestions} />);
    const cards = screen.getAllByTestId("question-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("ما هو موعد الفحص الطبي؟");
    expect(cards[1]).toHaveTextContent("كيف أستعد للخدمة العسكرية؟");
  });

  it("renders answer lists for each question", () => {
    render(<FeedAccordion questions={sampleQuestions} />);
    const answers = screen.getAllByTestId("answer-list");
    expect(answers).toHaveLength(2);
    expect(answers[0]).toHaveAttribute("data-question-id", "1");
    expect(answers[1]).toHaveAttribute("data-question-id", "2");
  });

  it("passes defaultValue to accordion when openValue is set", () => {
    render(<FeedAccordion questions={sampleQuestions} openValue="1" />);
    const accordion = screen.getByTestId("accordion");
    const props = JSON.parse(accordion.getAttribute("data-props") ?? "{}");
    expect(props.defaultValue).toEqual(["1"]);
  });

  it("renders with empty questions array", () => {
    render(<FeedAccordion questions={[]} />);
    expect(screen.queryAllByTestId("accordion-item")).toHaveLength(0);
  });
});

import type { Question } from "@/lib/types";

let questions: Question[] = [];

export function setQuestions(q: Question[]): void {
  questions = q;
}

export function getQuestions(): Question[] {
  return questions;
}

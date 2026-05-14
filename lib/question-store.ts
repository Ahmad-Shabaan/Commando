interface Question {
  id: number;
  title: string;
  created_at: string;
}

let questions: Question[] = [];

export function setQuestions(q: Question[]): void {
  questions = q;
}

export function getQuestions(): Question[] {
  return questions;
}

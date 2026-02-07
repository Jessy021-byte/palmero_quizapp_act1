export interface QuizQuestion {
  id: number;
  type: string;
  question: string;
  choices: Record<string, string>;
  answer: string | string[];
}

export const questions: QuizQuestion[];

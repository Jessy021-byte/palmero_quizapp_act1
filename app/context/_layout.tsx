import React, { createContext, useContext, useState } from "react";
import { questions as defaultQuestions } from "../../questions";

interface QuizQuestion {
  id: number;
  type: string;
  question: string;
  choices: Record<string, string>;
  answer: string | string[];
}

interface QuizContextType {
  quizQuestions: QuizQuestion[];
  setQuizQuestions: (questions: QuizQuestion[]) => void;
  timerDuration: number;
  setTimerDuration: (duration: number) => void;
  defaultQuestions: QuizQuestion[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(defaultQuestions);
  const [timerDuration, setTimerDuration] = useState(300);

  return (
    <QuizContext.Provider
      value={{
        quizQuestions,
        setQuizQuestions,
        timerDuration,
        setTimerDuration,
        defaultQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within QuizProvider");
  }
  return context;
}

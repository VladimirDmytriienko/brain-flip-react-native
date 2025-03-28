export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  answers: Answer[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export const STORAGE_KEY = 'quizzes'; 
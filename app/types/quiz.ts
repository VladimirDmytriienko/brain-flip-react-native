export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  answers: Answer[];
  correctAnswer: string | null;
}

export interface Quiz {
  id: string | number;
  title: string;
  questions: Question[];
  createdAt?: string;
} 
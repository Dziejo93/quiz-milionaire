import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EntityId } from '@/shared/types';

export interface AdminQuestion {
  id: string;
  text: string;
  type: 'text' | 'image';
  imageUrl?: string;
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface AdminQuiz {
  id: EntityId;
  title: string;
  description: string;
  questions: AdminQuestion[];
  prizeStructure: {
    level: number;
    amount: number;
    isSafeHaven: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface AdminStore {
  quizzes: AdminQuiz[];
  currentQuiz: AdminQuiz | null;

  // Quiz management
  createQuiz: (quiz: Omit<AdminQuiz, 'id' | 'createdAt' | 'updatedAt'>) => AdminQuiz;
  updateQuiz: (id: EntityId, updates: Partial<AdminQuiz>) => void;
  deleteQuiz: (id: EntityId) => void;
  setCurrentQuiz: (quiz: AdminQuiz | null) => void;

  // Question management
  addQuestion: (quizId: EntityId, question: Omit<AdminQuestion, 'id'>) => void;
  updateQuestion: (quizId: EntityId, questionId: string, updates: Partial<AdminQuestion>) => void;
  deleteQuestion: (quizId: EntityId, questionId: string) => void;
  reorderQuestions: (quizId: EntityId, questionIds: string[]) => void;

  // Prize management
  updatePrizeStructure: (quizId: EntityId, prizeStructure: AdminQuiz['prizeStructure']) => void;
}

const defaultPrizeStructure = [
  { level: 1, amount: 100, isSafeHaven: false },
  { level: 2, amount: 200, isSafeHaven: false },
  { level: 3, amount: 300, isSafeHaven: false },
  { level: 4, amount: 500, isSafeHaven: false },
  { level: 5, amount: 1000, isSafeHaven: true },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      quizzes: [],
      currentQuiz: null,

      createQuiz: (quizData) => {
        const newQuiz: AdminQuiz = {
          ...quizData,
          id: `quiz-${Date.now()}` as EntityId,
          createdAt: new Date(),
          updatedAt: new Date(),
          prizeStructure:
            quizData.prizeStructure.length > 0 ? quizData.prizeStructure : defaultPrizeStructure,
        };

        set((state) => ({
          quizzes: [...state.quizzes, newQuiz],
        }));

        return newQuiz;
      },

      updateQuiz: (id, updates) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === id ? { ...quiz, ...updates, updatedAt: new Date() } : quiz
          ),
          currentQuiz:
            state.currentQuiz?.id === id
              ? { ...state.currentQuiz, ...updates, updatedAt: new Date() }
              : state.currentQuiz,
        }));
      },

      deleteQuiz: (id) => {
        set((state) => ({
          quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
          currentQuiz: state.currentQuiz?.id === id ? null : state.currentQuiz,
        }));
      },

      setCurrentQuiz: (quiz) => {
        set({ currentQuiz: quiz });
      },

      addQuestion: (quizId, questionData) => {
        const newQuestion: AdminQuestion = {
          ...questionData,
          id: `question-${Date.now()}`,
          answers: questionData.answers.map((answer, index) => ({
            ...answer,
            id: `answer-${Date.now()}-${index}`,
          })),
        };

        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: [...quiz.questions, newQuestion],
                  updatedAt: new Date(),
                }
              : quiz
          ),
        }));
      },

      updateQuestion: (quizId, questionId, questionData) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: quiz.questions.map((question) =>
                    question.id === questionId
                      ? {
                          ...question,
                          ...questionData,
                          answers:
                            questionData.answers?.map((answer, index) => ({
                              ...answer,
                              id: answer.id || `answer-${Date.now()}-${index}`,
                            })) || question.answers,
                        }
                      : question
                  ),
                  updatedAt: new Date(),
                }
              : quiz
          ),
        }));
      },

      deleteQuestion: (quizId, questionId) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: quiz.questions.filter((q) => q.id !== questionId),
                  updatedAt: new Date(),
                }
              : quiz
          ),
        }));
      },

      reorderQuestions: (quizId, questionIds) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId
              ? {
                  ...quiz,
                  questions: questionIds.map((id) => quiz.questions.find((q) => q.id === id)!),
                  updatedAt: new Date(),
                }
              : quiz
          ),
        }));
      },

      updatePrizeStructure: (quizId, prizeStructure) => {
        set((state) => ({
          quizzes: state.quizzes.map((quiz) =>
            quiz.id === quizId ? { ...quiz, prizeStructure, updatedAt: new Date() } : quiz
          ),
        }));
      },
    }),
    {
      name: 'admin-quiz-storage',
    }
  )
);

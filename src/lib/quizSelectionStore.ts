import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminQuiz } from '@/lib/adminStore';

interface QuizSelectionStore {
  selectedQuiz: AdminQuiz | null;
  setSelectedQuiz: (quiz: AdminQuiz | null) => void;
  clearSelectedQuiz: () => void;
}

export const useQuizSelectionStore = create<QuizSelectionStore>()(
  persist(
    (set) => ({
      selectedQuiz: null,

      setSelectedQuiz: (quiz) => {
        set({ selectedQuiz: quiz });
      },

      clearSelectedQuiz: () => {
        set({ selectedQuiz: null });
      },
    }),
    {
      name: 'quiz-selection-storage',
    }
  )
);

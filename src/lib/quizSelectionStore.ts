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
    (set, get) => ({
      selectedQuiz: null,

      setSelectedQuiz: (quiz) => {
        console.log('Setting selected quiz:', quiz?.title);
        set({ selectedQuiz: quiz });
      },

      clearSelectedQuiz: () => {
        console.log('Clearing selected quiz');
        set({ selectedQuiz: null });
      },
    }),
    {
      name: 'quiz-selection-storage',
      partialize: (state) => ({ selectedQuiz: state.selectedQuiz }),
      onRehydrateStorage: () => (state) => {
        console.log('Quiz selection store rehydrated:', state?.selectedQuiz?.title || 'No quiz selected');
      },
    }
  )
);

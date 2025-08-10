import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Question } from '../../domains/quiz/entities/Question';
import type { Quiz } from '../../domains/quiz/entities/Quiz';
import { GameSession } from '../../domains/session/entities/GameSession';
import { createMockQuiz, createMockSession } from '../../infrastructure/mock/mockData';
import type { EntityId } from '../../shared/types';

// Working mock API with real data
const mockQuiz = createMockQuiz();
let currentSession: GameSession | null = null;
let currentQuestionIndex = 0;

const mockApi = {
  async startQuiz(quizId: EntityId, userId: EntityId) {
    // Create a new session with real data
    currentSession = createMockSession(quizId, userId);
    currentQuestionIndex = 0;
    return { sessionId: currentSession.id, success: true };
  },

  async resumeSession(sessionId: EntityId) {
    // Return the current session and quiz data
    const currentQuestion =
      currentQuestionIndex < mockQuiz.questions.length
        ? mockQuiz.questions[currentQuestionIndex]
        : null;

    return {
      success: true,
      session: currentSession,
      quiz: mockQuiz,
      currentQuestion,
    };
  },

  async answerQuestion(
    sessionId: EntityId,
    questionId: EntityId,
    answerId: EntityId,
    timeUsed: number
  ) {
    if (!currentSession) {
      return { success: false, error: 'No active session' };
    }

    const currentQuestion = mockQuiz.questions[currentQuestionIndex];
    if (!currentQuestion) {
      return { success: false, error: 'No current question' };
    }

    const correctAnswer = currentQuestion.answers.find((a) => a.isCorrect);
    const isCorrect = answerId === correctAnswer?.id;

    if (isCorrect) {
      // Move to next question
      currentQuestionIndex++;
      const newLevel = currentQuestionIndex;
      const prizeLevel = mockQuiz.prizeLevels.find((p) => p.level === newLevel);
      const newPrizeAmount = prizeLevel?.amount || currentSession.currentPrizeAmount;

      // Update session
      currentSession = new GameSession(
        currentSession.id,
        currentSession.quizId,
        currentSession.userId,
        currentQuestionIndex >= mockQuiz.questions.length ? 'completed' : 'playing',
        newLevel,
        newPrizeAmount,
        mockQuiz.prizeLevels.filter((p) => p.isSafeHaven && p.level <= newLevel).pop()?.amount || 0,
        currentSession.startedAt,
        new Date()
      );

      return {
        success: true,
        isCorrect: true,
        correctAnswerId: correctAnswer?.id || answerId,
        newPrizeAmount,
        newGuaranteedAmount: currentSession.guaranteedAmount,
        gameCompleted: currentQuestionIndex >= mockQuiz.questions.length,
      };
    } else {
      // Wrong answer - game over
      currentSession = new GameSession(
        currentSession.id,
        currentSession.quizId,
        currentSession.userId,
        'completed',
        currentSession.currentQuestionLevel,
        currentSession.guaranteedAmount, // Fall back to guaranteed amount
        currentSession.guaranteedAmount,
        currentSession.startedAt,
        new Date()
      );

      return {
        success: true,
        isCorrect: false,
        correctAnswerId: correctAnswer?.id || answerId,
        newPrizeAmount: currentSession.guaranteedAmount,
        newGuaranteedAmount: currentSession.guaranteedAmount,
        gameCompleted: true,
      };
    }
  },

  async abandonSession(sessionId: EntityId) {
    if (!currentSession) {
      return { success: false, finalPrize: 0 };
    }

    const finalPrize = currentSession.currentPrizeAmount;
    currentSession = new GameSession(
      currentSession.id,
      currentSession.quizId,
      currentSession.userId,
      'completed',
      currentSession.currentQuestionLevel,
      finalPrize,
      finalPrize,
      currentSession.startedAt,
      new Date()
    );

    return { success: true, finalPrize };
  },
};

interface UseQuizSessionProps {
  quizId?: EntityId;
  sessionId?: EntityId;
  userId: EntityId;
}

export function useQuizSession({ quizId, sessionId, userId }: UseQuizSessionProps) {
  const [currentSessionId, setCurrentSessionId] = useState<EntityId | null>(sessionId || null);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'completed' | 'error'>(
    'loading'
  );
  const queryClient = useQueryClient();

  // Query to get current session data
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ['quiz-session', currentSessionId],
    queryFn: () => (currentSessionId ? mockApi.resumeSession(currentSessionId) : null),
    enabled: !!currentSessionId,
  });

  // Mutation to start a new quiz
  const startQuizMutation = useMutation({
    mutationFn: ({ quizId, userId }: { quizId: EntityId; userId: EntityId }) =>
      mockApi.startQuiz(quizId, userId),
    onSuccess: (data) => {
      if (data.success) {
        setCurrentSessionId(data.sessionId);
        setGameState('playing');
      } else {
        setGameState('error');
      }
    },
    onError: () => {
      setGameState('error');
    },
  });

  // Mutation to answer a question
  const answerQuestionMutation = useMutation({
    mutationFn: ({
      sessionId,
      questionId,
      answerId,
      timeUsed,
    }: {
      sessionId: EntityId;
      questionId: EntityId;
      answerId: EntityId;
      timeUsed: number;
    }) => mockApi.answerQuestion(sessionId, questionId, answerId, timeUsed),
    onSuccess: (data) => {
      if (data.gameCompleted) {
        setGameState('completed');
      }
      // Invalidate session data to refetch updated state
      queryClient.invalidateQueries({ queryKey: ['quiz-session', currentSessionId] });
    },
  });

  // Mutation to abandon/walk away from quiz
  const abandonSessionMutation = useMutation({
    mutationFn: (sessionId: EntityId) => mockApi.abandonSession(sessionId),
    onSuccess: () => {
      setGameState('completed');
    },
  });

  // Start a new quiz
  const startQuiz = (quizId: EntityId) => {
    startQuizMutation.mutate({ quizId, userId });
  };

  // Answer a question
  const answerQuestion = (questionId: EntityId, answerId: EntityId, timeUsed: number) => {
    if (!currentSessionId) return;
    answerQuestionMutation.mutate({
      sessionId: currentSessionId,
      questionId,
      answerId,
      timeUsed,
    });
  };

  // Walk away from the quiz
  const walkAway = () => {
    if (!currentSessionId) return;
    abandonSessionMutation.mutate(currentSessionId);
  };

  // Update game state based on session data
  useEffect(() => {
    if (sessionData?.success && sessionData.session) {
      if (sessionData.session.isCompleted()) {
        setGameState('completed');
      } else if (sessionData.session.isActive()) {
        setGameState('playing');
      }
    } else if (sessionError) {
      setGameState('error');
    }
  }, [sessionData, sessionError]);

  return {
    // State
    gameState,
    currentSessionId,
    session: sessionData?.session,
    quiz: sessionData?.quiz,
    currentQuestion: sessionData?.currentQuestion,

    // Loading states
    isLoading: isSessionLoading || startQuizMutation.isPending,
    isAnswering: answerQuestionMutation.isPending,

    // Actions
    startQuiz,
    answerQuestion,
    walkAway,

    // Results
    lastAnswerResult: answerQuestionMutation.data,

    // Errors
    error: sessionError || startQuizMutation.error || answerQuestionMutation.error,
  };
}

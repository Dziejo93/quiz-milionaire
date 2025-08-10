import { Question } from '../../domains/quiz/entities/Question';
import { Quiz } from '../../domains/quiz/entities/Quiz';
import { Answer } from '../../domains/quiz/value-objects/Answer';
import { GameSession } from '../../domains/session/entities/GameSession';
import type { EntityId, GameStatus, QuestionType } from '../../shared/types';

// Mock quiz data
export const mockQuizData = {
  id: 'demo-quiz-1' as EntityId,
  title: 'Who Wants to Be a Millionaire - Demo Quiz',
  description: 'A sample quiz with 15 questions',
  createdBy: 'admin' as EntityId,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  isActive: true,
  questions: [
    {
      id: 'q1' as EntityId,
      quizId: 'demo-quiz-1' as EntityId,
      text: 'What is the capital of France?',
      type: 'text' as QuestionType,
      order: 1,
      timeLimit: 30,
      answers: [
        { id: 'a1' as EntityId, text: 'London', isCorrect: false },
        { id: 'a2' as EntityId, text: 'Berlin', isCorrect: false },
        { id: 'a3' as EntityId, text: 'Paris', isCorrect: true },
        { id: 'a4' as EntityId, text: 'Madrid', isCorrect: false },
      ],
    },
    {
      id: 'q2' as EntityId,
      quizId: 'demo-quiz-1' as EntityId,
      text: 'Which planet is known as the Red Planet?',
      type: 'text' as QuestionType,
      order: 2,
      timeLimit: 30,
      answers: [
        { id: 'a5' as EntityId, text: 'Venus', isCorrect: false },
        { id: 'a6' as EntityId, text: 'Mars', isCorrect: true },
        { id: 'a7' as EntityId, text: 'Jupiter', isCorrect: false },
        { id: 'a8' as EntityId, text: 'Saturn', isCorrect: false },
      ],
    },
    {
      id: 'q3' as EntityId,
      quizId: 'demo-quiz-1' as EntityId,
      text: 'What is 2 + 2?',
      type: 'text' as QuestionType,
      order: 3,
      timeLimit: 30,
      answers: [
        { id: 'a9' as EntityId, text: '3', isCorrect: false },
        { id: 'a10' as EntityId, text: '4', isCorrect: true },
        { id: 'a11' as EntityId, text: '5', isCorrect: false },
        { id: 'a12' as EntityId, text: '6', isCorrect: false },
      ],
    },
    {
      id: 'q4' as EntityId,
      quizId: 'demo-quiz-1' as EntityId,
      text: 'Who wrote "Romeo and Juliet"?',
      type: 'text' as QuestionType,
      order: 4,
      timeLimit: 30,
      answers: [
        { id: 'a13' as EntityId, text: 'Charles Dickens', isCorrect: false },
        { id: 'a14' as EntityId, text: 'William Shakespeare', isCorrect: true },
        { id: 'a15' as EntityId, text: 'Jane Austen', isCorrect: false },
        { id: 'a16' as EntityId, text: 'Mark Twain', isCorrect: false },
      ],
    },
    {
      id: 'q5' as EntityId,
      quizId: 'demo-quiz-1' as EntityId,
      text: 'What is the largest ocean on Earth?',
      type: 'text' as QuestionType,
      order: 5,
      timeLimit: 30,
      answers: [
        { id: 'a17' as EntityId, text: 'Atlantic Ocean', isCorrect: false },
        { id: 'a18' as EntityId, text: 'Pacific Ocean', isCorrect: true },
        { id: 'a19' as EntityId, text: 'Indian Ocean', isCorrect: false },
        { id: 'a20' as EntityId, text: 'Arctic Ocean', isCorrect: false },
      ],
    },
  ],
  prizeLevels: [
    { level: 1, amount: 100, displayName: '$100', isSafeHaven: false },
    { level: 2, amount: 200, displayName: '$200', isSafeHaven: false },
    { level: 3, amount: 300, displayName: '$300', isSafeHaven: false },
    { level: 4, amount: 500, displayName: '$500', isSafeHaven: false },
    { level: 5, amount: 1000, displayName: '$1,000', isSafeHaven: true },
    { level: 6, amount: 2000, displayName: '$2,000', isSafeHaven: false },
    { level: 7, amount: 4000, displayName: '$4,000', isSafeHaven: false },
    { level: 8, amount: 8000, displayName: '$8,000', isSafeHaven: false },
    { level: 9, amount: 16000, displayName: '$16,000', isSafeHaven: false },
    { level: 10, amount: 32000, displayName: '$32,000', isSafeHaven: true },
    { level: 11, amount: 64000, displayName: '$64,000', isSafeHaven: false },
    { level: 12, amount: 125000, displayName: '$125,000', isSafeHaven: false },
    { level: 13, amount: 250000, displayName: '$250,000', isSafeHaven: false },
    { level: 14, amount: 500000, displayName: '$500,000', isSafeHaven: false },
    { level: 15, amount: 1000000, displayName: '$1,000,000', isSafeHaven: true },
  ],
};

// Create domain entities from mock data
export function createMockQuiz(): Quiz {
  const questions = mockQuizData.questions.map((q) => {
    const answers = q.answers.map((a, index) => new Answer(a.id, a.text, String.fromCharCode(65 + index)));
    const correctAnswer = q.answers.find(a => a.isCorrect);
    return new Question(
      q.id,
      q.text,
      q.type as QuestionType,
      answers,
      correctAnswer?.id || q.answers[0].id,
      q.order,
      q.timeLimit
    );
  });

  return new Quiz(
    mockQuizData.id,
    mockQuizData.title,
    mockQuizData.description,
    questions,
    mockQuizData.prizeLevels,
    new Date(mockQuizData.createdAt),
    new Date(mockQuizData.updatedAt),
    mockQuizData.createdBy,
    mockQuizData.isActive
  );
}

export function createMockSession(quizId: EntityId, userId: EntityId): GameSession {
  const sessionId = `session-${Date.now()}` as EntityId;
  return new GameSession(
    sessionId,
    quizId,
    userId,
    1, // current level
    'in_progress' as GameStatus,
    [], // answers
    new Date(), // started at
    undefined, // completed at
    0, // current prize amount
    0 // guaranteed amount
  );
}

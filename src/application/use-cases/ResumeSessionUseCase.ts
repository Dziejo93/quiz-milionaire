import type { Question } from '../../domains/quiz/entities/Question';
import type { Quiz } from '../../domains/quiz/entities/Quiz';
import type { QuizRepository } from '../../domains/quiz/repositories/QuizRepository';
import type { GameSession } from '../../domains/session/entities/GameSession';
import type { SessionRepository } from '../../domains/session/repositories/SessionRepository';
import type { EntityId } from '../../shared/types';

export interface ResumeSessionCommand {
  sessionId: EntityId;
}

export interface ResumeSessionResult {
  success: boolean;
  session?: GameSession;
  quiz?: Quiz;
  currentQuestion?: Question;
  error?: string;
}

export class ResumeSessionUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private quizRepository: QuizRepository
  ) {}

  async execute(command: ResumeSessionCommand): Promise<ResumeSessionResult> {
    try {
      // Get the session
      const session = await this.sessionRepository.findById(command.sessionId);
      if (!session) {
        return {
          success: false,
          error: 'Session not found',
        };
      }

      if (!session.canResume()) {
        return {
          success: false,
          error: 'Session cannot be resumed - it may be completed or abandoned',
        };
      }

      // Get the quiz
      const quiz = await this.quizRepository.findById(session.quizId);
      if (!quiz) {
        return {
          success: false,
          error: 'Quiz not found',
        };
      }

      // Get the current question
      const currentQuestion = quiz.getQuestionByLevel(session.currentLevel);
      if (!currentQuestion) {
        return {
          success: false,
          error: 'Current question not found',
        };
      }

      return {
        success: true,
        session,
        quiz,
        currentQuestion,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

import { v4 as uuidv4 } from 'uuid';
import type { QuizRepository } from '../../domains/quiz/repositories/QuizRepository';
import { GameSession } from '../../domains/session/entities/GameSession';
import type { SessionRepository } from '../../domains/session/repositories/SessionRepository';
import type { EntityId } from '../../shared/types';

export interface StartQuizCommand {
  quizId: EntityId;
  userId: EntityId;
}

export interface StartQuizResult {
  sessionId: EntityId;
  success: boolean;
  error?: string;
}

export class StartQuizUseCase {
  constructor(
    private quizRepository: QuizRepository,
    private sessionRepository: SessionRepository
  ) {}

  async execute(command: StartQuizCommand): Promise<StartQuizResult> {
    try {
      // Check if quiz exists and is active
      const quiz = await this.quizRepository.findById(command.quizId);
      if (!quiz) {
        return {
          sessionId: '',
          success: false,
          error: 'Quiz not found or inactive',
        };
      }

      // Check if user already has an active session for this quiz
      const existingSession = await this.sessionRepository.findActiveSessionByUser(command.userId);
      if (existingSession) {
        return {
          sessionId: existingSession.id,
          success: true,
        };
      }

      // Create new game session
      const sessionId = uuidv4();
      const gameSession = new GameSession(
        sessionId,
        command.quizId,
        command.userId,
        1, // Start at level 1
        'in_progress',
        [], // No answers yet
        new Date(),
        undefined, // Not completed
        0, // No prize amount yet
        0, // No guaranteed amount yet
        30 // Default time limit
      );

      await this.sessionRepository.save(gameSession);

      return {
        sessionId,
        success: true,
      };
    } catch (error) {
      return {
        sessionId: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

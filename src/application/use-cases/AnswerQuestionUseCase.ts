import type { QuizRepository } from '../../domains/quiz/repositories/QuizRepository';
import { GameSession } from '../../domains/session/entities/GameSession';
import type { SessionRepository } from '../../domains/session/repositories/SessionRepository';
import type { EntityId } from '../../shared/types';

export interface AnswerQuestionCommand {
  sessionId: EntityId;
  questionId: EntityId;
  answerId: EntityId;
  timeUsed: number;
}

export interface AnswerQuestionResult {
  success: boolean;
  isCorrect: boolean;
  correctAnswerId: EntityId;
  newPrizeAmount: number;
  newGuaranteedAmount: number;
  gameCompleted: boolean;
  finalPrize?: number;
  error?: string;
}

export class AnswerQuestionUseCase {
  constructor(
    private sessionRepository: SessionRepository,
    private quizRepository: QuizRepository
  ) {}

  async execute(command: AnswerQuestionCommand): Promise<AnswerQuestionResult> {
    try {
      // Get the current session
      const session = await this.sessionRepository.findById(command.sessionId);
      if (!session) {
        return {
          success: false,
          isCorrect: false,
          correctAnswerId: '',
          newPrizeAmount: 0,
          newGuaranteedAmount: 0,
          gameCompleted: true,
          error: 'Session not found',
        };
      }

      if (!session.isActive()) {
        return {
          success: false,
          isCorrect: false,
          correctAnswerId: '',
          newPrizeAmount: session.currentPrizeAmount,
          newGuaranteedAmount: session.guaranteedAmount,
          gameCompleted: true,
          error: 'Session is not active',
        };
      }

      // Get the quiz and current question
      const quiz = await this.quizRepository.findById(session.quizId);
      if (!quiz) {
        return {
          success: false,
          isCorrect: false,
          correctAnswerId: '',
          newPrizeAmount: 0,
          newGuaranteedAmount: 0,
          gameCompleted: true,
          error: 'Quiz not found',
        };
      }

      const currentQuestion = quiz.getQuestionByLevel(session.currentLevel);
      if (!currentQuestion) {
        return {
          success: false,
          isCorrect: false,
          correctAnswerId: '',
          newPrizeAmount: session.currentPrizeAmount,
          newGuaranteedAmount: session.guaranteedAmount,
          gameCompleted: true,
          error: 'Question not found',
        };
      }

      // Check if the answer is correct
      const isCorrect = currentQuestion.isAnswerCorrect(command.answerId);
      const correctAnswerId = currentQuestion.correctAnswerId;

      // Calculate new prize amounts
      let newPrizeAmount = session.currentPrizeAmount;
      let newGuaranteedAmount = session.guaranteedAmount;
      let gameCompleted = false;
      let finalPrize: number | undefined;

      if (isCorrect) {
        // Player answered correctly
        const currentPrize = quiz.getPrizeByLevel(session.currentLevel);
        if (currentPrize) {
          newPrizeAmount = currentPrize.amount;

          // Update guaranteed amount if this is a safe haven
          if (currentPrize.isSafeHaven) {
            newGuaranteedAmount = currentPrize.amount;
          }
        }

        // Check if this was the final question
        if (session.currentLevel >= quiz.questions.length) {
          gameCompleted = true;
          finalPrize = newPrizeAmount;
        }
      } else {
        // Player answered incorrectly - game ends
        gameCompleted = true;
        finalPrize = newGuaranteedAmount;
        newPrizeAmount = newGuaranteedAmount;
      }

      // Update the session
      const updatedSession = session.answerQuestion(
        command.questionId,
        command.answerId,
        isCorrect,
        command.timeUsed,
        newPrizeAmount,
        newGuaranteedAmount
      );

      await this.sessionRepository.update(updatedSession);

      return {
        success: true,
        isCorrect,
        correctAnswerId,
        newPrizeAmount,
        newGuaranteedAmount,
        gameCompleted,
        finalPrize,
      };
    } catch (error) {
      return {
        success: false,
        isCorrect: false,
        correctAnswerId: '',
        newPrizeAmount: 0,
        newGuaranteedAmount: 0,
        gameCompleted: true,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

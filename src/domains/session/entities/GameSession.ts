import {
  AnswerResult,
  type EntityId,
  type GameStatus,
  type Timestamp,
} from '../../../shared/types';
import { SessionAnswer } from '../value-objects/SessionAnswer';

export class GameSession {
  constructor(
    public readonly id: EntityId,
    public readonly quizId: EntityId,
    public readonly userId: EntityId,
    public readonly currentLevel: number,
    public readonly status: GameStatus,
    public readonly answers: SessionAnswer[],
    public readonly startedAt: Timestamp,
    public readonly completedAt?: Timestamp,
    public readonly currentPrizeAmount: number = 0,
    public readonly guaranteedAmount: number = 0,
    public readonly timeRemaining?: number // seconds remaining for current question
  ) {
    this.validateSession();
  }

  private validateSession(): void {
    if (this.currentLevel < 0) {
      throw new Error('Current level cannot be negative');
    }

    if (this.currentPrizeAmount < 0) {
      throw new Error('Prize amount cannot be negative');
    }

    if (this.guaranteedAmount < 0) {
      throw new Error('Guaranteed amount cannot be negative');
    }

    if (this.guaranteedAmount > this.currentPrizeAmount) {
      throw new Error('Guaranteed amount cannot exceed current prize amount');
    }
  }

  public answerQuestion(
    questionId: EntityId,
    answerId: EntityId,
    isCorrect: boolean,
    timeUsed: number,
    newPrizeAmount: number,
    newGuaranteedAmount?: number
  ): GameSession {
    const sessionAnswer = new SessionAnswer(
      questionId,
      answerId,
      isCorrect ? 'correct' : 'incorrect',
      timeUsed,
      new Date()
    );

    const newAnswers = [...this.answers, sessionAnswer];
    const newLevel = isCorrect ? this.currentLevel + 1 : this.currentLevel;
    const newStatus = isCorrect ? (newLevel > 15 ? 'completed' : 'in_progress') : 'completed'; // Game ends on wrong answer

    return new GameSession(
      this.id,
      this.quizId,
      this.userId,
      newLevel,
      newStatus,
      newAnswers,
      this.startedAt,
      newStatus === 'completed' ? new Date() : this.completedAt,
      newPrizeAmount,
      newGuaranteedAmount ?? this.guaranteedAmount,
      undefined // Reset time remaining
    );
  }

  public updateTimeRemaining(seconds: number): GameSession {
    return new GameSession(
      this.id,
      this.quizId,
      this.userId,
      this.currentLevel,
      this.status,
      this.answers,
      this.startedAt,
      this.completedAt,
      this.currentPrizeAmount,
      this.guaranteedAmount,
      seconds
    );
  }

  public abandon(): GameSession {
    return new GameSession(
      this.id,
      this.quizId,
      this.userId,
      this.currentLevel,
      'abandoned',
      this.answers,
      this.startedAt,
      new Date(),
      this.guaranteedAmount, // Player gets guaranteed amount
      this.guaranteedAmount
    );
  }

  public timeOut(): GameSession {
    const timeoutAnswer = new SessionAnswer(
      `question_${this.currentLevel}`, // We'll need the actual question ID
      '',
      'timeout',
      30, // Full time used
      new Date()
    );

    return new GameSession(
      this.id,
      this.quizId,
      this.userId,
      this.currentLevel,
      'completed',
      [...this.answers, timeoutAnswer],
      this.startedAt,
      new Date(),
      this.guaranteedAmount, // Player gets guaranteed amount on timeout
      this.guaranteedAmount
    );
  }

  public isActive(): boolean {
    return this.status === 'in_progress';
  }

  public isCompleted(): boolean {
    return this.status === 'completed';
  }

  public canResume(): boolean {
    return this.status === 'in_progress';
  }

  public getLastAnswer(): SessionAnswer | undefined {
    return this.answers[this.answers.length - 1];
  }

  public getCorrectAnswersCount(): number {
    return this.answers.filter((a) => a.result === 'correct').length;
  }

  public getTotalTimeUsed(): number {
    return this.answers.reduce((total, answer) => total + answer.timeUsed, 0);
  }
}

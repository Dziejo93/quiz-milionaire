import type { AnswerResult, EntityId, Timestamp } from '../../../shared/types';

export class SessionAnswer {
  constructor(
    public readonly questionId: EntityId,
    public readonly answerId: EntityId,
    public readonly result: AnswerResult,
    public readonly timeUsed: number, // seconds taken to answer
    public readonly answeredAt: Timestamp
  ) {
    this.validateSessionAnswer();
  }

  private validateSessionAnswer(): void {
    if (this.timeUsed < 0) {
      throw new Error('Time used cannot be negative');
    }

    if (this.timeUsed > 60) {
      throw new Error('Time used cannot exceed 60 seconds');
    }

    if (this.result === 'timeout' && this.answerId !== '') {
      throw new Error('Timeout answers should not have an answer ID');
    }

    if (this.result !== 'timeout' && this.answerId === '') {
      throw new Error('Non-timeout answers must have an answer ID');
    }
  }

  public isCorrect(): boolean {
    return this.result === 'correct';
  }

  public isIncorrect(): boolean {
    return this.result === 'incorrect';
  }

  public isTimeout(): boolean {
    return this.result === 'timeout';
  }

  public equals(other: SessionAnswer): boolean {
    return (
      this.questionId === other.questionId &&
      this.answerId === other.answerId &&
      this.result === other.result
    );
  }
}

import type { EntityId, PrizeLevel, Timestamp } from '../../../shared/types';
import type { Question } from './Question';

export class Quiz {
  constructor(
    public readonly id: EntityId,
    public readonly title: string,
    public readonly description: string,
    public readonly questions: Question[],
    public readonly prizeStructure: PrizeLevel[],
    public readonly createdAt: Timestamp,
    public readonly updatedAt: Timestamp,
    public readonly createdBy: EntityId,
    public readonly isActive: boolean = true
  ) {
    this.validateQuiz();
  }

  private validateQuiz(): void {
    if (this.questions.length === 0) {
      throw new Error('Quiz must have at least one question');
    }

    if (this.prizeStructure.length !== this.questions.length) {
      throw new Error('Prize structure must match number of questions');
    }

    // Validate prize structure is in ascending order
    for (let i = 1; i < this.prizeStructure.length; i++) {
      if (this.prizeStructure[i].amount <= this.prizeStructure[i - 1].amount) {
        throw new Error('Prize amounts must be in ascending order');
      }
    }
  }

  public getQuestionByLevel(level: number): Question | undefined {
    return this.questions[level - 1];
  }

  public getPrizeByLevel(level: number): PrizeLevel | undefined {
    return this.prizeStructure.find((p) => p.level === level);
  }

  public getMaxPrize(): PrizeLevel {
    return this.prizeStructure[this.prizeStructure.length - 1];
  }

  public getSafeHavens(): PrizeLevel[] {
    return this.prizeStructure.filter((p) => p.isSafeHaven);
  }

  public updatePrizeStructure(newStructure: PrizeLevel[]): Quiz {
    return new Quiz(
      this.id,
      this.title,
      this.description,
      this.questions,
      newStructure,
      this.createdAt,
      new Date(),
      this.createdBy,
      this.isActive
    );
  }

  public deactivate(): Quiz {
    return new Quiz(
      this.id,
      this.title,
      this.description,
      this.questions,
      this.prizeStructure,
      this.createdAt,
      new Date(),
      this.createdBy,
      false
    );
  }
}

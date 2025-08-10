import type { EntityId } from '../../../shared/types';

export class Answer {
  constructor(
    public readonly id: EntityId,
    public readonly text: string,
    public readonly label: string // A, B, C, D
  ) {
    this.validateAnswer();
  }

  private validateAnswer(): void {
    if (!this.text.trim()) {
      throw new Error('Answer text cannot be empty');
    }

    if (!['A', 'B', 'C', 'D'].includes(this.label)) {
      throw new Error('Answer label must be A, B, C, or D');
    }
  }

  public equals(other: Answer): boolean {
    return this.id === other.id;
  }
}

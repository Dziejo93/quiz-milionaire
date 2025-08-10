import type { EntityId, MediaContent, QuestionType } from '../../../shared/types';
import type { Answer } from '../value-objects/Answer';

export class Question {
  constructor(
    public readonly id: EntityId,
    public readonly text: string,
    public readonly type: QuestionType,
    public readonly answers: Answer[],
    public readonly correctAnswerId: EntityId,
    public readonly level: number,
    public readonly timeLimit: number = 30, // seconds
    public readonly media?: MediaContent
  ) {
    this.validateQuestion();
  }

  private validateQuestion(): void {
    if (this.answers.length !== 4) {
      throw new Error('Question must have exactly 4 answers');
    }

    const correctAnswer = this.answers.find((a) => a.id === this.correctAnswerId);
    if (!correctAnswer) {
      throw new Error('Correct answer ID must match one of the provided answers');
    }

    if (this.level < 1) {
      throw new Error('Question level must be at least 1');
    }

    if (this.timeLimit < 10) {
      throw new Error('Time limit must be at least 10 seconds');
    }

    // Validate media content for specific question types
    if (this.type === 'image' || this.type === 'audio') {
      if (!this.media) {
        throw new Error(`${this.type} question must have media content`);
      }
      if (this.media.type !== this.type) {
        throw new Error('Media type must match question type');
      }
    }
  }

  public getCorrectAnswer(): Answer {
    return this.answers.find((a) => a.id === this.correctAnswerId)!;
  }

  public isAnswerCorrect(answerId: EntityId): boolean {
    return answerId === this.correctAnswerId;
  }

  public shuffleAnswers(): Question {
    const shuffledAnswers = [...this.answers].sort(() => Math.random() - 0.5);
    return new Question(
      this.id,
      this.text,
      this.type,
      shuffledAnswers,
      this.correctAnswerId,
      this.level,
      this.timeLimit,
      this.media
    );
  }

  public hasMedia(): boolean {
    return this.media !== undefined;
  }

  public isImageQuestion(): boolean {
    return this.type === 'image';
  }

  public isAudioQuestion(): boolean {
    return this.type === 'audio';
  }
}

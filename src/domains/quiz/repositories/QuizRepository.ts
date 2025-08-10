import type { EntityId } from '../../../shared/types';
import type { Quiz } from '../entities/Quiz';

export interface QuizRepository {
  findById(id: EntityId): Promise<Quiz | null>;
  findAll(): Promise<Quiz[]>;
  findByCreator(creatorId: EntityId): Promise<Quiz[]>;
  findActiveQuizzes(): Promise<Quiz[]>;
  save(quiz: Quiz): Promise<void>;
  update(quiz: Quiz): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

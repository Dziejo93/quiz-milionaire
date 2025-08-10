import type { EntityId } from '../../../shared/types';
import type { GameSession } from '../entities/GameSession';

export interface SessionRepository {
  findById(id: EntityId): Promise<GameSession | null>;
  findByUserId(userId: EntityId): Promise<GameSession[]>;
  findActiveSessionByUser(userId: EntityId): Promise<GameSession | null>;
  findByQuizId(quizId: EntityId): Promise<GameSession[]>;
  save(session: GameSession): Promise<void>;
  update(session: GameSession): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

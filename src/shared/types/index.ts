// Base types used across domains
export type EntityId = string;
export type Timestamp = Date;

// Question types
export type QuestionType = 'text' | 'image' | 'audio';

export interface MediaContent {
  url: string;
  type: 'image' | 'audio';
  alt?: string; // for accessibility
}

// Prize money configuration
export interface PrizeLevel {
  level: number;
  amount: number;
  displayName: string;
  isSafeHaven?: boolean; // guaranteed minimum if reached
}

// Game state
export type GameStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';
export type AnswerResult = 'correct' | 'incorrect' | 'timeout';

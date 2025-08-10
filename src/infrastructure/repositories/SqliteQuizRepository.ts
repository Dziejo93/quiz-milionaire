import { Question } from '../../domains/quiz/entities/Question';
import { Quiz } from '../../domains/quiz/entities/Quiz';
import type { QuizRepository } from '../../domains/quiz/repositories/QuizRepository';
import { Answer } from '../../domains/quiz/value-objects/Answer';
import type { EntityId, PrizeLevel } from '../../shared/types';
import { getDatabase } from '../database/connection';

export class SqliteQuizRepository implements QuizRepository {
  private db = getDatabase();

  async findById(id: EntityId): Promise<Quiz | null> {
    const quizRow = this.db
      .prepare(`
      SELECT * FROM quizzes WHERE id = ? AND is_active = TRUE
    `)
      .get(id) as any;

    if (!quizRow) return null;

    const questions = await this.getQuestionsByQuizId(id);
    const prizeStructure = await this.getPrizeStructureByQuizId(id);

    return new Quiz(
      quizRow.id,
      quizRow.title,
      quizRow.description,
      questions,
      prizeStructure,
      new Date(quizRow.created_at),
      new Date(quizRow.updated_at),
      quizRow.created_by,
      quizRow.is_active
    );
  }

  async findAll(): Promise<Quiz[]> {
    const quizRows = this.db
      .prepare(`
      SELECT * FROM quizzes WHERE is_active = TRUE ORDER BY created_at DESC
    `)
      .all() as any[];

    const quizzes = await Promise.all(
      quizRows.map(async (row) => {
        const questions = await this.getQuestionsByQuizId(row.id);
        const prizeStructure = await this.getPrizeStructureByQuizId(row.id);

        return new Quiz(
          row.id,
          row.title,
          row.description,
          questions,
          prizeStructure,
          new Date(row.created_at),
          new Date(row.updated_at),
          row.created_by,
          row.is_active
        );
      })
    );

    return quizzes;
  }

  async findByCreator(creatorId: EntityId): Promise<Quiz[]> {
    const quizRows = this.db
      .prepare(`
      SELECT * FROM quizzes WHERE created_by = ? AND is_active = TRUE ORDER BY created_at DESC
    `)
      .all(creatorId) as any[];

    const quizzes = await Promise.all(
      quizRows.map(async (row) => {
        const questions = await this.getQuestionsByQuizId(row.id);
        const prizeStructure = await this.getPrizeStructureByQuizId(row.id);

        return new Quiz(
          row.id,
          row.title,
          row.description,
          questions,
          prizeStructure,
          new Date(row.created_at),
          new Date(row.updated_at),
          row.created_by,
          row.is_active
        );
      })
    );

    return quizzes;
  }

  async findActiveQuizzes(): Promise<Quiz[]> {
    return this.findAll(); // Same as findAll since we already filter by is_active
  }

  async save(quiz: Quiz): Promise<void> {
    const transaction = this.db.transaction(() => {
      // Insert quiz
      this.db
        .prepare(`
        INSERT INTO quizzes (id, title, description, created_at, updated_at, created_by, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
        .run(
          quiz.id,
          quiz.title,
          quiz.description,
          quiz.createdAt.toISOString(),
          quiz.updatedAt.toISOString(),
          quiz.createdBy,
          quiz.isActive
        );

      // Insert questions and answers
      quiz.questions.forEach((question) => {
        this.db
          .prepare(`
          INSERT INTO questions (id, quiz_id, text, type, level, time_limit, media_url, media_type, media_alt, correct_answer_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
          .run(
            question.id,
            quiz.id,
            question.text,
            question.type,
            question.level,
            question.timeLimit,
            question.media?.url || null,
            question.media?.type || null,
            question.media?.alt || null,
            question.correctAnswerId
          );

        // Insert answers
        question.answers.forEach((answer) => {
          this.db
            .prepare(`
            INSERT INTO answers (id, question_id, text, label)
            VALUES (?, ?, ?, ?)
          `)
            .run(answer.id, question.id, answer.text, answer.label);
        });
      });

      // Insert prize structure
      quiz.prizeStructure.forEach((prize) => {
        this.db
          .prepare(`
          INSERT INTO prize_levels (id, quiz_id, level, amount, display_name, is_safe_haven)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
          .run(
            `${quiz.id}_prize_${prize.level}`,
            quiz.id,
            prize.level,
            prize.amount,
            prize.displayName,
            prize.isSafeHaven || false
          );
      });
    });

    transaction();
  }

  async update(quiz: Quiz): Promise<void> {
    this.db
      .prepare(`
      UPDATE quizzes 
      SET title = ?, description = ?, updated_at = ?, is_active = ?
      WHERE id = ?
    `)
      .run(quiz.title, quiz.description, quiz.updatedAt.toISOString(), quiz.isActive, quiz.id);
  }

  async delete(id: EntityId): Promise<void> {
    this.db
      .prepare(`
      UPDATE quizzes SET is_active = FALSE WHERE id = ?
    `)
      .run(id);
  }

  private async getQuestionsByQuizId(quizId: EntityId): Promise<Question[]> {
    const questionRows = this.db
      .prepare(`
      SELECT * FROM questions WHERE quiz_id = ? ORDER BY level ASC
    `)
      .all(quizId) as any[];

    const questions = await Promise.all(
      questionRows.map(async (row) => {
        const answers = await this.getAnswersByQuestionId(row.id);

        return new Question(
          row.id,
          row.text,
          row.type,
          answers,
          row.correct_answer_id,
          row.level,
          row.time_limit,
          row.media_url
            ? {
                url: row.media_url,
                type: row.media_type,
                alt: row.media_alt,
              }
            : undefined
        );
      })
    );

    return questions;
  }

  private async getAnswersByQuestionId(questionId: EntityId): Promise<Answer[]> {
    const answerRows = this.db
      .prepare(`
      SELECT * FROM answers WHERE question_id = ? ORDER BY label ASC
    `)
      .all(questionId) as any[];

    return answerRows.map((row) => new Answer(row.id, row.text, row.label));
  }

  private async getPrizeStructureByQuizId(quizId: EntityId): Promise<PrizeLevel[]> {
    const prizeRows = this.db
      .prepare(`
      SELECT * FROM prize_levels WHERE quiz_id = ? ORDER BY level ASC
    `)
      .all(quizId) as any[];

    return prizeRows.map((row) => ({
      level: row.level,
      amount: row.amount,
      displayName: row.display_name,
      isSafeHaven: row.is_safe_haven,
    }));
  }
}

// Simple quiz implementation that actually works
export interface SimpleQuestion {
  id: string;
  text: string;
  answers: SimpleAnswer[];
}

export interface SimpleAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface SimpleQuiz {
  id: string;
  title: string;
  questions: SimpleQuestion[];
  prizeLevels: PrizeLevel[];
}

export interface PrizeLevel {
  level: number;
  amount: number;
  displayName: string;
  isSafeHaven: boolean;
}

export interface GameState {
  currentQuestionIndex: number;
  currentPrizeAmount: number;
  guaranteedAmount: number;
  isCompleted: boolean;
  isCorrectAnswer?: boolean;
}

// Working demo quiz data
export const demoQuiz: SimpleQuiz = {
  id: 'demo-quiz',
  title: 'Who Wants to Be a Millionaire - Demo',
  questions: [
    {
      id: 'q1',
      text: 'What is the capital of France?',
      answers: [
        { id: 'a1', text: 'London', isCorrect: false },
        { id: 'a2', text: 'Berlin', isCorrect: false },
        { id: 'a3', text: 'Paris', isCorrect: true },
        { id: 'a4', text: 'Madrid', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      text: 'Which planet is known as the Red Planet?',
      answers: [
        { id: 'a5', text: 'Venus', isCorrect: false },
        { id: 'a6', text: 'Mars', isCorrect: true },
        { id: 'a7', text: 'Jupiter', isCorrect: false },
        { id: 'a8', text: 'Saturn', isCorrect: false },
      ],
    },
    {
      id: 'q3',
      text: 'What is 2 + 2?',
      answers: [
        { id: 'a9', text: '3', isCorrect: false },
        { id: 'a10', text: '4', isCorrect: true },
        { id: 'a11', text: '5', isCorrect: false },
        { id: 'a12', text: '6', isCorrect: false },
      ],
    },
    {
      id: 'q4',
      text: 'Who wrote "Romeo and Juliet"?',
      answers: [
        { id: 'a13', text: 'Charles Dickens', isCorrect: false },
        { id: 'a14', text: 'William Shakespeare', isCorrect: true },
        { id: 'a15', text: 'Jane Austen', isCorrect: false },
        { id: 'a16', text: 'Mark Twain', isCorrect: false },
      ],
    },
    {
      id: 'q5',
      text: 'What is the largest ocean on Earth?',
      answers: [
        { id: 'a17', text: 'Atlantic Ocean', isCorrect: false },
        { id: 'a18', text: 'Pacific Ocean', isCorrect: true },
        { id: 'a19', text: 'Indian Ocean', isCorrect: false },
        { id: 'a20', text: 'Arctic Ocean', isCorrect: false },
      ],
    },
  ],
  prizeLevels: [
    { level: 1, amount: 100, displayName: '$100', isSafeHaven: false },
    { level: 2, amount: 200, displayName: '$200', isSafeHaven: false },
    { level: 3, amount: 300, displayName: '$300', isSafeHaven: false },
    { level: 4, amount: 500, displayName: '$500', isSafeHaven: false },
    { level: 5, amount: 1000, displayName: '$1,000', isSafeHaven: true },
  ],
};

// Simple game logic
export class SimpleQuizGame {
  private quiz: SimpleQuiz;
  private gameState: GameState;

  constructor(quiz: SimpleQuiz) {
    this.quiz = quiz;
    this.gameState = {
      currentQuestionIndex: 0,
      currentPrizeAmount: 0,
      guaranteedAmount: 0,
      isCompleted: false,
    };
  }

  getCurrentQuestion(): SimpleQuestion | null {
    if (this.gameState.currentQuestionIndex >= this.quiz.questions.length) {
      return null;
    }
    return this.quiz.questions[this.gameState.currentQuestionIndex];
  }

  answerQuestion(answerId: string): {
    isCorrect: boolean;
    gameCompleted: boolean;
    newPrizeAmount: number;
  } {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      return {
        isCorrect: false,
        gameCompleted: true,
        newPrizeAmount: this.gameState.guaranteedAmount,
      };
    }

    const selectedAnswer = currentQuestion.answers.find((a) => a.id === answerId);
    const isCorrect = selectedAnswer?.isCorrect || false;

    if (isCorrect) {
      // Move to next question
      this.gameState.currentQuestionIndex++;
      const newLevel = this.gameState.currentQuestionIndex;
      const prizeLevel = this.quiz.prizeLevels.find((p) => p.level === newLevel);

      if (prizeLevel) {
        this.gameState.currentPrizeAmount = prizeLevel.amount;
        if (prizeLevel.isSafeHaven) {
          this.gameState.guaranteedAmount = prizeLevel.amount;
        }
      }

      // Check if game is completed
      const gameCompleted = this.gameState.currentQuestionIndex >= this.quiz.questions.length;
      if (gameCompleted) {
        this.gameState.isCompleted = true;
      }

      return {
        isCorrect: true,
        gameCompleted,
        newPrizeAmount: this.gameState.currentPrizeAmount,
      };
    } else {
      // Wrong answer - game over, fall back to guaranteed amount
      this.gameState.currentPrizeAmount = this.gameState.guaranteedAmount;
      this.gameState.isCompleted = true;

      return {
        isCorrect: false,
        gameCompleted: true,
        newPrizeAmount: this.gameState.guaranteedAmount,
      };
    }
  }

  walkAway(): number {
    this.gameState.isCompleted = true;
    return this.gameState.currentPrizeAmount;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getQuiz(): SimpleQuiz {
    return this.quiz;
  }
}

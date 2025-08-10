import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { QuizSelector } from '@/components/QuizSelector';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type AdminQuestion, type AdminQuiz, useAdminStore } from '@/lib/adminStore';
import { useQuizSelectionStore } from '@/lib/quizSelectionStore';

export const Route = createFileRoute('/quiz-old')({
  component: Quiz,
});

interface GameState {
  currentQuestionIndex: number;
  currentPrizeAmount: number;
  isGameCompleted: boolean;
  isGameWon: boolean;
  correctAnswers: number;
}

function Quiz() {
  const navigate = useNavigate();
  const { selectedQuiz, setSelectedQuiz } = useQuizSelectionStore();
  const quizzes = useAdminStore((state) => state.quizzes);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AdminQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswering, setIsAnswering] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!game || !currentQuestion || showResult || isAnswering) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit wrong answer
          handleAnswer('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game, currentQuestion, showResult, isAnswering]);

  const startQuiz = () => {
    const newGame = new SimpleQuizGame(demoQuiz);
    setGame(newGame);
    setGameState(newGame.getGameState());
    setCurrentQuestion(newGame.getCurrentQuestion());
    setTimeLeft(30);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answerId: string) => {
    if (!game || isAnswering) return;

    setIsAnswering(true);
    setSelectedAnswer(answerId);

    setTimeout(() => {
      const result = game.answerQuestion(answerId);
      const newGameState = game.getGameState();

      setGameState(newGameState);
      setShowResult(true);

      setTimeout(() => {
        if (!result.gameCompleted) {
          // Move to next question
          setCurrentQuestion(game.getCurrentQuestion());
          setTimeLeft(30);
          setShowResult(false);
          setSelectedAnswer(null);
        }
        setIsAnswering(false);
      }, 2000);
    }, 1000);
  };

  const handleWalkAway = () => {
    if (!game) return;
    const finalPrize = game.walkAway();
    setGameState(game.getGameState());
  };

  // Not started state
  if (!game) {
    return (
      <div className="min-h-screen millionaire-gradient flex items-center justify-center p-4">
        <div className="millionaire-card rounded-lg max-w-2xl mx-auto p-8">
          <div className="text-center space-y-6">
            <h1 className="millionaire-title text-5xl font-bold mb-4">WHO WANTS TO BE A</h1>
            <h1 className="millionaire-title text-6xl font-bold mb-6">MILLIONAIRE?</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Test your knowledge and climb the prize ladder to win big!
            </p>

            <div className="millionaire-card rounded-lg p-6 space-y-3 text-left">
              <h3 className="millionaire-prize text-lg font-semibold mb-4 text-center">
                GAME RULES
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• Answer 5 multiple choice questions correctly</p>
                <p>• Each question has a 30-second time limit</p>
                <p>• Prize money increases with each correct answer</p>
                <p>• Wrong answers end the game - you keep guaranteed winnings</p>
                <p>• You can walk away with current winnings at any time</p>
              </div>
            </div>

            <Button
              onClick={startQuiz}
              size="lg"
              className="millionaire-button text-xl px-12 py-4 rounded-lg font-semibold"
            >
              🎯 START THE GAME
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game completed state
  if (gameState?.isCompleted) {
    const isWinner = gameState.currentPrizeAmount >= 1000;
    return (
      <div className="min-h-screen millionaire-gradient flex items-center justify-center p-4">
        <div className="millionaire-card rounded-lg max-w-3xl mx-auto p-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="millionaire-title text-4xl font-bold">
                {isWinner ? '🎉 CONGRATULATIONS! 🎉' : '💔 GAME OVER'}
              </h1>
              <h2 className="millionaire-title text-3xl font-bold">
                {isWinner ? 'YOU ARE A WINNER!' : 'BETTER LUCK NEXT TIME!'}
              </h2>
            </div>

            <div className="millionaire-glow rounded-lg p-8">
              <p className="text-2xl mb-4 text-muted-foreground">
                {isWinner ? 'Your Final Prize:' : 'You Leave With:'}
              </p>
              <div className="millionaire-prize text-8xl font-bold mb-4">
                ${gameState.currentPrizeAmount.toLocaleString()}
              </div>
              <div className="text-lg text-muted-foreground">
                {isWinner
                  ? `Amazing! You've won $${gameState.currentPrizeAmount.toLocaleString()}!`
                  : `You played well and earned $${gameState.currentPrizeAmount.toLocaleString()}!`}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  setGame(null);
                  setGameState(null);
                  setCurrentQuestion(null);
                }}
                size="lg"
                className="millionaire-button text-xl px-12 py-4 rounded-lg font-semibold"
              >
                🎯 PLAY AGAIN
              </Button>
              <p className="text-sm text-muted-foreground">Think you can do better? Try again!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  if (!currentQuestion || !gameState) {
    return <div>Loading...</div>;
  }

  const currentLevel = gameState.currentQuestionIndex + 1;
  const progress = (gameState.currentQuestionIndex / demoQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen millionaire-gradient p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with progress and prize */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="millionaire-card rounded-lg p-6">
            <div className="text-center">
              <div className="millionaire-prize text-3xl font-bold mb-2">
                Question {currentLevel}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                of {demoQuiz.questions.length}
              </div>
              <Progress value={progress} className="h-3 bg-millionaire-blue-light" />
            </div>
          </div>

          <div className="millionaire-card millionaire-glow rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">CURRENT PRIZE</div>
              <div className="millionaire-prize text-4xl font-bold">
                ${gameState.currentPrizeAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="millionaire-card rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">TIME LEFT</div>
              <div
                className={`text-4xl font-bold ${
                  timeLeft <= 10 ? 'millionaire-timer-danger' : 'millionaire-timer'
                }`}
              >
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="millionaire-question rounded-lg p-8 mt-8">
          <h2 className="text-3xl font-bold text-center mb-8 millionaire-prize">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentQuestion.answers.map((answer, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              let buttonClass =
                'millionaire-button h-20 text-left justify-start text-lg font-semibold p-6';

              if (showResult && selectedAnswer === answer.id) {
                buttonClass += answer.isCorrect
                  ? ' millionaire-button-correct'
                  : ' millionaire-button-incorrect';
              } else if (showResult && answer.isCorrect) {
                buttonClass += ' millionaire-button-correct';
              } else if (selectedAnswer === answer.id && !showResult) {
                buttonClass += ' millionaire-button-selected';
              }

              return (
                <Button
                  key={answer.id}
                  className={buttonClass}
                  onClick={() => handleAnswer(answer.id)}
                  disabled={showResult || isAnswering}
                >
                  <span className="millionaire-prize text-xl font-bold mr-4">
                    {letters[index]}:
                  </span>
                  <span>{answer.text}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Walk Away Button */}
        {!showResult && gameState.currentPrizeAmount > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={handleWalkAway}
              className="millionaire-button px-8 py-4 text-lg font-semibold"
            >
              💰 WALK AWAY WITH ${gameState.currentPrizeAmount.toLocaleString()}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Secure your winnings and end the game
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

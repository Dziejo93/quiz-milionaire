import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { QuizSelector } from '@/components/QuizSelector';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AdminQuestion } from '@/lib/adminStore';
import { useQuizSelectionStore } from '@/lib/quizSelectionStore';

export const Route = createFileRoute('/quiz')({
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
  const { selectedQuiz } = useQuizSelectionStore();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AdminQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswering, setIsAnswering] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!selectedQuiz || !currentQuestion || showResult || isAnswering) return;

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
  }, [selectedQuiz, currentQuestion, showResult, isAnswering]);

  const startQuiz = () => {
    if (!selectedQuiz) return;

    const initialGameState: GameState = {
      currentQuestionIndex: 0,
      currentPrizeAmount: selectedQuiz.prizeStructure[0]?.amount || 0,
      isGameCompleted: false,
      isGameWon: false,
      correctAnswers: 0,
    };

    setGameState(initialGameState);
    setCurrentQuestion(selectedQuiz.questions?.[0] || null);
    setTimeLeft(30);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answerId: string) => {
    if (!selectedQuiz || !gameState || !currentQuestion || isAnswering) return;

    setIsAnswering(true);
    setSelectedAnswer(answerId);

    setTimeout(() => {
      const correctAnswer = currentQuestion.answers?.find((a) => a.isCorrect);

      // Handle both ID-based and index-based validation
      let isCorrect = false;

      if (correctAnswer?.id && answerId) {
        // ID-based validation (new answers with IDs)
        isCorrect = answerId === correctAnswer.id;
      } else {
        // Fallback: index-based validation (for answers without IDs)
        const answerIndex = parseInt(answerId) || 0;
        const correctAnswerIndex = currentQuestion.answers?.findIndex((a) => a.isCorrect) ?? -1;
        isCorrect = answerIndex === correctAnswerIndex;
      }

      // Debug logging to understand the issue
      console.log('DEBUG - Answer validation:', {
        selectedAnswerId: answerId,
        correctAnswerId: correctAnswer?.id,
        correctAnswer,
        allAnswers: currentQuestion.answers,
        isCorrect,
        hasIds: currentQuestion.answers?.every((a) => a.id),
        validation: correctAnswer?.id ? 'ID-based' : 'Index-based',
      });

      const newCorrectAnswers = isCorrect ? gameState.correctAnswers + 1 : gameState.correctAnswers;
      const nextQuestionIndex = gameState.currentQuestionIndex + 1;
      const isGameCompleted =
        !isCorrect || nextQuestionIndex >= (selectedQuiz.questions?.length || 0);

      const newGameState: GameState = {
        currentQuestionIndex: nextQuestionIndex,
        currentPrizeAmount:
          isCorrect && nextQuestionIndex < selectedQuiz.prizeStructure.length
            ? selectedQuiz.prizeStructure[nextQuestionIndex].amount
            : gameState.currentPrizeAmount,
        isGameCompleted,
        isGameWon: isCorrect && nextQuestionIndex >= (selectedQuiz.questions?.length || 0),
        correctAnswers: newCorrectAnswers,
      };

      setGameState(newGameState);
      setShowResult(true);

      setTimeout(() => {
        if (!isGameCompleted) {
          // Move to next question
          setCurrentQuestion(selectedQuiz.questions?.[nextQuestionIndex] || null);
          setTimeLeft(30);
          setShowResult(false);
          setSelectedAnswer(null);
        }
        setIsAnswering(false);
      }, 2000);
    }, 1000);
  };

  const handleWalkAway = () => {
    if (!gameState) return;

    const newGameState: GameState = {
      ...gameState,
      isGameCompleted: true,
      isGameWon: false,
    };

    setGameState(newGameState);
  };

  // No quiz selected - show selector
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen millionaire-gradient flex items-center justify-center p-4">
        <div className="millionaire-card rounded-lg max-w-4xl mx-auto p-8">
          <div className="text-center space-y-6 mb-8">
            <h1 className="millionaire-title text-5xl font-bold mb-4">WHO WANTS TO BE A</h1>
            <h1 className="millionaire-title text-6xl font-bold mb-6">MILLIONAIRE?</h1>
            <p className="text-xl text-white mb-8">Select a quiz to start playing!</p>
          </div>

          <QuizSelector />

          <div className="text-center mt-8">
            <Link
              to="/"
              className="millionaire-button inline-block px-8 py-4 text-lg font-semibold no-underline"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not started state
  if (!gameState) {
    return (
      <div className="min-h-screen millionaire-gradient flex items-center justify-center p-4">
        <div className="millionaire-card rounded-lg max-w-2xl mx-auto p-8">
          <div className="text-center space-y-6">
            <h1 className="millionaire-title text-4xl font-bold mb-4">{selectedQuiz.title}</h1>
            <p className="text-lg text-white mb-6">{selectedQuiz.description}</p>

            <div className="millionaire-card rounded-lg p-6 space-y-3 text-left">
              <h3 className="millionaire-prize text-lg font-semibold mb-4 text-center">
                GAME RULES
              </h3>
              <div className="space-y-2 text-white">
                <p>
                  • Answer {selectedQuiz.questions?.length || 0} multiple choice questions correctly
                </p>
                <p>• Each question has a 30-second time limit</p>
                <p>• Prize money increases with each correct answer</p>
                <p>• Wrong answers end the game - you keep guaranteed winnings</p>
                <p>• You can walk away at any time to secure your current prize</p>
              </div>
            </div>

            <div className="millionaire-card rounded-lg p-6">
              <h3 className="millionaire-prize text-lg font-semibold mb-4 text-center">
                PRIZE STRUCTURE
              </h3>
              <div className="space-y-2">
                {selectedQuiz.prizeStructure?.map((prize, index) => (
                  <div key={`prize-${index}`} className="flex justify-between items-center">
                    <span className="text-white">Question {index + 1}:</span>
                    <span
                      className={`font-bold ${prize.isSafeHaven ? 'millionaire-prize' : 'text-white'}`}
                    >
                      ${prize.amount.toLocaleString()}
                      {prize.isSafeHaven && ' 🛡️'}
                    </span>
                  </div>
                )) || []}
              </div>
            </div>

            <Button onClick={startQuiz} className="millionaire-button px-12 py-6 text-xl font-bold">
              🎯 START QUIZ
            </Button>

            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-white hover:underline">
                ← Back to Quiz Selection
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game completed state
  if (gameState?.isGameCompleted) {
    const isWinner = gameState.isGameWon;
    const finalPrize = gameState.currentPrizeAmount;

    return (
      <div className="min-h-screen millionaire-gradient flex items-center justify-center p-4">
        <div className="millionaire-card rounded-lg max-w-2xl mx-auto p-8">
          <div className="text-center space-y-6">
            <h1 className="millionaire-title text-4xl font-bold mb-4">
              {isWinner ? '🎉 CONGRATULATIONS! 🎉' : '😔 GAME OVER'}
            </h1>

            <div className="millionaire-card millionaire-glow rounded-lg p-8">
              <div className="text-center">
                <div className="text-lg text-white mb-2">YOU WON</div>
                <div className="millionaire-prize text-6xl font-bold mb-4">
                  ${finalPrize.toLocaleString()}
                </div>
                <div className="text-white">
                  {gameState.correctAnswers} out of {selectedQuiz.questions?.length || 0} questions
                  correct
                </div>
              </div>
            </div>

            {isWinner && (
              <div className="space-y-4">
                <p className="text-xl font-semibold millionaire-prize">🏆 QUIZ CHAMPION! 🏆</p>
                <p className="text-white">
                  You've answered all questions correctly and won the grand prize!
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setGameState(null)}
                className="millionaire-button px-8 py-4 text-lg font-semibold"
              >
                🎯 PLAY AGAIN
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                className="millionaire-button px-8 py-4 text-lg font-semibold"
              >
                🏠 HOME
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const currentLevel = gameState.currentQuestionIndex + 1;
  const progress = (gameState.currentQuestionIndex / (selectedQuiz.questions?.length || 1)) * 100;

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
              <div className="text-sm text-white mb-3">
                of {selectedQuiz.questions?.length || 0}
              </div>
              <Progress value={progress} className="h-3 bg-millionaire-blue-light" />
            </div>
          </div>

          <div className="millionaire-card millionaire-glow rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-white mb-2">CURRENT PRIZE</div>
              <div className="millionaire-prize text-4xl font-bold">
                ${gameState.currentPrizeAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="millionaire-card rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-white mb-2">TIME LEFT</div>
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

          {/* Image question support */}
          {currentQuestion.imageUrl && (
            <div className="text-center mb-8">
              <img
                src={currentQuestion.imageUrl}
                alt="Question image"
                className="max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentQuestion.answers.map((answer, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              const answerId = answer.id || index.toString();
              let buttonClass =
                'millionaire-button h-20 text-left justify-start text-lg font-semibold p-6';

              if (showResult && selectedAnswer === answerId) {
                buttonClass += answer.isCorrect
                  ? ' millionaire-button-correct'
                  : ' millionaire-button-incorrect';
              } else if (showResult && answer.isCorrect) {
                buttonClass += ' millionaire-button-correct';
              } else if (selectedAnswer === answerId && !showResult) {
                buttonClass += ' millionaire-button-selected';
              }

              return (
                <Button
                  key={answerId}
                  className={buttonClass}
                  onClick={() => handleAnswer(answerId)}
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
            <p className="text-sm text-white mt-2">Secure your winnings and end the game</p>
          </div>
        )}
      </div>
    </div>
  );
}

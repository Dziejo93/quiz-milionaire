import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

interface Lifelines {
  fiftyFifty: boolean;
  stopTimer: boolean;
  callFriend: boolean;
}

function Quiz() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedQuiz = useQuizSelectionStore((state) => state.selectedQuiz);

  // Debug logging for production build
  useEffect(() => {
    console.log('Quiz route mounted, selectedQuiz:', selectedQuiz?.title || 'No quiz selected');
    console.log('Quiz questions:', selectedQuiz?.questions?.length || 0);
  }, [selectedQuiz]);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AdminQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswering, setIsAnswering] = useState(false);
  const [lifelines, setLifelines] = useState<Lifelines>({ fiftyFifty: true, stopTimer: true, callFriend: true });
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([]);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!selectedQuiz || !currentQuestion || showResult || isAnswering || isTimerPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - end the game immediately
          setIsAnswering(true);
          setSelectedAnswer(null);
          
          setTimeout(() => {
            setGameState(currentState => ({
              currentQuestionIndex: currentState?.currentQuestionIndex || 0,
              currentPrizeAmount: currentState?.currentPrizeAmount || 0,
              correctAnswers: currentState?.correctAnswers || 0,
              isGameCompleted: true,
              isGameWon: false,
            }));
            setShowResult(true);
            setIsAnswering(false);
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedQuiz, currentQuestion, showResult, isAnswering, isTimerPaused]);

  const startQuiz = () => {
    console.log('startQuiz called, selectedQuiz:', selectedQuiz?.title || 'No quiz');
    if (!selectedQuiz) {
      console.error('Cannot start quiz: no quiz selected');
      return;
    }

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
    setLifelines({ fiftyFifty: true, stopTimer: true, callFriend: true });
    setHiddenAnswers([]);
    setIsTimerPaused(false);
  };

  // Lifeline functions
  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || !currentQuestion) return;
    
    const correctAnswer = currentQuestion.answers?.find((a) => a.isCorrect);
    if (!correctAnswer) return;
    
    const wrongAnswers = currentQuestion.answers?.filter((a) => !a.isCorrect) || [];
    const answersToHide = wrongAnswers.slice(0, 2).map((a, index) => {
      // Find the original index of this answer in the full answers array
      const originalIndex = currentQuestion.answers?.findIndex(answer => answer === a) ?? index;
      return a.id || originalIndex.toString();
    });
    
    setHiddenAnswers(answersToHide);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
  };

  const useStopTimer = () => {
    if (!lifelines.stopTimer) return;
    
    setIsTimerPaused(true);
    setLifelines(prev => ({ ...prev, stopTimer: false }));
  };

  const useCallFriend = () => {
    if (!lifelines.callFriend) return;
    
    // Placeholder functionality - could show a modal with friend's advice
    alert(t('friendAdvice'));
    setLifelines(prev => ({ ...prev, callFriend: false }));
  };

  const handleAnswer = (answerId: string) => {
    if (!selectedQuiz || !gameState || !currentQuestion || isAnswering || showResult) return;

    setIsAnswering(true);
    setSelectedAnswer(answerId);

    // Show the selected answer immediately
    setTimeout(() => {
      if (!currentQuestion || !currentQuestion.answers) return;

      const correctAnswer = currentQuestion.answers.find((a) => a.isCorrect);

      if (!correctAnswer) return;

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
          setHiddenAnswers([]); // Reset 50:50 for next question
          setIsTimerPaused(false); // Reset timer pause for next question
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
            <h3 className="millionaire-prize text-xl font-bold mb-4">{t('selectQuiz')}</h3>
            <p className="text-white mb-6">{t('noQuizzesAvailable')}</p>
          </div>

          <QuizSelector />

          <div className="text-center mt-8">
            <Link
              to="/"
              className="millionaire-button inline-block px-8 py-4 text-lg font-semibold no-underline"
            >
              🏠 {t('home').toUpperCase()}
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
                {t('gameRules')}
              </h3>
              <div className="space-y-2 text-white">
                <p>
                  • {t('answerQuestionsCorrectly')} {selectedQuiz.questions?.length || 0} {t('multipleChoiceQuestions')}
                </p>
                <p>{t('eachQuestionHasTimeLimit')}</p>
                <p>{t('prizeMoneyIncreases')}</p>
                <p>{t('wrongAnswersEndGame')}</p>
                <p>{t('walkAwayAtAnyTime')}</p>
              </div>
            </div>

            <div className="millionaire-card rounded-lg p-6">
              <h3 className="millionaire-prize text-lg font-semibold mb-4 text-center">
                {t('prizeStructure')}
              </h3>
              <div className="space-y-2">
                {selectedQuiz.prizeStructure?.map((prize, index) => (
                  <div key={`prize-${index}`} className="flex justify-between items-center">
                    <span className="text-white">{t('question')} {index + 1}:</span>
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
              🎯 {t('startQuiz')}
            </Button>

            <div className="text-center mt-6">
              <Link to="/" className="text-sm text-white hover:underline">
                {t('backToQuizSelection')}
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
              {isWinner ? `🎉 ${t('congratulations')} 🎉` : `😔 ${t('gameOver')}`}
            </h1>

            <div className="millionaire-card millionaire-glow rounded-lg p-8">
              <div className="text-center">
                <div className="text-lg text-white mb-2">{t('youWon')}</div>
                <div className="millionaire-prize text-6xl font-bold mb-4">
                  ${finalPrize.toLocaleString()}
                </div>
                <div className="text-white">
                  {gameState.correctAnswers} out of {selectedQuiz.questions?.length || 0} {t('questionsCorrect')}
                </div>
              </div>
            </div>

            {isWinner && (
              <div className="space-y-4">
                <p className="text-xl font-semibold millionaire-prize">{t('quizChampion')}</p>
                <p className="text-white">
                  {t('answeredAllQuestionsCorrectly')} {t('wonGrandPrize')}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setGameState(null)}
                className="millionaire-button px-8 py-4 text-lg font-semibold"
              >
                🎯 {t('playAgain')}
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                className="millionaire-button px-8 py-4 text-lg font-semibold"
              >
                🏠 {t('home').toUpperCase()}
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
                {t('question')} {currentLevel}
              </div>
              <div className="text-sm text-white mb-3">
                {t('of')} {selectedQuiz.questions?.length || 0}
              </div>
              <Progress value={progress} className="h-3 bg-millionaire-blue-light" />
            </div>
          </div>

          <div className="millionaire-card millionaire-glow rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-white mb-2">{t('currentPrize')}</div>
              <div className="millionaire-prize text-4xl font-bold">
                ${gameState.currentPrizeAmount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="millionaire-card rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-white mb-2">{t('timeLeft')}</div>
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

        {/* Lifelines */}
        <div className="millionaire-card rounded-lg p-6">
          <div className="text-center mb-4">
            <h3 className="millionaire-prize text-xl font-bold">{t('lifelines')}</h3>
            <p className="text-sm text-white mt-2">{t('useEachLifelineOnlyOnce')}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={useFiftyFifty}
              disabled={!lifelines.fiftyFifty}
              className={`px-6 py-3 font-bold ${
                lifelines.fiftyFifty
                  ? 'millionaire-button'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              50:50 {lifelines.fiftyFifty ? '✨' : '❌'}
            </Button>
            <Button
              onClick={useStopTimer}
              disabled={!lifelines.stopTimer}
              className={`px-6 py-3 font-bold ${
                lifelines.stopTimer
                  ? 'millionaire-button'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              ⏱️ {t('stopTimer')} {lifelines.stopTimer ? '✨' : '❌'}
            </Button>
            <Button
              onClick={useCallFriend}
              disabled={!lifelines.callFriend}
              className={`px-6 py-3 font-bold ${
                lifelines.callFriend
                  ? 'millionaire-button'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              📞 {t('callAFriend')} {lifelines.callFriend ? '✨' : '❌'}
            </Button>
          </div>
          {isTimerPaused && (
            <div className="text-center mt-4">
              <span className="millionaire-prize font-bold">⏸️ {t('timerPaused')}</span>
            </div>
          )}
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
                alt={t('questionContent')}
                className="max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {currentQuestion.answers.map((answer, index) => {
              const letters = ['A', 'B', 'C', 'D'];
              const answerId = answer.id || index.toString();
              
              // Check if this answer should be hidden by 50:50 lifeline
              const isHidden = hiddenAnswers.includes(answerId);
              
              if (isHidden) {
                return (
                  <div key={answerId} className="h-20 flex items-center justify-center">
                    <div className="text-gray-500 text-lg font-semibold">
                      {letters[index]}: {t('hiddenByFiftyFifty')}
                    </div>
                  </div>
                );
              }
              
              let buttonClass =
                'millionaire-answer-button h-20 text-left justify-start text-lg font-semibold';

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
              💰 {t('walkAway')} ${gameState.currentPrizeAmount.toLocaleString()}
            </Button>
            <p className="text-sm text-white mt-2">{t('secureWinningsEndGame')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

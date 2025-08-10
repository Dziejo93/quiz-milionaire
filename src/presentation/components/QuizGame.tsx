import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Question } from '../../domains/quiz/entities/Question';
import type { GameSession } from '../../domains/session/entities/GameSession';
import type { PrizeLevel } from '../../shared/types';

interface QuizGameProps {
  session: GameSession;
  currentQuestion: Question;
  prizeStructure: PrizeLevel[];
  onAnswerSelected: (answerId: string, timeUsed: number) => void;
  onWalkAway: () => void;
}

export function QuizGame({
  session,
  currentQuestion,
  prizeStructure,
  onAnswerSelected,
  onWalkAway,
}: QuizGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(currentQuestion.timeLimit);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || isAnswerLocked) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit with no answer
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswerLocked]);

  const handleTimeUp = () => {
    setIsAnswerLocked(true);
    const timeUsed = currentQuestion.timeLimit;
    onAnswerSelected('', timeUsed); // Empty string indicates timeout
  };

  const handleAnswerClick = (answerId: string) => {
    if (isAnswerLocked) return;
    setSelectedAnswer(answerId);
  };

  const handleFinalAnswer = () => {
    if (!selectedAnswer || isAnswerLocked) return;

    setIsAnswerLocked(true);
    const timeUsed = currentQuestion.timeLimit - timeRemaining;
    onAnswerSelected(selectedAnswer, timeUsed);
  };

  const currentPrize = prizeStructure.find((p) => p.level === session.currentLevel);
  const nextPrize = prizeStructure.find((p) => p.level === session.currentLevel + 1);
  const progressPercentage = (session.currentLevel / prizeStructure.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with progress and prize info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session.currentLevel}</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Prize</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentPrize?.displayName || '$0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Next Prize</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {nextPrize?.displayName || 'Final Prize!'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timer */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-4xl font-bold mb-2">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <Progress
            value={(timeRemaining / currentQuestion.timeLimit) * 100}
            className="w-full max-w-md mx-auto"
          />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Question {session.currentLevel}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg">{currentQuestion.text}</div>

          {/* Media content */}
          {currentQuestion.media && (
            <div className="flex justify-center">
              {currentQuestion.isImageQuestion() && (
                <img
                  src={currentQuestion.media.url}
                  alt={currentQuestion.media.alt || 'Question image'}
                  className="max-w-md max-h-64 object-contain rounded-lg"
                />
              )}
              {currentQuestion.isAudioQuestion() && (
                <audio controls src={currentQuestion.media.url} className="w-full max-w-md">
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.answers.map((answer) => (
          <Button
            key={answer.id}
            variant={selectedAnswer === answer.id ? 'default' : 'outline'}
            size="lg"
            className="h-auto p-4 text-left justify-start"
            onClick={() => handleAnswerClick(answer.id)}
            disabled={isAnswerLocked}
          >
            <span className="font-bold mr-3">{answer.label}:</span>
            <span>{answer.text}</span>
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="destructive" onClick={onWalkAway} disabled={isAnswerLocked}>
          Walk Away (${session.guaranteedAmount.toLocaleString()})
        </Button>

        <Button onClick={handleFinalAnswer} disabled={!selectedAnswer || isAnswerLocked} size="lg">
          Final Answer
        </Button>
      </div>

      {/* Guaranteed Amount Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <div className="text-sm text-green-700">
            Guaranteed Amount:{' '}
            <span className="font-bold">${session.guaranteedAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

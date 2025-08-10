import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';

interface QuizSelectorProps {
  onQuizSelect?: (quiz: AdminQuiz) => void;
  trigger?: React.ReactNode;
}

export function QuizSelector({ onQuizSelect, trigger }: QuizSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const quizzes = useAdminStore((state) => state.quizzes);

  const handleQuizSelect = (quiz: AdminQuiz) => {
    onQuizSelect?.(quiz);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button className="millionaire-button text-2xl px-16 py-6 rounded-lg font-bold">
      🎯 START PLAYING NOW!
    </Button>
  );

  if (quizzes.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          No custom quizzes available. Create your first quiz in the admin panel!
        </p>
        <Link to="/admin">
          <Button className="millionaire-button text-lg px-8 py-4 font-bold">
            ⚙️ CREATE YOUR FIRST QUIZ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="millionaire-card max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="millionaire-title text-3xl font-bold text-center">
            🎯 SELECT YOUR QUIZ CHALLENGE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-muted-foreground text-lg">
            Choose from your custom-created quizzes and test your knowledge!
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="millionaire-card rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="millionaire-prize text-xl font-bold mb-2">{quiz.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {quiz.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span className="millionaire-prize font-semibold">
                        {quiz.questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Prize:</span>
                      <span className="millionaire-prize font-semibold">
                        ${Math.max(...quiz.prizeStructure.map((p) => p.amount), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className="text-muted-foreground">
                        {quiz.questions.length > 0
                          ? `⭐ ${Math.round(quiz.questions.reduce((sum, q) => sum + q.difficulty, 0) / quiz.questions.length)}/5`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Safe Havens:</span>
                      <span className="text-green-400 font-semibold">
                        {quiz.prizeStructure.filter((p) => p.isSafeHaven).length}
                      </span>
                    </div>
                  </div>
                </div>

                {quiz.questions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-3">
                      This quiz has no questions yet.
                    </p>
                    <Link to="/admin">
                      <Button className="millionaire-button text-sm px-4 py-2 font-semibold">
                        ➕ ADD QUESTIONS
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <Button
                        onClick={() => handleQuizSelect(quiz)}
                        className="millionaire-button w-full text-lg py-3 font-bold"
                      >
                        🚀 PLAY THIS QUIZ
                      </Button>
                    </div>

                    {quiz.questions.length < 5 && (
                      <p className="text-center text-xs text-muted-foreground">
                        💡 Tip: Add more questions for a longer challenge!
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-millionaire-gold/30">
            <p className="text-muted-foreground mb-4">
              Want to create more quizzes or edit existing ones?
            </p>
            <Link to="/admin">
              <Button className="millionaire-button text-lg px-8 py-3 font-bold">
                ⚙️ MANAGE QUIZZES
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';
import { useQuizSelectionStore } from '@/lib/quizSelectionStore';

interface QuizSelectorProps {
  onQuizSelect?: (quiz: AdminQuiz) => void;
  trigger?: React.ReactNode;
}

export function QuizSelector({ onQuizSelect, trigger }: QuizSelectorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSelectedQuiz = useQuizSelectionStore((state) => state.setSelectedQuiz);
  const [isOpen, setIsOpen] = useState(false);
  const quizzes = useAdminStore((state) => state.quizzes);

  const handleQuizSelect = (quiz: AdminQuiz) => {
    onQuizSelect?.(quiz);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button className="millionaire-button text-2xl px-16 py-6 rounded-lg font-bold">
      🎯 {t('startPlayingNow')}
    </Button>
  );

  if (quizzes.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h3 className="millionaire-prize text-2xl font-bold mb-4">{t('noQuizzesAvailable')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('noQuizzesCreated')}
        </p>
        <Link to="/admin">
          <Button className="millionaire-button text-lg px-8 py-4 font-bold">
            ⚙️ {t('goToAdmin')}
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
            🎯 {t('selectQuizChallenge')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-muted-foreground text-lg">
            {t('chooseFromQuizzes')}
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
                      <span>{t('questions')}:</span>
                      <span className="millionaire-prize font-semibold">
                        {quiz.questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('maxPrize')}:</span>
                      <span className="millionaire-prize font-semibold">
                        ${Math.max(...quiz.prizeStructure.map((p) => p.amount), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('difficulty')}:</span>
                      <span className="text-muted-foreground">
                        {quiz.questions.length > 0
                          ? `⭐ ${Math.round(quiz.questions.reduce((sum, q) => sum + q.difficulty, 0) / quiz.questions.length)}/5`
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('safeHavens')}:</span>
                      <span className="text-green-400 font-semibold">
                        {quiz.prizeStructure.filter((p) => p.isSafeHaven).length}
                      </span>
                    </div>
                  </div>
                </div>

                {quiz.questions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm mb-3">
                      {t('noQuestionsYet')}
                    </p>
                    <Link to="/admin">
                      <Button className="millionaire-button text-sm px-4 py-2 font-semibold">
                        ➕ {t('addQuestions')}
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
                        🚀 {t('playThisQuiz')}
                      </Button>
                    </div>

                    {quiz.questions.length < 5 && (
                      <p className="text-center text-xs text-muted-foreground">
                        💡 {t('tipAddMoreQuestions')}
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

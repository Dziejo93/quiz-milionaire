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
    <Button className="text-2xl px-16 py-6 rounded-full font-bold [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
      🎯 {t('startPlayingNow')}
    </Button>
  );

  if (quizzes.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{t('noQuizzesAvailable')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('noQuizzesCreated')}
        </p>
        <Link to="/admin">
          <Button className="text-lg px-8 py-4 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
            ⚙️ {t('goToAdmin')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">
            🎯 {t('selectQuizChallenge')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-muted-foreground text-lg">
            {t('chooseFromQuizzes')}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="rounded-lg p-6 space-y-4 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{quiz.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {quiz.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('questions')}:</span>
                      <span className="font-semibold text-[hsl(var(--millionaire-gold))]">
                        {quiz.questions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('maxPrize')}:</span>
                      <span className="font-semibold text-[hsl(var(--millionaire-gold))]">
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
                      <Button className="text-sm px-4 py-2 font-semibold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
                        ➕ {t('addQuestions')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <Button
                        onClick={() => handleQuizSelect(quiz)}
                        className="w-full text-lg py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
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

          <div className="text-center pt-4 border-t border-t-[hsl(var(--millionaire-gold)/0.3)]">
            <p className="text-muted-foreground mb-4">
              Want to create more quizzes or edit existing ones?
            </p>
            <Link to="/admin">
              <Button className="text-lg px-8 py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
                ⚙️ MANAGE QUIZZES
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

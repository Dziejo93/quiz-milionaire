import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { QuizSelector } from '@/components/QuizSelector';
import { Button } from '@/components/ui/button';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';
import { useQuizSelectionStore } from '@/lib/quizSelectionStore';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSelectedQuiz = useQuizSelectionStore((state) => state.setSelectedQuiz);
  const quizzes = useAdminStore((state) => state.quizzes);

  const handleQuizSelect = (quiz: AdminQuiz) => {
    setSelectedQuiz(quiz);
    navigate({ to: '/quiz' });
  };

  return (
    <div className="min-h-screen [background:linear-gradient(135deg,hsl(var(--millionaire-blue))_0%,hsl(var(--millionaire-blue-light))_50%,hsl(var(--millionaire-blue))_100%)] flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">{t('welcome')} <br />{t('whoWantsToBeMillionaire')}</h2>
          <p className="text-2xl text-muted-foreground mb-8">{t('selectQuiz')}</p>
        </div>

        <div className="rounded-lg p-8 space-y-6 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl font-bold mb-6 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_20px_hsl(var(--millionaire-gold)/0.3)]">
            🏆 {t('welcomeToTheHottestQuizGameOnTheWeb')} 🏆
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">🎯 {t('howToPlay')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t('answerMultipleChoiceQuestionsCorrectly')}</li>
                <li>• {t('eachQuestionHasATimeLimit')}</li>
                <li>• {t('prizeMoneyIncreasesWithEachCorrectAnswer')}</li>
                <li>• {t('wrongAnswersEndTheGame')}</li>
                <li>• {t('walkAwayAnytimeToSecureYourWinnings')}</li>
                <li>• Wrong answers end the game</li>
                <li>• Walk away anytime to secure your winnings</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">💰 {t('dynamicPrizes')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {quizzes.length > 0 ? (
                  <>
                    <li>• {t('prizeAmountsVaryByQuiz')}</li>
                    <li>• {t('safeHavenLevelsProtectWinnings')}</li>
                    <li>• {t('customDifficultyProgression')}</li>
                    <li>• {t('textAndImageQuestionsSupported')}</li>
                    <li>
                      • {quizzes.length} {quizzes.length === 1 ? t('quizAvailableToPlay') : t('quizzesAvailableToPlay')}
                    </li>
                  </>
                ) : (
                  <>
                    <li>• {t('createCustomQuizzes')}</li>
                    <li>• {t('setYourOwnPrizeAmounts')}</li>
                    <li>• {t('supportForTextAndImage')}</li>
                    <li>• {t('unlimitedQuizCreation')}</li>
                    <li>• {t('professionalAdminPanel')}</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <QuizSelector onQuizSelect={handleQuizSelect} />
            <p className="text-sm text-muted-foreground">
              {quizzes.length > 0
                ? 'Choose from your custom quizzes and test your knowledge!'
                : 'Create your first quiz to start playing!'}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-8 pt-4">
          <Link to="/admin">
            <Button className="px-6 py-3 text-lg font-semibold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]">
              ⚙️ ADMIN PANEL
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

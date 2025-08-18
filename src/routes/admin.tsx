import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QuizCreationForm } from '@/components/admin/QuizCreationForm';
import { QuizList } from '@/components/admin/QuizList';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/adminStore';

export const Route = createFileRoute('/admin')({
  component: Admin,
});

function Admin() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
  const quizzes = useAdminStore((state) => state.quizzes);

  const handleQuizCreated = () => {
    // Switch to manage tab after creating a quiz
    setActiveTab('manage');
  };

  const totalQuestions = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const averagePrize =
    quizzes.length > 0
      ? Math.round(
          quizzes.reduce((sum, quiz) => {
            const maxPrize = Math.max(...quiz.prizeStructure.map((p) => p.amount), 0);
            return sum + maxPrize;
          }, 0) / quizzes.length
        )
      : 0;

  return (
    <div className="min-h-screen p-6 [background:linear-gradient(135deg,hsl(var(--millionaire-blue))_0%,hsl(var(--millionaire-blue-light))_50%,hsl(var(--millionaire-blue))_100%)]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">⚙️ ADMIN CONTROL PANEL ⚙️</h1>
          <p className="text-xl text-muted-foreground">
            Create, manage, and configure your millionaire quiz experience
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('overview')}
            className={`text-lg px-8 py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] ${
              activeTab === 'overview'
                ? 'ring-2 ring-[hsl(var(--millionaire-gold))] [box-shadow:0_0_25px_hsl(var(--millionaire-gold)/0.4),inset_0_1px_0_hsl(var(--millionaire-gold)/0.3)]'
                : ''
            }`}
          >
            📊 OVERVIEW
          </Button>
          <Button
            onClick={() => setActiveTab('manage')}
            className={`text-lg px-8 py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] ${
              activeTab === 'manage'
                ? 'ring-2 ring-[hsl(var(--millionaire-gold))] [box-shadow:0_0_25px_hsl(var(--millionaire-gold)/0.4),inset_0_1px_0_hsl(var(--millionaire-gold)/0.3)]'
                : ''
            }`}
          >
            📝 MANAGE QUIZZES
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg p-6 text-center [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{quizzes.length}</h3>
                <p className="text-muted-foreground">Total Quizzes</p>
              </div>

              <div className="rounded-lg p-6 text-center [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{totalQuestions}</h3>
                <p className="text-muted-foreground">Total Questions</p>
              </div>

              <div className="rounded-lg p-6 text-center [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
                  ${averagePrize.toLocaleString()}
                </h3>
                <p className="text-muted-foreground">{t('averageMaxPrize')}</p>
              </div>

              <div className="rounded-lg p-6 text-center [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="text-2xl font-bold mb-2 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">🎯</h3>
                <p className="text-muted-foreground">{t('readyToPlay')}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg p-8 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_0_20px_hsl(var(--millionaire-gold)/0.3),0_0_40px_hsl(var(--millionaire-gold)/0.1),inset_0_1px_0_hsl(var(--millionaire-gold)/0.2)]">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">🚀 {t('quickActions')}</h2>
                <p className="text-muted-foreground">
                  {t('getStartedCreatingManaging')}
                </p>
              </div>

              <div className="flex justify-center gap-6">
                <QuizCreationForm onSuccess={handleQuizCreated} />
                <Button
                  onClick={() => setActiveTab('manage')}
                  className="text-lg px-8 py-4 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
                >
                  📚 VIEW ALL QUIZZES
                </Button>
              </div>
            </div>

            {/* Recent Quizzes Preview */}
            {quizzes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">📋 RECENT QUIZZES</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {quizzes.slice(0, 3).map((quiz) => (
                    <div key={quiz.id} className="rounded-lg p-6 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <h4 className="text-lg font-bold mb-2 line-clamp-1 text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">
                        {quiz.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {quiz.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>{quiz.questions.length} questions</span>
                        <span className="font-semibold text-[hsl(var(--millionaire-gold))]">
                          ${Math.max(...quiz.prizeStructure.map((p) => p.amount), 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {quizzes.length > 3 && (
                  <div className="text-center">
                    <Button
                      onClick={() => setActiveTab('manage')}
                      className="text-lg px-6 py-3 font-bold rounded-full [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]"
                    >
                      VIEW ALL {quizzes.length} QUIZZES →
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Getting Started Guide */}
            {quizzes.length === 0 && (
              <div className="rounded-lg p-8 [background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border border-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">
                    🎯 WELCOME TO QUIZ ADMIN!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t('readyToCreateFirstQuiz')}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">1</div>
                    <h4 className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{t('stepOne')}</h4>
                    <p className="text-muted-foreground text-sm">
                      {t('startByCreatingNewQuiz')}
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">2</div>
                    <h4 className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{t('stepTwo')}</h4>
                    <p className="text-muted-foreground text-sm">
                      {t('addTextOrImageQuestions')}
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="text-4xl font-bold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">3</div>
                    <h4 className="text-lg font-semibold text-[hsl(var(--millionaire-gold))] [text-shadow:0_0_10px_hsl(var(--millionaire-gold)/0.5)]">{t('stepThree')}</h4>
                    <p className="text-muted-foreground text-sm">
                      {t('setUpPrizeStructure')}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <QuizCreationForm onSuccess={handleQuizCreated} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">📚 QUIZ MANAGEMENT</h2>
                <p className="text-muted-foreground">
                  Create, edit, and organize your quiz collection
                </p>
              </div>
              <QuizCreationForm onSuccess={handleQuizCreated} />
            </div>

            <QuizList />
          </div>
        )}
      </div>
    </div>
  );
}

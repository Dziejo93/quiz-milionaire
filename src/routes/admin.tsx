import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { QuizCreationForm } from '@/components/admin/QuizCreationForm';
import { QuizList } from '@/components/admin/QuizList';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/adminStore';

export const Route = createFileRoute('/admin')({
  component: Admin,
});

function Admin() {
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
    <div className="min-h-screen millionaire-gradient p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="millionaire-title text-5xl font-bold mb-4">⚙️ ADMIN CONTROL PANEL ⚙️</h1>
          <p className="text-xl text-muted-foreground">
            Create, manage, and configure your millionaire quiz experience
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('overview')}
            className={`text-lg px-8 py-3 font-bold ${
              activeTab === 'overview' ? 'millionaire-button-selected' : 'millionaire-button'
            }`}
          >
            📊 OVERVIEW
          </Button>
          <Button
            onClick={() => setActiveTab('manage')}
            className={`text-lg px-8 py-3 font-bold ${
              activeTab === 'manage' ? 'millionaire-button-selected' : 'millionaire-button'
            }`}
          >
            📝 MANAGE QUIZZES
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="millionaire-card rounded-lg p-6 text-center">
                <h3 className="millionaire-prize text-2xl font-bold mb-2">{quizzes.length}</h3>
                <p className="text-muted-foreground">Total Quizzes</p>
              </div>

              <div className="millionaire-card rounded-lg p-6 text-center">
                <h3 className="millionaire-prize text-2xl font-bold mb-2">{totalQuestions}</h3>
                <p className="text-muted-foreground">Total Questions</p>
              </div>

              <div className="millionaire-card rounded-lg p-6 text-center">
                <h3 className="millionaire-prize text-2xl font-bold mb-2">
                  ${averagePrize.toLocaleString()}
                </h3>
                <p className="text-muted-foreground">Average Max Prize</p>
              </div>

              <div className="millionaire-card rounded-lg p-6 text-center">
                <h3 className="millionaire-prize text-2xl font-bold mb-2">🎯</h3>
                <p className="text-muted-foreground">Ready to Play</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="millionaire-card millionaire-glow rounded-lg p-8">
              <div className="text-center mb-6">
                <h2 className="millionaire-title text-3xl font-bold mb-2">🚀 QUICK ACTIONS</h2>
                <p className="text-muted-foreground">
                  Get started with creating and managing your quiz content
                </p>
              </div>

              <div className="flex justify-center gap-6">
                <QuizCreationForm onSuccess={handleQuizCreated} />
                <Button
                  onClick={() => setActiveTab('manage')}
                  className="millionaire-button text-lg px-8 py-4 font-bold"
                >
                  📚 VIEW ALL QUIZZES
                </Button>
              </div>
            </div>

            {/* Recent Quizzes Preview */}
            {quizzes.length > 0 && (
              <div className="space-y-4">
                <h3 className="millionaire-title text-2xl font-bold">📋 RECENT QUIZZES</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {quizzes.slice(0, 3).map((quiz) => (
                    <div key={quiz.id} className="millionaire-card rounded-lg p-6">
                      <h4 className="millionaire-prize text-lg font-bold mb-2 line-clamp-1">
                        {quiz.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {quiz.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>{quiz.questions.length} questions</span>
                        <span className="millionaire-prize font-semibold">
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
                      className="millionaire-button text-lg px-6 py-3 font-bold"
                    >
                      VIEW ALL {quizzes.length} QUIZZES →
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Getting Started Guide */}
            {quizzes.length === 0 && (
              <div className="millionaire-card rounded-lg p-8">
                <div className="text-center mb-6">
                  <h3 className="millionaire-title text-2xl font-bold mb-4">
                    🎯 WELCOME TO QUIZ ADMIN!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Ready to create your first millionaire quiz? Here's how to get started:
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center space-y-3">
                    <div className="millionaire-prize text-4xl font-bold">1</div>
                    <h4 className="millionaire-prize text-lg font-semibold">Create Quiz</h4>
                    <p className="text-muted-foreground text-sm">
                      Start by creating a new quiz with a title and description
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="millionaire-prize text-4xl font-bold">2</div>
                    <h4 className="millionaire-prize text-lg font-semibold">Add Questions</h4>
                    <p className="text-muted-foreground text-sm">
                      Add text or image questions with multiple choice answers
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="millionaire-prize text-4xl font-bold">3</div>
                    <h4 className="millionaire-prize text-lg font-semibold">Configure Prizes</h4>
                    <p className="text-muted-foreground text-sm">
                      Set up your prize structure and safe haven levels
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
                <h2 className="millionaire-title text-3xl font-bold mb-2">📚 QUIZ MANAGEMENT</h2>
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

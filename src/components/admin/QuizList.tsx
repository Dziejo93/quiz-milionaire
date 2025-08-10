import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';
import { PrizeConfiguration } from './PrizeConfiguration';
import { QuestionForm } from './QuestionForm';

interface QuizListProps {
  onQuizSelect?: (quiz: AdminQuiz) => void;
}

export function QuizList({ onQuizSelect }: QuizListProps) {
  const { quizzes, deleteQuiz, setCurrentQuiz } = useAdminStore();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get the current selected quiz from the store to ensure it's always up-to-date
  const selectedQuiz = selectedQuizId ? quizzes.find((q) => q.id === selectedQuizId) || null : null;

  const handleQuizSelect = (quiz: AdminQuiz) => {
    setSelectedQuizId(quiz.id);
    setCurrentQuiz(quiz);
    onQuizSelect?.(quiz);
  };

  const handleDeleteQuiz = (quizId: string, quizTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`
      )
    ) {
      deleteQuiz(quizId);
      if (selectedQuizId === quizId) {
        setSelectedQuizId(null);
        setCurrentQuiz(null);
        setIsDetailsOpen(false);
      }
    }
  };

  const openQuizDetails = (quiz: AdminQuiz) => {
    setSelectedQuizId(quiz.id);
    setIsDetailsOpen(true);
  };

  // Close modal if selected quiz no longer exists
  useEffect(() => {
    if (selectedQuizId && !selectedQuiz && isDetailsOpen) {
      setIsDetailsOpen(false);
      setSelectedQuizId(null);
    }
  }, [selectedQuizId, selectedQuiz, isDetailsOpen]);

  if (quizzes.length === 0) {
    return (
      <div className="millionaire-card rounded-lg p-8 text-center">
        <h3 className="millionaire-prize text-xl font-bold mb-4">📝 No Quizzes Created Yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first quiz to get started with the millionaire experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="millionaire-title text-2xl font-bold">
        📚 YOUR QUIZ LIBRARY ({quizzes.length})
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="millionaire-card rounded-lg p-6 space-y-4">
            <div>
              <h4 className="millionaire-prize text-lg font-bold mb-2 line-clamp-2">
                {quiz.title}
              </h4>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{quiz.description}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Questions:</span>
                <span className="millionaire-prize font-semibold">{quiz.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Prize:</span>
                <span className="millionaire-prize font-semibold">
                  ${Math.max(...quiz.prizeStructure.map((p) => p.amount), 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="text-muted-foreground">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => openQuizDetails(quiz)}
                className="millionaire-button flex-1 text-sm py-2 font-semibold"
              >
                📋 MANAGE
              </Button>
              <Button
                onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                variant="destructive"
                className="px-3 py-2 text-sm"
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="millionaire-card max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedQuiz && (
            <>
              <DialogHeader>
                <DialogTitle className="millionaire-title text-2xl font-bold text-center">
                  📋 MANAGE QUIZ: {selectedQuiz.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Quiz Info */}
                <div className="millionaire-card rounded-lg p-4">
                  <h4 className="millionaire-prize text-lg font-semibold mb-2">
                    📝 Quiz Information
                  </h4>
                  <p className="text-muted-foreground mb-3">{selectedQuiz.description}</p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Questions:</strong> {selectedQuiz.questions.length}
                    </div>
                    <div>
                      <strong>Prize Levels:</strong> {selectedQuiz.prizeStructure.length}
                    </div>
                    <div>
                      <strong>Last Updated:</strong>{' '}
                      {new Date(selectedQuiz.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Management Actions */}
                <div className="flex gap-4 justify-center">
                  <QuestionForm
                    quizId={selectedQuiz.id}
                    onSuccess={() => {
                      // Force re-render by updating the selected quiz
                      const updatedQuiz = quizzes.find((q) => q.id === selectedQuiz.id);
                      if (updatedQuiz) {
                        setSelectedQuizId(updatedQuiz.id);
                      }
                    }}
                    trigger={
                      <Button className="millionaire-button text-lg px-6 py-3 font-bold">
                        ➕ ADD QUESTION
                      </Button>
                    }
                  />
                  <PrizeConfiguration
                    quizId={selectedQuiz.id}
                    currentPrizes={selectedQuiz.prizeStructure}
                    onSuccess={() => {
                      // Force re-render by updating the selected quiz
                      const updatedQuiz = quizzes.find((q) => q.id === selectedQuiz.id);
                      if (updatedQuiz) {
                        setSelectedQuizId(updatedQuiz.id);
                      }
                    }}
                  />
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  <h4 className="millionaire-prize text-lg font-semibold">
                    🧠 QUESTIONS ({selectedQuiz.questions.length})
                  </h4>

                  {selectedQuiz.questions.length === 0 ? (
                    <div className="millionaire-card rounded-lg p-6 text-center">
                      <p className="text-muted-foreground">
                        No questions added yet. Add your first question to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedQuiz.questions.map((question, index) => (
                        <div key={question.id} className="millionaire-card rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="millionaire-prize font-bold text-lg">
                                  Q{index + 1}
                                </span>
                                <span className="text-xs bg-millionaire-gold/20 px-2 py-1 rounded">
                                  {question.type === 'image' ? '🖼️ IMAGE' : '📝 TEXT'}
                                </span>
                                <span className="text-xs bg-millionaire-blue-light px-2 py-1 rounded">
                                  ⭐ Level {question.difficulty}
                                </span>
                              </div>
                              <p className="text-sm mb-3 line-clamp-2">{question.text}</p>
                              {question.type === 'image' && question.imageUrl && (
                                <img
                                  src={question.imageUrl}
                                  alt="Question"
                                  className="w-20 h-20 object-cover rounded border-2 border-millionaire-gold/30 mb-2"
                                />
                              )}
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {question.answers.map((answer, answerIndex) => (
                                  <div
                                    key={answer.id}
                                    className={`p-2 rounded ${
                                      answer.isCorrect
                                        ? 'bg-green-600/20 text-green-400'
                                        : 'bg-millionaire-blue-light/50'
                                    }`}
                                  >
                                    <strong>{String.fromCharCode(65 + answerIndex)}:</strong>{' '}
                                    {answer.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <QuestionForm
                              quizId={selectedQuiz.id}
                              question={question}
                              onSuccess={() => {
                                // Force re-render by updating the selected quiz
                                const updatedQuiz = quizzes.find((q) => q.id === selectedQuiz.id);
                                if (updatedQuiz) {
                                  setSelectedQuizId(updatedQuiz.id);
                                }
                              }}
                              trigger={
                                <Button className="millionaire-button px-3 py-2 text-sm">
                                  ✏️ EDIT
                                </Button>
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prize Structure */}
                <div className="space-y-4">
                  <h4 className="millionaire-prize text-lg font-semibold">💰 PRIZE STRUCTURE</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedQuiz.prizeStructure.map((prize) => (
                      <div
                        key={prize.level}
                        className={`millionaire-card rounded-lg p-3 flex justify-between items-center ${
                          prize.isSafeHaven ? 'ring-2 ring-green-500/50' : ''
                        }`}
                      >
                        <span>Level {prize.level}</span>
                        <div className="flex items-center gap-2">
                          <span className="millionaire-prize font-bold">${prize.amount}</span>
                          {prize.isSafeHaven && <span className="text-green-400 text-xs">🛡️</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

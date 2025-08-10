import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { QuizSelector } from '@/components/QuizSelector';
import { Button } from '@/components/ui/button';
import { type AdminQuiz, useAdminStore } from '@/lib/adminStore';
import { useQuizSelectionStore } from '@/lib/quizSelectionStore';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const setSelectedQuiz = useQuizSelectionStore((state) => state.setSelectedQuiz);
  const quizzes = useAdminStore((state) => state.quizzes);

  const handleQuizSelect = (quiz: AdminQuiz) => {
    setSelectedQuiz(quiz);
    navigate({ to: '/quiz' });
  };

  return (
    <div className="min-h-screen millionaire-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h1 className="millionaire-title text-7xl font-bold mb-4">WHO WANTS TO BE A</h1>
          <h1 className="millionaire-title text-8xl font-bold mb-8">MILLIONAIRE?</h1>
          <p className="text-2xl text-muted-foreground mb-8">
            The ultimate quiz challenge where knowledge pays off!
          </p>
        </div>

        <div className="millionaire-card rounded-lg p-8 space-y-6">
          <h2 className="millionaire-prize text-3xl font-bold mb-6">
            🏆 WELCOME TO THE HOTTEST QUIZ GAME ON THE WEB! 🏆
          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <h3 className="millionaire-prize text-xl font-semibold">🎯 HOW TO PLAY</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Answer multiple choice questions correctly</li>
                <li>• Each question has a 30-second time limit</li>
                <li>• Prize money increases with each correct answer</li>
                <li>• Wrong answers end the game</li>
                <li>• Walk away anytime to secure your winnings</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="millionaire-prize text-xl font-semibold">💰 DYNAMIC PRIZES</h3>
              <ul className="space-y-2 text-muted-foreground">
                {quizzes.length > 0 ? (
                  <>
                    <li>• Prize amounts vary by quiz</li>
                    <li>• Safe haven levels protect your winnings</li>
                    <li>• Custom difficulty progression</li>
                    <li>• Text and image questions supported</li>
                    <li>
                      • {quizzes.length} quiz{quizzes.length !== 1 ? 'es' : ''} available to play
                    </li>
                  </>
                ) : (
                  <>
                    <li>• Create custom quizzes with your own questions</li>
                    <li>• Set your own prize amounts and safe havens</li>
                    <li>• Support for text and image questions</li>
                    <li>• Unlimited quiz creation possibilities</li>
                    <li>• Professional admin panel included</li>
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
            <Button className="millionaire-button px-6 py-3 text-lg font-semibold">
              ⚙️ ADMIN PANEL
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen millionaire-gradient">
      <nav className="millionaire-card border-b-2 border-millionaire-gold/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="millionaire-title text-2xl font-bold">WHO WANTS TO BE A MILLIONAIRE?</h1>
          <div className="flex gap-6">
            <Link
              to="/"
              className="millionaire-button px-4 py-2 rounded text-sm font-semibold [&.active]:millionaire-button-selected"
            >
              🏠 HOME
            </Link>
            <Link
              to="/quiz"
              className="millionaire-button px-4 py-2 rounded text-sm font-semibold [&.active]:millionaire-button-selected"
            >
              🎯 PLAY QUIZ
            </Link>
            <Link
              to="/admin"
              className="millionaire-button px-4 py-2 rounded text-sm font-semibold [&.active]:millionaire-button-selected"
            >
              ⚙️ ADMIN
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});

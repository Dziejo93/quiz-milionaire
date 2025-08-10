import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

function RootComponent() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen millionaire-gradient">
      <nav className="millionaire-card border-b-2 border-millionaire-gold/30 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="millionaire-title text-2xl font-bold">{t('whoWantsToBeMillionaire').toUpperCase()}</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <Link
                to="/"
                className="millionaire-button px-4 py-2 rounded text-sm font-semibold [&.active]:millionaire-button-selected"
              >
                🏠 {t('home').toUpperCase()}
              </Link>
              <Link
                to="/quiz"
                className="millionaire-button px-4 py-2 rounded text-sm font-semibold [&.active]:millionaire-button-selected"
              >
                🎯 {t('quiz').toUpperCase()}
              </Link>
              <Link
                to="/admin"
                className="millionaire-button px-4 py-2 rounded text-sm font-semibold [&.active]:millionaire-button-selected"
              >
                ⚙️ {t('admin').toUpperCase()}
              </Link>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

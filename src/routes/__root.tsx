import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/components/LanguageSelector';

function RootComponent() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen [background:linear-gradient(135deg,hsl(var(--millionaire-blue))_0%,hsl(var(--millionaire-blue-light))_50%,hsl(var(--millionaire-blue))_100%)]">
      <nav className="[background:linear-gradient(135deg,hsl(var(--millionaire-blue-light))_0%,hsl(var(--millionaire-blue))_100%)] border-b border-b-[hsl(var(--millionaire-gold)/0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text [background-image:linear-gradient(135deg,hsl(var(--millionaire-gold))_0%,hsl(var(--millionaire-gold-light))_50%,hsl(var(--millionaire-gold))_100%)] [text-shadow:0_0_30px_hsl(var(--millionaire-gold)/0.5)]">{t('whoWantsToBeMillionaire').toUpperCase()}</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <Link
                to="/"
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] aria-[current=page]:ring-2 aria-[current=page]:ring-[hsl(var(--millionaire-gold))] aria-[current=page]:[box-shadow:0_0_25px_hsl(var(--millionaire-gold)/0.4),inset_0_1px_0_hsl(var(--millionaire-gold)/0.3)]"
              >
                🏠 {t('home').toUpperCase()}
              </Link>
              <Link
                to="/quiz"
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] aria-[current=page]:ring-2 aria-[current=page]:ring-[hsl(var(--millionaire-gold))] aria-[current=page]:[box-shadow:0_0_25px_hsl(var(--millionaire-gold)/0.4),inset_0_1px_0_hsl(var(--millionaire-gold)/0.3)]"
              >
                🎯 {t('quiz').toUpperCase()}
              </Link>
              <Link
                to="/admin"
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold [background:linear-gradient(135deg,hsl(var(--millionaire-gold-dark))_0%,hsl(var(--millionaire-gold))_50%,hsl(var(--millionaire-gold-light))_100%)] text-[hsl(var(--millionaire-blue))] border-2 border-[hsl(var(--millionaire-gold))] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] aria-[current=page]:ring-2 aria-[current=page]:ring-[hsl(var(--millionaire-gold))] aria-[current=page]:[box-shadow:0_0_25px_hsl(var(--millionaire-gold)/0.4),inset_0_1px_0_hsl(var(--millionaire-gold)/0.3)]"
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

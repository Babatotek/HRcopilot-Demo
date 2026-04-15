// ============================================
// FILE: src/demo/DemoApp.tsx
// PURPOSE: Root demo router. Manages the full visitor flow:
//   Landing → WelcomeZoom → RoleSelection → OrgProfile (CEO)
//   → ModeSelection → MainShell (all 12 modules)
//
//   Admin route is handled separately in index.tsx.
//   No login required — zero friction for demo visitors.
// ============================================

import React, { Suspense, lazy, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HR360Provider } from '../context/HR360Context';
import { CinematicSubtitles } from './voice';
import { primeAudioContext, loadKokoro } from './voice/narrationEngine';
import { useOnboardingStore } from './onboarding/onboardingStore';

// ── Lazy-loaded onboarding screens ───────────────────────────────────────────
const Landing             = lazy(() => import('../../pages/Landing'));
const WelcomeZoom         = lazy(() => import('./onboarding/WelcomeZoom').then(m => ({ default: m.WelcomeZoom })));
const RoleSelection       = lazy(() => import('./onboarding/RoleSelection').then(m => ({ default: m.RoleSelection })));
const ModeSelection       = lazy(() => import('./onboarding/ModeSelection').then(m => ({ default: m.ModeSelection })));
const MainShell           = lazy(() => import('./MainShell'));

// ── Query client ──────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

// ── Page loader ───────────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0d0a1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Loading…</p>
      </div>
    </div>
  );
}

// ── Global error fallback ─────────────────────────────────────────────────────
function GlobalFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-[#0d0a1a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Something went wrong</h1>
        <p className="text-white/40 text-sm mb-6 font-mono">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl text-white text-sm font-black uppercase tracking-wider transition-colors"
        >
          Restart Demo
        </button>
      </div>
    </div>
  );
}

// ── Route components ──────────────────────────────────────────────────────────

function LandingRoute() {
  const navigate = useNavigate();
  const { setStep } = useOnboardingStore();

  const handleExploreDemo = useCallback(() => {
    // Create AudioContext synchronously inside the click handler.
    // This is the ONLY moment Chrome allows it without a gesture warning.
    // primeAudioContext stores it in the narrationEngine module scope
    // so it survives the React navigation that follows.
    primeAudioContext();

    // Start Kokoro model download immediately — runs in background worker
    // while the zoom animation plays (~1-2s head start before speak() fires)
    loadKokoro().catch(() => {});

    setStep('welcome-zoom');
    navigate('/welcome');
  }, [navigate, setStep]);

  // Landing expects brand + theme props — provide sensible defaults
  const brand = { companyName: 'HR360', logoUrl: '', primaryColor: '#0047cc' };

  return (
    <Suspense fallback={<PageLoader />}>
      <Landing
        brand={brand}
        theme="light"
        onToggleTheme={() => {}}
        onGetStarted={handleExploreDemo}
        onLogin={handleExploreDemo}   // Login button also enters demo flow
      />
    </Suspense>
  );
}

function WelcomeRoute() {
  const navigate = useNavigate();
  const { setStep } = useOnboardingStore();

  const handleDone = useCallback(() => {
    setStep('role-selection');
    navigate('/role');
  }, [navigate, setStep]);

  return (
    <Suspense fallback={<PageLoader />}>
      <WelcomeZoom onDone={handleDone} />
    </Suspense>
  );
}

function RoleRoute() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<PageLoader />}>
      <RoleSelection
        onDone={() => navigate('/mode')}
      />
    </Suspense>
  );
}

function ModeRoute() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<PageLoader />}>
      <ModeSelection onDone={() => navigate('/app')} />
    </Suspense>
  );
}

function AppRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HR360Provider>
        <MainShell />
      </HR360Provider>
    </Suspense>
  );
}

// ── Smart redirect — resume where user left off ───────────────────────────────
function SmartRedirect() {
  const step = useOnboardingStore((s) => s.step);

  const stepRoutes: Record<string, string> = {
    'landing':       '/',
    'welcome-zoom':  '/welcome',
    'role-selection': '/role',
    'org-profile':   '/mode',   // legacy sessions — redirect to mode
    'mode-selection': '/mode',
    'preparing':     '/mode',
    'complete':      '/app',
  };

  return <Navigate to={stepRoutes[step] ?? '/'} replace />;
}

// ── App routes ────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<LandingRoute />} />
      <Route path="/welcome"    element={<WelcomeRoute />} />
      <Route path="/role"       element={<RoleRoute />} />
      <Route path="/mode"       element={<ModeRoute />} />
      <Route path="/app/*"      element={<AppRoute />} />
      <Route path="*"           element={<SmartRedirect />} />
    </Routes>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export function DemoApp() {
  // Ensure light mode — remove any dark class left by old App.tsx
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  return (
    <ErrorBoundary
      FallbackComponent={GlobalFallback}
      onReset={() => window.location.replace('/')}
    >
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AppRoutes />
          {/* Always-visible overlays */}
          <CinematicSubtitles />
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

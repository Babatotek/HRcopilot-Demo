// ============================================
// FILE: src/demo/components/SandboxBanner.tsx
// PURPOSE: Floating banner shown in sandbox/flows mode.
//   Tells the user they're in free-explore mode.
//   Shows a reset button to restore seed data.
// ============================================

import { motion } from 'framer-motion';
import { useDemoOrchestrator } from '../orchestrator/demoOrchestrator';
import { useOnboardingStore } from '../onboarding/onboardingStore';

export function SandboxBanner() {
  const { mode, status, resetDemo } = useDemoOrchestrator();
  const { demoMode } = useOnboardingStore();

  const activeMode = demoMode ?? mode;

  // Only show in sandbox or flows mode when running
  if (activeMode === 'guided') return null;
  if (status !== 'running' && status !== 'idle') return null;

  const isSandbox = activeMode === 'sandbox';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="fixed top-16 md:top-20 right-2 md:right-4 z-[9980] pointer-events-auto"
    >
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-lg"
        style={{
          background: isSandbox ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isSandbox ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
        }}
      >
        <span className="text-base">{isSandbox ? '🎮' : '⚡'}</span>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider"
            style={{ color: isSandbox ? '#10b981' : '#f59e0b' }}>
            {isSandbox ? 'Sandbox Mode' : 'Strategic Flows'}
          </p>
          <p className="text-[9px] text-slate-500">
            {isSandbox ? 'Explore freely — all modules unlocked' : 'Watching business processes'}
          </p>
        </div>
        {isSandbox && (
          <button
            onClick={() => { resetDemo(); window.location.reload(); }}
            className="ml-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-all border border-rose-200"
          >
            Reset
          </button>
        )}
      </div>
    </motion.div>
  );
}

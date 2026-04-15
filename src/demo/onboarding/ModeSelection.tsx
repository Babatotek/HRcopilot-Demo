// ============================================
// FILE: src/demo/onboarding/ModeSelection.tsx
// PURPOSE: Final onboarding step — pick demo mode.
//          Guided / Sandbox / Strategic Flows.
//          Quen speaks mode description on hover, confirms on click.
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from './onboardingStore';
import { speak } from '../voice/narrationEngine';
import { primeAudioContext } from '../voice/narrationEngine';
import type { DemoMode } from './onboardingStore';

interface Props {
  onDone: () => void; // → MainShell / Dashboard
}

interface ModeCard {
  id:          DemoMode;
  icon:        string;
  title:       string;
  tagline:     string;
  details:     string[];
  duration:    string;
  gradient:    string;
  border:      string;
  glow:        string;
  narration:   string;
}

const MODES: ModeCard[] = [
  {
    id:       'guided',
    icon:     '🎯',
    title:    'Guided Walkthrough',
    tagline:  'Let Quen show you everything',
    details:  [
      '12 modules explained step by step',
      'Voice narration with Quen',
      'Interactive spotlight highlights',
      'Role-personalised insights',
    ],
    duration:  '10–15 min',
    gradient:  'from-blue-50 to-indigo-100/80',
    border:    'hover:border-blue-300',
    glow:      'hover:shadow-blue-100',
    narration: "Guided mode gives you the full HR360 story. I'll walk you through every module, explain the ROI, and show you exactly how it works.",
  },
  {
    id:       'sandbox',
    icon:     '🎮',
    title:    'Sandbox Mode',
    tagline:  'Explore freely at your own pace',
    details:  [
      'Full access to all 12 modules',
      'Live data simulation',
      'Try any feature instantly',
      'Reset to seed data anytime',
    ],
    duration:  'Unlimited',
    gradient:  'from-emerald-50 to-teal-100/80',
    border:    'hover:border-emerald-300',
    glow:      'hover:shadow-emerald-100',
    narration: "Sandbox mode gives you full control. Add employees, run payroll, test the geofence — everything is live and you can reset any time.",
  },
  {
    id:       'flows',
    icon:     '⚡',
    title:    'Strategic Flows',
    tagline:  'Watch real business processes',
    details:  [
      'Employee Lifecycle end-to-end',
      'Month-End Close automation',
      'Talent Acquisition pipeline',
      'Compliance Audit walkthrough',
    ],
    duration:  '5–8 min',
    gradient:  'from-amber-50 to-orange-100/80',
    border:    'hover:border-amber-300',
    glow:      'hover:shadow-amber-100',
    narration: "Strategic flows show you complete business processes from start to finish — onboarding an employee, closing the month, running a compliance audit.",
  },
];

import { useDemoOrchestrator } from '../orchestrator/demoOrchestrator';

export function ModeSelection({ onDone }: Props) {
  const { setDemoMode, setStep, role } = useOnboardingStore();
  const { setMode, startDemo, resetDemo } = useDemoOrchestrator();
  const [selecting, setSelecting] = useState<DemoMode | null>(null);
  const [hovered, setHovered] = useState<DemoMode | null>(null);

  const handleSelect = async (mode: ModeCard) => {
    if (selecting) return;
    setSelecting(mode.id);

    primeAudioContext();
    speak(mode.narration, { scriptId: `onboarding.mode.${mode.id}` }).catch(() => {});

    // Store mode in both stores
    setDemoMode(mode.id);

    // Reset then set mode BEFORE startDemo so it's preserved
    resetDemo();
    setMode(mode.id);
    startDemo();

    await new Promise((r) => setTimeout(r, 700));
    setStep('complete');
    onDone();
  };

  const handleBack = () => {
    setStep('role-selection');
    // Parent handles navigation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="text-5xl mb-4"
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, repeatDelay: 4 }}
        >
          🚀
        </motion.div>
        <p className="text-xs font-black text-violet-600 uppercase tracking-[0.2em] mb-3">
          Almost there
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          How would you like to{' '}
          <span className="text-violet-600">explore?</span>
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          Choose your adventure — you can switch modes any time inside the app
        </p>
      </motion.div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl relative z-10">
        {MODES.map((mode, i) => {
          const isSelecting = selecting === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => handleSelect(mode)}
              onHoverStart={() => setHovered(mode.id)}
              onHoverEnd={() => setHovered(null)}
              disabled={!!selecting}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={selecting ? {} : { y: -6, scale: 1.02 }}
              whileTap={selecting ? {} : { scale: 0.98 }}
              className={`
                relative text-left rounded-2xl p-6 border transition-all duration-300 cursor-pointer
                bg-gradient-to-br ${mode.gradient}
                border-white/60 ${mode.border}
                shadow-lg ${mode.glow} hover:shadow-2xl
                disabled:opacity-60 disabled:cursor-not-allowed
                ${isSelecting ? 'ring-2 ring-violet-500 scale-[1.02]' : ''}
              `}
            >
              {/* Selecting spinner */}
              {isSelecting && (
                <motion.div
                  className="absolute top-4 right-4 w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {/* Duration badge */}
              <div className="absolute top-4 right-4">
                {!isSelecting && (
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {mode.duration}
                  </span>
                )}
              </div>

              <div className="text-5xl mb-4">{mode.icon}</div>
              <h2 className="text-xl font-black text-slate-900 mb-1">{mode.title}</h2>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
                {mode.tagline}
              </p>

              <ul className="space-y-2">
                {mode.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="text-violet-500 text-xs mt-0.5 flex-shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Start
                </span>
                <motion.span
                  className="text-white/40 text-sm"
                  animate={hovered === mode.id ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Back link */}
      <motion.div
        className="mt-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleBack}
          className="text-slate-400 hover:text-slate-700 text-xs font-semibold uppercase tracking-widest transition-colors"
        >
          ← Back to role selection
        </button>
      </motion.div>
    </div>
  );
}

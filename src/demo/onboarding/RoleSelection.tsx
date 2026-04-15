// ============================================
// FILE: src/demo/onboarding/RoleSelection.tsx
// PURPOSE: Step 2 of onboarding — user picks their role.
//          Quen speaks a role-specific line on selection.
//          CEO → OrgProfile, others → ModeSelection.
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from './onboardingStore';
import { speak } from '../voice/narrationEngine';
import { primeAudioContext } from '../voice/narrationEngine';
import { UserRole } from '../../../types';

interface Props {
  onDone: () => void; // → ModeSelection (all roles)
}

interface RoleCard {
  role:        UserRole;
  label:       string;
  icon:        string;
  tagline:     string;
  features:    string[];
  gradient:    string;
  glow:        string;
  narration:   string;
  scriptId:    string;
}

const ROLES: RoleCard[] = [
  {
    role:     UserRole.CEO,
    label:    'CEO',
    icon:     '👔',
    tagline:  'Strategic Oversight',
    features: ['Company-wide analytics', 'Financial planning', 'Executive dashboards'],
    gradient: 'from-amber-50 to-orange-100/80',
    glow:     'hover:shadow-amber-100',
    narration: "As CEO, you'll see the full financial picture — payroll costs, procurement spend, and workforce ROI — all in one command centre.",
    scriptId:  'role.ceo',
  },
  {
    role:     UserRole.HR_MANAGER,
    label:    'HR Manager',
    icon:     '👥',
    tagline:  'Operations Management',
    features: ['Employee lifecycle', 'Payroll automation', 'Talent acquisition'],
    gradient: 'from-blue-50 to-indigo-100/80',
    glow:     'hover:shadow-blue-100',
    narration: "As HR Manager, you'll see how HR360 eliminates manual processes — attendance, payroll, and performance reviews all automated.",
    scriptId:  'role.hr',
  },
  {
    role:     UserRole.ACCOUNTANT,
    label:    'Accountant',
    icon:     '💰',
    tagline:  'Financial Control',
    features: ['Payroll processing', 'Budget tracking', 'Compliance reporting'],
    gradient: 'from-emerald-50 to-teal-100/80',
    glow:     'hover:shadow-emerald-100',
    narration: "As Accountant, you'll see how every payroll run posts directly to the general ledger — automated journal entries, instant reconciliation.",
    scriptId:  'role.finance',
  },
];

export function RoleSelection({ onDone }: Props) {
  const { setRole, setStep } = useOnboardingStore();
  const [selecting, setSelecting] = useState<UserRole | null>(null);

  const handleSelect = async (card: RoleCard) => {
    if (selecting) return;
    setSelecting(card.role);

    primeAudioContext();
    speak(card.narration, { scriptId: card.scriptId }).catch(() => {});

    setRole(card.role);

    // Brief pause so the card selection feels intentional
    await new Promise((r) => setTimeout(r, 600));

    setStep('mode-selection');
    onDone();
  };

  const handleSkip = () => {
    setRole(UserRole.HR_MANAGER);
    setStep('mode-selection');
    onDone();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Soft background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs font-black text-violet-600 uppercase tracking-[0.2em] mb-3">
          Personalise your demo
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Choose Your <span className="text-violet-600">Role</span>
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          HR360 adapts the demo to what matters most for your position
        </p>
      </motion.div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl relative z-10">
        {ROLES.map((card, i) => {
          const isSelecting = selecting === card.role;
          return (
            <motion.button
              key={card.role}
              onClick={() => handleSelect(card)}
              disabled={!!selecting}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={selecting ? {} : { y: -6, scale: 1.02 }}
              whileTap={selecting ? {} : { scale: 0.98 }}
              className={`
                relative text-left rounded-2xl p-6 border transition-all duration-300 cursor-pointer
                bg-gradient-to-br ${card.gradient}
                border-white/60 hover:border-white/80
                shadow-lg ${card.glow} hover:shadow-2xl
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

              <div className="text-5xl mb-4">{card.icon}</div>
              <h2 className="text-xl font-black text-slate-900 mb-1">{card.label}</h2>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4">
                {card.tagline}
              </p>

              <ul className="space-y-2">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-600 text-sm">
                    <span className="text-violet-500 text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Select role
                </span>
                <span className="text-slate-400 text-sm">→</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Skip */}
      <motion.div
        className="mt-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={handleSkip}
          className="text-slate-400 hover:text-slate-700 text-xs font-semibold uppercase tracking-widest transition-colors"
        >
          Skip — explore as guest →
        </button>
      </motion.div>
    </div>
  );
}

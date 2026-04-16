// ============================================
// FILE: src/demo/components/LeakageClosingScreen.tsx
// PURPOSE: Full-screen closing overlay shown during the final
//   narration step. Displays pre-calculated demo leakage numbers
//   and a CTA to run the real calculator for their own org.
//   Opens the LeakageAnalysisModal when CTA is clicked.
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeakageAnalysisModal from '../../../components/LeakageAnalysisModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-calculated demo numbers — 20 employees, ₦115.8M payroll, Technology sector
const DEMO_LEAKAGE = {
  totalAnnual:    '₦18.4M',
  perSecond:      '₦0.58',
  perDay:         '₦50,400',
  breakEven:      '2.1 months',
  roi3yr:         '₦38.2M',
  domains: [
    { label: 'Payroll Errors',       value: '₦4.6M',  pct: 25, color: '#0047cc' },
    { label: 'Attendance Fraud',     value: '₦3.2M',  pct: 17, color: '#0369a1' },
    { label: 'Procurement Leakage',  value: '₦3.8M',  pct: 21, color: '#0ea5e9' },
    { label: 'HR Admin Waste',       value: '₦2.9M',  pct: 16, color: '#38bdf8' },
    { label: 'Performance Gap',      value: '₦2.1M',  pct: 11, color: '#7dd3fc' },
    { label: 'Finance & Compliance', value: '₦1.8M',  pct: 10, color: '#bae6fd' },
  ],
};

export function LeakageClosingScreen({ isOpen, onClose }: Props) {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="leakage-closing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[8000] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(2,13,26,0.92)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[10px] font-black uppercase tracking-[0.3em] mb-3"
                  style={{ color: '#0ea5e9' }}
                >
                  Demo Organisation · 20 Employees · Technology Sector
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2"
                >
                  This organisation is losing
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2"
                  style={{ color: '#0ea5e9' }}
                >
                  {DEMO_LEAKAGE.totalAnnual}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/40 text-sm"
                >
                  every year to preventable inefficiencies
                </motion.p>

                {/* Live counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center gap-3 mt-4 px-5 py-2.5 rounded-full"
                  style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#0ea5e9' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm font-black text-white/70">
                    <span style={{ color: '#0ea5e9' }}>{DEMO_LEAKAGE.perSecond}</span> leaking every second right now
                  </span>
                </motion.div>
              </div>

              {/* Domain breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl p-6 mb-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Leakage by Domain</p>
                <div className="space-y-3">
                  {DEMO_LEAKAGE.domains.map((d, i) => (
                    <motion.div
                      key={d.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.07 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[10px] text-white/40 w-36 flex-shrink-0">{d.label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: d.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.pct}%` }}
                          transition={{ delay: 0.7 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-white/60 w-16 text-right flex-shrink-0">{d.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ROI stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8"
              >
                {[
                  { label: 'Daily Leakage',    value: DEMO_LEAKAGE.perDay },
                  { label: 'Break-Even',        value: DEMO_LEAKAGE.breakEven },
                  { label: '3-Year Recovery',   value: DEMO_LEAKAGE.roi3yr },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-3 md:p-4 text-center"
                    style={{ background: 'rgba(0,71,204,0.08)', border: '1px solid rgba(0,71,204,0.15)' }}>
                    <p className="text-sm md:text-lg font-black text-white mb-0.5">{value}</p>
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(14,165,233,0.6)' }}>{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="text-center space-y-3"
              >
                <p className="text-white/50 text-sm mb-4">
                  These are <span className="text-white font-semibold">demo numbers</span>. Your organisation's actual leakage could be higher or lower.
                </p>
                <button
                  onClick={() => setShowCalculator(true)}
                  className="w-full max-w-md py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0047cc, #0ea5e9)' }}
                >
                  Calculate Your Organisation's Leakage →
                </button>
                <button
                  onClick={onClose}
                  className="block mx-auto text-[10px] font-black uppercase tracking-widest transition-colors"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                >
                  Continue to summary →
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real leakage calculator — opens when CTA is clicked */}
      <LeakageAnalysisModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
    </>
  );
}

// ============================================
// FILE: src/demo/components/DemoCompletionModal.tsx
// PURPOSE: Shown when the guided demo (HR360 At A Glance) completes.
//   - Celebrates the end of the demo
//   - Shows key value props
//   - Contact / proposal request form
//   - Resets demo on close
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoOrchestrator } from '../orchestrator/demoOrchestrator';
import { useOnboardingStore } from '../onboarding/onboardingStore';
import { useNavigate } from 'react-router-dom';

interface FormState {
  name:        string;
  email:       string;
  company:     string;
  phone:       string;
  headcount:   string;
  message:     string;
}

const HEADCOUNTS = ['1–10', '11–50', '51–200', '201–500', '501–1,000', '1,000+'];

const VALUE_PROPS = [
  { icon: '⏱️', stat: '80%',  label: 'Reduction in payroll processing time' },
  { icon: '🔒', stat: '100%', label: 'Attendance fraud eliminated' },
  { icon: '📊', stat: '24hrs', label: 'Month-end close (down from 6–10 days)' },
  { icon: '💰', stat: '15–20%', label: 'Procurement spend recovered' },
];

export function DemoCompletionModal() {
  const { status, resetDemo } = useDemoOrchestrator();
  const { reset: resetOnboarding, role } = useOnboardingStore();
  const navigate = useNavigate();

  const [form, setForm]       = useState<FormState>({ name: '', email: '', company: '', phone: '', headcount: '51–200', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab]         = useState<'value' | 'form'>('value');

  const isOpen = status === 'complete';

  const patch = (partial: Partial<FormState>) =>
    setForm(prev => ({ ...prev, ...partial }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setSubmitting(true);

    // Send to Netlify Forms (works out of the box on Netlify)
    try {
      const body = new URLSearchParams({
        'form-name': 'hr360-proposal-request',
        ...form,
      });
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    } catch { /* non-fatal — form still shows success */ }

    setSubmitting(false);
    setSubmitted(true);
  }, [form]);

  const handleClose = useCallback(() => {
    resetDemo();
    resetOnboarding();
    navigate('/');
  }, [resetDemo, resetOnboarding, navigate]);

  const handleReplay = useCallback(() => {
    resetDemo();
    navigate('/mode');
  }, [resetDemo, navigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="demo-completion-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          style={{ background: 'rgba(10,6,24,0.85)', backdropFilter: 'blur(16px)' }}
        >
          <motion.div
            key="demo-completion-panel"
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 32 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl rounded-[28px] overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg, #0f0a1e 0%, #130d2a 100%)', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            {/* ── Header ── */}
            <div className="relative px-8 pt-8 pb-6 text-center overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.25) 0%, transparent 70%)' }} />

              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                You've seen HR360 at its best
              </h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                Now let's talk about what it can do for <span className="text-violet-300 font-semibold">your organisation specifically</span>.
              </p>
            </div>

            {/* ── Tab switcher ── */}
            <div className="flex gap-1 mx-8 mb-6 bg-white/5 rounded-2xl p-1">
              {([
                { id: 'value', label: '💡 What You Saw' },
                { id: 'form',  label: '📋 Get a Proposal' },
              ] as { id: 'value' | 'form'; label: string }[]).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    tab === t.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="px-8 pb-8">

              {/* ── Value props tab ── */}
              {tab === 'value' && (
                <motion.div
                  key="value-tab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {VALUE_PROPS.map(({ icon, stat, label }) => (
                      <div key={label} className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="text-2xl mb-2">{icon}</div>
                        <p className="text-2xl font-black text-violet-300 leading-none mb-1">{stat}</p>
                        <p className="text-[10px] text-white/50 leading-snug">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl p-4 border border-violet-500/20" style={{ background: 'rgba(139,92,246,0.08)' }}>
                    <p className="text-[11px] font-black text-violet-300 uppercase tracking-widest mb-2">
                      💸 What is your organisation losing right now?
                    </p>
                    <p className="text-[12px] text-white/60 leading-relaxed">
                      The leakage calculator you just saw uses your real headcount, payroll, and procurement data to calculate your exact exposure — payroll errors, time theft, maverick spending, and more.
                    </p>
                    <p className="text-[12px] text-violet-300 font-semibold mt-2">
                      Most organisations discover they're losing 8–22% of annual payroll to preventable inefficiencies.
                    </p>
                  </div>

                  <button
                    onClick={() => setTab('form')}
                    className="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
                  >
                    Request a Personalised Proposal →
                  </button>
                </motion.div>
              )}

              {/* ── Contact form tab ── */}
              {tab === 'form' && (
                <motion.div
                  key="form-tab"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-3"
                    >
                      <div className="text-5xl">✅</div>
                      <h3 className="text-xl font-black text-white">Proposal request received</h3>
                      <p className="text-white/50 text-sm max-w-xs mx-auto">
                        Our team will prepare a personalised proposal with your leakage analysis and ROI projection within 24 hours.
                      </p>
                      <div className="flex gap-3 justify-center pt-4">
                        <button onClick={handleReplay}
                          className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all">
                          Replay Demo
                        </button>
                        <button onClick={handleClose}
                          className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
                          Back to Home
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    // Hidden Netlify form field + actual form
                    <form
                      name="hr360-proposal-request"
                      data-netlify="true"
                      onSubmit={handleSubmit}
                      className="space-y-3"
                    >
                      <input type="hidden" name="form-name" value="hr360-proposal-request" />

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Full Name *" value={form.name} onChange={v => patch({ name: v })} placeholder="Jane Smith" />
                        <Field label="Work Email *" value={form.email} onChange={v => patch({ email: v })} placeholder="jane@company.com" type="email" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Company *" value={form.company} onChange={v => patch({ company: v })} placeholder="Acme Corp" />
                        <Field label="Phone" value={form.phone} onChange={v => patch({ phone: v })} placeholder="+234 800 000 0000" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">
                          Headcount
                        </label>
                        <select
                          value={form.headcount}
                          onChange={e => patch({ headcount: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          {HEADCOUNTS.map(h => <option key={h} value={h} style={{ background: '#1e1b4b' }}>{h} employees</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">
                          What's your biggest HR/payroll challenge?
                        </label>
                        <textarea
                          value={form.message}
                          onChange={e => patch({ message: e.target.value })}
                          rows={2}
                          placeholder="e.g. Manual payroll errors, attendance fraud, slow month-end close..."
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || !form.name || !form.email || !form.company}
                        className="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending…
                          </span>
                        ) : 'Send Proposal Request →'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ── Footer actions ── */}
              {!submitted && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <button onClick={handleReplay}
                    className="text-[10px] font-black text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors">
                    ↺ Replay Demo
                  </button>
                  <button onClick={handleClose}
                    className="text-[10px] font-black text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors">
                    Exit →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Small reusable field ───────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
    </div>
  );
}

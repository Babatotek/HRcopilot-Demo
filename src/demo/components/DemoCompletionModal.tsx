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
import { Clock, ShieldCheck, BarChart3, ShoppingCart, CheckCircle } from 'lucide-react';
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
  { Icon: Clock,        stat: '80%',    label: 'Reduction in payroll processing time' },
  { Icon: ShieldCheck,  stat: '100%',   label: 'Attendance fraud eliminated' },
  { Icon: BarChart3,    stat: '24 hrs', label: 'Month-end close (down from 6–10 days)' },
  { Icon: ShoppingCart, stat: '15–20%', label: 'Procurement spend recovered' },
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
            style={{ background: 'linear-gradient(160deg, #0f0a1e 0%, #021020 100%)', border: '1px solid rgba(56,189,248,0.2)' }}
          >
            {/* ── Header ── */}
            <div className="relative px-8 pt-8 pb-6 text-center overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />

              {/* Wordmark */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <div className="w-px h-4 bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(14,165,233,0.6)' }}>
                  HRcopilot · Demo Complete
                </span>
                <div className="w-px h-4 bg-white/10" />
              </motion.div>

              <h2 className="text-2xl font-black text-white tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                You've seen HRcopilot at its best
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                Now let's talk about what it can do for{' '}
                <span className="text-white/70 font-semibold">your organisation specifically</span>.
              </p>
            </div>

            {/* ── Tab switcher ── */}
            <div className="flex gap-1 mx-8 mb-6 rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {([
                { id: 'value', label: 'What You Saw' },
                { id: 'form',  label: 'Get a Proposal' },
              ] as { id: 'value' | 'form'; label: string }[]).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    tab === t.id
                      ? 'bg-white/8 text-white'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                  style={tab === t.id ? { background: 'rgba(0,71,204,0.3)', color: 'white' } : {}}
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
                  {/* Leakage highlight */}
                  <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(0,71,204,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#0ea5e9' }}>Demo Organisation Lost</p>
                    <p className="text-4xl font-black text-white mb-1">₦18.4M / year</p>
                    <p className="text-[11px] text-white/40">to payroll errors, attendance fraud, procurement leakage & more</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {VALUE_PROPS.map(({ Icon, stat, label }) => (
                      <div key={label} className="rounded-xl p-4 border border-white/8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="mb-2 text-white/30">
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-xl font-black text-white leading-none mb-1">{stat}</p>
                        <p className="text-[10px] text-white/40 leading-snug">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl p-4" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#0ea5e9' }}>
                      What is YOUR organisation losing?
                    </p>
                    <p className="text-[12px] text-white/60 leading-relaxed mb-3">
                      The demo showed ₦18.4M in annual leakage for 20 employees. Most organisations with 100+ employees lose <span className="text-white font-semibold">₦80M–₦400M annually</span> to the same preventable gaps.
                    </p>
                    <button
                      onClick={() => setTab('form')}
                      className="w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #0047cc, #0ea5e9)' }}
                    >
                      Get My Organisation's Leakage Report →
                    </button>
                  </div>
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
                      <div className="flex justify-center mb-2">
                        <CheckCircle className="w-12 h-12" style={{ color: '#0ea5e9' }} />
                      </div>
                      <h3 className="text-lg font-black text-white tracking-tight">Proposal request received</h3>
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
                          style={{ background: 'linear-gradient(135deg, #0369a1, #2563eb)' }}>
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
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#e0f2fe]0/40"
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
                          className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#e0f2fe]0/40 resize-none"
                          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || !form.name || !form.email || !form.company}
                        className="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #0369a1, #2563eb)' }}
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
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#e0f2fe]0/40"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      />
    </div>
  );
}


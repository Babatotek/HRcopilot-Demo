// ============================================
// FILE: src/demo/onboarding/WelcomeZoom.tsx
// PURPOSE: Cinematic welcome screen.
//   Deep space background, particle field, phased logo reveal.
//   Narration fires after zoom settles.
// ============================================

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { speak, primeAudioContext } from '../voice/narrationEngine';

interface Props { onDone: () => void; }

const WELCOME_TEXT =
  "Welcome to HR360 Explorer. I'm your AI guide. Let me show you what's possible when people, finance, and operations work as one.";

const PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  id:       i,
  x:        Math.random() * 100,
  y:        Math.random() * 100,
  size:     Math.random() * 2.5 + 1,
  duration: 4 + Math.random() * 5,
  delay:    Math.random() * 3,
}));

export function WelcomeZoom({ onDone }: Props) {
  const [show, setShow] = useState(false);
  // Track whether we've already called onDone to prevent double-advance
  const advancedRef = useRef(false);

  const advance = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    // Show content after zoom animation settles
    const t1 = setTimeout(() => setShow(true), 700);

    // Narration — advance when speech finishes, with a minimum 4s display time
    const t2 = setTimeout(() => {
      primeAudioContext();
      speak(WELCOME_TEXT, {
        scriptId: 'onboarding.welcome',
        onDone: () => {
          // Speech finished naturally — short pause then advance
          setTimeout(advance, 600);
        },
      }).catch(() => {
        // speak() threw synchronously — safety timer will advance
      });
    }, 900);

    // Safety fallback — if speech never fires onDone (network issue, etc.)
    // wait a generous 12s before advancing anyway
    const t3 = setTimeout(advance, 12_000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      // Do NOT call stop() here — it would cancel the in-flight generation
      // and trigger the fallback chain, causing a double-advance via onDone
    };
  }, [advance]);

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ background: '#06040f' }}>

      {/* Expanding zoom overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0.05, borderRadius: '50%', opacity: 0 }}
        animate={{ scale: 1,    borderRadius: '0%',  opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #1e0a3c 0%, #0d0520 45%, #06040f 100%)',
        }}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.12, 1], x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          top: '15%', right: '10%',
        }}
        animate={{ scale: [1, 1.18, 1], x: [0, -18, 0], y: [0, 25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* Particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left:             `${p.x}%`,
              top:              `${p.y}%`,
              width:            `${p.size}px`,
              height:           `${p.size}px`,
              backgroundColor:  'rgba(167,139,250,0.5)',
            }}
            animate={{ y: [0, -90], opacity: [0, 0.7, 0] }}
            transition={{
              duration:   p.duration,
              delay:      p.delay,
              repeat:     Infinity,
              ease:       'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.35), transparent)' }}
        animate={{ top: ['0%', '100%'], opacity: [0, 0.8, 0] }}
        transition={{ duration: 3.5, delay: 1, repeat: Infinity, repeatDelay: 5, ease: 'linear' }}
      />

      {/* ── Main content — always mounted, fades in ── */}
      <motion.div
        className="relative z-10 text-center px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 30 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Spinning ring + rocket */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, #7c3aed, #6366f1, #a855f7, #c084fc, #7c3aed)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-[3px] rounded-full flex items-center justify-center"
            style={{ background: '#0d0520' }}>
            <motion.span
              className="text-4xl"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              🚀
            </motion.span>
          </div>
          {/* Outer glow ring */}
          <div className="absolute -inset-2 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)' }} />
        </div>

        {/* Wordmark */}
        <motion.h1
          className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          HR
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%)' }}
          >
            360
          </span>
        </motion.h1>

        <motion.p
          className="font-bold uppercase tracking-[0.45em] mb-3"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Explorer
        </motion.p>

        <motion.p
          className="text-base max-w-xs leading-relaxed mb-10"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          People · Finance · Operations · Intelligence
        </motion.p>

        {/* Pulsing dots */}
        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(167,139,250,0.8)' }}
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Skip */}
      <motion.button
        onClick={onDone}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 right-8 transition-colors"
        style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
      >
        Skip intro →
      </motion.button>
    </div>
  );
}

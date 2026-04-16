import React, { useState } from 'react';

interface GlassCardProps {
  id?: string;
  'data-demo-id'?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  /** Left border accent color, e.g. '#0047cc' */
  accentColor?: string;
  /** If provided the card becomes clickable and shows this modal content */
  modalContent?: React.ReactNode;
  modalTitle?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  id,
  'data-demo-id': dataDemoId,
  children,
  className = '',
  title,
  action,
  accentColor,
  modalContent,
  modalTitle,
  onClick,
}) => {
  const [open, setOpen] = useState(false);
  const isClickable = !!(modalContent || onClick);

  const handleClick = () => {
    if (onClick) { onClick(); return; }
    if (modalContent) setOpen(true);
  };

  return (
    <>
      <div
        id={id}
        data-demo-id={dataDemoId}
        onClick={isClickable ? handleClick : undefined}
        className={`
          relative rounded-[2rem] bg-white dark:bg-[#13102a]
          border border-slate-50 dark:border-white/[0.04]
          shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]
          hover:-translate-y-1 active:translate-y-0
          transition-all duration-300 p-4 sm:p-6 md:p-8 overflow-hidden
          ${isClickable ? 'cursor-pointer' : ''}
          ${className}
        `}
        style={accentColor ? { borderLeft: `4px solid ${accentColor}` } : undefined}
      >
        {/* subtle top-right glow when accent is set */}
        {accentColor && (
          <div
            className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: accentColor }}
          />
        )}

        {(title || action) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em]">
                {title}
              </h3>
            )}
            {action && <div>{action}</div>}
          </div>
        )}

        {children}

        {/* click hint */}
        {isClickable && (
          <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-3 h-3 text-slate-300 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {open && modalContent && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-[#13102a] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-slate-100 dark:border-white/5"
              style={accentColor ? { borderLeft: `3px solid ${accentColor}` } : undefined}
            >
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                {modalTitle || title || 'Details'}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-7 py-6">{modalContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(GlassCard);

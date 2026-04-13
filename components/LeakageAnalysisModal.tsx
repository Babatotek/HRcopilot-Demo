import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LeakageWidget = lazy(() => import('../src/components/leakage/OrganizationalIntelligenceWidget'));

interface LeakageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const LeakageAnalysisModal: React.FC<LeakageAnalysisModalProps> = ({ isOpen, onClose, userName = 'there' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-7xl bg-white dark:bg-[#0f172a] rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col h-[95vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0047cc] to-[#0035a0] rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-2xl text-white">📊</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Leakage Intelligence</h2>
                    <span className="px-2 py-0.5 bg-[#e0e7ff] text-[#0047cc] text-[10px] font-bold rounded-md">Enterprise</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Real-time organizational leakage analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#0047cc] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Leakage Analysis...</p>
                  </div>
                </div>
              }>
                <div className="p-6">
                  <LeakageWidget standalone={true} />
                </div>
              </Suspense>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeakageAnalysisModal;
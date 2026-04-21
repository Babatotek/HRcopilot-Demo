// ============================================
// FILE: src/demo/components/DemoApprovalChainModal.tsx
// PURPOSE: Guided demo approval pipeline showcase.
//   Opens automatically on the approval-pipeline step.
//   Visualises the multi-stage approval chain across
//   Leave, Payroll, Procurement, and Expense operations.
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type ApprovalStatus = 'APPROVED' | 'PENDING' | 'AWAITING' | 'REJECTED';

interface ApprovalStep {
  role: string;
  name: string;
  status: ApprovalStatus;
  timestamp?: string;
  comment?: string;
}

interface ApprovalItem {
  id: string;
  type: 'Leave Request' | 'Payroll Run' | 'Purchase Order' | 'Expense Claim';
  icon: string;
  subject: string;
  amount?: string;
  submittedBy: string;
  submittedAt: string;
  chain: ApprovalStep[];
  overallStatus: 'IN PROGRESS' | 'APPROVED' | 'REJECTED';
}

const APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: 'PR-2026-04',
    type: 'Payroll Run',
    icon: '💰',
    subject: 'April 2026 Payroll — All Branches',
    amount: '₦12,450,000',
    submittedBy: 'Payroll Engine',
    submittedAt: 'Apr 20, 2026 · 08:00',
    overallStatus: 'IN PROGRESS',
    chain: [
      { role: 'HR Manager',    name: 'Amara Osei',     status: 'APPROVED',  timestamp: 'Apr 20 · 08:14', comment: 'Attendance data verified. Approved.' },
      { role: 'Finance Lead',  name: 'Chidi Nwosu',    status: 'APPROVED',  timestamp: 'Apr 20 · 09:02', comment: 'Ledger entries reviewed. Approved.' },
      { role: 'CEO',           name: 'Tosin Adeyemi',  status: 'PENDING',   timestamp: undefined },
    ],
  },
  {
    id: 'LR-0441',
    type: 'Leave Request',
    icon: '🏖️',
    subject: '5-Day Annual Leave — Kelly Robinson',
    submittedBy: 'Kelly Robinson',
    submittedAt: 'Apr 18, 2026 · 14:22',
    overallStatus: 'APPROVED',
    chain: [
      { role: 'Line Manager',  name: 'James Okafor',   status: 'APPROVED',  timestamp: 'Apr 18 · 15:10', comment: 'Coverage confirmed.' },
      { role: 'HR Manager',    name: 'Amara Osei',     status: 'APPROVED',  timestamp: 'Apr 19 · 09:30', comment: 'Balance sufficient. Approved.' },
    ],
  },
  {
    id: 'PO-2026-118',
    type: 'Purchase Order',
    icon: '📦',
    subject: 'Office Equipment — IT Department',
    amount: '₦840,000',
    submittedBy: 'Emeka Eze',
    submittedAt: 'Apr 19, 2026 · 11:05',
    overallStatus: 'IN PROGRESS',
    chain: [
      { role: 'Dept. Head',    name: 'Emeka Eze',      status: 'APPROVED',  timestamp: 'Apr 19 · 11:05', comment: 'Budget available.' },
      { role: 'Procurement',   name: 'Ngozi Adaeze',   status: 'APPROVED',  timestamp: 'Apr 19 · 13:40', comment: '3-way match passed.' },
      { role: 'Finance Lead',  name: 'Chidi Nwosu',    status: 'PENDING',   timestamp: undefined },
    ],
  },
  {
    id: 'EX-0892',
    type: 'Expense Claim',
    icon: '🧾',
    subject: 'Client Travel & Accommodation',
    amount: '₦215,000',
    submittedBy: 'Fatima Bello',
    submittedAt: 'Apr 17, 2026 · 16:48',
    overallStatus: 'REJECTED',
    chain: [
      { role: 'Line Manager',  name: 'James Okafor',   status: 'APPROVED',  timestamp: 'Apr 17 · 17:20' },
      { role: 'Finance Lead',  name: 'Chidi Nwosu',    status: 'REJECTED',  timestamp: 'Apr 18 · 10:05', comment: 'Receipts missing for hotel. Resubmit.' },
    ],
  },
];

const STATUS_CONFIG: Record<ApprovalStatus, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  APPROVED:  { icon: <CheckCircle2 size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  PENDING:   { icon: <Clock size={14} />,        color: 'text-amber-500',   bg: 'bg-amber-50',    border: 'border-amber-200'   },
  AWAITING:  { icon: <AlertCircle size={14} />,  color: 'text-slate-400',   bg: 'bg-slate-50',    border: 'border-slate-200'   },
  REJECTED:  { icon: <XCircle size={14} />,      color: 'text-rose-500',    bg: 'bg-rose-50',     border: 'border-rose-200'    },
};

const OVERALL_BADGE: Record<ApprovalItem['overallStatus'], string> = {
  'IN PROGRESS': 'bg-amber-50 text-amber-600 border-amber-200',
  'APPROVED':    'bg-emerald-50 text-emerald-600 border-emerald-200',
  'REJECTED':    'bg-rose-50 text-rose-500 border-rose-200',
};

function ApprovalCard({ item, index }: { item: ApprovalItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="px-4 py-3 flex items-start justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl flex-shrink-0">{item.icon}</span>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type} · {item.id}</p>
            <p className="text-[12px] font-black text-slate-900 truncate">{item.subject}</p>
            {item.amount && (
              <p className="text-[11px] font-black text-[#0047cc] mt-0.5">{item.amount}</p>
            )}
          </div>
        </div>
        <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${OVERALL_BADGE[item.overallStatus]}`}>
          {item.overallStatus}
        </span>
      </div>

      {/* Submitter */}
      <div className="px-4 pt-2.5 pb-1 flex items-center gap-2 text-[10px] text-slate-400">
        <span className="font-bold">Submitted by</span>
        <span className="font-black text-slate-600">{item.submittedBy}</span>
        <span>·</span>
        <span>{item.submittedAt}</span>
      </div>

      {/* Approval chain */}
      <div className="px-4 pb-4 pt-2 space-y-2">
        {item.chain.map((step, i) => {
          const cfg = STATUS_CONFIG[step.status];
          const isLast = i === item.chain.length - 1;
          return (
            <div key={i} className="flex gap-3">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                  {cfg.icon}
                </div>
                {!isLast && <div className="w-px flex-1 bg-slate-100 mt-1" />}
              </div>

              {/* Step detail */}
              <div className={`flex-1 pb-${isLast ? '0' : '2'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-black text-slate-800">{step.name}</span>
                    <span className="ml-1.5 text-[9px] font-bold text-slate-400 uppercase">{step.role}</span>
                  </div>
                  {step.timestamp && (
                    <span className="text-[9px] text-slate-400 flex-shrink-0">{step.timestamp}</span>
                  )}
                </div>
                {step.comment && (
                  <p className="mt-0.5 text-[10px] text-slate-500 italic">"{step.comment}"</p>
                )}
                {!step.timestamp && (
                  <p className="mt-0.5 text-[10px] text-amber-500 font-bold">Awaiting review…</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function DemoApprovalChainModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 32 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl mx-auto bg-slate-50 rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#0047cc] via-[#38bdf8] to-[#0047cc] flex-shrink-0" />

            {/* Header */}
            <div className="px-4 md:px-8 pt-5 pb-4 flex items-center justify-between gap-3 bg-white border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
                  <ShieldCheck size={20} className="text-[#0047cc]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">Approval Pipeline</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Every operation · Verified · Auditable
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Summary badges */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[9px] font-black text-amber-600 uppercase tracking-widest">
                    2 Pending
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                    1 Approved
                  </span>
                  <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-full text-[9px] font-black text-rose-500 uppercase tracking-widest">
                    1 Rejected
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all text-sm flex-shrink-0"
                >✕</button>
              </div>
            </div>

            {/* Subtitle */}
            <div className="px-4 md:px-8 py-3 bg-[#eff6ff] border-b border-[#bfdbfe] flex-shrink-0">
              <p className="text-[11px] text-[#1d4ed8] font-bold">
                Leave requests, payroll runs, purchase orders, and expense claims — every operation is gated by a configurable approval chain before it is processed.
              </p>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-5 space-y-4">
              {APPROVAL_ITEMS.map((item, i) => (
                <ApprovalCard key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 md:px-8 py-4 bg-white border-t border-slate-100 flex items-center justify-between flex-shrink-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                🔒 All decisions timestamped · Immutable audit trail
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#0047cc] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0035a0] transition-all shadow-lg shadow-blue-500/20"
              >
                Continue Demo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

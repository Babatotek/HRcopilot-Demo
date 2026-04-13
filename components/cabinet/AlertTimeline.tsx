import React from 'react';
import GlassCard from '../GlassCard';

const AlertTimeline: React.FC = () => {
  const alerts = [
    { id: 1, type: 'EXPIRING', title: 'Contract Expiring Soon', desc: 'Vendor agreement with TechCorp expires in 30 days.', date: 'Today, 09:00 AM', status: 'pending' },
    { id: 2, type: 'MISSING', title: 'Missing Compliance Form', desc: 'I-9 form missing for new hire Jane Doe.', date: 'Yesterday, 14:30 PM', status: 'action_required' },
    { id: 3, type: 'UPDATED', title: 'Policy Updated', desc: 'Q3 Security Policy has been signed by all department heads.', date: 'Oct 12, 11:15 AM', status: 'resolved' },
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest">Compliance Alerts</h3>
          <p className="text-[10px] text-slate-500 mt-1">Triggering Notification Bell & Memos</p>
        </div>
        <button className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest">View All</button>
      </div>

      <div className="space-y-6">
        {alerts.map((alert, i) => (
          <div key={alert.id} className="relative pl-6">
            {/* Timeline line */}
            {i !== alerts.length - 1 && (
              <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200 dark:bg-white/10" />
            )}
            
            {/* Timeline dot */}
            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
              alert.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-500' :
              alert.status === 'action_required' ? 'bg-rose-500/20 text-rose-500' :
              'bg-amber-500/20 text-amber-500'
            }`}>
              {alert.status === 'resolved' ? '✓' : alert.status === 'action_required' ? '!' : '⏱'}
            </div>

            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{alert.title}</h4>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{alert.date}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">{alert.desc}</p>
              
              {alert.status !== 'resolved' && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-[var(--brand-primary)] text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Take Action</button>
                  <button className="px-3 py-1.5 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-widest">Dismiss</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default AlertTimeline;

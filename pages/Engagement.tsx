
import React from 'react';
import GlassCard from '../components/GlassCard';
import { DEMO_RECOGNITIONS, DEMO_MILESTONES, DEMO_REWARDS, DEMO_EMPLOYEES } from '../demoData';

const RECOGNITION_FEED = DEMO_RECOGNITIONS.map(r => ({
  id: r.id,
  sender: r.senderName,
  role: r.senderRole,
  time: '1 hour ago',
  message: r.message,
  kudos: Object.values(r.reactions).reduce((s, v) => s + v, 0),
  avatar: r.senderAvatar,
  reactions: Object.keys(r.reactions),
}));

const REWARDS = DEMO_REWARDS.map(r => ({
  title: r.title,
  cost: r.pointsCost,
  icon: r.icon,
  color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}));

const Engagement: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Engagement <span className="text-[#0047cc]">Dashboard</span></h2>
        </div>
        <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
          Give Recognitions
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Recognitions Given', val: '48', footer: 'View All › 15 this week', icon: '⭐', color: 'text-blue-400' },
          { label: 'Awards Redeemed', val: '16', footer: '+15% vs last 30 days', icon: '🏆', color: 'text-orange-400' },
          { label: 'Kudos Points', val: '220', footer: 'in Q2 2024', icon: '😊', color: 'text-emerald-400' },
          { label: 'Polls Published', val: '5', footer: 'All Time', icon: '📊', color: 'text-purple-400' },
          { label: 'Days', val: '5', footer: 'All Time', icon: '🗓️', color: 'text-slate-400' },
        ].map((stat, i) => (
          <GlassCard key={i} className="!p-4 border-white/5 hover:bg-white/[0.04] transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[28px] font-black text-white">{stat.val}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl grayscale opacity-40 group-hover:opacity-100 transition-all">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#0047cc]">
                {stat.footer}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content: Surveys and Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Overview / Survey Result */}
          <GlassCard 
            title="Overview" 
            action={
              <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Export ▾</button>
            }
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-white mb-1">How satisfied are you with the company's new remote work policy?</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Posted 5 days ago • 20 Responses</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Dissatisfied', val: 4, color: 'bg-rose-500' },
                  { label: 'Slightly Dissatisfied', val: 15, color: 'bg-orange-500' },
                  { label: 'Satisfied', val: 51, color: 'bg-emerald-500' },
                  { label: 'Very Satisfied', val: 22, color: 'bg-blue-500' },
                  { label: 'Neutral', val: 8, color: 'bg-slate-500' },
                ].map((opt, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${opt.color}`} />
                          {opt.label}
                       </span>
                       <span className="text-white">{opt.val}%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div className={`h-full ${opt.color} opacity-40`} style={{ width: `${opt.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Employee Polls ›</button>
              </div>
            </div>
          </GlassCard>

          {/* Employee Recognition Feed */}
          <GlassCard 
            title="Employee Recognition Feed" 
            action={<button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">View All ›</button>}
          >
            <div className="space-y-8">
              {RECOGNITION_FEED.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/10"><img src={item.avatar} className="w-full h-full object-cover" alt="" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-black text-white">{item.sender}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{item.role} • {item.time}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0047cc]/10 rounded-lg border border-[#0047cc]/20">
                         <span className="text-[10px] font-black text-[#0047cc] uppercase tracking-widest">{item.kudos} Kudos</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-300 leading-relaxed italic border-l-2 border-[#0047cc]/30 pl-4 py-1">"{item.message}"</p>
                    <div className="mt-4 flex items-center justify-between">
                       <div className="flex gap-2">
                          {item.reactions.map((r, ri) => (
                            <button key={ri} className="px-2 py-1 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-colors">{r}</button>
                          ))}
                          <button className="px-2 py-1 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Comments</button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar: Incentives and Milestones */}
        <div className="lg:col-span-4 space-y-6">
          {/* Employee of the Month */}
          <GlassCard title="Employee of the Month" action={<button className="text-[10px] font-black text-slate-500 uppercase">Export ▾</button>}>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                <img src="https://picsum.photos/100/100?sig=eom" className="w-24 h-24 rounded-[32px] border-2 border-orange-500 relative z-10 p-1 bg-[#0f172a]" alt="" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-xl z-20 shadow-lg">😊</div>
              </div>
              <h3 className="text-xl font-black text-white">John Smith</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Sales Associate</p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Kudos</p>
                   <p className="text-sm font-black text-white">780</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Rating Score</p>
                   <p className="text-sm font-black text-white">120</p>
                </div>
              </div>
              <button className="mt-4 text-[9px] font-black text-blue-400 uppercase tracking-widest hover:underline">Employee Profile ›</button>
            </div>
          </GlassCard>

          {/* Rewards Catalog */}
          <GlassCard title="Rewards Catalog" action={<button className="text-[9px] font-black text-slate-500 uppercase">Export ▾</button>}>
            <div className="grid grid-cols-2 gap-3">
              {REWARDS.map((reward, i) => (
                <div key={i} className={`p-4 rounded-2xl border flex flex-col items-center text-center group cursor-pointer transition-all hover:scale-[1.02] ${reward.color}`}>
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{reward.icon}</div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-1">{reward.title}</h4>
                  <p className="text-xs font-black text-white mb-3">{reward.cost} Kudos</p>
                  <button className="w-full py-1.5 bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/20">Redeem</button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming Birthdays */}
          <GlassCard title="Upcoming Birthdays" action={<button className="text-slate-500">•••</button>}>
            <div className="space-y-4">
              {DEMO_MILESTONES.filter(m => m.type === 'BIRTHDAY').map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                   <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/10"><img src={item.avatar} className="w-full h-full object-cover" alt="" /></div>
                   <div className="flex-1">
                      <p className="text-xs font-bold text-white tracking-tight">{item.employeeName}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{item.date} • {item.note}</p>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xl">🎈</button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming Work Anniversaries */}
          <GlassCard title="Work Anniversaries" action={<span className="text-xl">🎊</span>}>
            <div className="space-y-4">
              {DEMO_MILESTONES.filter(m => m.type === 'ANNIVERSARY').map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-white/10"><img src={item.avatar} className="w-full h-full object-cover" alt="" /></div>
                   <div className="flex-1">
                      <p className="text-xs font-bold text-white tracking-tight">{item.employeeName}</p>
                      <p className="text-[9px] text-emerald-400 font-black uppercase">{item.note}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{item.date}</p>
                   </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Engagement;

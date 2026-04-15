
import React from 'react';
import GlassCard from '../components/GlassCard';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const attendanceData = [
  { name: 'Week 1', Absent: 0, Late: 0, Present: 0 },
  { name: 'Week 2', Absent: 0, Late: 0, Present: 0 },
  { name: 'Week 3', Absent: 0, Late: 0, Present: 0 },
  { name: 'Week 4', Absent: 0, Late: 0, Present: 0 },
];

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            MY <span className="text-[#0047cc]">DASHBOARD</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
            PERSONAL OVERVIEW
          </p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="!p-6 border-l-4 border-l-emerald-500 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">DAYS PRESENT</span>
          <h3 className="text-4xl font-black text-emerald-500 group-hover:scale-105 transition-transform origin-left">0</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">THIS MONTH</p>
        </GlassCard>
        
        <GlassCard className="!p-6 border-l-4 border-l-rose-500 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">DAYS ABSENT</span>
          <h3 className="text-4xl font-black text-rose-500 group-hover:scale-105 transition-transform origin-left">3</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">THIS MONTH</p>
        </GlassCard>
        
        <GlassCard className="!p-6 border-l-4 border-l-[#0047cc] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">LEAVE BALANCE</span>
          <h3 className="text-4xl font-black text-[#0047cc] group-hover:scale-105 transition-transform origin-left">0</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">DAYS REMAINING</p>
        </GlassCard>
        
        <GlassCard className="!p-6 border-l-4 border-l-[#0047cc] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all group">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">MY SCORE</span>
          <h3 className="text-4xl font-black text-[#0047cc] group-hover:scale-105 transition-transform origin-left">100%</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">EXCEPTIONAL</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Charts */}
        <div className="space-y-8">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">My Attendance</h3>
              <span className="text-xs font-bold text-[#0047cc]">April 2026</span>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} ticks={[0, 0.25, 0.5, 0.75, 1]} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }} />
                  <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="Present" fill="#0047cc" radius={[4, 4, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6">My Performance Score</h3>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white">100%</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">EXCEPTIONAL</p>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                    <span>MY SCORE</span>
                    <span className="text-slate-900 dark:text-white">100%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-200 dark:bg-slate-700 w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                    <span>DEPT AVG</span>
                    <span className="text-slate-900 dark:text-white">78.67%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[78.67%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                    <span>ORG AVG</span>
                    <span className="text-slate-900 dark:text-white">81.68%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 dark:bg-slate-600 w-[81.68%]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between text-[10px] font-bold text-slate-400">
              <span>2026-W11</span>
              <span>2026-W09</span>
              <span>2026-W08</span>
              <span>2026-W11</span>
              <span>2026-W11</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <GlassCard>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6">Leave Balance</h3>
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-sm text-slate-400">No leave balances found</p>
            </div>
          </GlassCard>

          <div className="bg-[#0047cc] rounded-3xl p-8 shadow-xl">
            <h3 className="text-sm font-black text-white italic tracking-widest uppercase mb-6">QUICK ACTIONS</h3>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.hash = '/my-payroll'}
                className="w-full bg-white text-[#0047cc] font-black text-[10px] uppercase tracking-widest py-4 px-6 rounded-xl text-left hover:bg-blue-50 transition-colors flex justify-between items-center"
              >
                My Payslips
                <span className="text-[8px] opacity-40">→</span>
              </button>
              <button className="w-full bg-white text-[#0047cc] font-bold text-sm py-4 px-6 rounded-xl text-left hover:bg-blue-50 transition-colors">
                Apply for Leave
              </button>
              <button className="w-full bg-white text-[#0047cc] font-bold text-sm py-4 px-6 rounded-xl text-left hover:bg-blue-50 transition-colors">
                My Attendance
              </button>
              <button className="w-full bg-white text-[#0047cc] font-bold text-sm py-4 px-6 rounded-xl text-left hover:bg-blue-50 transition-colors">
                My Performance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

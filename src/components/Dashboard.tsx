import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpRight, TrendingUp, Users, Clock, Calendar, CheckCircle, Play } from 'lucide-react';
import { cn } from '../lib/utils';

const headcountData = [
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 8 },
  { name: 'Apr', value: 10 },
];

const attendanceData = [
  { name: 'Present', value: 0, color: '#0052CC' },
  { name: 'Late', value: 0, color: '#FBBF24' },
  { name: 'Absent', value: 10, color: '#EF4444' },
  { name: 'On Leave', value: 0, color: '#94A3B8' },
];

const demographicData = [
  { name: 'Full-Time', value: 8, color: '#0052CC' },
  { name: 'Full-Time', value: 1, color: '#10B981' },
  { name: 'Part-Time', value: 1, color: '#FBBF24' },
];

const topPerformers = [
  { name: 'Kelly Robinson', dept: 'MARKETING', score: '84.2%', avatar: 'KR' },
  { name: 'Amanda Ward', dept: 'HUMAN RESOURCES', score: '83.67%', avatar: 'AW' },
  { name: 'Alex Rivera', dept: 'ENGINEERING', score: '78.67%', avatar: 'AR' },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-800 tracking-tight italic uppercase">
            Executive <span className="text-brand-blue">Dashboard</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
            Organisation Overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Calendar size={14} />
          April 2026
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value="10" trend="+0" color="blue" />
        <StatCard label="Present Today" value="0" color="emerald" />
        <StatCard label="On Leave" value="0" color="amber" />
        <StatCard label="Pending Approvals" value="0" color="indigo" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Headcount Over Time</h3>
            <button className="text-[10px] font-bold text-brand-blue hover:underline">View Details →</button>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                  dy={8}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0052CC" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#0052CC', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Attendance Health</h3>
          <div className="h-40 relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-800">0%</span>
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Present Rate</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[9px] font-bold p-1.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-500 uppercase truncate max-w-[40px]">{item.name}</span>
                </div>
                <span className="text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EmptyStateCard title="Employee Turnover" />
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Employee Demographics</h3>
          <div className="h-40 relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {demographicData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center p-1.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[8px] font-bold text-slate-500 uppercase">{item.name}</span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Payroll Summary</h3>
            <button className="text-[10px] font-bold text-brand-blue hover:underline">View Runs →</button>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <p className="text-3xl font-extrabold text-brand-blue tracking-tight">₦44,943.18</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Current Period Net</p>
            
            <div className="grid grid-cols-3 gap-2 w-full mt-6">
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs font-extrabold text-slate-800">11</p>
                <p className="text-[7px] font-bold text-slate-400 uppercase">Staff</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs font-extrabold text-slate-800">1</p>
                <p className="text-[7px] font-bold text-slate-400 uppercase">Runs</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-[9px] font-extrabold text-slate-800 leading-tight">₦4k</p>
                <p className="text-[7px] font-bold text-slate-400 uppercase">Avg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EmptyStateCard title="Pending Approvals" />
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Top Performers</h3>
            <button className="text-[10px] font-bold text-brand-blue hover:underline">View All →</button>
          </div>
          <div className="space-y-2">
            {topPerformers.map((person, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-600">{person.avatar}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{person.name}</p>
                    <p className="text-[9px] font-bold text-slate-400">{person.dept}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-brand-blue">{person.score}</span>
              </div>
            ))}
          </div>
        </div>

        <EmptyStateCard title="Hiring Funnel" />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Performance</h3>
            <button className="text-[10px] font-bold text-brand-blue hover:underline">View All →</button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-brand-blue">0%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Org Score</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Top Performers</span>
                <span className="text-xs font-extrabold text-emerald-600">3</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[30%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-brand-blue p-6 rounded-xl text-white shadow-lg shadow-brand-blue/10 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold italic uppercase tracking-wider text-lg">Quick Actions</h3>
            <p className="text-white/60 text-[10px] font-medium">Commonly used HR operations</p>
          </div>
          <div className="flex gap-3">
            <ActionButton label="Run Payroll" />
            <ActionButton label="Manage Employees" />
            <ActionButton label="Performance" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, color }: { label: string, value: string, trend?: string, color: string }) {
  const colors = {
    blue: 'border-l-brand-blue',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    indigo: 'border-l-[#eff6ff]0',
  };

  return (
    <div className={cn(
      "bg-white p-4 rounded-xl border border-slate-200 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer group",
      colors[color as keyof typeof colors]
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-500 transition-colors">{label}</span>
        {trend && (
          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            {trend} <ArrowUpRight size={8} />
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-slate-800 tracking-tight group-hover:text-brand-blue transition-colors">{value}</p>
    </div>
  );
}

function EmptyStateCard({ title }: { title: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
      <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-2">
          <TrendingUp className="text-slate-200" size={20} />
        </div>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">No data available</p>
      </div>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="bg-white hover:bg-slate-50 py-2.5 px-4 rounded-lg font-bold text-[11px] transition-all text-brand-blue flex items-center gap-2 group shadow-sm whitespace-nowrap">
      {label}
      <Play size={10} className="fill-brand-blue" />
    </button>
  );
}



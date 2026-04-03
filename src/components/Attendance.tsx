import React from 'react';
import { 
  BarChart3, 
  Users, 
  UserX, 
  Clock, 
  Calendar, 
  Activity, 
  History, 
  Timer, 
  CheckSquare, 
  Smartphone, 
  FileText, 
  Settings,
  TrendingDown,
  Circle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';

const attendanceTrendData = [
  { name: 'Mar 28', value: 0.5 },
  { name: 'Mar 29', value: 0.5 },
  { name: 'Mar 30', value: 2 },
  { name: 'Mar 31', value: 0.5 },
  { name: 'Apr 1', value: 4 },
  { name: 'Apr 2', value: 7 },
  { name: 'Apr 3', value: 1 },
];

const tabs = [
  { icon: BarChart3, label: 'OVERVIEW', active: true },
  { icon: FileText, label: 'SUMMARY' },
  { icon: Activity, label: 'LIVE ATTENDANCE' },
  { icon: History, label: 'DAILY RECORDS' },
  { icon: Timer, label: 'OVERTIME' },
  { icon: CheckSquare, label: 'CORRECTIONS' },
  { icon: Smartphone, label: 'DEVICES & IMPORTS' },
  { icon: FileText, label: 'REPORTS' },
  { icon: Settings, label: 'SETTINGS' },
];

export function Attendance() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-800 tracking-tight italic uppercase">
            Attendance <span className="text-brand-blue">Workspace</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
          <Circle size={8} className="fill-emerald-600" />
          Live Sync Active
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center overflow-x-auto no-scrollbar">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap",
              tab.active 
                ? "bg-brand-blue/5 text-brand-blue shadow-sm" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-extrabold text-slate-800 italic uppercase tracking-wider">Overview & Analytics</h2>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AttendanceStatCard icon={Users} label="Present Today" value="1" iconColor="text-emerald-500" bgColor="bg-emerald-50" />
          <AttendanceStatCard icon={UserX} label="Absent Today" value="8" iconColor="text-rose-500" bgColor="bg-rose-50" />
          <AttendanceStatCard icon={Clock} label="Late Arrivals" value="1" iconColor="text-orange-500" bgColor="bg-orange-50" />
          <AttendanceStatCard icon={Calendar} label="On Leave" value="0" iconColor="text-blue-500" bgColor="bg-blue-50" />
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attendance Rate</h3>
              <TrendingDown size={16} className="text-rose-500" />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-800">11.1%</span>
                <span className="text-xs font-bold text-slate-400">1 / 9</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[11.1%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">7-Day Attendance Trend</h3>
              <span className="text-[10px] font-bold text-slate-300 uppercase">Last 7 days</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#cbd5e1' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#cbd5e1' }} 
                    domain={[0, 8]}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">Today's Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <SummaryItem label="Total Employees" value="9" />
            <SummaryItem label="Checked In" value="1" color="text-emerald-600" />
            <SummaryItem label="Not Checked In" value="8" color="text-rose-600" />
            <SummaryItem label="Late Check-ins" value="1" color="text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceStatCard({ icon: Icon, label, value, iconColor, bgColor }: { icon: any, label: string, value: string, iconColor: string, bgColor: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bgColor)}>
        <Icon className={iconColor} size={24} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-800 leading-none">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color = "text-slate-800" }: { label: string, value: string, color?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={cn("text-xl font-extrabold", color)}>{value}</p>
    </div>
  );
}

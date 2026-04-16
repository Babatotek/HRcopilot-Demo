import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, UserMinus, Clock, Calendar, 
  LayoutDashboard, FileText, Activity, ClipboardList, 
  History, ShieldCheck, Smartphone, BarChart3, Settings as SettingsIcon,
  TrendingUp, MoreHorizontal, MapPin, Shield, Fingerprint, FileCheck, Search, Plus, Target, Navigation, AlertCircle, XCircle, Info
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GeofenceMap from '../components/GeofenceMap';
import { GeofenceZone, Branch, WorkdaySettings, PublicHoliday } from '../types';
import { DEMO_ATTENDANCE, DEMO_ATTENDANCE_TREND, DEMO_BRANCHES, DEMO_DASHBOARD_KPIS } from '../demoData';

const TREND_DATA = DEMO_ATTENDANCE_TREND.map(d => ({
  day: d.day,
  value: parseFloat(((d.present / (d.present + d.late + d.absent)) * 100).toFixed(1)),
}));

const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [activeSubTab, setActiveSubTab] = useState('GEOFENCING');

  const [workdaySettings, setWorkdaySettings] = useState<WorkdaySettings>({
    workStart: '09:00',
    workEnd: '17:00',
    gracePeriod: 15,
    workHoursPerDay: 8,
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI']
  });

  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([
    { id: '1', name: 'New Year\'s Day', date: '2026-01-01', isRecurring: true },
    { id: '2', name: 'Good Friday', date: '2026-04-03', isRecurring: false },
    { id: '3', name: 'Easter Monday', date: '2026-04-06', isRecurring: false },
    { id: '4', name: 'Workers\' Day', date: '2026-05-01', isRecurring: true },
  ]);

  const [geofenceZones, setGeofenceZones] = useState<GeofenceZone[]>(
    DEMO_BRANCHES.filter(b => b.latitude !== 0).map(b => ({
      id: b.id,
      name: b.name,
      latitude: b.latitude,
      longitude: b.longitude,
      radius: 300,
      isActive: true,
    }))
  );

// Fix: wire branches state to DEMO_BRANCHES
  const [branches, setBranches] = useState<Partial<Branch>[]>(
    DEMO_BRANCHES.map(b => ({ id: b.id, name: b.name, latitude: b.latitude, longitude: b.longitude, image: b.image }))
  );

  const tabs = [
    { id: 'OVERVIEW', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'SUMMARY', label: 'SUMMARY', icon: FileText },
    { id: 'LIVE_ATTENDANCE', label: 'LIVE ATTENDANCE', icon: Activity },
    { id: 'DAILY_RECORDS', label: 'DAILY RECORDS', icon: ClipboardList },
    { id: 'OVERTIME', label: 'OVERTIME', icon: History },
    { id: 'CORRECTIONS', label: 'CORRECTIONS', icon: ShieldCheck },
    { id: 'DEVICES_IMPORTS', label: 'DEVICES & IMPORTS', icon: Smartphone },
    { id: 'REPORTS', label: 'REPORTS', icon: BarChart3 },
    { id: 'SETTINGS', label: 'SETTINGS', icon: SettingsIcon },
  ];

  const todayRecords = DEMO_ATTENDANCE;
  const presentCount = todayRecords.filter(r => r.status === 'PRESENT').length;
  const absentCount  = todayRecords.filter(r => r.status === 'ABSENT').length;
  const lateCount    = todayRecords.filter(r => r.status === 'LATE').length;
  const onLeaveCount = todayRecords.filter(r => r.status === 'ON_LEAVE').length;

  const stats = [
    { label: 'Present Today', value: String(DEMO_DASHBOARD_KPIS.presentToday), icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', accent: '#10b981' },
    { label: 'Absent Today',  value: String(DEMO_DASHBOARD_KPIS.absentToday),  icon: UserMinus, color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-500/10', accent: '#ef4444' },
    { label: 'Late Arrivals', value: String(DEMO_DASHBOARD_KPIS.lateToday),    icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10', accent: '#f59e0b' },
    { label: 'On Leave',      value: String(DEMO_DASHBOARD_KPIS.onLeaveToday), icon: Calendar, color: 'text-[#0047cc]', bgColor: 'bg-blue-50 dark:bg-blue-500/10', accent: '#0047cc' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          ATTENDANCE <span className="text-[#0047cc] italic">WORKSPACE</span>
        </h1>
        <div id="attendance-live-sync" data-demo-id="attendance-live-sync" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">LIVE SYNC ACTIVE</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-x-auto shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-demo-id={`attendance-tab-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#0047cc] text-white shadow-lg shadow-[#e0f2fe]0/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Overview & Analytics Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">OVERVIEW & ANALYTICS</h2>
              
              {/* Stats Grid */}
              <div id="attendance-stats" data-demo-id="attendance-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {stats.map((stat, i) => (
                  <GlassCard key={i} accentColor={stat.accent} className="!p-4 cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <div className={`w-8 h-8 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                    <p className={`text-2xl font-black tracking-tighter leading-none ${stat.color}`}>{stat.value}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Rate Card */}
                <GlassCard className="p-4 sm:p-8 flex flex-col justify-between h-auto sm:h-[350px]">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Attendance Rate</h3>
                    <TrendingUp className="text-emerald-500" size={16} />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="text-center">
                      <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{Math.round((DEMO_DASHBOARD_KPIS.presentToday / DEMO_DASHBOARD_KPIS.totalEmployees) * 100)}%</p>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{DEMO_DASHBOARD_KPIS.presentToday} / {DEMO_DASHBOARD_KPIS.totalEmployees}</p>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((DEMO_DASHBOARD_KPIS.presentToday / DEMO_DASHBOARD_KPIS.totalEmployees) * 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* 7-Day Trend Chart */}
                <GlassCard className="lg:col-span-2 p-4 sm:p-8 h-auto sm:h-[350px]">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">7-Day Attendance Trend</h3>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Last 7 days</span>
                  </div>
                  <div className="h-[220px] w-full min-w-0 relative">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <LineChart data={TREND_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Today's Summary Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Today's Summary</h2>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <GlassCard className="!p-0 overflow-hidden">
                <div className="table-wrap">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Check In</th>
                        <th className="px-6 py-4">Check Out</th>
                        <th className="px-6 py-4">Total Hours</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {todayRecords.slice(0, 8).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/10"><img src={row.avatar} className="w-full h-full object-cover" alt="" /></div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{row.employeeName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 font-mono">{row.firstIn ?? '--'}</td>
                          <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 font-mono">{row.lastOut ?? '--'}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-white">{row.totalHours > 0 ? `${row.totalHours}h` : '0h'}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              row.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-500' :
                              row.status === 'LATE'    ? 'bg-amber-500/10 text-amber-500' :
                              row.status === 'ON_LEAVE'? 'bg-blue-500/10 text-blue-500' :
                              'bg-rose-500/10 text-rose-500'
                            }`}>
                              {row.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === 'SUMMARY' && (
          <div className="space-y-6">
            <GlassCard title="Monthly Attendance Summary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Punctuality</p>
                  <p className="text-3xl font-black text-emerald-500">
                    {Math.round(((DEMO_DASHBOARD_KPIS.presentToday - DEMO_DASHBOARD_KPIS.lateToday) / DEMO_DASHBOARD_KPIS.totalEmployees) * 100)}%
                  </p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Overtime</p>
                  <p className="text-3xl font-black text-blue-500">
                    {(todayRecords.reduce((s, r) => s + r.otMins, 0) / 60).toFixed(1)}h
                  </p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Absence Rate</p>
                  <p className="text-3xl font-black text-rose-500">
                    {((DEMO_DASHBOARD_KPIS.absentToday / DEMO_DASHBOARD_KPIS.totalEmployees) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Dept</th>
                      <th className="px-4 py-3">Check In</th>
                      <th className="px-4 py-3">Check Out</th>
                      <th className="px-4 py-3">Hours</th>
                      <th className="px-4 py-3">OT</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {todayRecords.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] text-xs">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img src={r.avatar} className="w-6 h-6 rounded-full border border-slate-200 dark:border-white/10" alt="" />
                            <span className="font-bold text-slate-900 dark:text-white">{r.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{r.department}</td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">{r.firstIn ?? '--'}</td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">{r.lastOut ?? '--'}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{r.totalHours > 0 ? r.totalHours+'h' : '--'}</td>
                        <td className="px-4 py-3 text-blue-500 font-bold">{r.otMins > 0 ? r.otMins+'m' : '--'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            r.status === 'PRESENT'  ? 'bg-emerald-500/10 text-emerald-500' :
                            r.status === 'LATE'     ? 'bg-amber-500/10 text-amber-500' :
                            r.status === 'HALF_DAY' ? 'bg-blue-500/10 text-blue-500' :
                            r.status === 'ON_LEAVE' ? 'bg-slate-500/10 text-slate-400' :
                            'bg-rose-500/10 text-rose-500'
                          }`}>{r.status.replace('_', ' ')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'LIVE_ATTENDANCE' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Live Monitoring</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Real-time Updates
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayRecords.filter(r => r.status === 'PRESENT').slice(0, 6).map((r, i) => (
                <GlassCard key={i} className="p-6 flex items-center gap-4">
                  <div className="relative">
                    <img src={r.avatar} className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{r.employeeName}</p>
                    <p className="text-[9px] text-slate-600 dark:text-slate-500 font-bold uppercase tracking-widest">Checked in at {r.firstIn}</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">Active Now</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'DAILY_RECORDS' && (
          <GlassCard title="Daily Attendance Logs">
            <div className="space-y-4">
              <div className="flex gap-4 mb-6">
                <input type="date" defaultValue="2026-04-11" className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc]" />
                <select className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc]">
                  <option>All Departments</option>
                  {[...new Set(todayRecords.map(r => r.department))].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="table-wrap">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Branch</th>
                      <th className="px-4 py-3">Check In</th>
                      <th className="px-4 py-3">Check Out</th>
                      <th className="px-4 py-3">Hours</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {todayRecords.map((r, i) => (
                      <tr key={i} className="text-xs text-slate-900 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={r.avatar} className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10" alt="" />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{r.employeeName}</span>
                              <span className="text-[9px] text-slate-400 uppercase">{r.department}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-mono">{r.date}</td>
                        <td className="px-4 py-4 text-slate-500">{r.branch}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-mono">{r.firstIn ?? '--'}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-mono">{r.lastOut ?? '--'}</td>
                        <td className="px-4 py-4 font-bold">{r.totalHours > 0 ? r.totalHours+'h' : '--'}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            r.status === 'PRESENT'  ? 'bg-emerald-500/10 text-emerald-500' :
                            r.status === 'LATE'     ? 'bg-amber-500/10 text-amber-500' :
                            r.status === 'HALF_DAY' ? 'bg-blue-500/10 text-blue-500' :
                            r.status === 'ON_LEAVE' ? 'bg-slate-500/10 text-slate-400' :
                            'bg-rose-500/10 text-rose-500'
                          }`}>{r.status.replace('_', ' ')}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'OVERTIME' && (
          <div className="space-y-6">
            <GlassCard title="Overtime Requests & Approvals">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pending Approvals</h4>
                  {todayRecords.filter(r => r.otMins > 0).slice(0, 2).map((r, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{r.employeeName}</p>
                        <p className="text-[9px] text-slate-600 dark:text-slate-500 uppercase">{r.otMins} mins OT • Apr 11</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-lg">Approve</button>
                        <button className="px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase rounded-lg">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OT Statistics</h4>
                  <div className="h-40 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Overtime Trends Chart</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'CORRECTIONS' && (
          <GlassCard title="Attendance Corrections">
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">No Pending Corrections</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest max-w-xs mx-auto">All attendance logs are verified and synchronized with the central governance system.</p>
              <button className="px-6 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                Request Manual Correction
              </button>
            </div>
          </GlassCard>
        )}

        {activeTab === 'DEVICES_IMPORTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard title="Biometric Devices">
              <div className="space-y-4">
                {[
                  { name: 'Main Entrance Scanner', status: 'Online', ip: '192.168.1.45' },
                  { name: 'Warehouse Gate B', status: 'Offline', ip: '192.168.1.48' },
                ].map((device, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{device.name}</p>
                      <p className="text-[9px] text-slate-600 dark:text-slate-500 uppercase">{device.ip}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${device.status === 'Online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {device.status}
                    </span>
                  </div>
                ))}
                <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all">
                  + Add New Device
                </button>
              </div>
            </GlassCard>
            <GlassCard title="Bulk Import">
              <div className="p-4 sm:p-8 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-4">
                <Smartphone className="mx-auto text-slate-500" size={32} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drag and drop attendance CSV/XLSX files</p>
                <button className="px-6 py-2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">
                  Browse Files
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'REPORTS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Monthly Attendance Register',
              'Late Arrival Report',
              'Absence Analysis',
              'Overtime Disbursement',
              'Shift Compliance Report',
              'Device Sync Audit'
            ].map((report, i) => (
              <GlassCard key={i} className="hover:border-blue-500/50 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <BarChart3 className="text-slate-500 group-hover:text-blue-500 transition-colors" size={20} />
                  <button className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Download</button>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{report}</h4>
                <p className="text-[9px] text-slate-500 uppercase mt-1">Last generated: 2 hours ago</p>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="space-y-8">
            {/* Sub-tabs for Settings */}
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 overflow-x-auto">
              {[
                { id: 'GEOFENCING', label: 'GEOFENCING', icon: MapPin },
                { id: 'IP_WHITELISTING', label: 'IP WHITELISTING', icon: Shield },
                { id: 'BIOMETRIC', label: 'BIOMETRIC', icon: Fingerprint },
                { id: 'POLICIES_RULES', label: 'POLICIES & RULES', icon: FileCheck },
                { id: 'AUDIT', label: 'AUDIT', icon: History },
              ].map((sub) => (
                <button
                  key={sub.id}
                  data-demo-id={`attendance-subtab-${sub.id.toLowerCase()}`}
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeSubTab === sub.id 
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  <sub.icon size={12} />
                  {sub.label}
                </button>
              ))}
            </div>

            {activeSubTab === 'GEOFENCING' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Geofence Zones List */}
                <div className="lg:col-span-4 space-y-6">
                  <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Geofence Zones</h3>
                      <button className="p-1.5 bg-[#0047cc]/10 text-[#0047cc] rounded-lg hover:bg-[#0047cc]/20 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search zones..." 
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#0047cc] transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      {geofenceZones.map((zone) => (
                        <div key={zone.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl flex justify-between items-center group hover:border-[#0047cc]/50 transition-all cursor-pointer">
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{zone.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{zone.radius}m Radius</p>
                              <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase ${zone.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {zone.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Map View */}
                <div className="lg:col-span-8 space-y-6">
                  <GlassCard id="attendance-map-container" className="p-0 overflow-hidden h-[600px] relative">
                    <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#0047cc]" />
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Boundary Map</span>
                      </div>
                      <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
                      <span className="text-[9px] font-mono text-slate-600 dark:text-slate-500">6.524400, 3.379200</span>
                    </div>

                    <div className="absolute top-4 right-4 z-[1000] flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          placeholder="Search address..." 
                          className="w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#0047cc] shadow-xl"
                        />
                      </div>
                      <button className="px-4 py-2 bg-[#0047cc] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">
                        Search
                      </button>
                    </div>

                    <div data-demo-id="geofence-map">
                    <GeofenceMap 
                      center={[6.5244, 3.3792]} 
                      zoom={12} 
                      zones={geofenceZones.map(z => ({ id: z.id, name: z.name, lat: z.latitude, lng: z.longitude, radius: z.radius, status: z.isActive ? 'ACTIVE' : 'INACTIVE' }))}
                      branches={branches.map(b => ({ id: b.id!, name: b.name!, lat: b.latitude!, lng: b.longitude!, image: b.image }))}
                    />
                    </div>
                  </GlassCard>

                  {/* New Zone Configuration */}
                  <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Target size={18} className="text-[#0047cc]" />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">New Zone Configuration</h3>
                      </div>
                      <button className="px-4 py-2 bg-[#0047cc]/10 text-[#0047cc] text-[9px] font-black uppercase tracking-widest rounded-xl">
                        Test Validation
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Branch Zone</label>
                          <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0047cc]">
                            <option>Select a Branch...</option>
                            {branches.map(b => <option key={b.id}>{b.name}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Latitude</label>
                            <input type="text" value="6.5244" readOnly className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Longitude</label>
                            <input type="text" value="3.3792" readOnly className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono" />
                          </div>
                        </div>
                        <button className="w-full py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
                          <Navigation size={14} />
                          Detect My Current Location
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Radius (100m) — Max 300m</label>
                            <span className="text-[10px] font-black text-[#0047cc]">230m</span>
                          </div>
                          <input type="range" min="50" max="500" defaultValue="230" className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#0047cc]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Active Status</p>
                              <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                              </div>
                            </div>
                            <p className="text-[8px] text-slate-600 dark:text-slate-500 font-bold uppercase">Only Super Admin / CEO can change this</p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Strict Mode</p>
                              <div className="w-8 h-4 bg-slate-200 dark:bg-white/10 rounded-full relative">
                                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                              </div>
                            </div>
                            <p className="text-[8px] text-slate-600 dark:text-slate-500 font-bold uppercase">Blocks punch if outside zone</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {activeSubTab === 'POLICIES_RULES' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                  {/* Working Hours & Grace */}
                  <GlassCard className="p-4 sm:p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <Clock className="text-[#0047cc]" size={20} />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Working Hours & Grace</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Work Start Time</label>
                        <div className="relative">
                          <input 
                            type="time" 
                            value={workdaySettings.workStart}
                            onChange={(e) => setWorkdaySettings({...workdaySettings, workStart: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-3 text-sm font-bold focus:outline-none focus:border-[#0047cc]" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Work End Time</label>
                        <div className="relative">
                          <input 
                            type="time" 
                            value={workdaySettings.workEnd}
                            onChange={(e) => setWorkdaySettings({...workdaySettings, workEnd: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-3 text-sm font-bold focus:outline-none focus:border-[#0047cc]" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Grace Period (Mins)</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            value={workdaySettings.gracePeriod}
                            onChange={(e) => setWorkdaySettings({...workdaySettings, gracePeriod: parseInt(e.target.value)})}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-3 text-sm font-bold focus:outline-none focus:border-[#0047cc]" 
                          />
                          <span className="absolute right-6 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">Mins</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Work Hours/Day</label>
                        <div className="relative flex items-center">
                          <input 
                            type="number" 
                            value={workdaySettings.workHoursPerDay}
                            onChange={(e) => setWorkdaySettings({...workdaySettings, workHoursPerDay: parseInt(e.target.value)})}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-3 text-sm font-bold focus:outline-none focus:border-[#0047cc]" 
                          />
                          <span className="absolute right-6 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">Hrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Working Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                          <button
                            key={day}
                            onClick={() => {
                              const newDays = workdaySettings.workingDays.includes(day)
                                ? workdaySettings.workingDays.filter(d => d !== day)
                                : [...workdaySettings.workingDays, day];
                              setWorkdaySettings({...workdaySettings, workingDays: newDays});
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              workdaySettings.workingDays.includes(day)
                                ? 'bg-[#0047cc] text-white border-transparent shadow-lg shadow-blue-500/20'
                                : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-500 font-bold uppercase mt-4 italic">
                        {workdaySettings.workingDays.length} working days per week — used for attendance calendar, leave accrual, and payroll calculations.
                      </p>
                    </div>

                    <div className="mt-8 p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl flex items-start gap-4">
                      <AlertCircle className="text-rose-500 shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Enterprise Rule Active</p>
                        <p className="text-[9px] text-slate-600 dark:text-slate-500 font-bold uppercase mt-1 leading-relaxed">
                          Lateness exceeding the grace period triggers an automated 1-hour rate deduction in the payroll module.
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Public Holidays */}
                  <GlassCard className="p-4 sm:p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-[#0047cc]" size={20} />
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Public Holidays (2026)</h3>
                      </div>
                      <button className="px-4 py-2 bg-[#0047cc]/10 text-[#0047cc] text-[9px] font-black uppercase tracking-widest rounded-xl">
                        + Add Holiday
                      </button>
                    </div>
                    <div className="space-y-3">
                      {publicHolidays.map((holiday) => (
                        <div key={holiday.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex flex-col items-center justify-center border border-slate-100 dark:border-white/10">
                              <span className="text-[8px] font-black text-[#0047cc] uppercase">{new Date(holiday.date).toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{new Date(holiday.date).getDate()}</span>
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{holiday.name}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                {holiday.isRecurring ? 'Recurring Every Year' : 'One-time Event'}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                            <XCircle size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  {/* Governance Notice */}
                  <GlassCard className="p-4 sm:p-8 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck className="text-amber-500" size={20} />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Governance Notice</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Info size={14} className="text-amber-500" />
                          <p className="text-[10px] font-black text-amber-600 uppercase">CEO Approval Protocol</p>
                        </div>
                        <p className="text-[10px] text-slate-700 dark:text-slate-400 font-bold italic leading-relaxed">
                          "Changes to organization settings, including grace periods and OT rules, must be authorized by a Superadmin or the CEO. HR Managers may propose changes, but they will not be active until approved."
                        </p>
                      </div>
                      <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-3xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield size={14} className="text-[#0047cc]" />
                          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Payroll Lock Period</p>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-500 font-bold leading-relaxed">
                          Attendance records are locked 3 days before the payroll cycle end. Manual corrections are blocked during this window.
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Policy Impact Summary */}
                  <GlassCard className="p-4 sm:p-8 bg-gradient-to-br from-[#0047cc] to-[#0047cc] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-black uppercase italic tracking-tight mb-1">Policy Impact <span className="opacity-60">Summary</span></h3>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-8">Active System Guardrails</p>
                      
                      <div className="space-y-4">
                        {[
                          `${workdaySettings.gracePeriod}M Late Grace Period`,
                          `${workdaySettings.workingDays.length} Working Days/Week`,
                          '1HR Rate Late Penalty Active',
                          'CEO Approval Flow Enforcement'
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Calendar size={120} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
                  </GlassCard>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-100 dark:border-white/5">
        <div>
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Total Employees</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">9</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Checked In</p>
          <p className="text-2xl font-black text-emerald-500">7</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Not Checked In</p>
          <p className="text-2xl font-black text-rose-500">2</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Late Check-ins</p>
          <p className="text-2xl font-black text-amber-500">0</p>
        </div>
      </div>
    </div>
  );
};

export default Attendance;




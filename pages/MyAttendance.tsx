import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, TrendingUp, 
  ChevronLeft, ChevronRight, Info, Palmtree, Coffee
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { WorkdaySettings, PublicHoliday } from '../types';
import { DEMO_ATTENDANCE } from '../demoData';

// Logged-in employee = Kelly Robinson (E01)
const MY_RECORDS = DEMO_ATTENDANCE.filter(r => r.employeeId === 'E01');

const MyAttendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('April 2026');

  // Mock organization settings (In a real app, these would come from a context or API)
  const workdaySettings: WorkdaySettings = {
    workStart: '09:00',
    workEnd: '17:00',
    gracePeriod: 15,
    workHoursPerDay: 8,
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI']
  };

  const publicHolidays: PublicHoliday[] = [
    { id: '1', name: 'New Year\'s Day', date: '2026-01-01', isRecurring: true },
    { id: '2', name: 'Good Friday', date: '2026-04-03', isRecurring: false },
    { id: '3', name: 'Easter Monday', date: '2026-04-06', isRecurring: false },
    { id: '4', name: 'Workers\' Day', date: '2026-05-01', isRecurring: true },
  ];

  const stats = [
    { label: 'Present Days', value: String(MY_RECORDS.filter(r => r.status === 'PRESENT').length), icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10', accent: '#10b981' },
    { label: 'Absent Days',  value: String(MY_RECORDS.filter(r => r.status === 'ABSENT').length),  icon: XCircle,       color: 'text-rose-500',    bgColor: 'bg-rose-50 dark:bg-rose-500/10',    accent: '#ef4444' },
    { label: 'Late Days',    value: String(MY_RECORDS.filter(r => r.status === 'LATE').length),    icon: AlertCircle,   color: 'text-amber-500',   bgColor: 'bg-amber-50 dark:bg-amber-500/10',  accent: '#f59e0b' },
    { label: 'Holidays',     value: '2',                                                            icon: Palmtree,      color: 'text-[#0047cc]',   bgColor: 'bg-blue-50 dark:bg-blue-500/10',    accent: '#0047cc' },
  ];

  // Mock calendar data for April 2026
  // April 1st 2026 is a Wednesday
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const startOffset = 3; // Wednesday (0: Sun, 1: Mon, 2: Tue, 3: Wed)

  const getDayStatus = (day: number) => {
    const dateStr = `2026-04-${day.toString().padStart(2, '0')}`;
    const date = new Date(dateStr);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    
    // Check if it's a public holiday
    const holiday = publicHolidays.find(h => h.date === dateStr);
    if (holiday) return { type: 'HOLIDAY', name: holiday.name };

    // Check if it's a working day
    if (!workdaySettings.workingDays.includes(dayOfWeek)) return { type: 'DAY_OFF' };

    // Mock statuses for demonstration
    if (day < 3) return { type: 'PRESENT' };
    if (day === 7) return { type: 'LATE' };
    if (day === 14) return { type: 'ABSENT' };
    if (day < 20) return { type: 'PRESENT' };
    
    return { type: 'EMPTY' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            My <span className="text-[#0047cc]">Attendance</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track your attendance history and statistics
          </p>
        </div>
        <div className="relative">
          <button className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm">
            {selectedMonth}
            <CalendarIcon size={14} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Today's Status Banner */}
      {(() => {
        const today = MY_RECORDS[0];
        return (
        <div className="bg-slate-800 dark:bg-slate-900 rounded-[32px] p-5 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Status</p>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${today?.status === 'PRESENT' ? 'border-emerald-500' : 'border-slate-500'}`}>
                {today?.status === 'PRESENT' ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Info size={12} className="text-slate-400" />}
              </div>
              <p className="text-lg font-bold">
                {today ? `${today.status.replace('_', ' ')} — Checked in at ${today.firstIn ?? '--'}` : 'Not checked in yet'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{today ? `${today.totalHours}h` : '0h'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">of 8h required</p>
          </div>
        </div>
        );
      })()}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={i} accentColor={stat.accent} className="!p-4 cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className={`w-8 h-8 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={16} strokeWidth={1.5} />
              </div>
            </div>
            <p className={`text-2xl font-black tracking-tighter leading-none ${stat.color}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Attendance Calendar */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Attendance Calendar</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-100 border border-rose-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#bae6fd] border border-[#7dd3fc]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Day Off</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</span>
            </div>
          ))}
          
          {/* Empty cells for offset */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="h-40" />
          ))}

          {/* Calendar Days */}
          {days.map((day) => {
            const status = getDayStatus(day);
            return (
              <div 
                key={day} 
                className={`h-40 rounded-2xl border flex flex-col items-center justify-center relative transition-all hover:shadow-lg cursor-pointer p-4 text-center ${
                  status.type === 'PRESENT' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' :
                  status.type === 'ABSENT' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' :
                  status.type === 'LATE' ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' :
                  status.type === 'HOLIDAY' ? 'bg-[#e0f2fe] border-[#7dd3fc] text-[#075985] shadow-sm' :
                  status.type === 'DAY_OFF' ? 'bg-slate-50 border-slate-200 text-slate-400' :
                  'bg-slate-50/50 border-slate-100 dark:bg-white/[0.02] dark:border-white/5 text-slate-400'
                }`}
              >
                <span className="text-xl font-black">{day}</span>
                
                {status.type === 'PRESENT' && (
                  <div className="mt-2 flex flex-col items-center">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase mt-1">09:00 - 17:05</span>
                  </div>
                )}
                {status.type === 'ABSENT' && (
                  <div className="mt-2 flex flex-col items-center">
                    <XCircle size={16} className="text-rose-500" />
                    <span className="text-[8px] font-black uppercase mt-1">No Record</span>
                  </div>
                )}
                {status.type === 'LATE' && (
                  <div className="mt-2 flex flex-col items-center">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span className="text-[8px] font-black uppercase mt-1">09:45 - 17:10</span>
                  </div>
                )}
                {status.type === 'HOLIDAY' && (
                  <div className="mt-2 flex flex-col items-center">
                    <Palmtree size={16} className="text-[#e0f2fe]0" />
                    <span className="text-[8px] font-black uppercase mt-1 leading-tight">{status.name}</span>
                  </div>
                )}
                {status.type === 'DAY_OFF' && (
                  <div className="mt-2 flex flex-col items-center">
                    <Coffee size={16} className="text-slate-400" />
                    <span className="text-[8px] font-black uppercase mt-1">Weekend</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;



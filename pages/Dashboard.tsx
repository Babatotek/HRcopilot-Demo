import React, { useState, useMemo, useCallback } from 'react';
import GlassCard from '../components/GlassCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from 'recharts';
import InsightRibbon from '../components/InsightRibbon';
import { UserProfile, UserRole } from '../types';
import {
  DEMO_HEADCOUNT_TREND, DEMO_ABSENTEEISM_TREND, DEMO_TURNOVER_TREND,
  DEMO_DASHBOARD_KPIS, DEMO_EMPLOYEES, DEMO_PAYROLL_TREND,
} from '../demoData';

// ── Data (sourced from unified demoData) ─────────────────────────────────────

const headcountData = DEMO_HEADCOUNT_TREND.map(d => ({ name: d.month, val: d.value }));
const absenteeismData = DEMO_ABSENTEEISM_TREND.map(d => ({ name: d.month, rate: d.rate }));
const expenseData = DEMO_PAYROLL_TREND.map(d => ({ name: d.month, val: Math.round(d.gross / 1000) }));

const attendanceData = [
  { name: 'Present', value: DEMO_DASHBOARD_KPIS.presentToday, color: '#0047cc' },
  { name: 'Late', value: DEMO_DASHBOARD_KPIS.lateToday, color: '#f59e0b' },
  { name: 'Absent', value: DEMO_DASHBOARD_KPIS.absentToday, color: '#ef4444' },
  { name: 'On Leave', value: DEMO_DASHBOARD_KPIS.onLeaveToday, color: '#94a3b8' },
];
const turnoverData = [
  { name: 'Promoted', val: 8, color: '#0047cc' },
  { name: 'Involuntary Exit', val: DEMO_TURNOVER_TREND.reduce((s, d) => s + d.involuntary, 0), color: '#f59e0b' },
  { name: 'Offers Made', val: DEMO_DASHBOARD_KPIS.openPositions, color: '#10b981' },
  { name: 'Hired', val: DEMO_TURNOVER_TREND.reduce((s, d) => s + d.voluntary, 0), color: '#0035a0' },
];
const leaveData = [
  { name: 'Engineering', annual: 10, sick: 15, casual: 5, maternity: 2 },
  { name: 'Sales', annual: 20, sick: 5, casual: 10, maternity: 5 },
  { name: 'Marketing', annual: 15, sick: 10, casual: 15, maternity: 8 },
  { name: 'HR', annual: 12, sick: 12, casual: 8, maternity: 4 },
];
const hiringFunnel = [
  { label: 'New Applicants', pct: 100, count: 248, color: 'bg-blue-600', hex: '#0047cc' },
  { label: 'Screened', pct: 60, count: 149, color: 'bg-blue-400', hex: '#3b82f6' },
  { label: 'Interviewed', pct: 33, count: 82, color: 'bg-amber-500', hex: '#f59e0b' },
  { label: 'Offers Made', pct: 19, count: 47, color: 'bg-emerald-500', hex: '#10b981' },
  { label: 'Hired', pct: 10, count: 25, color: 'bg-rose-500', hex: '#ef4444' },
];
const demographicsData = [
  { name: 'Full-Time', value: DEMO_EMPLOYEES.filter(e => e.employment === 'Full-Time').length, color: '#0047cc' },
  { name: 'Contract', value: DEMO_EMPLOYEES.filter(e => e.employment === 'Contract').length, color: '#f59e0b' },
  { name: 'Part-Time', value: DEMO_EMPLOYEES.filter(e => e.employment === 'Part-Time').length, color: '#10b981' },
];
const topPerformers = DEMO_EMPLOYEES
  .sort((a, b) => b.performanceScore - a.performanceScore)
  .slice(0, 4)
  .map((e, i) => ({
    name: e.name,
    dept: e.department,
    score: `${e.performanceScore}%`,
    icon: ['🏆', '🥈', '🥉', '4️⃣'][i],
    trend: '+2.1%',
  }));
const quickReports = [
  { l: 'Headcount by Dept', i: '🏢' }, { l: 'Payroll Summary', i: '💰' },
  { l: 'Performance Trends', i: '📈' }, { l: 'Overtime Analysis', i: '⏱️' },
  { l: 'Turnover by Dept', i: '🏗️' }, { l: 'Diversity Report', i: '🌈' },
  { l: 'Absenteeism', i: '📊' }, { l: 'Hiring Pipeline', i: '🎯' },
];

// Finance KPIs derived from demo payroll data
const financeKpis = [
  { label: 'Total Payroll (YTD)', value: `₦${(DEMO_PAYROLL_TREND.reduce((s, d) => s + d.net, 0) / 1000000).toFixed(1)}M`, delta: '+8%', color: 'text-emerald-500' },
  { label: 'Monthly Gross', value: `₦${(DEMO_PAYROLL_TREND[DEMO_PAYROLL_TREND.length - 1].gross / 1000000).toFixed(2)}M`, delta: '+2%', color: 'text-rose-500' },
  { label: 'Net Disbursed', value: `₦${(DEMO_PAYROLL_TREND[DEMO_PAYROLL_TREND.length - 1].net / 1000000).toFixed(2)}M`, delta: '+2%', color: 'text-[#0047cc]' },
];

// Procurement summary
const procurementData = [
  { name: 'Pending', val: 4, color: '#f59e0b' },
  { name: 'Approved', val: 3, color: '#10b981' },
  { name: 'Delivered', val: 2, color: '#0047cc' },
  { name: 'Rejected', val: 1, color: '#ef4444' },
];
const vendorPerformers = [
  { name: 'DataCenter Pro', rating: '4.8/5', status: 'Reliable', color: 'text-emerald-500' },
  { name: 'TechSupply Nigeria', rating: '4.5/5', status: 'Standard', color: 'text-blue-500' },
  { name: 'Cleantech Services', rating: '3.8/5', status: 'At Risk', color: 'text-amber-500' },
];

const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  borderRadius: '16px',
  fontSize: '11px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  color: '#1e293b'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-2xl shadow-xl">
        <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-black text-[#0047cc]">
          {payload[0].name}: <span className="italic">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// ── Modal content helpers ─────────────────────────────────────────────────────

const StatRow: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
    <span className={`text-sm font-black ${color ?? 'text-slate-900 dark:text-white'}`}>{value}</span>
  </div>
);

// ── KPI modal contents ────────────────────────────────────────────────────────

const HeadcountModal: React.FC<{ data: any[] }> = ({ data }) => {
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const delta = (latest?.val || 0) - (prev?.val || 0);

  return (
    <div className="space-y-1">
      <StatRow label="Focus Period Total" value={String(latest?.val || 0)} />
      <StatRow label="Net Change" value={(delta >= 0 ? '+' : '') + delta} color={delta >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
      <StatRow label="Full-Time" value={String(demographicsData.find(d => d.name === 'Full-Time')?.value ?? 0)} />
      <StatRow label="Contract" value={String(demographicsData.find(d => d.name === 'Contract')?.value ?? 0)} />
      <StatRow label="Part-Time" value={String(demographicsData.find(d => d.name === 'Part-Time')?.value ?? 0)} />
      <div className="mt-4 h-32 w-full min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data}>
            <defs><linearGradient id="hcM" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0047cc" stopOpacity={0.3} /><stop offset="95%" stopColor="#0047cc" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="val" stroke="#0047cc" strokeWidth={2} fill="url(#hcM)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PresentModal = () => {
  const total = attendanceData.reduce((s, d) => s + d.value, 0);
  const rate = Math.round((DEMO_DASHBOARD_KPIS.presentToday / total) * 100);
  const onTimeRate = Math.round(((DEMO_DASHBOARD_KPIS.presentToday - DEMO_DASHBOARD_KPIS.lateToday) / total) * 100);
  return (
    <div className="space-y-1">
      <StatRow label="Present Today" value={String(DEMO_DASHBOARD_KPIS.presentToday)} color="text-emerald-500" />
      <StatRow label="Late Arrivals" value={String(DEMO_DASHBOARD_KPIS.lateToday)} color="text-amber-500" />
      <StatRow label="Absent" value={String(DEMO_DASHBOARD_KPIS.absentToday)} color="text-rose-500" />
      <StatRow label="On Leave" value={String(DEMO_DASHBOARD_KPIS.onLeaveToday)} color="text-slate-400" />
      <StatRow label="Present Rate" value={`${rate}%`} color="text-emerald-500" />
      <StatRow label="On-Time Rate" value={`${onTimeRate}%`} />
      <div className="mt-4 h-36 w-full min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie data={attendanceData} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none" isAnimationActive={false}>
              {attendanceData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const LeaveModal = () => (
  <div className="space-y-1">
    <StatRow label="Currently On Leave" value={String(DEMO_DASHBOARD_KPIS.onLeaveToday)} color="text-amber-500" />
    <StatRow label="Annual Leave" value="7" />
    <StatRow label="Sick Leave" value="3" />
    <StatRow label="Maternity / Paternity" value="1" />
    <StatRow label="Unpaid Leave" value="1" />
    <StatRow label="Pending Requests" value={String(DEMO_DASHBOARD_KPIS.pendingLeaveRequests)} color="text-amber-500" />
    <StatRow label="Leave Utilisation" value={`${((DEMO_DASHBOARD_KPIS.onLeaveToday / DEMO_DASHBOARD_KPIS.totalEmployees) * 100).toFixed(1)}%`} />
  </div>
);

const TurnoverModal = () => {
  const voluntary = DEMO_TURNOVER_TREND.reduce((s, d) => s + d.voluntary, 0);
  const involuntary = DEMO_TURNOVER_TREND.reduce((s, d) => s + d.involuntary, 0);
  return (
    <div className="space-y-1">
      <StatRow label="Turnover Rate" value={`${DEMO_DASHBOARD_KPIS.turnoverRateYTD}%`} color="text-rose-500" />
      <StatRow label="vs Last Month" value="+0.5%" color="text-rose-400" />
      <StatRow label="Voluntary Exits" value={String(voluntary)} />
      <StatRow label="Involuntary Exits" value={String(involuntary)} />
      <StatRow label="Promotions" value="8" color="text-emerald-500" />
      <StatRow label="Avg Tenure at Exit" value="2.1 yrs" />
      <div className="mt-4 h-36 w-full min-w-0 relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={turnoverData} layout="vertical">
            <XAxis type="number" hide axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="val" radius={[0, 4, 4, 0]}>
              {turnoverData.map((e, i) => <Cell key={i} fill={e.color} opacity={0.75} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TenureModal = () => (
  <div className="space-y-1">
    <StatRow label="Average Tenure" value="3.4 yrs" color="text-purple-500" />
    <StatRow label="YoY Change" value="+1.3%" color="text-emerald-500" />
    <StatRow label="< 1 Year" value="62 employees" />
    <StatRow label="1 – 3 Years" value="148 employees" />
    <StatRow label="3 – 5 Years" value="134 employees" />
    <StatRow label="5+ Years" value="96 employees" />
    <StatRow label="Longest Tenure" value="14.2 yrs" />
  </div>
);

const OpenRolesModal = () => (
  <div className="space-y-1">
    <StatRow label="Open Positions" value="15" color="text-blue-500" />
    <StatRow label="Added This Week" value="+3" color="text-emerald-500" />
    <StatRow label="Engineering" value="6" />
    <StatRow label="Sales" value="4" />
    <StatRow label="Marketing" value="3" />
    <StatRow label="Operations" value="2" />
    <StatRow label="Avg Days Open" value="18 days" />
    <div className="mt-4 h-28 w-full min-w-0 relative">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart data={hiringFunnel}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {hiringFunnel.map((e, i) => <Cell key={i} fill={e.hex} opacity={0.75} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ── KPI card config ───────────────────────────────────────────────────────────


// ── Component ─────────────────────────────────────────────────────────────────

interface DashboardProps {
  userProfile?: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
  const role = userProfile?.role || UserRole.CEO;
  const name = userProfile?.name || 'Admin';

  const [activeRange, setActiveRange] = useState<string>('MTD');
  const [activeBranch, setActiveBranch] = useState('All Branches');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Simulation: Trigger evaluation pulse on filter change
  React.useEffect(() => {
    setIsEvaluating(true);
    const timer = setTimeout(() => setIsEvaluating(false), 600);
    return () => clearTimeout(timer);
  }, [activeRange, activeBranch]);

  // Logic: Process and Filter Data based on UI controls
  const getProcessedData = useCallback((data: any[]) => {
    const rangeMap: Record<string, number> = {
      'TODAY': 2, 'MTD': 3, 'LAST MO': 2, '3M': 3, '6M': 6, 'YTD': 12, 'LY': 12
    };
    const rangeMonths = rangeMap[activeRange] || 6;
    return data.slice(-rangeMonths);
  }, [activeRange]);

  const processedHeadcount = useMemo(() => getProcessedData(headcountData), [getProcessedData]);
  const processedAbsenteeism = useMemo(() => getProcessedData(absenteeismData), [getProcessedData]);
  const processedExpenses = useMemo(() => getProcessedData(expenseData), [getProcessedData]);

  // Dynamic KPI Calculation
  const hcLatest = processedHeadcount[processedHeadcount.length - 1];
  const hcPrev = processedHeadcount[processedHeadcount.length - 2];
  const hcDelta = (hcLatest?.val || 0) - (hcPrev?.val || 0);

  const expLatest = processedExpenses[processedExpenses.length - 1];
  const expPrev = processedExpenses[processedExpenses.length - 2];
  const expDelta = (expLatest?.val || 0) - (expPrev?.val || 0);

  const absLatest = processedAbsenteeism[processedAbsenteeism.length - 1];
  const absPrev = processedAbsenteeism[processedAbsenteeism.length - 2];
  const absDelta = (absLatest?.rate || 0) - (absPrev?.rate || 0);

  const KPI_CARDS = useMemo(() => [
    {
      label: 'Total Employees', val: String(hcLatest?.val || 0), delta: (hcDelta >= 0 ? '+' : '') + hcDelta + ' shift',
      accent: '#0047cc', deltaColor: hcDelta >= 0 ? 'text-emerald-500' : 'text-rose-500',
      modal: <HeadcountModal data={processedHeadcount} />, modalTitle: 'Headcount Breakdown',
    },
    {
      label: 'Present Rate',
      val: `${Math.round((DEMO_DASHBOARD_KPIS.presentToday / (DEMO_DASHBOARD_KPIS.presentToday + DEMO_DASHBOARD_KPIS.lateToday + DEMO_DASHBOARD_KPIS.absentToday + DEMO_DASHBOARD_KPIS.onLeaveToday)) * 100)}%`,
      delta: 'Steady',
      accent: '#10b981', deltaColor: 'text-emerald-500',
      modal: <PresentModal />, modalTitle: 'Attendance Detail',
    },
    {
      label: 'On Leave',
      val: String(DEMO_DASHBOARD_KPIS.onLeaveToday),
      delta: `${((DEMO_DASHBOARD_KPIS.onLeaveToday / DEMO_DASHBOARD_KPIS.totalEmployees) * 100).toFixed(1)}% of staff`,
      accent: '#f59e0b', deltaColor: 'text-amber-500',
      modal: <LeaveModal />, modalTitle: 'Leave Breakdown',
    },
    {
      label: 'Turnover Rate',
      val: `${DEMO_DASHBOARD_KPIS.turnoverRateYTD}%`,
      delta: '+0.5% vs last',
      accent: '#ef4444', deltaColor: 'text-rose-500',
      modal: <TurnoverModal />, modalTitle: 'Turnover Analysis',
    },
    {
      label: 'Avg Expenses',
      val: `₦${((expLatest?.val || 0) / 1000).toFixed(1)}M`,
      delta: `${expDelta >= 0 ? '+' : ''}${(expDelta / 1000).toFixed(1)}M`,
      accent: '#0035a0', deltaColor: expDelta <= 0 ? 'text-emerald-500' : 'text-rose-500',
      modal: null, modalTitle: 'Expense Trend',
    },
    {
      label: 'Absenteeism', val: (absLatest?.rate || 0) + '%', delta: (absDelta >= 0 ? '+' : '') + absDelta.toFixed(1) + '%',
      accent: '#f59e0b', deltaColor: absDelta <= 0 ? 'text-emerald-500' : 'text-rose-500',
      modal: null, modalTitle: 'Absenteeism Analysis',
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [hcLatest, hcDelta, expLatest, expDelta, absLatest, absDelta, processedHeadcount]);

  // Derived datasets — memoized so they don't recalculate on unrelated renders
  const ratio = processedHeadcount.length / headcountData.length;
  const processedTurnover = useMemo(() => turnoverData.map(d => ({ ...d, val: Math.round(d.val * ratio) })), [ratio]);
  const processedLeave = useMemo(() => leaveData.map(d => ({ ...d, annual: Math.round(d.annual * ratio) })), [ratio]);
  const processedFunnel = useMemo(() => hiringFunnel.map(d => ({ ...d, count: Math.round(d.count * ratio) })), [ratio]);
  const processedPerformers = useMemo(() => topPerformers.slice(0, Math.max(1, Math.round(topPerformers.length * ratio))), [ratio]);

  // Role-specific Header Text
  const getDashboardTitle = () => {
    switch (role) {
      case UserRole.CEO: return <>Strategic <span className="text-[#0047cc] italic">Directorate</span></>;
      case UserRole.ACCOUNTANT: return <>Financial <span className="text-emerald-600 italic">Oversight</span></>;
      case UserRole.HR_MANAGER: return <>People & <span className="text-blue-500 italic">Culture</span></>;
      default: return <>Executive <span className="text-[#0047cc] italic">Dashboard</span></>;
    }
  };

  const getDashboardSub = () => {
    switch (role) {
      case UserRole.CEO: return 'Enterprise Growth & Valuation Metrics';
      case UserRole.ACCOUNTANT: return 'Payroll, Expenses & Audit Trail';
      case UserRole.HR_MANAGER: return 'Workforce Analytics & Engagement';
      default: return 'Comprehensive Organisation Overview';
    }
  };

  // Filter KPIs based on role
  const filteredKpis = KPI_CARDS.filter(kpi => {
    if (role === UserRole.ACCOUNTANT) return ['Total Employees', 'Turnover Rate', 'Avg Tenure'].includes(kpi.label) === false; // Focus on finance
    return true;
  });

  const presentRate = Math.round(
    (attendanceData.find(d => d.name === 'Present')!.value /
      attendanceData.reduce((s, d) => s + d.value, 0)) * 100
  );

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            EXECUTIVE <span className="text-[#0047cc]">DASHBOARD</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">ORGANISATION OVERVIEW</p>
        </div>
      </div>

      {/* Unified Filter Bar */}
      <div id="dashboard-overview" className="flex flex-wrap items-center gap-4">
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          {['TODAY', 'MTD', 'LAST MO', '3M', '6M', 'YTD', 'LY', 'CUSTOM'].map(r => (
            <button key={r} onClick={() => setActiveRange(r)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeRange === r ? 'bg-[#0047cc] text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>

        <select
          value={activeBranch}
          onChange={(e) => setActiveBranch(e.target.value)}
          className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 outline-none hover:border-[#0047cc]/30 transition-all cursor-pointer"
        >
          <option>All Branches</option>
          <option>Headquarters</option>
          <option>Regional - EMEA</option>
          <option>Satellite - APAC</option>
        </select>

        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 ml-auto">
          <span className={`w-2 h-2 rounded-full ${isEvaluating ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'} transition-colors`} />
          {isEvaluating ? 'REFRESHING METRICS...' : 'DATA SYNCHRONIZED'}
        </div>
      </div>

      {/* Insight Ribbon removed */}



      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {filteredKpis.slice(0, 6).map((s, i) => (
          <GlassCard key={i} accentColor={s.accent} modalContent={s.modal} modalTitle={s.modalTitle} className="!p-4 group cursor-pointer">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">{s.label}</span>
              <span className={`text-[8px] font-bold ${s.deltaColor}`}>{s.delta}</span>
            </div>
            <h3 className="text-2xl font-black tracking-tighter leading-none" style={{ color: s.accent }}>{s.val}</h3>
          </GlassCard>
        ))}
      </div>

      {/* Row 1: Role Specific Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CEO / ADMIN / HR: Headcount Trend */}
        {(role === UserRole.CEO || role === UserRole.HR_MANAGER) && (
          <div className="lg:col-span-7">
            <GlassCard title="Headcount Over Time"
              action={<span className={`px-2 py-0.5 ${hcDelta >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'} text-[8px] font-black uppercase rounded-lg`}>{hcDelta >= 0 ? 'Steady Growth' : 'Attrition Detected'}</span>}
              modalTitle="Headcount Trend" modalContent={<HeadcountModal data={processedHeadcount} />}>
              <div className="h-[260px] w-full min-w-0 relative mt-2">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={processedHeadcount}>
                    <defs>
                      <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0047cc" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0047cc" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-white/5" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="val" name="Headcount" stroke="#0047cc" strokeWidth={3} fill="url(#hcGrad)" dot={{ r: 4, fill: '#0047cc', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ACCOUNTANT: Expense Trend */}
        {role === UserRole.ACCOUNTANT && (
          <div className="lg:col-span-12">
            <GlassCard title="Operational Expenditures" action={<div className="flex items-center gap-2"><span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase rounded-lg">Expenditure Spike</span><button className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded-lg">Generate Audit</button></div>}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {financeKpis.map((f, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm transition-hover hover:shadow-md">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.label}</p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">{f.value}</h4>
                    <p className={`text-[9px] font-bold ${f.color} mt-1`}>{f.delta} vs LY</p>
                  </div>
                ))}
              </div>
              <div className="h-[280px] w-full min-w-0 relative mt-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={processedExpenses}>
                    <defs><linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-white/5" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fill="url(#expGrad)" dot={{ r: 3, fill: '#10b981' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}

        {role !== UserRole.ACCOUNTANT && (
          <div className="lg:col-span-5">
            <GlassCard title="Attendance Health" modalTitle="Attendance Detail" modalContent={<PresentModal />}>
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <div className="h-44 w-44 min-w-0 relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie data={attendanceData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none" isAnimationActive={false}>
                        {attendanceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 flex-1 pl-2 sm:pl-4">
                  {attendanceData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{d.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{d.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{presentRate}% Present Rate</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Row 2: Financials / Performance / Team Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(role === UserRole.ACCOUNTANT || role === UserRole.CEO) && (
          <GlassCard title="Payroll Summary"
            action={<span className="text-[9px] font-black text-[#0047cc] uppercase tracking-widest cursor-pointer hover:underline">View Runs →</span>}
            modalTitle="Payroll Summary" modalContent={
              <div className="space-y-1">
                <StatRow label="Current Period Net" value={`₦${DEMO_DASHBOARD_KPIS.monthlyPayrollTotal.toLocaleString()}`} color="text-emerald-500" />
                <StatRow label="Total Employees" value={String(DEMO_DASHBOARD_KPIS.totalEmployees)} />
                <StatRow label="Active Runs" value="1" />
                <StatRow label="Average Pay" value={`₦${Math.round(DEMO_DASHBOARD_KPIS.monthlyPayrollTotal / DEMO_DASHBOARD_KPIS.activeEmployees).toLocaleString()}`} />
                <StatRow label="Total Gross" value={`₦${DEMO_PAYROLL_TREND[DEMO_PAYROLL_TREND.length - 1].gross.toLocaleString()}`} />
                <StatRow label="Total Deductions" value={`₦${(DEMO_PAYROLL_TREND[DEMO_PAYROLL_TREND.length - 1].gross - DEMO_PAYROLL_TREND[DEMO_PAYROLL_TREND.length - 1].net).toLocaleString()}`} color="text-rose-500" />
                <StatRow label="Period" value="April 2026" />
              </div>
            }>
            <div className="pt-2">
              <h3 className="text-2xl font-black text-emerald-500 mb-1">₦{DEMO_DASHBOARD_KPIS.monthlyPayrollTotal.toLocaleString()}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Period Net</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ label: 'Employees', val: String(DEMO_DASHBOARD_KPIS.totalEmployees) }, { label: 'Active Runs', val: '1' }, { label: 'Avg Pay', val: `₦${Math.round(DEMO_DASHBOARD_KPIS.monthlyPayrollTotal / DEMO_DASHBOARD_KPIS.activeEmployees / 1000)}K` }].map((item, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-center">
                    <p className="text-xs font-black text-slate-900 dark:text-white">{item.val}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {role !== UserRole.ACCOUNTANT && (
          <GlassCard title="Performance Overview"
            action={<span className="text-[9px] font-black text-[#0047cc] uppercase tracking-widest cursor-pointer hover:underline">View All →</span>}
            modalTitle="Performance Overview" modalContent={
              <div className="space-y-1">
                <StatRow label="Org Avg Score" value="78.4%" color="text-[#0047cc]" />
                <StatRow label="Top Performers" value="4" color="text-emerald-500" />
                <StatRow label="At Risk" value="12" color="text-rose-500" />
                <StatRow label="Pending Reviews" value="28" color="text-amber-500" />
                <StatRow label="Completed Reviews" value="312" />
                <StatRow label="Avg Review Score" value="78.4%" />
                {topPerformers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-[9px] text-slate-400">{p.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-[#0047cc]">{p.score}</p>
                      <p className="text-[9px] text-emerald-500">{p.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            }>
            <div className="pt-2">
              <h3 className="text-4xl font-black text-[#0047cc] mb-1">78.4%</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Org Avg Score</p>
              <div className="space-y-2">
                {[{ label: 'Top Performers', val: '4', color: 'text-emerald-500' }, { label: 'At Risk', val: '12', color: 'text-rose-500' }, { label: 'Pending Reviews', val: '28', color: 'text-amber-500' }].map((r, i) => (
                  <div key={i} className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{r.label}</span>
                    <span className={`text-sm font-black ${r.color}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {(role === UserRole.CEO || role === UserRole.HR_MANAGER) && (
          <GlassCard title="Absenteeism Rate"
            modalTitle="Absenteeism Detail" modalContent={
              <div className="space-y-1">
                <StatRow label="Avg Absenteeism Rate" value="2.7%" color="text-amber-500" />
                <StatRow label="Avg Days Absent" value="3.1 days" />
                <StatRow label="Jan Rate" value="2.5%" />
                <StatRow label="Feb Rate" value="3.1%" color="text-rose-500" />
                <StatRow label="Mar Rate" value="2.8%" />
                <StatRow label="Apr Rate" value="2.4%" color="text-emerald-500" />
                <StatRow label="Highest Dept" value="Sales (4.1%)" color="text-rose-500" />
              </div>
            }>
            <div className="flex justify-between items-center mb-3 pt-1">
              <div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Rate</p><p className="text-2xl font-black text-amber-500">2.7%</p></div>
              <div className="text-right"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Days</p><p className="text-2xl font-black text-slate-900 dark:text-white">3.1</p></div>
            </div>
            <div className="h-28 w-full min-w-0 relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={processedAbsenteeism}>
                  <defs><linearGradient id="absGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="name" hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2} fill="url(#absGrad)" dot={{ r: 3, fill: '#f59e0b' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Row 3: Talent / Pipeline / Procurement Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(role === UserRole.HR_MANAGER || role === UserRole.CEO) && (
          <GlassCard title="Employee Turnover"
            action={<span className="px-2 py-1 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase rounded-lg">Rate: 4.2%</span>}
            modalTitle="Turnover Analysis" modalContent={<TurnoverModal />}>
            <div className="h-52 w-full min-w-0 relative mt-2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={processedTurnover} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-white/5" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="val" radius={[0, 6, 6, 0]}>
                    {processedTurnover.map((e, i) => <Cell key={i} fill={e.color} opacity={0.75} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {role === UserRole.ACCOUNTANT && (
          <GlassCard title="Financial Compliance" action={<span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-lg">Internal Audit</span>}>
            <div className="space-y-4 pt-2">
              {[{ l: 'Tax Remittance', v: 'Verified', c: 'text-emerald-500' }, { l: 'Pension Fund', v: '98%', c: 'text-[#0047cc]' }, { l: 'Audit Score', v: 'A+', c: 'text-emerald-600' }].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.l}</span>
                  <span className={`text-sm font-black ${item.c}`}>{item.v}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {(role !== UserRole.ACCOUNTANT) && (
          <GlassCard title="Leave by Department"
            modalTitle="Leave Statistics" modalContent={
              <div className="space-y-1">
                {leaveData.map((d, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3 mb-1">{d.name}</p>
                    <StatRow label="Annual" value={String(d.annual)} />
                    <StatRow label="Sick" value={String(d.sick)} />
                    <StatRow label="Casual" value={String(d.casual)} />
                    <StatRow label="Maternity" value={String(d.maternity)} />
                  </div>
                ))}
              </div>
            }>
            <div className="h-52 w-full min-w-0 relative mt-2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={processedLeave}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-white/5" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="annual" stackId="a" fill="#0047cc" opacity={0.75} />
                  <Bar dataKey="sick" stackId="a" fill="#f59e0b" opacity={0.75} />
                  <Bar dataKey="casual" stackId="a" fill="#10b981" opacity={0.75} />
                  <Bar dataKey="maternity" stackId="a" fill="#ef4444" opacity={0.75} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        )}

        {(role === UserRole.CEO || role === UserRole.HR_MANAGER) && (
          <GlassCard title="Hiring Funnel"
            modalTitle="Hiring Pipeline" modalContent={<OpenRolesModal />}>
            <div className="space-y-3 py-1 mt-2">
              {processedFunnel.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ backgroundColor: item.hex }}>{item.pct}%</span>
                      {item.label}
                    </div>
                    <span className="text-slate-900 dark:text-white font-black">{item.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} opacity-70 transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Row 4: Demographics / Top Performers / Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role !== UserRole.ACCOUNTANT && (
          <GlassCard title="Employee Demographics"
            modalTitle="Demographics Breakdown" modalContent={
              <div className="space-y-1">
                {demographicsData.map((d, i) => (
                  <StatRow key={i} label={d.name} value={`${d.value} (${Math.round(d.value / 440 * 100)}%)`} />
                ))}
                <StatRow label="Total" value="440" />
                <div className="mt-4 h-36">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie data={demographicsData} innerRadius={44} outerRadius={64} paddingAngle={4} dataKey="value" stroke="none" isAnimationActive={false}>
                        {demographicsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            }>
            <div className="flex flex-col items-center pt-2">
              <div className="h-36 w-36">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie data={demographicsData} innerRadius={44} outerRadius={64} paddingAngle={4} dataKey="value" stroke="none" isAnimationActive={false}>
                      {demographicsData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full space-y-2 mt-4 px-2">
                {demographicsData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{d.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        )}

        {role !== UserRole.ACCOUNTANT && (
          <GlassCard title="Top Performers"
            action={<span className="text-[9px] font-black text-[#0047cc] uppercase tracking-widest cursor-pointer hover:underline">View All →</span>}
            modalTitle="Top Performers" modalContent={
              <div className="space-y-1">
                {topPerformers.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{p.dept}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#0047cc]">{p.score}</p>
                      <p className="text-[9px] text-emerald-500 font-bold">{p.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            }>
            <div className="space-y-4 pt-2">
              {processedPerformers.map((p, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-base">{p.icon}</div>
                    <div>
                      <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.dept}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#0047cc]">{p.score}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="space-y-4">
          <div className={`p-6 rounded-2xl shadow-xl relative overflow-hidden ${role === UserRole.ACCOUNTANT ? 'bg-emerald-600' : 'bg-[#0047cc]'}`}>
            <h4 className="text-sm font-black text-white uppercase tracking-widest italic mb-4">Quick Actions</h4>
            <div className="space-y-2.5">
              {(role === UserRole.ACCOUNTANT ? ['Process Payroll', 'Verify Invoices', 'Bank Remittance'] :
                ['Run Payroll', 'Manage Employees', 'View Performance']).map((action, i) => (
                  <button key={i} className={`w-full py-3 bg-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-md hover:scale-[1.02] transition-all text-left px-5 flex justify-between items-center group/btn ${role === UserRole.ACCOUNTANT ? 'text-emerald-600' : 'text-[#0047cc]'}`}>
                    {action}<span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">→</span>
                  </button>
                ))}
            </div>
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
          <GlassCard title="Quick Reports">
            <div className="grid grid-cols-2 gap-1 mt-1">
              {(role === UserRole.ACCOUNTANT ? [{ l: 'Payroll Log', i: '📜' }, { l: 'Tax Yield', i: '📉' }, { l: 'Audit Trail', i: '🔐' }, { l: 'Benefit Breakdown', i: '🎁' }] : quickReports).map((rep, i) => (
                <button key={i} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group">
                  <span className="text-xs grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100">{rep.i}</span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white uppercase tracking-tight leading-tight">{rep.l}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

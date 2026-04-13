
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { DEMO_DASHBOARD_KPIS, DEMO_ATTENDANCE_TREND } from '../demoData';

interface Insight {
  id: string;
  type: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  icon: string;
  action?: string;
}

interface InsightRibbonProps {
  role: UserRole;
  userName?: string;
}

const InsightRibbon: React.FC<InsightRibbonProps> = ({ role, userName }) => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const kpis = DEMO_DASHBOARD_KPIS;
    const attRate = Math.round((kpis.presentToday / kpis.totalEmployees) * 100);
    const absRate = parseFloat(((kpis.absentToday / kpis.totalEmployees) * 100).toFixed(1));
    const latestTrend = DEMO_ATTENDANCE_TREND[DEMO_ATTENDANCE_TREND.length - 1];
    const prevTrend   = DEMO_ATTENDANCE_TREND[DEMO_ATTENDANCE_TREND.length - 2];
    const lateDelta   = latestTrend.late - prevTrend.late;

    const getInsights = (): Insight[] => {
      switch (role) {
        case UserRole.ACCOUNTANT:
          return [
            { id: '1', type: kpis.pendingPayrollApprovals > 0 ? 'critical' : 'info', title: `Payroll: ${kpis.pendingPayrollApprovals} Pending`, description: `${kpis.pendingPayrollApprovals} payroll run awaiting approval. Monthly net: ₦${(kpis.monthlyPayrollTotal/1000000).toFixed(2)}M.`, icon: '💰', action: 'Review Run' },
            { id: '2', type: 'info', title: 'Tax Deadline', description: 'Monthly remittance due in 4 days. Ensure PAYE and Pension are reconciled.', icon: '📅', action: 'Prepare' },
            { id: '3', type: 'warning', title: `Revenue YTD: ₦${(kpis.revenueYTD/1000000).toFixed(0)}M`, description: `Pipeline value ₦${(kpis.pipelineValue/1000000).toFixed(0)}M. Monitor conversion to close Q2 gap.`, icon: '📊' },
          ];
        case UserRole.CEO:
          return [
            { id: '1', type: 'info', title: `Headcount: ${kpis.totalEmployees}`, description: `${kpis.activeEmployees} active, ${kpis.openPositions} open positions. Attendance today: ${attRate}%.`, icon: '🚀', action: 'View Report' },
            { id: '2', type: kpis.turnoverRateYTD > 10 ? 'warning' : 'info', title: `Turnover: ${kpis.turnoverRateYTD}% YTD`, description: kpis.turnoverRateYTD > 10 ? 'Above 10% threshold — review retention strategy.' : 'Within acceptable range.', icon: '🔍' },
            { id: '3', type: 'info', title: `Pipeline: ₦${(kpis.pipelineValue/1000000).toFixed(0)}M`, description: `${kpis.openPositions} open roles to support growth. Revenue YTD ₦${(kpis.revenueYTD/1000000).toFixed(0)}M.`, icon: '✨' },
          ];
        case UserRole.HR_MANAGER:
          return [
            { id: '1', type: lateDelta > 0 ? 'warning' : 'info', title: `Late Arrivals: ${kpis.lateToday} today`, description: `${lateDelta > 0 ? `Up ${lateDelta} vs yesterday` : 'Stable'}. ${kpis.lateToday} of ${kpis.totalEmployees} employees arrived late.`, icon: '⏰', action: 'Notify Managers' },
            { id: '2', type: kpis.pendingLeaveRequests > 5 ? 'critical' : 'warning', title: `${kpis.pendingLeaveRequests} Leave Requests Pending`, description: `${kpis.pendingLeaveRequests} requests awaiting approval. ${kpis.onLeaveToday} currently on leave.`, icon: '🏖️', action: 'Audit' },
            { id: '3', type: 'info', title: `Avg Performance: ${kpis.avgPerformanceScore}%`, description: `Organisation-wide average. ${kpis.openPositions} open positions in the hiring pipeline.`, icon: '👤' },
          ];
        default:
          return [
            { id: '1', type: 'info', title: `Attendance: ${attRate}%`, description: `${kpis.presentToday} present, ${kpis.lateToday} late, ${kpis.absentToday} absent today.`, icon: '📋' },
          ];
      }
    };

    setInsights(getInsights());
  }, [role, userName]);

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {insights.map((insight, idx) => (
        <div key={insight.id} 
          className="min-w-[280px] md:min-w-[320px] glass-iridescent p-4 rounded-2xl flex flex-col justify-between group cursor-default"
          style={{ animationDelay: `${idx * 150}ms` }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-slate-100 dark:bg-white/5 transition-transform group-hover:scale-110 duration-300`}>
              {insight.icon}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
              insight.type === 'critical' ? 'bg-rose-500/10 text-rose-500' :
              insight.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
              'bg-[#0047cc]/10 text-[#0047cc]'
            }`}>
              {insight.type}
            </span>
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{insight.title}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{insight.description}</p>
          </div>
          {insight.action && (
            <button className="mt-3 text-[9px] font-black text-[#0047cc] hover:underline uppercase tracking-widest text-left">
              {insight.action} →
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default InsightRibbon;

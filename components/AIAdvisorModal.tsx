
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { generateHRAssistantResponse } from '../services/geminiService';
import { DEMO_DASHBOARD_KPIS, DEMO_ATTENDANCE_TREND } from '../demoData';
import { useHR360 } from '../src/context/HR360Context';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

type TabType = 'Briefing' | 'Insights' | 'Trends' | 'Ask';

// ── Full org context — now sourced from HR360Context (live state) ─────────────
// Kept as a local helper only for the Briefing tab health score / cards
// The Ask tab uses buildGroqContext() from the live context store instead.

// Compute health score from real data
const computeHealthScore = (kpis: typeof DEMO_DASHBOARD_KPIS) => {
  const attScore   = Math.round((kpis.presentToday / kpis.totalEmployees) * 100);
  const perfScore  = kpis.avgPerformanceScore;
  const retScore   = Math.round((1 - kpis.turnoverRateYTD / 100) * 100);
  const leaveScore = Math.round((1 - kpis.onLeaveToday / kpis.totalEmployees) * 100);
  return Math.round((attScore + perfScore + retScore + leaveScore) / 4);
};

const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose, userName = 'there' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Briefing');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Live context — always reflects current app state including any user changes
  const { buildGroqContext, employees, attendance, leaveRequests, payrollRuns } = useHR360();

  // Briefing tab — compute from live state (memoized to avoid recalc on every keystroke)
  const totalEmp     = useMemo(() => employees.length, [employees]);
  const activeEmp    = useMemo(() => employees.filter((e: any) => e.status === 'Active' || e.status === 'Remote').length, [employees]);
  const presentToday = useMemo(() => attendance.filter((r: any) => ['PRESENT','LATE','HALF_DAY'].includes(r.status)).length, [attendance]);
  const lateToday    = useMemo(() => attendance.filter((r: any) => r.status === 'LATE').length, [attendance]);
  const absentToday  = useMemo(() => attendance.filter((r: any) => r.status === 'ABSENT').length, [attendance]);
  const onLeaveToday = useMemo(() => employees.filter((e: any) => e.status === 'On Leave').length, [employees]);
  const avgPerf      = useMemo(() => Math.round(employees.reduce((s: number, e: any) => s + (e.performanceScore ?? 0), 0) / (employees.length || 1)), [employees]);
  const turnoverRate = useMemo(() => parseFloat(((employees.filter((e: any) => e.status === 'Probation').length / (employees.length || 1)) * 100).toFixed(1)), [employees]);
  const pendingLeaveCount   = useMemo(() => leaveRequests.filter((r: any) => r.status === 'PENDING').length, [leaveRequests]);
  const pendingPayrollCount = useMemo(() => payrollRuns.filter((r: any) => r.status === 'UNDER_REVIEW').length, [payrollRuns]);

  const kpisLive = useMemo(() => ({
    totalEmployees: totalEmp, activeEmployees: activeEmp,
    presentToday, lateToday, absentToday, onLeaveToday,
    avgPerformanceScore: avgPerf, turnoverRateYTD: turnoverRate,
    monthlyPayrollTotal: DEMO_DASHBOARD_KPIS.monthlyPayrollTotal,
    revenueYTD: DEMO_DASHBOARD_KPIS.revenueYTD,
    pipelineValue: DEMO_DASHBOARD_KPIS.pipelineValue,
    pendingLeaveRequests: pendingLeaveCount, pendingPayrollApprovals: pendingPayrollCount,
    openPositions: DEMO_DASHBOARD_KPIS.openPositions,
  }), [totalEmp, activeEmp, presentToday, lateToday, absentToday, onLeaveToday, avgPerf, turnoverRate, pendingLeaveCount, pendingPayrollCount]);

  const healthScore = useMemo(() => computeHealthScore(kpisLive as any), [kpisLive]);
  const attRate     = useMemo(() => Math.round((presentToday / (totalEmp || 1)) * 100), [presentToday, totalEmp]);
  const absRate     = useMemo(() => parseFloat(((absentToday / (totalEmp || 1)) * 100).toFixed(1)), [absentToday, totalEmp]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    const newHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
    setChatHistory(newHistory);
    setIsLoading(true);
    try {
      // buildGroqContext() is called HERE — on every send — so it always reflects
      // the latest state including any changes made since the modal opened
      const liveContext = buildGroqContext();
      const contextualHistory = newHistory.map((m, i) =>
        i === 0
          ? { ...m, content: `[ORG CONTEXT — LIVE]\n${liveContext}\n\n[USER QUESTION]\n${m.content}` }
          : m
      );
      const res = await generateHRAssistantResponse(userMsg, contextualHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: res || "I'm processing your request. Could you provide more context?" }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Error communicating with AI engine.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  const renderMessage = (text: string) => {
    const clean = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#{1,3}\s+/gm, '')
      .trim();

    const linkRegex = /\[([^\]]+)\]\((\/[^\)]*)\)/g;
    const parts: React.ReactNode[] = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(clean)) !== null) {
      if (match.index > last) {
        parts.push(<span key={last}>{clean.slice(last, match.index)}</span>);
      }
      parts.push(
        <Link
          key={match.index}
          to={match[2]}
          onClick={onClose}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0047cc]/10 text-[#0047cc] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#0047cc] hover:text-white transition-all mx-0.5"
        >
          → {match[1]}
        </Link>
      );
      last = match.index + match[0].length;
    }
    if (last < clean.length) {
      parts.push(<span key={last}>{clean.slice(last)}</span>);
    }
    return parts;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-[#d9dee9] rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col h-[85vh]"
          >
            {/* Header */}
            <div className="p-10 pb-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <div className="text-[#0047cc]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-black text-[#0047cc] uppercase tracking-widest">AI Advisor</h2>
                    <span className="px-2 py-0.5 bg-[#e0e7ff] text-[#0047cc] text-[10px] font-bold rounded-md">Employee</span>
                  </div>
                <p className="text-sm font-medium text-slate-500">Good afternoon, {userName}. Here's your briefing.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white rounded-full hover:bg-slate-50 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="px-10 flex gap-8 border-b border-slate-300/50">
              {(['Briefing', 'Insights', 'Trends', 'Ask'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-[#0047cc]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047cc]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#e2e7f0]/50">
              {activeTab === 'Briefing' && (
                <div className="space-y-6">
                  {/* Health Score Card */}
                  <div className="bg-white rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-8 mb-6">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={healthScore >= 70 ? 'text-emerald-500' : healthScore >= 50 ? 'text-amber-500' : 'text-rose-500'}
                            strokeWidth="3"
                            strokeDasharray={`${healthScore}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-black text-slate-900">{healthScore}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-slate-900 mb-1">Organisation Health Score</h3>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed">Composite of attendance, retention, performance and approvals.</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">Live — {kpisLive.totalEmployees} employees</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-lg font-black text-emerald-500">{attRate}%</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Attendance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-[#0047cc]">{kpisLive.avgPerformanceScore}%</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Performance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-amber-500">{kpisLive.turnoverRateYTD}%</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Turnover</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Cards - Styled like the image */}
                  <div className="space-y-3">
                    {/* DESCRIPTIVE Card - Attendance */}
                    <motion.div 
                      initial={false}
                      animate={{ height: expandedCard === 'attendance' ? 'auto' : 'auto' }}
                      className="bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-blue-400 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setExpandedCard(expandedCard === 'attendance' ? null : 'attendance')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-wider rounded">
                              DESCRIPTIVE
                            </span>
                            <span className="text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mb-1">Attendance Rate: {attRate}%</h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {kpisLive.presentToday} of {kpisLive.totalEmployees} employees are present today. {kpisLive.lateToday} arrived late, {kpisLive.absentToday} absent.
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedCard === 'attendance' ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {expandedCard === 'attendance' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                        >
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-emerald-50 rounded-xl">
                              <p className="text-2xl font-black text-emerald-600">{kpisLive.presentToday}</p>
                              <p className="text-[9px] font-bold text-emerald-700 uppercase mt-1">Present</p>
                            </div>
                            <div className="text-center p-3 bg-amber-50 rounded-xl">
                              <p className="text-2xl font-black text-amber-600">{kpisLive.lateToday}</p>
                              <p className="text-[9px] font-bold text-amber-700 uppercase mt-1">Late</p>
                            </div>
                            <div className="text-center p-3 bg-rose-50 rounded-xl">
                              <p className="text-2xl font-black text-rose-600">{kpisLive.absentToday}</p>
                              <p className="text-[9px] font-bold text-rose-700 uppercase mt-1">Absent</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-slate-600 uppercase mb-3">7-Day Trend</p>
                            <div className="relative h-24">
                              <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="0" y1="20" x2="280" y2="20" stroke="#e2e8f0" strokeWidth="1" />
                                <line x1="0" y1="40" x2="280" y2="40" stroke="#e2e8f0" strokeWidth="1" />
                                <line x1="0" y1="60" x2="280" y2="60" stroke="#e2e8f0" strokeWidth="1" />
                                
                                {/* Line path */}
                                <polyline
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  points={DEMO_ATTENDANCE_TREND.slice(-7).map((day: any, idx: number) => {
                                    const maxVal = Math.max(...DEMO_ATTENDANCE_TREND.slice(-7).map((d: any) => d.present));
                                    const minVal = Math.min(...DEMO_ATTENDANCE_TREND.slice(-7).map((d: any) => d.present));
                                    const range = maxVal - minVal || 1;
                                    const x = (idx * 280) / 6;
                                    const y = 70 - ((day.present - minVal) / range) * 50;
                                    return `${x},${y}`;
                                  }).join(' ')}
                                />
                                
                                {/* Data points */}
                                {DEMO_ATTENDANCE_TREND.slice(-7).map((day: any, idx: number) => {
                                  const maxVal = Math.max(...DEMO_ATTENDANCE_TREND.slice(-7).map((d: any) => d.present));
                                  const minVal = Math.min(...DEMO_ATTENDANCE_TREND.slice(-7).map((d: any) => d.present));
                                  const range = maxVal - minVal || 1;
                                  const x = (idx * 280) / 6;
                                  const y = 70 - ((day.present - minVal) / range) * 50;
                                  return (
                                    <circle
                                      key={idx}
                                      cx={x}
                                      cy={y}
                                      r="4"
                                      fill="#3b82f6"
                                      stroke="white"
                                      strokeWidth="2"
                                    />
                                  );
                                })}
                              </svg>
                              
                              {/* X-axis labels */}
                              <div className="flex justify-between mt-2">
                                {DEMO_ATTENDANCE_TREND.slice(-7).map((day: any, idx: number) => (
                                  <span key={idx} className="text-[8px] font-bold text-slate-400">
                                    {day.day.slice(0, 3)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* PRESCRIPTIVE Card - Pending Actions */}
                    <motion.div 
                      initial={false}
                      animate={{ height: expandedCard === 'actions' ? 'auto' : 'auto' }}
                      className="bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-purple-400 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setExpandedCard(expandedCard === 'actions' ? null : 'actions')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-wider rounded">
                              PRESCRIPTIVE
                            </span>
                            <span className="text-purple-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mb-1">Pending Approvals: {kpisLive.pendingLeaveRequests + kpisLive.pendingPayrollApprovals}</h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {kpisLive.pendingLeaveRequests} leave requests and {kpisLive.pendingPayrollApprovals} payroll run awaiting action.
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedCard === 'actions' ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {expandedCard === 'actions' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                        >
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">Leave Requests</p>
                                  <p className="text-[10px] text-slate-500">Requires immediate review</p>
                                </div>
                              </div>
                              <span className="text-lg font-black text-amber-600">{kpisLive.pendingLeaveRequests}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900">Payroll Approvals</p>
                                  <p className="text-[10px] text-slate-500">Ready for final approval</p>
                                </div>
                              </div>
                              <span className="text-lg font-black text-blue-600">{kpisLive.pendingPayrollApprovals}</span>
                            </div>
                          </div>
                          <button className="w-full py-2 bg-purple-500 text-white rounded-lg text-xs font-black uppercase hover:bg-purple-600 transition-colors">
                            Review All Pending Items
                          </button>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* DIAGNOSTIC Card - Absenteeism */}
                    <motion.div 
                      initial={false}
                      animate={{ height: expandedCard === 'diagnostic' ? 'auto' : 'auto' }}
                      className={`bg-white rounded-[20px] p-5 shadow-sm border-l-4 ${absRate > 5 ? 'border-orange-400' : 'border-emerald-400'} cursor-pointer hover:shadow-md transition-all`}
                      onClick={() => setExpandedCard(expandedCard === 'diagnostic' ? null : 'diagnostic')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 ${absRate > 5 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} text-[9px] font-black uppercase tracking-wider rounded`}>
                              DIAGNOSTIC
                            </span>
                            <span className={absRate > 5 ? 'text-orange-600' : 'text-emerald-600'}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mb-1">
                            Absenteeism Alert: {absRate}%
                            {absRate > 5 && <span className="ml-2 text-orange-600">⚠️</span>}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {absRate > 5 
                              ? `${kpisLive.absentToday} employees absent — above 5% threshold. Review with department heads.`
                              : `${kpisLive.absentToday} employee absent — within acceptable range.`
                            }
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedCard === 'diagnostic' ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {expandedCard === 'diagnostic' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Current Rate</p>
                              <p className="text-2xl font-black text-slate-900">{absRate}%</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                              <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Threshold</p>
                              <p className="text-2xl font-black text-slate-900">5.0%</p>
                            </div>
                          </div>
                          {absRate > 5 && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                              <p className="text-[10px] font-black text-orange-700 uppercase mb-2">⚠️ Recommended Actions</p>
                              <ul className="space-y-1 text-[11px] text-slate-700">
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-500 mt-0.5">•</span>
                                  <span>Schedule department head meetings to identify root causes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-500 mt-0.5">•</span>
                                  <span>Review attendance policies and enforcement</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-orange-500 mt-0.5">•</span>
                                  <span>Consider employee wellness initiatives</span>
                                </li>
                              </ul>
                            </div>
                          )}
                          {absRate <= 5 && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                              <p className="text-[10px] font-black text-emerald-700 uppercase mb-2">✓ Status: Healthy</p>
                              <p className="text-[11px] text-slate-700">Absenteeism is within acceptable range. Continue monitoring trends.</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>

                    {/* PREDICTIVE Card - Headcount Projection */}
                    <motion.div 
                      initial={false}
                      animate={{ height: expandedCard === 'predictive' ? 'auto' : 'auto' }}
                      className="bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-indigo-400 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setExpandedCard(expandedCard === 'predictive' ? null : 'predictive')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-wider rounded">
                              PREDICTIVE
                            </span>
                            <span className="text-indigo-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mb-1">Headcount Projection — +{kpisLive.openPositions} in 3 months</h3>
                          <p className="text-xs text-slate-500 font-medium">
                            Based on {kpisLive.openPositions} open positions and current hiring velocity, expect {totalEmp + kpisLive.openPositions} employees by Q3.
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedCard === 'predictive' ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      
                      {expandedCard === 'predictive' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-100 overflow-hidden"
                        >
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-slate-50 rounded-xl">
                              <p className="text-2xl font-black text-slate-900">{totalEmp}</p>
                              <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Current</p>
                            </div>
                            <div className="text-center p-3 bg-indigo-50 rounded-xl">
                              <p className="text-2xl font-black text-indigo-600">+{kpisLive.openPositions}</p>
                              <p className="text-[9px] font-bold text-indigo-700 uppercase mt-1">Hiring</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-50 rounded-xl">
                              <p className="text-2xl font-black text-emerald-600">{totalEmp + kpisLive.openPositions}</p>
                              <p className="text-[9px] font-bold text-emerald-700 uppercase mt-1">Projected</p>
                            </div>
                          </div>
                          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                            <p className="text-[10px] font-black text-indigo-700 uppercase mb-2">📊 Growth Impact Analysis</p>
                            <div className="space-y-2 text-[11px] text-slate-700">
                              <div className="flex justify-between">
                                <span>Estimated Monthly Payroll Increase:</span>
                                <span className="font-bold">₦{((kpisLive.openPositions * 500000) / 1000000).toFixed(1)}M</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Office Space Requirement:</span>
                                <span className="font-bold">{kpisLive.openPositions} additional seats</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Onboarding Timeline:</span>
                                <span className="font-bold">8-12 weeks</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {/* Strategic AI Analysis Banner */}
                  <div className="bg-gradient-to-r from-[#0047cc] to-blue-600 rounded-[20px] p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-white/80 uppercase tracking-wider mb-1">💡 Strategic AI Analysis</p>
                        <p className="text-sm font-bold text-white">
                          Your organization is performing well with {attRate}% attendance and {avgPerf}% average performance. 
                          Focus on resolving {kpisLive.pendingLeaveRequests + kpisLive.pendingPayrollApprovals} pending approvals to maintain momentum.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Bar */}
                  <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 mb-1">Quick Actions</h3>
                        <p className="text-[10px] font-medium text-slate-400">Common tasks and shortcuts</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#0047cc] text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                          Approve Leave
                        </button>
                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                          Run Payroll
                        </button>
                        <button className="px-4 py-2 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20">
                          View Reports
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Ask' && (
                <div className="h-full flex flex-col bg-white rounded-[32px] overflow-hidden shadow-sm">
                  <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                    {chatHistory.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center">
                        <div className="w-full max-w-2xl space-y-3 mb-8">
                          {[
                            "What is our biggest retention risk right now?",
                            "How does our attendance compare to last month?",
                            "What should I focus on this week?",
                            "Give me a career development plan for my role"
                          ].map((prompt, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              onClick={() => {
                                setChatInput(prompt);
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                              className="w-full text-left px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-600 hover:border-[#0047cc] hover:text-[#0047cc] hover:bg-blue-50/50 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{prompt}</span>
                                <svg className="w-4 h-4 text-slate-400 group-hover:text-[#0047cc] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        <div className="text-center opacity-40">
                          <span className="text-4xl mb-3 block">🤖</span>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Or ask me anything about your organization</p>
                        </div>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-[20px] text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#0047cc] text-white rounded-tr-none shadow-lg'
                            : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                        }`}>
                          {msg.role === 'user'
                            ? msg.content
                            : renderMessage(msg.content)
                          }
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 p-4 rounded-[20px] rounded-tl-none border border-slate-200">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Ask anything about your organization..."
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 focus:border-[#0047cc] transition-all"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim()}
                        className="p-3 bg-[#0047cc] text-white rounded-2xl shadow-lg hover:scale-[1.05] active:scale-0.95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Insights' && (
                <div className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workforce Health</span>
                        <span className="text-2xl">👥</span>
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">{Math.round((activeEmp / totalEmp) * 100)}%</p>
                      <p className="text-xs text-slate-500">{activeEmp} of {totalEmp} active</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">On Leave</span>
                          <span className="font-bold text-slate-900">{onLeaveToday}</span>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                          <span className="text-slate-400">Probation</span>
                          <span className="font-bold text-slate-900">{employees.filter((e: any) => e.status === 'Probation').length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance Rate</span>
                        <span className="text-2xl">📊</span>
                      </div>
                      <p className="text-3xl font-black text-emerald-500 mb-1">{attRate}%</p>
                      <p className="text-xs text-slate-500">Today's attendance</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Late</span>
                          <span className="font-bold text-amber-600">{lateToday}</span>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                          <span className="text-slate-400">Absent</span>
                          <span className="font-bold text-rose-600">{absentToday}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Performance</span>
                        <span className="text-2xl">⭐</span>
                      </div>
                      <p className="text-3xl font-black text-[#0047cc] mb-1">{avgPerf}%</p>
                      <p className="text-xs text-slate-500">Organization average</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Top Performer</span>
                          <span className="font-bold text-slate-900">{[...employees].sort((a: any, b: any) => (b.performanceScore ?? 0) - (a.performanceScore ?? 0))[0]?.performanceScore}%</span>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                          <span className="text-slate-400">Needs Support</span>
                          <span className="font-bold text-slate-900">{employees.filter((e: any) => (e.performanceScore ?? 0) < 75).length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pipeline Value</span>
                        <span className="text-2xl">💰</span>
                      </div>
                      <p className="text-3xl font-black text-emerald-600 mb-1">₦{(DEMO_DASHBOARD_KPIS.pipelineValue / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-slate-500">Active deals</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Revenue YTD</span>
                          <span className="font-bold text-slate-900">₦{(DEMO_DASHBOARD_KPIS.revenueYTD / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                          <span className="text-slate-400">Active Deals</span>
                          <span className="font-bold text-slate-900">{buildGroqContext().match(/Active Deals: (\d+)/)?.[1] || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Performance */}
                  <div className="bg-white rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Department Performance</h3>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Live Data</span>
                    </div>
                    <div className="space-y-4">
                      {[...new Set(employees.map((e: any) => e.department))].map((dept: string) => {
                        const deptEmployees = employees.filter((e: any) => e.department === dept);
                        const deptAvg = Math.round(deptEmployees.reduce((sum: number, e: any) => sum + (e.performanceScore ?? 0), 0) / deptEmployees.length);
                        const deptPresent = attendance.filter((a: any) => a.department === dept && ['PRESENT', 'LATE', 'HALF_DAY'].includes(a.status)).length;
                        const deptAttRate = Math.round((deptPresent / deptEmployees.length) * 100);
                        
                        return (
                          <div key={dept} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-900">{dept}</span>
                                <span className="text-[10px] font-bold text-slate-500">{deptEmployees.length} employees</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-[#0047cc] rounded-full transition-all"
                                      style={{ width: `${deptAvg}%` }}
                                    />
                                  </div>
                                  <p className="text-[9px] text-slate-400 mt-1">Performance: {deptAvg}%</p>
                                </div>
                                <div className="flex-1">
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-emerald-500 rounded-full transition-all"
                                      style={{ width: `${deptAttRate}%` }}
                                    />
                                  </div>
                                  <p className="text-[9px] text-slate-400 mt-1">Attendance: {deptAttRate}%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top & Bottom Performers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🏆</span>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Top Performers</h3>
                      </div>
                      <div className="space-y-3">
                        {[...employees].sort((a: any, b: any) => (b.performanceScore ?? 0) - (a.performanceScore ?? 0)).slice(0, 5).map((emp: any, idx: number) => (
                          <div key={emp.id} className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-300 w-4">#{idx + 1}</span>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                              <p className="text-[10px] text-slate-400">{emp.department}</p>
                            </div>
                            <span className="text-xs font-black text-emerald-600">{emp.performanceScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">📈</span>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Needs Support</h3>
                      </div>
                      <div className="space-y-3">
                        {[...employees].sort((a: any, b: any) => (a.performanceScore ?? 0) - (b.performanceScore ?? 0)).slice(0, 5).map((emp: any, idx: number) => (
                          <div key={emp.id} className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-300 w-4">#{idx + 1}</span>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                              <p className="text-[10px] text-slate-400">{emp.department}</p>
                            </div>
                            <span className="text-xs font-black text-amber-600">{emp.performanceScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pending Actions */}
                  <div className="bg-white rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">⚡</span>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Pending Actions</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-amber-50 rounded-xl">
                        <p className="text-2xl font-black text-amber-600">{pendingLeaveCount}</p>
                        <p className="text-[10px] font-bold text-amber-700 uppercase mt-1">Leave Requests</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-black text-blue-600">{pendingPayrollCount}</p>
                        <p className="text-[10px] font-bold text-blue-700 uppercase mt-1">Payroll Approvals</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-black text-purple-600">{employees.filter((e: any) => e.status === 'Probation').length}</p>
                        <p className="text-[10px] font-bold text-purple-700 uppercase mt-1">Probation Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Trends' && (
                <div className="space-y-6">
                  {/* 7-Day Attendance Trend */}
                  <div className="bg-white rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">7-Day Attendance Trend</h3>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Last 7 Days</span>
                    </div>
                    
                    {/* Line Graph */}
                    <div className="relative h-48 mb-6">
                      <svg className="w-full h-full" viewBox="0 0 700 160" preserveAspectRatio="xMidYMid meet">
                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="700" y2="30" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="0" y1="70" x2="700" y2="70" stroke="#e2e8f0" strokeWidth="1" />
                        <line x1="0" y1="110" x2="700" y2="110" stroke="#e2e8f0" strokeWidth="1" />
                        
                        {/* Present line */}
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={DEMO_ATTENDANCE_TREND.map((day: any, idx: number) => {
                            const maxVal = Math.max(...DEMO_ATTENDANCE_TREND.map((d: any) => Math.max(d.present, d.late, d.absent)));
                            const x = (idx * 700) / (DEMO_ATTENDANCE_TREND.length - 1);
                            const y = 130 - ((day.present / maxVal) * 100);
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                        
                        {/* Late line */}
                        <polyline
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={DEMO_ATTENDANCE_TREND.map((day: any, idx: number) => {
                            const maxVal = Math.max(...DEMO_ATTENDANCE_TREND.map((d: any) => Math.max(d.present, d.late, d.absent)));
                            const x = (idx * 700) / (DEMO_ATTENDANCE_TREND.length - 1);
                            const y = 130 - ((day.late / maxVal) * 100);
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                        
                        {/* Absent line */}
                        <polyline
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={DEMO_ATTENDANCE_TREND.map((day: any, idx: number) => {
                            const maxVal = Math.max(...DEMO_ATTENDANCE_TREND.map((d: any) => Math.max(d.present, d.late, d.absent)));
                            const x = (idx * 700) / (DEMO_ATTENDANCE_TREND.length - 1);
                            const y = 130 - ((day.absent / maxVal) * 100);
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                        
                        {/* Data points for Present */}
                        {DEMO_ATTENDANCE_TREND.map((day: any, idx: number) => {
                          const maxVal = Math.max(...DEMO_ATTENDANCE_TREND.map((d: any) => Math.max(d.present, d.late, d.absent)));
                          const x = (idx * 700) / (DEMO_ATTENDANCE_TREND.length - 1);
                          const y = 130 - ((day.present / maxVal) * 100);
                          return (
                            <g key={`present-${idx}`}>
                              <circle cx={x} cy={y} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
                              <text x={x} y={y - 12} textAnchor="middle" fontSize="11" fontWeight="bold" fill="#10b981">{day.present}</text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="flex justify-between mt-3">
                        {DEMO_ATTENDANCE_TREND.map((day: any, idx: number) => (
                          <span key={idx} className="text-[10px] font-bold text-slate-400">
                            {day.day}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs font-bold text-slate-400">Avg Present</p>
                        <p className="text-lg font-black text-emerald-600">{Math.round(DEMO_ATTENDANCE_TREND.reduce((s: number, d: any) => s + d.present, 0) / DEMO_ATTENDANCE_TREND.length)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Avg Late</p>
                        <p className="text-lg font-black text-amber-600">{Math.round(DEMO_ATTENDANCE_TREND.reduce((s: number, d: any) => s + d.late, 0) / DEMO_ATTENDANCE_TREND.length)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Avg Absent</p>
                        <p className="text-lg font-black text-rose-600">{Math.round(DEMO_ATTENDANCE_TREND.reduce((s: number, d: any) => s + d.absent, 0) / DEMO_ATTENDANCE_TREND.length)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payroll Trend */}
                  <div className="bg-white rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">6-Month Payroll Trend</h3>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Nov '25 - Apr '26</span>
                    </div>
                    <div className="space-y-3">
                      {buildGroqContext().match(/Payroll Trend:[\s\S]*?(\w+ '\d+: Gross ₦[\d.]+M, Net ₦[\d.]+M)/g)?.slice(0, 6).map((trend: string, idx: number) => {
                        const match = trend.match(/(\w+ '\d+): Gross ₦([\d.]+)M, Net ₦([\d.]+)M/);
                        if (!match) return null;
                        const [, month, gross, net] = match;
                        const grossNum = parseFloat(gross);
                        const netNum = parseFloat(net);
                        const maxGross = 12;
                        
                        return (
                          <div key={idx}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-slate-900">{month}</span>
                              <div className="flex gap-4 text-[10px]">
                                <span className="text-slate-500">Gross: <span className="font-bold text-slate-900">₦{gross}M</span></span>
                                <span className="text-slate-500">Net: <span className="font-bold text-emerald-600">₦{net}M</span></span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-slate-400 rounded-full transition-all"
                                  style={{ width: `${(grossNum / maxGross) * 100}%` }}
                                />
                              </div>
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full transition-all"
                                  style={{ width: `${(netNum / maxGross) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Department Trends */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">📊</span>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Headcount by Dept</h3>
                      </div>
                      <div className="space-y-3">
                        {[...new Set(employees.map((e: any) => e.department))].map((dept: string) => {
                          const count = employees.filter((e: any) => e.department === dept).length;
                          const percentage = Math.round((count / totalEmp) * 100);
                          return (
                            <div key={dept}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-900">{dept}</span>
                                <span className="text-xs font-bold text-slate-500">{count} ({percentage}%)</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#0047cc] rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">💼</span>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Employment Mix</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Full-Time', count: employees.filter((e: any) => e.employment === 'Full-Time').length, color: 'bg-emerald-500' },
                          { label: 'Contract', count: employees.filter((e: any) => e.employment === 'Contract').length, color: 'bg-amber-500' },
                          { label: 'Part-Time', count: employees.filter((e: any) => e.employment === 'Part-Time').length, color: 'bg-blue-500' },
                        ].map((type) => {
                          const percentage = Math.round((type.count / totalEmp) * 100);
                          return (
                            <div key={type.label}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-900">{type.label}</span>
                                <span className="text-xs font-bold text-slate-500">{type.count} ({percentage}%)</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${type.color} rounded-full transition-all`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status Distribution */}
                  <div className="bg-white rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg">👤</span>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Employee Status Distribution</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Active', count: employees.filter((e: any) => e.status === 'Active').length, color: 'bg-emerald-500', icon: '✓' },
                        { label: 'Remote', count: employees.filter((e: any) => e.status === 'Remote').length, color: 'bg-blue-500', icon: '🏠' },
                        { label: 'On Leave', count: employees.filter((e: any) => e.status === 'On Leave').length, color: 'bg-amber-500', icon: '✈️' },
                        { label: 'Probation', count: employees.filter((e: any) => e.status === 'Probation').length, color: 'bg-purple-500', icon: '⏱️' },
                      ].map((status) => (
                        <div key={status.label} className="text-center p-4 bg-slate-50 rounded-xl">
                          <span className="text-2xl mb-2 block">{status.icon}</span>
                          <p className="text-2xl font-black text-slate-900">{status.count}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{status.label}</p>
                          <div className={`h-1 ${status.color} rounded-full mt-2`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AIAdvisorModal;

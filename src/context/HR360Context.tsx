/**
 * HR360Context — single live data store for the entire application.
 *
 * Every module reads initial state from demoData.ts and writes updates here.
 * AIAdvisorModal reads from this context on every message send, so Groq
 * always has 100% awareness of the current application state.
 *
 * Usage:
 *   // Read
 *   const { employees, leaveRequests } = useHR360();
 *
 *   // Write (e.g. after approving a leave)
 *   const { updateLeaveRequest } = useHR360();
 *   updateLeaveRequest(id, { status: 'APPROVED' });
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  DEMO_EMPLOYEES,
  DEMO_ATTENDANCE,
  DEMO_LEAVE_REQUESTS,
  DEMO_LEAVE_BALANCES,
  DEMO_PAYROLL_LINES,
  DEMO_PAYROLL_RUNS,
  DEMO_PAYROLL_PERIODS,
  DEMO_CRM_DEALS,
  DEMO_CRM_CONTACTS,
  DEMO_OBJECTIVES,
  DEMO_CANDIDATES,
  DEMO_JOB_OPENINGS,
  DEMO_RECOGNITIONS,
  DEMO_PURCHASE_ORDERS,
  DEMO_VENDORS,
  DEMO_REQUISITIONS,
  DEMO_BRANCHES,
  DEMO_MEMOS,
  DEMO_CHAT_MESSAGES,
  DEMO_PAYROLL_TREND,
  DEMO_ATTENDANCE_TREND,
  DEMO_TEAM_PERFORMANCE,
} from '../../demoData';
import { loadPersistedState, persistState, clearPersistedState, getStorageMeta, PERSISTED_COLLECTIONS } from '../lib/storage';
import { queryCache } from '../lib/cache';

// ── Types ─────────────────────────────────────────────────────────────────────

type AnyRecord = Record<string, any>;

interface HR360State {
  employees:       AnyRecord[];
  attendance:      AnyRecord[];
  attendanceTrend: AnyRecord[];
  leaveRequests:   AnyRecord[];
  leaveBalances:   AnyRecord[];
  payrollLines:    AnyRecord[];
  payrollRuns:     AnyRecord[];
  payrollPeriods:  AnyRecord[];
  payrollTrend:    AnyRecord[];
  crmDeals:        AnyRecord[];
  crmContacts:     AnyRecord[];
  objectives:      AnyRecord[];
  candidates:      AnyRecord[];
  jobOpenings:     AnyRecord[];
  recognitions:    AnyRecord[];
  purchaseOrders:  AnyRecord[];
  vendors:         AnyRecord[];
  requisitions:    AnyRecord[];
  branches:        AnyRecord[];
  memos:           AnyRecord[];
  chatMessages:    AnyRecord[];
  teamPerformance: AnyRecord[];
  // Audit log of every change — Groq reads this too
  changeLog:       { timestamp: string; module: string; action: string; detail: string }[];
}

interface HR360Actions {
  // Generic updater — patches a record by id in any collection
  updateRecord:   (collection: keyof Omit<HR360State, 'changeLog'>, id: string, patch: AnyRecord) => void;
  addRecord:      (collection: keyof Omit<HR360State, 'changeLog'>, record: AnyRecord) => void;
  removeRecord:   (collection: keyof Omit<HR360State, 'changeLog'>, id: string) => void;
  // Convenience helpers for common operations
  updateLeaveRequest:  (id: string, patch: AnyRecord) => void;
  updatePayrollRun:    (id: string, patch: AnyRecord) => void;
  updateCrmDeal:       (id: string, patch: AnyRecord) => void;
  addEmployee:         (employee: AnyRecord) => void;
  updateEmployee:      (id: string, patch: AnyRecord) => void;
  addRecognition:      (recognition: AnyRecord) => void;
  // Build the full context string for Groq
  buildGroqContext:    () => string;
  // Storage controls
  resetToDefaults:     () => void;
  storageMeta:         () => { savedAt: string | null; sizeKb: number };
}

type HR360ContextType = HR360State & HR360Actions;

// ── Context ───────────────────────────────────────────────────────────────────

const HR360Context = createContext<HR360ContextType | null>(null);

export const HR360Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ── Hydrate from localStorage (falls back to demoData if nothing persisted) ──
  const [state, setState] = useState<HR360State>(() => {
    const saved = loadPersistedState();
    return {
      employees:       saved?.employees       ?? DEMO_EMPLOYEES,
      attendance:      saved?.attendance      ?? DEMO_ATTENDANCE,
      attendanceTrend: DEMO_ATTENDANCE_TREND,   // static reference — never persisted
      leaveRequests:   saved?.leaveRequests   ?? DEMO_LEAVE_REQUESTS,
      leaveBalances:   saved?.leaveBalances   ?? DEMO_LEAVE_BALANCES,
      payrollLines:    saved?.payrollLines    ?? DEMO_PAYROLL_LINES,
      payrollRuns:     saved?.payrollRuns     ?? DEMO_PAYROLL_RUNS,
      payrollPeriods:  saved?.payrollPeriods  ?? DEMO_PAYROLL_PERIODS,
      payrollTrend:    DEMO_PAYROLL_TREND,       // static reference — never persisted
      crmDeals:        saved?.crmDeals        ?? DEMO_CRM_DEALS,
      crmContacts:     saved?.crmContacts     ?? DEMO_CRM_CONTACTS,
      objectives:      saved?.objectives      ?? DEMO_OBJECTIVES,
      candidates:      saved?.candidates      ?? DEMO_CANDIDATES,
      jobOpenings:     saved?.jobOpenings     ?? DEMO_JOB_OPENINGS,
      recognitions:    saved?.recognitions    ?? DEMO_RECOGNITIONS,
      purchaseOrders:  saved?.purchaseOrders  ?? DEMO_PURCHASE_ORDERS,
      vendors:         saved?.vendors         ?? DEMO_VENDORS,
      requisitions:    saved?.requisitions    ?? DEMO_REQUISITIONS,
      branches:        saved?.branches        ?? DEMO_BRANCHES,
      memos:           saved?.memos           ?? DEMO_MEMOS,
      chatMessages:    saved?.chatMessages    ?? DEMO_CHAT_MESSAGES,
      teamPerformance: saved?.teamPerformance ?? DEMO_TEAM_PERFORMANCE,
      changeLog:       saved?.changeLog       ?? [],
    };
  });

  // ── Persist on every state change (debounced 300ms inside persistState) ──────
  useEffect(() => {
    const snapshot: Partial<Record<typeof PERSISTED_COLLECTIONS[number], any[]>> = {};
    for (const key of PERSISTED_COLLECTIONS) {
      (snapshot as any)[key] = (state as any)[key];
    }
    persistState(snapshot);
    // Invalidate cached derived computations whenever state changes
    queryCache.invalidatePrefix('groq:');
    queryCache.invalidatePrefix('derived:');
  }, [state]);
  const log = (module: string, action: string, detail: string) => ({
    timestamp: new Date().toISOString(),
    module,
    action,
    detail,
  });

  const updateRecord = useCallback((
    collection: keyof Omit<HR360State, 'changeLog'>,
    id: string,
    patch: AnyRecord,
  ) => {
    setState(prev => ({
      ...prev,
      [collection]: (prev[collection] as AnyRecord[]).map(r =>
        r.id === id ? { ...r, ...patch } : r
      ),
      changeLog: [
        log(collection, 'UPDATE', `id=${id} patch=${JSON.stringify(patch)}`),
        ...prev.changeLog.slice(0, 49),
      ],
    }));
  }, []);

  const addRecord = useCallback((
    collection: keyof Omit<HR360State, 'changeLog'>,
    record: AnyRecord,
  ) => {
    setState(prev => ({
      ...prev,
      [collection]: [record, ...(prev[collection] as AnyRecord[])],
      changeLog: [
        log(collection, 'ADD', `id=${record.id} name=${record.name ?? record.title ?? record.id}`),
        ...prev.changeLog.slice(0, 49),
      ],
    }));
  }, []);

  const removeRecord = useCallback((
    collection: keyof Omit<HR360State, 'changeLog'>,
    id: string,
  ) => {
    setState(prev => ({
      ...prev,
      [collection]: (prev[collection] as AnyRecord[]).filter(r => r.id !== id),
      changeLog: [
        log(collection, 'REMOVE', `id=${id}`),
        ...prev.changeLog.slice(0, 49),
      ],
    }));
  }, []);

  // ── Convenience helpers ──────────────────────────────────────────────────────

  const updateLeaveRequest  = useCallback((id: string, patch: AnyRecord) => updateRecord('leaveRequests', id, patch), [updateRecord]);
  const updatePayrollRun    = useCallback((id: string, patch: AnyRecord) => updateRecord('payrollRuns', id, patch), [updateRecord]);
  const updateCrmDeal       = useCallback((id: string, patch: AnyRecord) => updateRecord('crmDeals', id, patch), [updateRecord]);
  const addEmployee         = useCallback((emp: AnyRecord) => addRecord('employees', emp), [addRecord]);
  const updateEmployee      = useCallback((id: string, patch: AnyRecord) => updateRecord('employees', id, patch), [updateRecord]);
  const addRecognition      = useCallback((r: AnyRecord) => addRecord('recognitions', r), [addRecord]);

  const resetToDefaults = useCallback(() => {
    clearPersistedState();
    setState({
      employees:       DEMO_EMPLOYEES,
      attendance:      DEMO_ATTENDANCE,
      attendanceTrend: DEMO_ATTENDANCE_TREND,
      leaveRequests:   DEMO_LEAVE_REQUESTS,
      leaveBalances:   DEMO_LEAVE_BALANCES,
      payrollLines:    DEMO_PAYROLL_LINES,
      payrollRuns:     DEMO_PAYROLL_RUNS,
      payrollPeriods:  DEMO_PAYROLL_PERIODS,
      payrollTrend:    DEMO_PAYROLL_TREND,
      crmDeals:        DEMO_CRM_DEALS,
      crmContacts:     DEMO_CRM_CONTACTS,
      objectives:      DEMO_OBJECTIVES,
      candidates:      DEMO_CANDIDATES,
      jobOpenings:     DEMO_JOB_OPENINGS,
      recognitions:    DEMO_RECOGNITIONS,
      purchaseOrders:  DEMO_PURCHASE_ORDERS,
      vendors:         DEMO_VENDORS,
      requisitions:    DEMO_REQUISITIONS,
      branches:        DEMO_BRANCHES,
      memos:           DEMO_MEMOS,
      chatMessages:    DEMO_CHAT_MESSAGES,
      teamPerformance: DEMO_TEAM_PERFORMANCE,
      changeLog:       [],
    });
  }, []);

  const storageMeta = useCallback(() => getStorageMeta(), []);

  // ── Groq context builder — reads live state, called on every message ─────────
  // Provides comprehensive organizational intelligence with actionable insights

  const buildGroqContext = useCallback((): string => {
    return queryCache.get('groq:context', () => {
    const s = state;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // ═══ WORKFORCE ANALYTICS ═══
    const totalEmp   = s.employees.length;
    const activeEmp  = s.employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
    const onLeave    = s.employees.filter(e => e.status === 'On Leave').length;
    const probation  = s.employees.filter(e => e.status === 'Probation').length;
    const depts      = [...new Set(s.employees.map(e => e.department))];
    const deptBreakdown = depts.map(d => {
      const count = s.employees.filter(e => e.department === d).length;
      const avgPerf = Math.round(s.employees.filter(e => e.department === d).reduce((sum, e) => sum + (e.performanceScore ?? 0), 0) / count);
      return `${d}: ${count} employees, avg performance ${avgPerf}%`;
    }).join(' | ');
    
    // Employment mix & salary insights
    const fullTime   = s.employees.filter(e => e.employment === 'Full-Time').length;
    const contract   = s.employees.filter(e => e.employment === 'Contract').length;
    const partTime   = s.employees.filter(e => e.employment === 'Part-Time').length;
    const avgSalary  = Math.round(s.employees.reduce((sum, e) => sum + (e.baseSalary ?? 0), 0) / totalEmp);
    
    // ═══ ATTENDANCE INTELLIGENCE ═══
    const presentToday = s.attendance.filter(r => ['PRESENT','LATE','HALF_DAY'].includes(r.status)).length;
    const lateToday    = s.attendance.filter(r => r.status === 'LATE').length;
    const absentToday  = s.attendance.filter(r => r.status === 'ABSENT').length;
    const halfDay      = s.attendance.filter(r => r.status === 'HALF_DAY').length;
    const attRate      = Math.round((presentToday / totalEmp) * 100);
    const absRate      = ((absentToday / totalEmp) * 100).toFixed(1);
    
    // Detailed attendance breakdown
    const lateDetails = s.attendance.filter(r => r.status === 'LATE')
      .map(r => `${r.employeeName} (${r.department}, ${r.lateMins}m late)`).join('; ');
    const absentDetails = s.attendance.filter(r => r.status === 'ABSENT')
      .map(r => `${r.employeeName} (${r.department})`).join('; ');
    
    // Overtime analysis
    const totalOT = s.attendance.reduce((sum, r) => sum + (r.otMins ?? 0), 0);
    const avgOT   = totalOT > 0 ? Math.round(totalOT / s.attendance.filter(r => (r.otMins ?? 0) > 0).length) : 0;
    const topOT = [...s.attendance].sort((a, b) => (b.otMins ?? 0) - (a.otMins ?? 0))
      .filter(r => (r.otMins ?? 0) > 0).slice(0, 5)
      .map(r => `${r.employeeName} (${r.otMins}m, ${r.department})`).join('; ');
    
    // 7-day attendance trend with insights
    const trendData = s.attendanceTrend;
    const avgPresent = Math.round(trendData.reduce((sum: number, d: any) => sum + d.present, 0) / trendData.length);
    const avgLate    = Math.round(trendData.reduce((sum: number, d: any) => sum + d.late, 0) / trendData.length);
    const trendStr = trendData.map((d: any) => `${d.day}: ${d.present}P/${d.late}L/${d.absent}A`).join(' | ');
    
    // ═══ PERFORMANCE INTELLIGENCE ═══
    const ranked = [...s.employees].sort((a, b) => (b.performanceScore ?? 0) - (a.performanceScore ?? 0));
    const top5   = ranked.slice(0, 5).map(e => `${e.name} (${e.department}, ${e.position}) — ${e.performanceScore}%`).join('; ');
    const bottom5 = ranked.slice(-5).map(e => `${e.name} (${e.department}, ${e.position}) — ${e.performanceScore}%`).join('; ');
    const avgPerf = Math.round(s.employees.reduce((sum, e) => sum + (e.performanceScore ?? 0), 0) / totalEmp);
    
    // Department performance breakdown
    const deptPerf = s.teamPerformance.map((t: any) => 
      `${t.name}: KPI=${t.kpi}%, Behavioral=${t.behavioral}%, Attendance=${t.attendance}%, Overall=${t.avg}%`
    ).join(' | ');
    
    // OKR progress tracking with detailed key results
    const okrDetails = s.objectives.map((o: any) => {
      const progress = Math.round(
        o.keyResults.reduce((sum: number, kr: any) =>
          sum + Math.min(100, (kr.currentValue / kr.targetValue) * 100), 0
        ) / o.keyResults.length
      );
      const krSummary = o.keyResults.map((kr: any) => 
        `${kr.description}: ${kr.currentValue}/${kr.targetValue} ${kr.unit} (${Math.round((kr.currentValue/kr.targetValue)*100)}%)`
      ).join('; ');
      return `[${o.ownerName}] ${o.title} — ${progress}% overall (${o.status})\n    Key Results: ${krSummary}`;
    }).join('\n  ');
    
    // ═══ LEAVE MANAGEMENT ═══
    const pendingLeaves = s.leaveRequests.filter(r => r.status === 'PENDING');
    const approvedLeaves = s.leaveRequests.filter(r => r.status === 'APPROVED');
    const rejectedLeaves = s.leaveRequests.filter(r => r.status === 'REJECTED');
    const pendingLeaveDetails = pendingLeaves
      .map(r => `${r.employeeName} (${r.department}): ${r.type}, ${r.days} days (${r.startDate} to ${r.endDate}) — Reason: ${r.reason}`)
      .join('\n  ');
    
    // Leave balance insights
    const leaveBalanceSummary = s.leaveBalances.slice(0, 5).map((lb: any) =>
      `${lb.employeeName}: Annual ${lb.annual.remaining}/${lb.annual.total}, Sick ${lb.sick.remaining}/${lb.sick.total}, Casual ${lb.casual.remaining}/${lb.casual.total}`
    ).join(' | ');
    
    // ═══ PAYROLL INTELLIGENCE ═══
    const payrollRun = s.payrollRuns.find(r => r.status === 'UNDER_REVIEW');
    const monthlyGross = s.payrollLines.reduce((sum, l) => sum + (l.grossPay ?? 0), 0);
    const monthlyNet = s.payrollLines.reduce((sum, l) => sum + (l.netPay ?? 0), 0);
    const totalDeductions = monthlyGross - monthlyNet;
    const highestPaid = [...s.payrollLines].sort((a, b) => (b.netPay ?? 0) - (a.netPay ?? 0))
      .slice(0, 5).map(l => `${l.employeeName} (${l.department}): ₦${l.netPay?.toLocaleString()}`).join('; ');
    const anomalies = s.payrollLines.filter(l => l.hasAnomalies)
      .map(l => `${l.employeeName} (${l.department}): variance ₦${l.variance?.toLocaleString()}`).join('; ');
    const onHold = s.payrollLines.filter(l => l.isOnHold).map(l => l.employeeName).join(', ');
    
    // Payroll trend analysis
    const payrollTrendStr = s.payrollTrend.map((p: any) => 
      `${p.month}: Gross ₦${(p.gross/1000000).toFixed(1)}M, Net ₦${(p.net/1000000).toFixed(1)}M`
    ).join(' | ');
    
    // ═══ CRM & SALES INTELLIGENCE ═══
    const activeDeals = s.crmDeals.filter(d => d.status === 'ACTIVE');
    const wonDeals = s.crmDeals.filter(d => d.status === 'WON');
    const lostDeals = s.crmDeals.filter(d => d.status === 'LOST');
    const topDeals = [...activeDeals].sort((a, b) => (b.value ?? 0) - (a.value ?? 0)).slice(0, 5)
      .map(d => `${d.title} (${d.companyName}) — ₦${((d.value ?? 0)/1000000).toFixed(1)}M, ${d.stage}, ${d.probability}% probability, Owner: ${d.ownerName}`)
      .join('\n  ');
    const revenueYTD  = wonDeals.reduce((s, d) => s + (d.value ?? 0), 0);
    const pipelineVal = activeDeals.reduce((s, d) => s + (d.value ?? 0), 0);
    const weightedPipeline = activeDeals.reduce((s, d) => s + ((d.value ?? 0) * (d.probability ?? 0) / 100), 0);
    
    // ═══ TALENT ACQUISITION ═══
    const openPositions = s.jobOpenings.filter(j => j.status === 'OPEN');
    const totalOpenings = openPositions.reduce((s, j) => s + j.openings, 0);
    const totalApplicants = openPositions.reduce((s, j) => s + j.applicants, 0);
    const openRolesDetails = openPositions
      .map(j => `${j.title} (${j.department}, ${j.branch}): ${j.openings} positions, ${j.applicants} applicants, Manager: ${j.hiringManager}`)
      .join('\n  ');
    
    const topCandidates = [...s.candidates].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5)
      .map(c => `${c.name} for ${c.position} — Score: ${c.score}, Status: ${c.status}, Source: ${c.source}`)
      .join('\n  ');
    
    // ═══ EMPLOYEE ENGAGEMENT ═══
    const recentRecognitions = s.recognitions.slice(0, 5)
      .map(r => `${r.senderName} (${r.senderRole}) → ${r.recipientName}: "${r.message.slice(0, 80)}..." [${Object.entries(r.reactions).map(([k,v]) => `${k}${v}`).join(' ')}]`)
      .join('\n  ');
    
    // ═══ PROCUREMENT & FINANCE ===
    const pendingPOs = s.purchaseOrders.filter(p => p.status === 'PENDING');
    const approvedPOs = s.purchaseOrders.filter(p => p.status === 'APPROVED');
    const pendingPODetails = pendingPOs
      .map(p => `${p.poNumber} — ${p.vendorName}: ₦${p.totalAmount?.toLocaleString()} (${p.department}, Requester: ${p.requesterName})`)
      .join('\n  ');
    const totalProcurementValue = s.purchaseOrders.reduce((sum, p) => sum + (p.totalAmount ?? 0), 0);
    
    const pendingReqs = s.requisitions.filter(r => r.status === 'PENDING');
    const pendingReqDetails = pendingReqs
      .map(r => `${r.title} — ${r.requesterName} (${r.department}): ₦${r.estimatedAmount?.toLocaleString()}, Priority: ${r.priority}`)
      .join('\n  ');
    
    // Vendor insights
    const topVendors = [...s.vendors].sort((a, b) => (b.totalSpend ?? 0) - (a.totalSpend ?? 0)).slice(0, 5)
      .map(v => `${v.name} (${v.category}): ₦${v.totalSpend?.toLocaleString()}, Rating: ${v.rating}, Risk: ${v.riskLevel}`)
      .join(' | ');
    
    // ═══ BRANCH OPERATIONS ===
    const branchDetails = s.branches.map(b =>
      `${b.name} (${b.type}, ${b.city}): ${b.employee_count} employees, Today: ${b.attendance_today?.present}P/${b.attendance_today?.late}L/${b.attendance_today?.absent}A, Manager: ${b.manager_name}`
    ).join('\n  ');
    
    // ═══ COMMUNICATION & MEMOS ===
    const unreadMemos = s.memos.filter(m => !m.isRead);
    const highPriorityMemos = s.memos.filter(m => m.priority === 'HIGH');
    const recentMemos = s.memos.slice(0, 3)
      .map(m => `[${m.senderName}] ${m.subject} — "${m.snippet}" (${m.timestamp.slice(0,10)})`)
      .join('\n  ');
    
    // ═══ RECENT CHANGES (Session Audit Log) ===
    const recentChanges = state.changeLog.slice(0, 15)
      .map(c => `[${c.timestamp.slice(11, 19)}] ${c.module}.${c.action}: ${c.detail}`)
      .join('\n  ');

    return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║  HR360 LIVE ORGANIZATIONAL INTELLIGENCE — ${today}                            ║
║  Complete real-time snapshot with actionable insights                         ║
╚═══════════════════════════════════════════════════════════════════════════════╝

═══ 1. WORKFORCE OVERVIEW ═══
Total Headcount: ${totalEmp} | Active: ${activeEmp} | On Leave: ${onLeave} | Probation: ${probation}
Employment Mix: Full-Time ${fullTime} (${Math.round(fullTime/totalEmp*100)}%), Contract ${contract} (${Math.round(contract/totalEmp*100)}%), Part-Time ${partTime} (${Math.round(partTime/totalEmp*100)}%)
Average Base Salary: ₦${avgSalary.toLocaleString()}/month
Departments (${depts.length}): ${depts.join(', ')}

Department Breakdown:
  ${deptBreakdown}

═══ 2. ATTENDANCE & PUNCTUALITY (Today) ═══
Attendance Rate: ${attRate}% | Present: ${presentToday} | Late: ${lateToday} | Absent: ${absentToday} | Half-Day: ${halfDay}
Absenteeism Rate: ${absRate}% ${parseFloat(absRate) > 5 ? '⚠️ ABOVE THRESHOLD (5%)' : '✓ Within acceptable range'}

Late Arrivals (${lateToday}):
  ${lateDetails || 'None'}

Absent Today (${absentToday}):
  ${absentDetails || 'None'}

Overtime Analysis:
  Total OT Today: ${totalOT} minutes | Average OT: ${avgOT} minutes per person
  Top OT Contributors: ${topOT || 'None'}

7-Day Attendance Trend (Avg: ${avgPresent} present, ${avgLate} late):
  ${trendStr}

═══ 3. PERFORMANCE & OKRs ═══
Organization Average Performance: ${avgPerf}%

Department Performance Scores:
  ${deptPerf}

Top 5 Performers:
  ${top5}

Bottom 5 Performers (Coaching Opportunities):
  ${bottom5}

Active OKRs (${s.objectives.length}):
  ${okrDetails}

═══ 4. LEAVE MANAGEMENT ═══
Pending Requests: ${pendingLeaves.length} | Approved This Month: ${approvedLeaves.length} | Rejected: ${rejectedLeaves.length}

Pending Leave Requests Requiring Action:
  ${pendingLeaveDetails || 'None'}

Sample Leave Balances:
  ${leaveBalanceSummary}

═══ 5. PAYROLL & COMPENSATION ═══
Current Period: ${payrollRun ? `${payrollRun.periodName} (${payrollRun.status})` : 'No active run'}
Monthly Gross: ₦${monthlyGross.toLocaleString()} | Net: ₦${monthlyNet.toLocaleString()} | Deductions: ₦${totalDeductions.toLocaleString()}
Pending Approvals: ${s.payrollRuns.filter(r => r.status === 'UNDER_REVIEW').length}

Highest Paid Employees:
  ${highestPaid}

Payroll Anomalies (${s.payrollLines.filter(l => l.hasAnomalies).length}):
  ${anomalies || 'None'}

On Hold: ${onHold || 'None'}

6-Month Payroll Trend:
  ${payrollTrendStr}

═══ 6. CRM & SALES PIPELINE ═══
Revenue YTD: ₦${(revenueYTD/1000000).toFixed(1)}M | Pipeline Value: ₦${(pipelineVal/1000000).toFixed(1)}M | Weighted Pipeline: ₦${(weightedPipeline/1000000).toFixed(1)}M
Active Deals: ${activeDeals.length} | Won: ${wonDeals.length} | Lost: ${lostDeals.length}
Win Rate: ${wonDeals.length > 0 ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) : 0}%

Top Active Deals:
  ${topDeals}

═══ 7. TALENT ACQUISITION ═══
Open Positions: ${totalOpenings} across ${openPositions.length} roles | Total Applicants: ${totalApplicants}
Avg Applicants per Role: ${openPositions.length > 0 ? Math.round(totalApplicants / openPositions.length) : 0}

Open Roles:
  ${openRolesDetails}

Top Candidates:
  ${topCandidates}

═══ 8. EMPLOYEE ENGAGEMENT ═══
Recent Recognition (Last 5):
  ${recentRecognitions}

═══ 9. PROCUREMENT & VENDOR MANAGEMENT ═══
Total Procurement Value: ₦${(totalProcurementValue/1000000).toFixed(1)}M
Pending POs: ${pendingPOs.length} | Approved POs: ${approvedPOs.length}
Pending Requisitions: ${pendingReqs.length}

Pending Purchase Orders:
  ${pendingPODetails || 'None'}

Pending Requisitions:
  ${pendingReqDetails || 'None'}

Top Vendors by Spend:
  ${topVendors}

═══ 10. BRANCH OPERATIONS ═══
Active Branches: ${s.branches.filter(b => b.status === 'Active').length}

Branch Details:
  ${branchDetails}

═══ 11. INTERNAL COMMUNICATIONS ═══
Unread Memos: ${unreadMemos.length} | High Priority: ${highPriorityMemos.length}

Recent Memos:
  ${recentMemos}

═══ 12. SESSION ACTIVITY LOG (Last 15 Actions) ═══
${recentChanges || '  No changes recorded this session'}

╔═══════════════════════════════════════════════════════════════════════════════╗
║  ACTIONABLE INSIGHTS & RECOMMENDATIONS                                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝

• Attendance: ${parseFloat(absRate) > 5 ? `Absenteeism at ${absRate}% exceeds 5% threshold. Review with department heads.` : `Attendance healthy at ${attRate}%.`}
• Performance: ${avgPerf < 80 ? `Org avg ${avgPerf}% below target. Consider training programs.` : `Strong performance at ${avgPerf}%.`}
• Leave: ${pendingLeaves.length > 5 ? `${pendingLeaves.length} pending leave requests need immediate review.` : `Leave management current.`}
• Payroll: ${s.payrollLines.filter(l => l.hasAnomalies).length > 0 ? `${s.payrollLines.filter(l => l.hasAnomalies).length} payroll anomalies require investigation.` : `Payroll processing clean.`}
• Pipeline: Weighted pipeline ₦${(weightedPipeline/1000000).toFixed(1)}M suggests ${weightedPipeline > pipelineVal * 0.6 ? 'strong' : 'moderate'} conversion probability.
• Talent: ${totalApplicants > totalOpenings * 10 ? 'Strong candidate pipeline.' : 'Consider expanding recruitment channels.'}
• Procurement: ${pendingPOs.length + pendingReqs.length} items awaiting approval.

Use this data to provide specific, actionable recommendations based on the user's question.
`.trim();
    }, 120_000); // cache for 2 minutes — invalidated on any state change
  }, [state]);

  const value: HR360ContextType = {
    ...state,
    updateRecord,
    addRecord,
    removeRecord,
    updateLeaveRequest,
    updatePayrollRun,
    updateCrmDeal,
    addEmployee,
    updateEmployee,
    addRecognition,
    buildGroqContext,
    resetToDefaults,
    storageMeta,
  };

  return <HR360Context.Provider value={value}>{children}</HR360Context.Provider>;
};

export const useHR360 = (): HR360ContextType => {
  const ctx = useContext(HR360Context);
  if (!ctx) throw new Error('useHR360 must be used inside HR360Provider');
  return ctx;
};

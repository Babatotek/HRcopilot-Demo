// ============================================
// FILE: src/demo/orchestrator/strategicFlows.ts
// PURPOSE: 6 strategic flow definitions.
//   Each flow is a named sequence of steps that demonstrate
//   a complete end-to-end business process.
//   Consumed by the Strategic Flows mode selector in MainShell.
// ============================================

import type { DemoStep } from './demoOrchestrator';

export interface StrategicFlow {
  id:          string;
  title:       string;
  description: string;
  icon:        string;
  durationMin: number;
  steps:       DemoStep[];
}

// ── 1. Employee Lifecycle ─────────────────────────────────────────────────────

const EMPLOYEE_LIFECYCLE: StrategicFlow = {
  id:          'employee-lifecycle',
  title:       'Employee Lifecycle',
  description: 'From job requisition to first payslip — the complete onboarding journey.',
  icon:        '👤',
  durationMin: 6,
  steps: [
    {
      id:           'lifecycle.requisition',
      label:        'Job Requisition',
      module:       'talent',
      narrationKey: 'talentManagement.hook',
      durationMs:   8_000,
      joyrideTarget: '#talent-pipeline',
    },
    {
      id:           'lifecycle.hire',
      label:        'Hire & Onboard',
      module:       'employees',
      narrationKey: 'talentManagement.pipeline',
      durationMs:   8_000,
      joyrideTarget: '#employees-table',
    },
    {
      id:           'lifecycle.attendance',
      label:        'First Clock-In',
      module:       'attendance',
      narrationKey: 'attendance.clockInSuccess',
      durationMs:   8_000,
      joyrideTarget: '#attendance-map',
    },
    {
      id:           'lifecycle.payroll',
      label:        'First Payslip',
      module:       'payroll',
      narrationKey: 'payroll.runPayroll',
      durationMs:   8_000,
      joyrideTarget: '#payroll-run-btn',
    },
    {
      id:           'lifecycle.performance',
      label:        'Performance Review',
      module:       'performance',
      narrationKey: 'performance.templateAssigned',
      durationMs:   8_000,
      joyrideTarget: '#performance-grid',
    },
  ],
};

// ── 2. Month-End Close ────────────────────────────────────────────────────────

const MONTH_END_CLOSE: StrategicFlow = {
  id:          'month-end-close',
  title:       'Month-End Close',
  description: 'Attendance lock → payroll run → ledger post → financial reports.',
  icon:        '📅',
  durationMin: 5,
  steps: [
    {
      id:           'close.attendance',
      label:        'Lock Attendance',
      module:       'attendance',
      narrationKey: 'attendance.advisorInsight',
      durationMs:   8_000,
      joyrideTarget: '#attendance-map',
    },
    {
      id:           'close.payroll',
      label:        'Run Payroll',
      module:       'payroll',
      narrationKey: 'payroll.runPayroll',
      durationMs:   8_000,
      joyrideTarget: '#payroll-run-btn',
    },
    {
      id:           'close.ledger',
      label:        'Post to Ledger',
      module:       'finance',
      narrationKey: 'accountingFinance.journalEntries',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
    {
      id:           'close.reports',
      label:        'Financial Reports',
      module:       'finance',
      narrationKey: 'accountingFinance.reporting',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
    {
      id:           'close.reconcile',
      label:        'Reconciliation',
      module:       'finance',
      narrationKey: 'accountingFinance.reconciliation',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
  ],
};

// ── 3. Manager Dashboard ──────────────────────────────────────────────────────

const MANAGER_DASHBOARD: StrategicFlow = {
  id:          'manager-dashboard',
  title:       'Manager Dashboard',
  description: 'Real-time KPIs, team attendance, leave approvals, and AI insights.',
  icon:        '📊',
  durationMin: 4,
  steps: [
    {
      id:           'mgr.dashboard',
      label:        'KPI Overview',
      module:       '',
      narrationKey: 'dashboard.overview',
      durationMs:   8_000,
      joyrideTarget: '#dashboard-kpis',
    },
    {
      id:           'mgr.attendance',
      label:        'Team Attendance',
      module:       'attendance',
      narrationKey: 'attendance.hook',
      durationMs:   8_000,
      joyrideTarget: '#attendance-map',
    },
    {
      id:           'mgr.leave',
      label:        'Leave Approvals',
      module:       'leave',
      narrationKey: 'costsavings.turnover',
      durationMs:   8_000,
      joyrideTarget: '#leave-table',
    },
    {
      id:           'mgr.advisor',
      label:        'AI Insights',
      module:       '',
      narrationKey: 'dashboard.advisor',
      durationMs:   8_000,
      joyrideTarget: '#ai-advisor-btn',
    },
  ],
};

// ── 4. Talent Acquisition ─────────────────────────────────────────────────────

const TALENT_ACQUISITION: StrategicFlow = {
  id:          'talent-acquisition',
  title:       'Talent Acquisition',
  description: 'Requisition → pipeline → interview → offer → onboard.',
  icon:        '🌟',
  durationMin: 5,
  steps: [
    {
      id:           'talent.hook',
      label:        'Open Requisition',
      module:       'talent',
      narrationKey: 'talentManagement.hook',
      durationMs:   8_000,
      joyrideTarget: '#talent-pipeline',
    },
    {
      id:           'talent.pipeline',
      label:        'Candidate Pipeline',
      module:       'talent',
      narrationKey: 'talentManagement.pipeline',
      durationMs:   8_000,
      joyrideTarget: '#talent-pipeline',
    },
    {
      id:           'talent.scoring',
      label:        'AI Deal Scoring',
      module:       'crm',
      narrationKey: 'crmSales.dealScoring',
      durationMs:   8_000,
      joyrideTarget: '#crm-pipeline',
    },
    {
      id:           'talent.offer',
      label:        'Extend Offer',
      module:       'talent',
      narrationKey: 'talentManagement.pipeline',
      durationMs:   8_000,
      joyrideTarget: '#talent-pipeline',
    },
    {
      id:           'talent.onboard',
      label:        'Onboard Employee',
      module:       'employees',
      narrationKey: 'talentManagement.hook',
      durationMs:   8_000,
      joyrideTarget: '#employees-table',
    },
  ],
};

// ── 5. Compliance Audit ───────────────────────────────────────────────────────

const COMPLIANCE_AUDIT: StrategicFlow = {
  id:          'compliance-audit',
  title:       'Compliance Audit',
  description: 'Attendance logs → payroll audit → procurement review → export.',
  icon:        '🔍',
  durationMin: 5,
  steps: [
    {
      id:           'audit.attendance',
      label:        'Attendance Logs',
      module:       'attendance',
      narrationKey: 'attendance.clockInSuccess',
      durationMs:   8_000,
      joyrideTarget: '#attendance-map',
    },
    {
      id:           'audit.payroll',
      label:        'Payroll Audit',
      module:       'payroll',
      narrationKey: 'payroll.compliance',
      durationMs:   8_000,
      joyrideTarget: '#payroll-run-btn',
    },
    {
      id:           'audit.procurement',
      label:        'Procurement Review',
      module:       'procurement',
      narrationKey: 'procurement.threeWayMatch',
      durationMs:   8_000,
      joyrideTarget: '#procurement-table',
    },
    {
      id:           'audit.finance',
      label:        'Finance Compliance',
      module:       'finance',
      narrationKey: 'accountingFinance.compliance',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
    {
      id:           'audit.export',
      label:        'Export Reports',
      module:       'finance',
      narrationKey: 'accountingFinance.reporting',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
  ],
};

// ── 6. Financial Planning ─────────────────────────────────────────────────────

const FINANCIAL_PLANNING: StrategicFlow = {
  id:          'financial-planning',
  title:       'Financial Planning',
  description: 'Budget vs actuals, payroll forecasting, procurement spend, cash flow.',
  icon:        '💹',
  durationMin: 5,
  steps: [
    {
      id:           'fin.overview',
      label:        'Financial Overview',
      module:       'finance',
      narrationKey: 'accountingFinance.hook',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
    {
      id:           'fin.payroll',
      label:        'Payroll Forecast',
      module:       'payroll',
      narrationKey: 'payroll.advisorIntro',
      durationMs:   8_000,
      joyrideTarget: '#payroll-run-btn',
    },
    {
      id:           'fin.procurement',
      label:        'Procurement Spend',
      module:       'procurement',
      narrationKey: 'procurement.savingsTracker',
      durationMs:   8_000,
      joyrideTarget: '#procurement-table',
    },
    {
      id:           'fin.cashflow',
      label:        'Cash Flow',
      module:       'finance',
      narrationKey: 'accountingFinance.cashflow',
      durationMs:   8_000,
      joyrideTarget: '#finance-ledger',
    },
    {
      id:           'fin.advisor',
      label:        'AI Forecast',
      module:       '',
      narrationKey: 'accountingFinance.advisorInsight',
      durationMs:   8_000,
      joyrideTarget: '#ai-advisor-btn',
    },
  ],
};

// ── All flows export ──────────────────────────────────────────────────────────

export const STRATEGIC_FLOWS: StrategicFlow[] = [
  EMPLOYEE_LIFECYCLE,
  MONTH_END_CLOSE,
  MANAGER_DASHBOARD,
  TALENT_ACQUISITION,
  COMPLIANCE_AUDIT,
  FINANCIAL_PLANNING,
];

export {
  EMPLOYEE_LIFECYCLE,
  MONTH_END_CLOSE,
  MANAGER_DASHBOARD,
  TALENT_ACQUISITION,
  COMPLIANCE_AUDIT,
  FINANCIAL_PLANNING,
};

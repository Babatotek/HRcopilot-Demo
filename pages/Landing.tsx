import React, { useState, useMemo } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Play, Check, Plus, Minus, MapPin, 
  Facebook, Twitter, Linkedin, Instagram, 
  Briefcase, Users, BookOpen, TrendingUp, 
  Globe, MessageSquare, Quote, Menu, X, Shield, Zap, Database
} from 'lucide-react';
import { BrandSettings } from '../types';

interface LandingProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onViewApp: (role: 'executive' | 'employee') => void;
  brand: BrandSettings;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

// ── Module Summary Section ────────────────────────────────────────────────────
const MODULES_DATA = [
  // Core HR
  { category: 'Core HR', module: 'Executive Dashboard', description: 'Real-time command center for leadership', features: 'KPI cards, headcount trends, payroll charts, hiring funnel, top performers', benefit: 'CEOs see the full health of the business in one screen — no chasing reports', isAI: false },
  { category: 'Core HR', module: 'Employee Dashboard', description: 'Personal portal for every staff member', features: 'Payslips, attendance history, leave balance, performance score, approvals queue', benefit: 'Employees are self-sufficient — reduces HR query volume by up to 60%', isAI: false },
  { category: 'Core HR', module: 'Employee Directory', description: 'Central record of every person in the organization', features: 'Digital profiles, employment type, department, salary band, documents', benefit: 'Single source of truth — eliminates duplicate records and inconsistencies', isAI: false },
  { category: 'Core HR', module: 'Role Management', description: 'Controls who sees and does what across the platform', features: 'Role creation, permission assignment, access matrix, department restrictions', benefit: 'Prevents unauthorized access to sensitive payroll and financial data', isAI: false },
  { category: 'Core HR', module: 'Branch Management', description: 'Manages multi-location operations from one dashboard', features: 'Branch creation, staff assignment, branch-level reporting, location analytics', benefit: 'Multiple offices managed centrally — no confusion across locations', isAI: false },
  // Payroll
  { category: 'Payroll', module: 'Payroll Engine', description: 'Automates the full payroll cycle end-to-end', features: 'Gross/net calculation, overtime, bonuses, multi-currency (₦, $, £, €)', benefit: 'Eliminates 3-day manual payroll runs — processes in under 20 minutes', isAI: false },
  { category: 'Payroll', module: 'Statutory Compliance', description: 'Handles all Nigerian and international tax obligations automatically', features: 'PAYE, PENCOM, NSITF, ITF, NHF auto-calculation and deduction', benefit: 'Zero compliance errors — always audit-ready, no penalties', isAI: false },
  { category: 'Payroll', module: 'Payslip Generation', description: 'Creates and distributes professional payslips', features: 'Digital payslip per employee, downloadable PDF, full deduction breakdown', benefit: 'Employees trust their pay — disputes drop dramatically', isAI: false },
  { category: 'Payroll', module: 'Payroll Trend Analytics', description: 'Tracks payroll costs over time', features: 'Monthly gross vs. net charts, YTD totals, department cost breakdown', benefit: 'Finance teams spot cost anomalies before they become problems', isAI: false },
  // Attendance
  { category: 'Attendance', module: 'Attendance Management', description: 'Tracks who is present, late, or absent in real time', features: 'Live dashboard, clock-in/out logs, late arrival flags, absenteeism trends', benefit: 'Managers know exactly who is at work at any moment', isAI: false },
  { category: 'Attendance', module: 'Geofence Map', description: 'Enforces location-based attendance', features: 'GPS boundary per branch, out-of-zone alerts, map visualization', benefit: 'Eliminates buddy punching and remote clock-in fraud entirely', isAI: false },
  { category: 'Attendance', module: 'Leave Management', description: 'Manages all leave types and approval workflows', features: 'Annual, sick, casual, maternity leave; approval flow; balance tracking; calendar', benefit: 'Leave managed fairly and transparently — no more WhatsApp leave requests', isAI: false },
  // Performance
  { category: 'Performance', module: 'Performance Management', description: 'Runs continuous performance review cycles', features: 'Evaluation forms, scoring, manager reviews, performance trends, cycle management', benefit: 'Replaces annual reviews with ongoing feedback — staff improve faster', isAI: false },
  { category: 'Performance', module: 'Goals & OKRs', description: 'Aligns individual goals with company strategy', features: 'Objective creation, key result tracking, weighted progress, AI-suggested KRs', benefit: "Every employee's work connects to company targets — strategy becomes execution", isAI: true },
  { category: 'Performance', module: 'Talent Management', description: 'Manages the full recruitment and onboarding pipeline', features: 'Job openings, applicant tracking, candidate scoring, interview stages, onboarding', benefit: 'Reduces time-to-hire and ensures new hires are productive from day one', isAI: false },
  { category: 'Performance', module: 'Engagement Dashboard', description: 'Measures and drives employee morale and culture', features: 'Recognition feed, kudos points, rewards redemption, polls, milestone tracking', benefit: 'High engagement reduces turnover — strong recognition programs retain 31% more staff', isAI: false },
  // Finance
  { category: 'Finance', module: 'Accounting & Finance', description: 'Full double-entry accounting suite', features: 'General ledger, chart of accounts, journal entries, trial balance, GL reports', benefit: 'Replaces standalone accounting software — HR and finance data always in sync', isAI: false },
  { category: 'Finance', module: 'Cash Flow & P&L', description: 'Tracks money in and money out', features: 'Cash flow dashboard, P&L overview, revenue vs. expense charts, period comparisons', benefit: 'Leadership sees financial health in real time — no waiting for month-end reports', isAI: false },
  { category: 'Finance', module: 'Financial Reporting', description: 'Generates statutory and management reports', features: 'Balance sheet, income statement, consolidation reports, tax reports', benefit: 'Audit-ready financials at any time — no scrambling at year-end', isAI: false },
  { category: 'Finance', module: 'Budgeting & Planning', description: 'Controls spending against approved budgets', features: 'Budget vs. actual tracking, department budgets, forecasts', benefit: 'Overspending is caught before it happens — not after', isAI: false },
  { category: 'Finance', module: 'Invoices & Receipts', description: 'Creates and tracks all company invoices', features: 'Invoice generation, line items, payment status, customer records', benefit: 'Professional invoicing improves cash collection speed and client perception', isAI: false },
  // Procurement
  { category: 'Procurement', module: 'Procurement Management', description: 'Controls all purchasing activity', features: 'Purchase requisitions, purchase orders, vendor management, approval workflows', benefit: 'Unauthorized spending eliminated — every purchase has a paper trail', isAI: false },
  { category: 'Procurement', module: 'AI Contract Extraction', description: 'Reads and summarizes vendor contracts using AI', features: 'Paste contract text → Gemini extracts key terms, obligations, and dates', benefit: 'Legal and procurement teams save hours reviewing contracts manually', isAI: true },
  { category: 'Procurement', module: 'Spend Analytics', description: 'Tracks procurement costs by category and department', features: 'Spend breakdown charts, PO status tracking, budget consumption', benefit: 'Identifies where the company is overspending before it becomes a problem', isAI: false },
  // CRM
  { category: 'CRM & Sales', module: 'Sales Intelligence', description: 'Gives sales teams a real-time view of their pipeline', features: 'Sales pipeline board, deal stages, leaderboard, activity feed, forecasting', benefit: 'Sales managers see exactly where every deal stands — no more guessing', isAI: false },
  { category: 'CRM & Sales', module: 'AI Deal Scoring', description: 'Uses Gemini AI to score the probability of closing each deal', features: 'One-click AI analysis → probability score + recommended next action', benefit: 'Sales teams focus on the right deals — conversion rates improve', isAI: true },
  { category: 'CRM & Sales', module: 'Relationship Management', description: 'Manages leads, contacts, and accounts', features: 'Lead tracking, contact profiles, account-based marketing targets', benefit: 'No lead falls through the cracks — every relationship is documented', isAI: false },
  { category: 'CRM & Sales', module: 'Support & Success', description: 'Manages post-sale customer relationships', features: 'Support tickets, SLA monitoring, customer health scores, knowledge base', benefit: 'Customer retention improves — issues resolved before clients churn', isAI: false },
  // Communication
  { category: 'Communication', module: 'Team Chat', description: 'Internal messaging platform for the whole organization', features: 'Real-time chat, channels, message history, file sharing, admin dashboard', benefit: 'Replaces WhatsApp for work — all communication is searchable and professional', isAI: false },
  { category: 'Communication', module: 'Memo System', description: 'Official internal communication and announcements', features: 'Create memos, assign recipients, read receipts, broadcast to departments', benefit: "Important announcements documented and confirmed received — no 'I didn't see it'", isAI: false },
  { category: 'Communication', module: 'Video Meetings', description: 'Built-in video conferencing for the team', features: 'Multi-participant video, in-meeting chat, file sharing, screen layout management', benefit: 'Teams meet without leaving the platform — no switching to Zoom or Teams', isAI: false },
  // AI & Intelligence
  { category: 'AI & Intelligence', module: 'AI Advisor', description: 'On-demand AI strategic advisor powered by Google Gemini', features: 'Role-aware responses, natural language queries, real-time data context', benefit: 'Every user gets expert-level guidance instantly — no consultant required', isAI: true },
  { category: 'AI & Intelligence', module: 'Leakage Intelligence', description: 'Detects where the organization is losing money', features: 'Cross-references HR, payroll, attendance, finance & procurement; industry benchmarking', benefit: 'Uncovers hidden financial losses — typically ₦5M–₦200M annually', isAI: true },
  { category: 'AI & Intelligence', module: 'Automation & Workflows', description: 'Automates repetitive HR processes', features: 'Onboarding tasks, leave routing, timesheet reminders, payroll cutoff alerts', benefit: 'HR team spends time on people, not paperwork — admin overhead drops by 40%', isAI: true },
  { category: 'AI & Intelligence', module: 'Smart Resume Screener', description: 'AI-ranks incoming job applications', features: 'Automatic scoring and ranking of candidates against job requirements', benefit: 'Recruiters review only the best candidates — hiring quality improves', isAI: true },
  { category: 'AI & Intelligence', module: 'Retention Risk Analysis', description: 'Identifies employees likely to leave', features: 'Analyzes HR data patterns to flag flight risks before they resign', benefit: 'Proactive retention saves the cost of replacing staff (50–200% of annual salary)', isAI: true },
  // Security
  { category: 'Security', module: 'Identity & Access', description: 'Controls who can access what across the entire platform', features: 'User provisioning, RBAC, risk scoring per user, device binding', benefit: 'Sensitive data protected — only authorized people see payroll and finance records', isAI: false },
  { category: 'Security', module: 'Security Monitoring', description: 'Detects suspicious activity in real time', features: 'Geo-spoof detection, device mismatch alerts, risk level badges, audit trail', benefit: 'Security threats caught immediately — not discovered after damage is done', isAI: false },
  // System
  { category: 'System', module: 'Virtual Cabinet', description: 'Digital document management system', features: 'File explorer, AI metadata extraction, cabinet categories, role-based access', benefit: 'Eliminates physical filing — every document is searchable and access-controlled', isAI: true },
  { category: 'System', module: 'Integrations Hub', description: 'Connects HRcopilot to external tools', features: 'Zoom, Slack, Teams, QuickBooks, Workday, DocuSign, Paycor, Greenhouse; open API', benefit: 'Existing tools keep working — HRcopilot becomes the hub that connects everything', isAI: false },
  { category: 'System', module: 'Brand Settings', description: 'Customizes the platform to match company identity', features: 'Logo upload, primary color, company name, theme configuration', benefit: "The platform feels like your company's own system — not generic software", isAI: false },
  { category: 'System', module: 'Currency Context', description: 'Manages multi-currency display across the platform', features: 'Real-time currency switching, exchange rate application, symbol formatting', benefit: 'International operations display figures in the correct local currency', isAI: false },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Core HR':          'bg-blue-100 text-blue-700',
  'Payroll':          'bg-emerald-100 text-emerald-700',
  'Attendance':       'bg-violet-100 text-violet-700',
  'Performance':      'bg-amber-100 text-amber-700',
  'Finance':          'bg-cyan-100 text-cyan-700',
  'Procurement':      'bg-orange-100 text-orange-700',
  'CRM & Sales':      'bg-rose-100 text-rose-700',
  'Communication':    'bg-indigo-100 text-indigo-700',
  'AI & Intelligence':'bg-purple-100 text-purple-700',
  'Security':         'bg-red-100 text-red-700',
  'System':           'bg-slate-100 text-slate-700',
};

const ModuleSummarySection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(MODULES_DATA.map(m => m.category)))], []);

  const filtered = useMemo(() => MODULES_DATA.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.module.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.benefit.toLowerCase().includes(q);
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    return matchSearch && matchCat;
  }), [search, activeCategory]);

  const aiCount = MODULES_DATA.filter(m => m.isAI).length;

  return (
    <section id="modules" className="py-20 md:py-32 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[2px] bg-[#0047cc]" />
            <span className="text-[#0047cc] font-bold text-[10px] tracking-[0.2em] uppercase">Platform Overview</span>
            <div className="w-8 h-[2px] bg-[#0047cc]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
            Every Module. Every Capability.
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed mb-8">
            {MODULES_DATA.length} modules and widgets — all working together in one unified platform. Search, filter, and explore everything HRcopilot can do for your organization.
          </p>
          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: `${MODULES_DATA.length} Total Modules`, color: 'bg-[#0047cc] text-white' },
              { label: `${aiCount} AI-Powered`, color: 'bg-purple-600 text-white' },
              { label: `${categories.length - 1} Categories`, color: 'bg-slate-800 text-white' },
              { label: '120+ Countries', color: 'bg-emerald-600 text-white' },
            ].map((p, i) => (
              <span key={i} className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${p.color}`}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-80 flex-shrink-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search modules or benefits..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 focus:border-[#0047cc] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0047cc] text-white shadow-md shadow-[#0047cc]/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#0047cc]/40 hover:text-[#0047cc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex-shrink-0">
            {filtered.length} of {MODULES_DATA.length}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left py-4 px-5 font-bold text-[10px] tracking-widest uppercase w-[22%]">Module</th>
                  <th className="text-left py-4 px-5 font-bold text-[10px] tracking-widest uppercase w-[22%]">What It Does</th>
                  <th className="text-left py-4 px-5 font-bold text-[10px] tracking-widest uppercase w-[30%]">Key Features</th>
                  <th className="text-left py-4 px-5 font-bold text-[10px] tracking-widest uppercase w-[26%]">Organizational Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-slate-400 text-sm">
                      No modules match your search. Try a different term or reset the filter.
                    </td>
                  </tr>
                ) : filtered.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-5 align-top">
                      <div className="font-bold text-slate-900 group-hover:text-[#0047cc] transition-colors">
                        {item.module}
                        {item.isAI && (
                          <span className="ml-2 inline-block bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide">AI</span>
                        )}
                      </div>
                      <span className={`mt-1.5 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? 'bg-slate-100 text-slate-600'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 align-top leading-relaxed">{item.description}</td>
                    <td className="py-4 px-5 text-slate-500 align-top leading-relaxed">{item.features}</td>
                    <td className="py-4 px-5 align-top bg-emerald-50/40 border-l-2 border-emerald-200">
                      <span className="text-emerald-600 font-bold mr-1">✓</span>
                      <span className="text-slate-700 leading-relaxed">{item.benefit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm mb-6">Ready to see all {MODULES_DATA.length} modules in action?</p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-[#0047cc] text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#0035a0] hover:shadow-lg hover:shadow-[#0047cc]/30 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Explore the Live Demo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin, onViewApp, brand }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);

  // ── Contact form — powered by Formspree ──────────────────────────────────
  const [formState, handleFormSubmit] = useForm('xvzdknvj');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isAnnual, setIsAnnual] = useState(false);

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const stats = [
    { icon: <Users className="w-5 h-5" />, label: 'EMPLOYEES MANAGED', value: '2.5M+', desc: 'Across global enterprises, trusting HRcopilot daily.' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'ADMIN TIME SAVED', value: '40%', desc: 'Automated workflows reduce manual HR overhead.' },
    { icon: <Globe className="w-5 h-5" />, label: 'COUNTRIES SUPPORTED', value: '120+', desc: 'Built-in localization and global compliance.' },
    { icon: <Shield className="w-5 h-5" />, label: 'PLATFORM UPTIME', value: '99.99%', desc: 'Enterprise-grade reliability and security.' },
  ];

  const workflow = [
    { num: '01', title: 'Unified Data Core', desc: 'Eliminate silos with a single source of truth for all your human capital data.' },
    { num: '02', title: 'Intelligent Automation', desc: 'Streamline onboarding, payroll, and performance reviews with AI-driven workflows.' },
    { num: '03', title: 'Actionable Analytics', desc: 'Make strategic decisions with real-time predictive insights and custom dashboards.' },
    { num: '04', title: 'Global Compliance', desc: 'Stay ahead of regulatory changes with automated local and international compliance tracking.' },
  ];

  const services = [
    { icon: <Database className="w-6 h-6" />, title: 'Core HR & Payroll', desc: 'Seamlessly manage employee records, benefits, and global payroll in one unified interface.' },
    { icon: <Briefcase className="w-6 h-6" />, title: 'Talent Acquisition', desc: 'Attract, track, and hire top-tier talent with our collaborative applicant tracking system.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Performance & OKRs', desc: 'Align individual goals with corporate strategy through continuous feedback and reviews.' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Learning & Development', desc: 'Upskill your workforce with personalized learning paths and certification tracking.' },
  ];

  const premierServices = [
    'Advanced Workforce Analytics',
    'Global Payroll Engine',
    'AI-Powered Recruitment',
    'Automated Compliance Tracking',
    'Employee Self-Service Portal'
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'CHIEF HR OFFICER AT TECHFLOW', quote: '"HRcopilot replaced 5 different disjointed systems. Our HR team is finally strategic rather than administrative. The ROI was apparent within months."', img: '/HRcopilot_Logo.png' },
    { name: 'Michael Chen', role: 'CIO AT GLOBALLOGISTICS', quote: '"Enterprise-grade security meets consumer-grade user experience. The implementation was seamless, and the analytics dashboard gives our C-suite unprecedented visibility."', img: '/HRcopilot_Logo.png' },
    { name: 'Elena Rodriguez', role: 'VP OF TALENT AT BLOOM CREATIVE', quote: '"The AI-powered recruitment and automated onboarding workflows have reduced our time-to-hire by 35%. HRcopilot is a fundamental game-changer."', img: '/HRcopilot_Logo.png' },
  ];

  const pricing = [
    { name: 'Growth', desc: 'For mid-market companies scaling their operations.', price: '70', unit: '/month', features: ['Core HR & Directory', 'Basic Payroll Integration', 'Time & Attendance', 'Standard Reporting', 'Email Support'], highlighted: false, cta: 'START FREE TRIAL', ctaHref: null },
    { name: 'Enterprise', desc: 'Comprehensive OS for large, complex organizations.', price: '130', unit: '/month', features: ['Everything in Growth', 'Advanced Analytics', 'Performance Management', 'Global Compliance', '24/7 Priority Support'], highlighted: true, cta: 'START FREE TRIAL', ctaHref: null },
    { name: 'Custom', desc: 'Tailored solutions for global multinationals.', price: 'Custom', unit: '', features: ['Everything in Enterprise', 'Custom Integrations', 'Dedicated Success Manager', 'On-Premise Options', 'SLA Guarantees'], highlighted: false, cta: 'CONTACT SALES', ctaHref: 'tel:+2347068110163' },
  ];

  const news = [
    { date: 'April 02, 2026', title: 'How AI is Reshaping Enterprise Talent Acquisition', img: '/HR360_bg.jpg', tag: 'PRODUCT' },
    { date: 'March 28, 2026', title: 'Navigating Global Compliance in a Remote-First World', img: '/HR360_bg.jpg', tag: 'COMPLIANCE' },
    { date: 'March 15, 2026', title: 'HRcopilot Named Leader in HCM Magic Quadrant', img: '/HR360_bg.jpg', tag: 'COMPANY' },
  ];

  const faqs = [
    { q: 'How does HRcopilot integrate with our existing ERP?', a: 'HRcopilot features a robust open API and pre-built connectors for major ERPs like SAP, Oracle, and Workday, ensuring seamless bidirectional data sync.' },
    { q: 'What is the typical implementation timeline?', a: 'Enterprise implementations typically range from 8 to 16 weeks, depending on the complexity of your legacy data migration and custom integration requirements.' },
    { q: 'Is HRcopilot compliant with GDPR and CCPA?', a: 'Yes. Security and privacy are foundational. HRcopilot is SOC 2 Type II certified, ISO 27001 compliant, and fully adheres to GDPR, CCPA, and other global data protection regulations.' },
    { q: 'Do you offer dedicated customer success managers?', a: 'All Enterprise and Custom tier customers are assigned a dedicated Customer Success Manager to guide implementation, training, and ongoing strategic optimization.' },
  ];

  const SectionLabel = ({ text, center = false }: { text: string, center?: boolean }) => (
    <div className={`flex items-center gap-4 mb-6 ${center ? 'justify-center' : ''}`}>
      {center && <div className="w-8 h-[2px] bg-[#0047cc]"></div>}
      <span className="text-[#0047cc] font-bold text-[10px] tracking-[0.2em] uppercase">{text}</span>
      <div className="w-8 h-[2px] bg-[#0047cc]"></div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white text-slate-900 font-sans selection:bg-[#0047cc] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:py-6 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <img src="/HRcopilot_Logo.png" alt="HRcopilot Logo" className="h-[50px] object-contain" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-widest uppercase text-slate-400">
            <a href="#home" className="hover:text-[#0047cc] transition-colors">HOME</a>
            <a href="#features" className="hover:text-[#0047cc] transition-colors">FEATURES</a>
            <a href="#modules" className="hover:text-[#0047cc] transition-colors">PLATFORM OVERVIEW</a>
            <a href="#pricing" className="hover:text-[#0047cc] transition-colors">PRICING</a>
            <a href="#contact" className="hover:text-[#0047cc] transition-colors">CONTACT</a>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button onClick={onLogin} className="text-slate-700 text-[11px] font-bold tracking-widest uppercase hover:text-[#0047cc] transition-colors">
              LOGIN
            </button>
            <button onClick={onGetStarted} className="relative overflow-hidden bg-gradient-to-r from-[#0047cc] to-[#0035a0] text-white px-6 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase hover:shadow-lg hover:shadow-[#0047cc]/30 transition-all group">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
              />
              <span className="relative z-10">Explore Demo</span>
            </button>
          </div>

          <button className="lg:hidden text-slate-900 p-2 -mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl py-6 px-6 flex flex-col gap-6 animate-in slide-in-from-top-2 z-[101] max-h-[80vh] overflow-y-auto overscroll-contain touch-pan-y">
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-[#0047cc] transition-colors">HOME</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-[#0047cc] transition-colors">FEATURES</a>
            <a href="#modules" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-[#0047cc] transition-colors">PLATFORM OVERVIEW</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-[#0047cc] transition-colors">PRICING</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-[#0047cc] transition-colors">CONTACT</a>
            <div className="h-px bg-slate-100 w-full my-2"></div>
            <button onClick={() => { setIsMenuOpen(false); onLogin(); }} className="text-slate-700 text-sm font-bold tracking-widest uppercase hover:text-[#0047cc] transition-colors text-left">
              LOGIN
            </button>
            <button onClick={() => { setIsMenuOpen(false); onGetStarted(); }} className="bg-[#0047cc] text-white px-6 py-4 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-blue-700 transition-all text-center w-full">
              GET STARTED
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative z-10 pt-24 md:pt-48 pb-16 md:pb-32 px-4 md:px-6 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/HRcopilot_bg.jpg"
            alt="HRcopilot Background"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white dark:from-[#0d0a1a]/50 dark:via-[#0d0a1a]/30 dark:to-[#0d0a1a]" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#e0f2fe]0 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-white/60 italic">Human Resources Operating System</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400 fill-mode-both"
          >
            <span className="block text-slate-900 dark:text-white mb-0">DRIVE YOUR VISION</span>
            <span className="block text-slate-500 dark:text-slate-400 italic lowercase text-2xl sm:text-3xl md:text-5xl mb-2">with</span>
            <span className="gradient-text-live italic">PRECISION.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-base md:text-lg lg:text-xl font-medium leading-relaxed mb-8 md:mb-12"
          >
            Empower your workforce with HRcopilot's most advanced HR operating system. Provision identities, automate compliance, and unlock predictive intelligence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* âœ¨ Glittering Explore Demo button */}
            <motion.button
              id="explore-btn"
              onClick={onGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full sm:w-auto px-10 py-5 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] overflow-hidden shadow-2xl shadow-[#eff6ff]0/30 group"
              style={{ background: 'linear-gradient(135deg, #0047cc, #0035a0, #1d4ed8)' }}
            >
              {/* Shimmer sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
              />
              {/* Sparkle dots */}
              {[
                { top: '20%', left: '12%', delay: 0 },
                { top: '60%', left: '80%', delay: 0.4 },
                { top: '30%', left: '70%', delay: 0.8 },
                { top: '70%', left: '25%', delay: 1.2 },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{ top: s.top, left: s.left }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
                />
              ))}
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Demo
              </span>
            </motion.button>

            <button
              onClick={() => setShowRolePicker(true)}
              className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm"
            >
              View Application
            </button>
          </motion.div>
        </div>

        {/* ── Role Picker Modal ─────────────────────────────────────────── */}
        {showRolePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowRolePicker(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#0047cc] mb-1">No login required</p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Choose Your View</h2>
                  </div>
                  <button onClick={() => setShowRolePicker(false)} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-400 mt-2">Explore the full application interface. Switch views anytime from inside the app.</p>
              </div>

              {/* Role cards */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Executive */}
                <button
                  onClick={() => { setShowRolePicker(false); onViewApp('executive'); }}
                  className="group relative p-6 rounded-2xl border-2 border-slate-100 hover:border-[#0047cc] bg-white hover:bg-[#f0f5ff] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047cc] to-[#0035a0] flex items-center justify-center text-white text-2xl mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    👔
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Executive View</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Full dashboard — payroll, attendance, finance, procurement, CRM & more.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-[#0047cc] uppercase tracking-widest">
                    Enter <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Employee */}
                <button
                  onClick={() => { setShowRolePicker(false); onViewApp('employee'); }}
                  className="group relative p-6 rounded-2xl border-2 border-slate-100 hover:border-[#0047cc] bg-white hover:bg-[#f0f5ff] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047cc] to-[#1d4ed8] flex items-center justify-center text-white text-2xl mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    🧑‍💼
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Employee View</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Personal portal — my payslips, attendance, leave, performance & approvals.</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-[#0047cc] uppercase tracking-widest">
                    Enter <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              <div className="px-6 pb-6 text-center">
                <p className="text-[10px] text-slate-300 uppercase tracking-widest">You can start the guided demo anytime from inside the app</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Marquee â€” pinned to hero bottom, always in viewport */}
        <div className="absolute bottom-0 left-0 right-0 text-white py-4 overflow-hidden flex whitespace-nowrap z-30" style={{ background: "linear-gradient(90deg, #0d1f3c, #0a3060, #0d1f3c)" }}>
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
            className="flex items-center gap-8 text-[11px] font-black tracking-widest uppercase"
          >
            {['UNIFIED PLATFORM','ENTERPRISE GRADE','AI-DRIVEN INSIGHTS','SEAMLESS INTEGRATION','GLOBAL COMPLIANCE','BIOMETRIC ATTENDANCE','AUTOMATED PAYROLL','REAL-TIME ANALYTICS','UNIFIED PLATFORM','ENTERPRISE GRADE','AI-DRIVEN INSIGHTS','SEAMLESS INTEGRATION','GLOBAL COMPLIANCE'].map((label, i) => (
              <React.Fragment key={i}>
                <span>{label}</span>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#0047cc" }} />
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0047cc] rounded flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-900">{stat.label}</span>
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">{stat.value}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video / About Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionLabel text="DISCOVER HRcopilot" center />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Built for Scale: The Platform Powering Modern Enterprises
            </h2>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-video bg-slate-200 rounded-[2rem] overflow-hidden mb-12 group cursor-pointer">
            <img src="/HRcopilot_bg.jpg" alt="Dashboard Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#0047cc] rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-500 italic text-sm max-w-xl">
              "Our architecture is designed to handle the complexities of global workforces, providing consumer-grade experiences with enterprise-grade security and reliability."
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-[#0047cc] to-[#1d4ed8] flex items-center justify-center text-white font-bold text-sm">
                    {i}
                  </div>
                ))}
              </div>
              <button className="text-xs font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2 hover:text-[#0047cc] transition-colors">
                MEET OUR CUSTOMERS <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="features" className="py-20 md:py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <SectionLabel text="PLATFORM ARCHITECTURE" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              How HRcopilot Transforms Operations
            </h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Our unified architecture ensures data flows seamlessly across all modules, eliminating silos and empowering strategic decision-making from the C-suite to the frontline.
            </p>
            <button className="bg-[#0a0a0a] text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#0047cc] hover:shadow-lg hover:shadow-[#0047cc]/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2">
              VIEW ARCHITECTURE <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-12">
            {workflow.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-[#0047cc] text-white flex items-center justify-center font-bold shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 px-6 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <SectionLabel text="ENTERPRISE MODULES" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              A Complete Ecosystem For Your Workforce
            </h2>
            <p className="text-white/60 mb-10 leading-relaxed">
              From hire to retire, HRcopilot provides specialized modules that work together flawlessly within a single unified platform.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-semibold">
                <div className="w-5 h-5 rounded-full border border-[#0047cc] flex items-center justify-center text-[#0047cc]">
                  <Check className="w-3 h-3" />
                </div>
                SOC 2 Type II Certified Security
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold">
                <div className="w-5 h-5 rounded-full border border-[#0047cc] flex items-center justify-center text-[#0047cc]">
                  <Check className="w-3 h-3" />
                </div>
                Open API & Pre-built Integrations
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <div key={i} className="border border-white/10 bg-white/5 p-8 rounded-xl hover:border-[#0047cc]/50 transition-colors">
                <div className="text-[#0047cc] mb-6">{service.icon}</div>
                <h3 className="text-lg font-bold mb-4">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Module Summary Section ─────────────────────────────────────── */}
      <ModuleSummarySection onGetStarted={onGetStarted} />

      {/* FAQ */}
      <section className="py-20 md:py-32 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="COMMON QUESTIONS" center />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className={`font-bold ${activeFaq === i ? 'text-[#0047cc]' : 'text-slate-900'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeFaq === i ? 'bg-[#0047cc] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {activeFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                {activeFaq === i && (
                  <div className="px-8 pb-6 text-slate-500 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Contact */}
      <section id="contact" className="py-20 md:py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="w-full h-[400px] bg-slate-200 rounded-3xl mb-20 relative overflow-hidden">
            <img src="/HRcopilot_bg.jpg" alt="Map" className="w-full h-full object-cover opacity-50 grayscale" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-[#0047cc] rounded-full flex items-center justify-center text-white shadow-xl mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl text-center min-w-[250px]">
                <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mb-2">GLOBAL HQ:</p>
                <p className="text-sm font-semibold text-slate-900 mb-4">Hillcrest Mall, Ahmadu Bello Way, Lokogoma Crecient, Abuja, Nigeria</p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mb-2">ENTERPRISE SALES:</p>
                <p className="text-sm font-semibold text-slate-900">HRcopilot-OS</p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel text="REQUEST A DEMO" center />
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Ready To Transform Your HR?
              </h2>
            </div>

            {formState.succeeded ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Received!</h3>
                <p className="text-slate-500 text-sm max-w-sm">Thanks for reaching out. Our team will be in touch within one business day.</p>
              </div>
            ) : (
            <form className="space-y-8" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">YOUR NAME</label>
                  <input required type="text" name="name" placeholder="John Doe" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-[#0047cc] transition-colors text-slate-900" />
                  <ValidationError field="name" errors={formState.errors} className="text-rose-500 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">WORK EMAIL</label>
                  <input required type="email" name="email" placeholder="john@company.com" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-[#0047cc] transition-colors text-slate-900" />
                  <ValidationError field="email" errors={formState.errors} className="text-rose-500 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">COMPANY NAME</label>
                  <input required type="text" name="company" placeholder="Acme Corp" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-[#0047cc] transition-colors text-slate-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">COMPANY SIZE</label>
                  <select name="size" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-[#0047cc] transition-colors text-slate-900 appearance-none">
                    <option>100 - 499 Employees</option>
                    <option>500 - 999 Employees</option>
                    <option>1000 - 4999 Employees</option>
                    <option>5000+ Employees</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">WHAT ARE YOUR MAIN HR CHALLENGES?</label>
                <textarea name="message" placeholder="Tell us about your current stack and goals..." rows={4} className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-[#0047cc] transition-colors text-slate-900 resize-none"></textarea>
                <ValidationError field="message" errors={formState.errors} className="text-rose-500 text-xs mt-1" />
              </div>

              {/* General form error */}
              <ValidationError errors={formState.errors} className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-medium" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={formState.submitting}
                  className="bg-[#0047cc] text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-[#0035a0] hover:shadow-lg hover:shadow-[#0047cc]/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {formState.submitting ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> SENDING…</>
                  ) : (
                    <>REQUEST DEMO <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/HRcopilot_Logo.png" alt="HRcopilot Logo" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                The unified human capital operating system built for global enterprises. Automate workflows, ensure compliance, and unlock insights.
              </p>
              <div className="flex items-center gap-4 text-white/50">
                <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Newsletter</h4>
              <p className="text-white/50 text-sm mb-4">Stay updated with the latest HR tech trends and platform updates.</p>
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 focus-within:border-[#0047cc]/50 transition-colors">
                <input type="email" placeholder="Your work email" className="bg-transparent border-none outline-none px-4 py-2 text-sm w-full text-white" />
                <button className="w-10 h-10 bg-[#0047cc] rounded-full flex items-center justify-center hover:bg-[#0035a0] hover:shadow-lg hover:shadow-[#0047cc]/30 active:scale-95 transition-all shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Core HR & Payroll</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Talent Acquisition</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Performance & OKRs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Workforce Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security & Compliance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-xs">
            <p>Â© 2026 Analytictosin Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;





import React, { useState } from 'react';
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
  brand: BrandSettings;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onLogin, brand }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    { icon: <Users className="w-5 h-5" />, label: 'EMPLOYEES MANAGED', value: '2.5M+', desc: 'Across global enterprises, trusting HR360 daily.' },
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
    { name: 'Sarah Johnson', role: 'CHIEF HR OFFICER AT TECHFLOW', quote: '"HR360 replaced 5 different disjointed systems. Our HR team is finally strategic rather than administrative. The ROI was apparent within months."', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Michael Chen', role: 'CIO AT GLOBALLOGISTICS', quote: '"Enterprise-grade security meets consumer-grade user experience. The implementation was seamless, and the analytics dashboard gives our C-suite unprecedented visibility."', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    { name: 'Elena Rodriguez', role: 'VP OF TALENT AT BLOOM CREATIVE', quote: '"The AI-powered recruitment and automated onboarding workflows have reduced our time-to-hire by 35%. HR360 is a fundamental game-changer."', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
  ];

  const pricing = [
    { name: 'Growth', desc: 'For mid-market companies scaling their operations.', price: '15.00', features: ['Core HR & Directory', 'Basic Payroll Integration', 'Time & Attendance', 'Standard Reporting', 'Email Support'], highlighted: false },
    { name: 'Enterprise', desc: 'Comprehensive OS for large, complex organizations.', price: '29.00', features: ['Everything in Growth', 'Advanced Analytics', 'Performance Management', 'Global Compliance', '24/7 Priority Support'], highlighted: true },
    { name: 'Custom', desc: 'Tailored solutions for global multinationals.', price: 'Custom', features: ['Everything in Enterprise', 'Custom Integrations', 'Dedicated Success Manager', 'On-Premise Options', 'SLA Guarantees'], highlighted: false },
  ];

  const news = [
    { date: 'April 02, 2026', title: 'How AI is Reshaping Enterprise Talent Acquisition', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800', tag: 'PRODUCT' },
    { date: 'March 28, 2026', title: 'Navigating Global Compliance in a Remote-First World', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', tag: 'COMPLIANCE' },
    { date: 'March 15, 2026', title: 'HR360 Named Leader in HCM Magic Quadrant', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800', tag: 'COMPANY' },
  ];

  const faqs = [
    { q: 'How does HR360 integrate with our existing ERP?', a: 'HR360 features a robust open API and pre-built connectors for major ERPs like SAP, Oracle, and Workday, ensuring seamless bidirectional data sync.' },
    { q: 'What is the typical implementation timeline?', a: 'Enterprise implementations typically range from 8 to 16 weeks, depending on the complexity of your legacy data migration and custom integration requirements.' },
    { q: 'Is HR360 compliant with GDPR and CCPA?', a: 'Yes. Security and privacy are foundational. HR360 is SOC 2 Type II certified, ISO 27001 compliant, and fully adheres to GDPR, CCPA, and other global data protection regulations.' },
    { q: 'Do you offer dedicated customer success managers?', a: 'All Enterprise and Custom tier customers are assigned a dedicated Customer Success Manager to guide implementation, training, and ongoing strategic optimization.' },
  ];

  const SectionLabel = ({ text, center = false }: { text: string, center?: boolean }) => (
    <div className={`flex items-center gap-4 mb-6 ${center ? 'justify-center' : ''}`}>
      {center && <div className="w-8 h-[2px] bg-blue-600"></div>}
      <span className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">{text}</span>
      <div className="w-8 h-[2px] bg-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:py-6 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center pt-1">
              <img src="/Analytictosin_Logo.png" alt="Analytictosin Logo" className="h-[28px] object-contain" />
            </div>
            <div className="font-black text-2xl tracking-tighter italic text-slate-900">HR360<span className="text-orange-500">.</span></div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-widest uppercase text-slate-400">
            <a href="#home" className="hover:text-blue-600 transition-colors">HOME</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">FEATURES</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">PRICING</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">CONTACT</a>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button onClick={onLogin} className="text-slate-700 text-[11px] font-bold tracking-widest uppercase hover:text-blue-600 transition-colors">
              LOGIN
            </button>
            <button onClick={onGetStarted} className="bg-[#0047cc] text-white px-6 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all">
              GET STARTED
            </button>
          </div>

          <button className="lg:hidden text-slate-900 p-2 -mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl py-6 px-6 flex flex-col gap-6 animate-in slide-in-from-top-2 z-[101] max-h-[80vh] overflow-y-auto overscroll-contain touch-pan-y">
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-blue-600 transition-colors">HOME</a>
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-blue-600 transition-colors">FEATURES</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-blue-600 transition-colors">PRICING</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase text-slate-900 hover:text-blue-600 transition-colors">CONTACT</a>
            <div className="h-px bg-slate-100 w-full my-2"></div>
            <button onClick={() => { setIsMenuOpen(false); onLogin(); }} className="text-slate-700 text-sm font-bold tracking-widest uppercase hover:text-blue-600 transition-colors text-left">
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
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000"
            alt="HR360 Background"
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
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-white/60 italic">Human Resources Operating System</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400 fill-mode-both"
          >
            <span className="block text-slate-900 dark:text-white mb-2">HUMAN CAPITAL</span>
            <span className="gradient-text-live italic">REIMAGINED.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-base md:text-lg lg:text-xl font-medium leading-relaxed mb-8 md:mb-12"
          >
            Empower your workforce with HR360's most advanced HR operating system. Provision identities, automate compliance, and unlock predictive intelligence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              id="explore-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-5 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-blue-500/30"
              style={{ backgroundColor: brand.primaryColor }}
            >
              Start Company Onboarding
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm"
            >
              Explore Solutions
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white">
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
            <SectionLabel text="DISCOVER HR360" center />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Built for Scale: The Platform Powering Modern Enterprises
            </h2>
          </div>

          <div className="relative w-full max-w-5xl mx-auto aspect-video bg-slate-200 rounded-[2rem] overflow-hidden mb-12 group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80" alt="Dashboard Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
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
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="Avatar" />
                ))}
              </div>
              <button className="text-xs font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2 hover:text-blue-600 transition-colors">
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
              How HR360 Transforms Operations
            </h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Our unified architecture ensures data flows seamlessly across all modules, eliminating silos and empowering strategic decision-making from the C-suite to the frontline.
            </p>
            <button className="bg-[#0a0a0a] text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2">
              VIEW ARCHITECTURE <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-12">
            {workflow.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
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
              From hire to retire, HR360 provides specialized modules that work together flawlessly within a single unified platform.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-semibold">
                <div className="w-5 h-5 rounded-full border border-blue-600 flex items-center justify-center text-blue-600">
                  <Check className="w-3 h-3" />
                </div>
                SOC 2 Type II Certified Security
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold">
                <div className="w-5 h-5 rounded-full border border-blue-600 flex items-center justify-center text-blue-600">
                  <Check className="w-3 h-3" />
                </div>
                Open API & Pre-built Integrations
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <div key={i} className="border border-white/10 bg-white/5 p-8 rounded-xl hover:border-blue-600/50 transition-colors">
                <div className="text-blue-600 mb-6">{service.icon}</div>
                <h3 className="text-lg font-bold mb-4">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-blue-600 text-white py-6 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-8 text-sm font-bold tracking-widest uppercase"
        >
          <span>UNIFIED PLATFORM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>ENTERPRISE GRADE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>AI-DRIVEN INSIGHTS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>SEAMLESS INTEGRATION</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>GLOBAL COMPLIANCE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          {/* Duplicate for seamless loop */}
          <span>UNIFIED PLATFORM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>ENTERPRISE GRADE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>AI-DRIVEN INSIGHTS</span>
        </motion.div>
      </div>

      {/* Premier Services List */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionLabel text="CORE CAPABILITIES" center />
          
          <div className="mt-16 flex flex-col">
            {premierServices.map((service, i) => (
              <div key={i} className="group border-b border-slate-200 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-slate-50 transition-colors px-4 -mx-4 rounded-lg">
                <div className="flex items-center gap-8">
                  <span className="text-slate-300 font-mono text-lg">0{i+1}</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{service}</h3>
                </div>
                <div className="flex items-center gap-8">
                  {i === 0 && (
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300" alt="Analytics Preview" className="w-32 h-20 object-cover rounded hidden md:block" />
                  )}
                  <button className="text-[10px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    EXPLORE FEATURE <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="SUCCESS STORIES" center />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Trusted by Enterprise Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl shadow-sm relative">
                <Quote className="absolute top-10 right-10 w-12 h-12 text-blue-50 opacity-50" />
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic relative z-10">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 px-6 relative bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Office" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="ENTERPRISE PRICING" center />
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
              Scalable Plans For Global Teams
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm font-semibold text-white">
              <span className={!isAnnual ? 'opacity-100' : 'opacity-50'}>Billed Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-7 rounded-full bg-blue-600 relative flex items-center px-1 shadow-inner transition-colors hover:bg-blue-500"
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
              <span className={isAnnual ? 'opacity-100' : 'opacity-50'}>Billed Annually</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {pricing.map((plan, i) => (
              <div key={i} className={`rounded-2xl p-10 ${plan.highlighted ? 'bg-blue-600 text-white scale-105 shadow-2xl' : 'bg-[#111]/80 backdrop-blur border border-white/10 text-white'}`}>
                <div className="mb-8">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded ${plan.highlighted ? 'bg-white/20' : 'bg-white/10'}`}>
                    {plan.name}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <p className={`text-sm mb-8 ${plan.highlighted ? 'text-white/80' : 'text-white/50'}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-2 mb-8">
                  {plan.price !== 'Custom' && <span className="text-2xl font-bold">$</span>}
                  <span className="text-6xl font-bold tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-white/50'}`}>/ User / Mo</span>}
                </div>
                <button className={`w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase mb-10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg ${plan.highlighted ? 'bg-white text-blue-600 hover:bg-slate-50 hover:shadow-white/20' : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-600/30'}`}>
                  {plan.price === 'Custom' ? 'CONTACT SALES' : 'START FREE TRIAL'} <ArrowRight className="w-4 h-4" />
                </button>
                <ul className="space-y-4">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${plan.highlighted ? 'border-white/30 text-white' : 'border-white/10 text-blue-500'}`}>
                        <Check className="w-2 h-2" />
                      </div>
                      <span className={plan.highlighted ? 'text-white/90' : 'text-white/70'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights / News */}
      <section className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel text="LATEST INSIGHTS" center />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              HR Tech Trends & News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded">
                    {item.tag}
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-3">{item.date}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <button className="text-xs font-bold tracking-widest uppercase text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  READ ARTICLE <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                  <span className={`font-bold ${activeFaq === i ? 'text-blue-600' : 'text-slate-900'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeFaq === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
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
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map" className="w-full h-full object-cover opacity-50 grayscale" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl text-center min-w-[250px]">
                <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mb-2">GLOBAL HQ:</p>
                <p className="text-sm font-semibold text-slate-900 mb-4">100 Innovation Drive, San Francisco, CA 94105, USA.</p>
                <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400 mb-2">ENTERPRISE SALES:</p>
                <p className="text-sm font-semibold text-slate-900">+1 800 HR360-OS</p>
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

            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">YOUR NAME</label>
                  <input type="text" placeholder="John Doe" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-blue-600 transition-colors text-slate-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">WORK EMAIL</label>
                  <input type="email" placeholder="john@company.com" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-blue-600 transition-colors text-slate-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">COMPANY NAME</label>
                  <input type="text" placeholder="Acme Corp" className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-blue-600 transition-colors text-slate-900" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">COMPANY SIZE</label>
                  <select className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-blue-600 transition-colors text-slate-900 appearance-none">
                    <option>100 - 499 Employees</option>
                    <option>500 - 999 Employees</option>
                    <option>1000 - 4999 Employees</option>
                    <option>5000+ Employees</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">WHAT ARE YOUR MAIN HR CHALLENGES?</label>
                <textarea placeholder="Tell us about your current stack and goals..." rows={4} className="w-full border-b border-slate-200 py-3 bg-transparent focus:outline-none focus:border-blue-600 transition-colors text-slate-900 resize-none"></textarea>
              </div>
              <div className="flex justify-end">
                <button type="button" className="bg-blue-600 text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2">
                  REQUEST DEMO <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/Analytictosin_Logo.png" alt="Analytictosin Logo" className="h-10 w-auto object-contain drop-shadow-md rounded-md bg-white p-1" />
                <div>
                  <div className="font-bold text-xl leading-none tracking-tight">Analytictosin.</div>
                  <div className="text-[8px] tracking-widest uppercase opacity-80">Enterprise HCM OS</div>
                </div>
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
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 focus-within:border-blue-500/50 transition-colors">
                <input type="email" placeholder="Your work email" className="bg-transparent border-none outline-none px-4 py-2 text-sm w-full text-white" />
                <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 transition-all shrink-0">
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
            <p>© 2026 Analytictosin Inc. All rights reserved.</p>
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

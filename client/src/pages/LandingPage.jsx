import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, ShieldCheck, CreditCard, Users, ArrowRight,
  CheckCircle, ChevronRight, HelpCircle, Phone, MapPin, Sparkles,
  BarChart3, Smartphone, BellRing, LogIn, UserPlus, Building2,
  Check, ExternalLink, Bot, Award, ChevronDown, ChevronUp,
  Megaphone, Pause, Play, FileText, Search, AlertCircle, Zap, TrendingUp, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/common/Spinner';

const MSP_RATES = [
  { name: 'Wheat (गेहूं)', rate: '₹2,275', season: 'Rabi' },
  { name: 'Paddy / Rice (धान)', rate: '₹2,183', season: 'Kharif' },
  { name: 'Mustard (सरसों)', rate: '₹5,650', season: 'Rabi' },
  { name: 'Chickpea / Gram (चना)', rate: '₹5,440', season: 'Rabi' },
  { name: 'Cotton (कपास)', rate: '₹7,020', season: 'Kharif' },
  { name: 'Maize (मक्का)', rate: '₹2,090', season: 'Kharif' },
];

const FAQS = [
  {
    q: 'How does Kisan Procurement Connect work for farmers?',
    a: 'Farmers can register in under 2 minutes, select their nearest procurement centre, choose an available date and time slot, and instantly receive an official Token number with an estimated queue turn time.'
  },
  {
    q: 'Do I still need to wait in long queues at the Mandi / Centre?',
    a: 'No! With our real-time queue tracker, you can monitor the live token being served from your mobile phone and arrive right on your turn, eliminating hours of crowded waiting.'
  },
  {
    q: 'How is the MSP payment processed?',
    a: 'Once your produce is weighed, graded, and verified by the Procurement Officer, payment is directly initialized via DBT (Direct Benefit Transfer) to your registered bank account with real-time status updates.'
  },
  {
    q: 'Can I book a slot without smartphone access?',
    a: 'Yes, slots can be booked through Common Service Centres (CSC), village panchayats, or family members using your Aadhaar/Farmer ID and verified mobile number.'
  },
  {
    q: 'What documents do I need to bring to the procurement centre?',
    a: 'Bring your physical or SMS digital Token slip, Government ID (Aadhaar or Voter ID), and bank passbook/account details matching your registration.'
  }
];

// Moving ticker notifications data (each is an active hyperlink)
const TICKER_NOTIFICATIONS = [
  {
    id: 'msp-2026',
    tag: 'MSP 2026-27',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    title: 'Wheat MSP officially announced at ₹2,275/Qtl & Mustard at ₹5,650/Qtl — Book your Mandi slot early',
    href: '#msp-rates',
    isNew: true,
  },
  {
    id: 'slot-open',
    tag: 'Mandi Booking Open',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    title: 'Punjab (Ludhiana Main, Amritsar, Patiala) centres open for online slot reservations',
    href: '/login',
    isNew: true,
  },
  {
    id: 'dbt-alert',
    tag: 'Direct DBT Transfer',
    tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    title: '100% MSP payout directly credited into linked bank accounts within 48 to 72 hours of weighment',
    href: '#features',
    isNew: false,
  },
  {
    id: 'krishi-ai',
    tag: 'Krishi AI Launch',
    tagColor: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
    title: 'Ask Agi / Krishi AI Assistant launched for 24/7 crop grading, price check & slot support',
    href: '/farmer/ai-assistant',
    isNew: true,
  },
  {
    id: 'live-queue',
    tag: 'Live Token Tracker',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    title: 'Monitor live queue position and counter calling from your mobile phone in real-time',
    href: '/login',
    isNew: false,
  },
  {
    id: 'registration-alert',
    tag: 'Farmer Registration',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    title: 'Self-register in under 2 minutes with mobile number & land verification to get digital Farmer ID',
    href: '/register',
    isNew: false,
  },
  {
    id: 'quality-norms',
    tag: 'Moisture Standards',
    tagColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    title: 'Standard moisture content ceiling set at max 12% for Grade-A Paddy — View FAQ quality guidelines',
    href: '#faq',
    isNew: false,
  },
  {
    id: 'helpline',
    tag: 'Toll-Free Helpline',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    title: '24/7 National Farmer Support Helpline active: 1800-180-1551 (Toll-Free call center)',
    href: 'tel:18001801551',
    isNew: false,
  }
];

// Highlighted Notices & Official Circulars Data
const HIGHLIGHTED_NOTICES = [
  {
    id: 1,
    title: 'Official Notification: Rabi Marketing Season 2026-27 MSP Schedule & Mandi Allocations',
    category: 'msp',
    categoryLabel: 'MSP & Rates',
    date: '10 Oct 2026',
    desc: 'Ministry circular detailing state-wise procurement calendar, designated grain centres in Punjab, Haryana, UP, and updated Minimum Support Price tables for Rabi crops.',
    badge: 'NEW',
    link: '#msp-rates',
    actionText: 'View MSP Rates Table'
  },
  {
    id: 2,
    title: 'Advance Slot Booking Open for Ludhiana, Amritsar & Patiala Mandis',
    category: 'slot',
    categoryLabel: 'Slot & Queue',
    date: '08 Oct 2026',
    desc: 'Registered farmers can select 1-hour entry windows across the upcoming 14 days to eliminate crowded mandi gate waiting lines and tractor gridlock.',
    badge: 'LIVE NOW',
    link: '/login',
    actionText: 'Book Slot Online'
  },
  {
    id: 3,
    title: 'Direct Benefit Transfer (DBT) Guidelines for Aadhaar & NPCI Linked Accounts',
    category: 'dbt',
    categoryLabel: 'DBT Payments',
    date: '05 Oct 2026',
    desc: 'Mandatory verification protocols ensuring instant PFMS direct credit into verified bank accounts within 48 to 72 hours of moisture and weight verification.',
    badge: 'IMPORTANT',
    link: '#features',
    actionText: 'Check DBT Process'
  },
  {
    id: 4,
    title: 'Automated Moisture & Refraction Quality Inspection Norms',
    category: 'quality',
    categoryLabel: 'Quality Norms',
    date: '02 Oct 2026',
    desc: 'Fair Average Quality (FAQ) standards approved for Grade-A Paddy and Cereal grains. Transparent digital sensor verification with zero arbitrary rejections.',
    badge: 'CIRCULAR',
    link: '#faq',
    actionText: 'Read FAQ Standards'
  },
  {
    id: 5,
    title: 'Launch of "Ask Agi" Krishi AI Assistant for 24/7 Farmer Inquiries',
    category: 'advisory',
    categoryLabel: 'Farmer Advisory',
    date: '28 Sep 2026',
    desc: 'Multilingual conversational AI powered by agricultural knowledge to assist with token lookup, mandi timings, disease diagnosis, and MSP calculations.',
    badge: 'FEATURE',
    link: '/farmer/ai-assistant',
    actionText: 'Chat with Krishi AI'
  },
  {
    id: 6,
    title: 'Instant Self-Registration with 5-Field Verification for New Farmers',
    category: 'advisory',
    categoryLabel: 'Farmer Advisory',
    date: '25 Sep 2026',
    desc: 'Simplified registration flow requiring only name, mobile number, state, district, and address to get started with instant digital token bookings.',
    badge: 'PORTAL',
    link: '/register',
    actionText: 'Register as Farmer'
  }
];

const LandingPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [activeNoticeTab, setActiveNoticeTab] = useState('all');
  const [noticeSearch, setNoticeSearch] = useState('');
  const [selectedNoticeModal, setSelectedNoticeModal] = useState(null);

  // If user is already authenticated, redirect to their role dashboard
  if (!loading && isAuthenticated && user) {
    const redirectMap = {
      farmer: '/farmer/dashboard',
      procurement_officer: '/officer/dashboard',
      quality_staff: '/officer/dashboard',
      data_staff: '/officer/dashboard',
      gate_staff: '/officer/dashboard',
      centre_head: '/officer/dashboard',
      district_officer: '/admin/dashboard',
      state_officer: '/admin/dashboard',
      central_admin: '/admin/dashboard',
      admin: '/admin/dashboard',
      officer: '/officer/dashboard',
    };
    const target = redirectMap[user.role] || '/farmer/dashboard';
    return <Navigate to={target} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredNotices = HIGHLIGHTED_NOTICES.filter((item) => {
    const matchesTab = activeNoticeTab === 'all' || item.category === activeNoticeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(noticeSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ── TOP TRICOLOR STRIP & GOVERNMENT IDENTIFIER ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
      <div className="bg-primary-950 text-primary-100 text-xs py-2 px-3 sm:px-4 border-b border-primary-900">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium tracking-wide">
              National Agricultural Digital Procurement Network • Ministry of Agriculture &amp; Farmers Welfare
            </span>
          </div>
          <div className="flex items-center gap-4 text-primary-300">
            <span>Toll-Free Helpline: <strong className="text-white font-mono">1800-180-1551</strong></span>
            <span className="hidden sm:inline text-primary-700">|</span>
            <Link
              to="/login"
              className="hover:text-white transition flex items-center gap-1 font-semibold text-emerald-300"
            >
              <LogIn className="w-3.5 h-3.5" /> Portal Login
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN STICKY NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary-700 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Wheat className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-950 flex items-center gap-1.5">
                Kisan Connect
                <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Govt of India
                </span>
              </span>
              <p className="text-xs text-gray-500 font-medium">Smart Mandi Slot &amp; Queue Management</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-gray-600">
            <a 
              href="#notices" 
              onClick={(e) => handleSmoothScroll(e, '#notices')}
              className="hover:text-primary-600 transition flex items-center gap-1.5 text-emerald-700 font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Updates &amp; Notices
            </a>
            <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, '#how-it-works')} className="hover:text-primary-600 transition">How It Works</a>
            <a href="#msp-rates" onClick={(e) => handleSmoothScroll(e, '#msp-rates')} className="hover:text-primary-600 transition">MSP Rates</a>
            <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="hover:text-primary-600 transition">Features</a>
            <a href="#faq" onClick={(e) => handleSmoothScroll(e, '#faq')} className="hover:text-primary-600 transition">FAQ</a>
            <Link to="/farmer/ai-assistant" className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold">
              <Bot className="w-4 h-4" /> Ask Agi
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              id="landing-nav-login-btn"
              className="px-4 sm:px-5 py-2.5 text-sm font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 hover:text-primary-700 rounded-xl transition-all border border-gray-200 flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <LogIn className="w-4 h-4 text-primary-600" />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              id="landing-nav-register-btn"
              className="px-4 sm:px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 rounded-xl shadow-md shadow-primary-600/25 transition-all transform active:scale-95 flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">Register / Book</span>
              <span className="sm:hidden">Register</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 🚀 CONTINUOUS MOVING TICKER OF IMPORTANT NOTIFICATIONS & HYPERLINKS ── */}
      <div 
        id="ticker-banner"
        className="w-full bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 text-white border-y border-emerald-800/50 py-2 sm:py-2.5 px-3 sm:px-6 shadow-md relative z-30"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          
          {/* Left Fixed Pill Badge with Pulsing Beacon */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Important Updates</span>
            <span className="xs:hidden">Updates</span>
          </div>

          {/* Scrolling Marquee Tape with Clickable Hyperlinks */}
          <div className="overflow-hidden relative flex-1">
            <div className={`animate-marquee flex items-center gap-8 sm:gap-12 text-xs sm:text-[13px] ${isTickerPaused ? 'animate-marquee-paused' : ''}`}>
              
              {/* Render items duplicated for seamless infinite loop */}
              {[...TICKER_NOTIFICATIONS, ...TICKER_NOTIFICATIONS].map((item, idx) => {
                const isAnchor = item.href.startsWith('#');
                return isAnchor ? (
                  <a
                    key={`${item.id}-${idx}`}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="group flex items-center gap-2 shrink-0 text-slate-200 hover:text-white transition cursor-pointer"
                    title={`Click to jump to: ${item.title}`}
                  >
                    <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold border tracking-wide ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="font-medium group-hover:underline underline-offset-2 text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </span>
                    {item.isNew && (
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase tracking-tighter">
                        NEW
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-slate-600 font-bold ml-2">•</span>
                  </a>
                ) : (
                  <Link
                    key={`${item.id}-${idx}`}
                    to={item.href}
                    className="group flex items-center gap-2 shrink-0 text-slate-200 hover:text-white transition cursor-pointer"
                    title={`Click to open: ${item.title}`}
                  >
                    <span className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold border tracking-wide ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="font-medium group-hover:underline underline-offset-2 text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </span>
                    {item.isNew && (
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase tracking-tighter">
                        NEW
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-slate-600 font-bold ml-2">•</span>
                  </Link>
                );
              })}

            </div>
          </div>

          {/* Right Action Controls (Pause / Resume + All Circulars Shortcut) */}
          <div className="flex items-center gap-2 shrink-0 pl-1">
            <button
              type="button"
              onClick={() => setIsTickerPaused(!isTickerPaused)}
              className="p-1 sm:p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition flex items-center justify-center cursor-pointer"
              title={isTickerPaused ? "Resume scrolling ticker" : "Pause scrolling ticker"}
              aria-label={isTickerPaused ? "Resume scrolling ticker" : "Pause scrolling ticker"}
            >
              {isTickerPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            <a
              href="#notices"
              onClick={(e) => handleSmoothScroll(e, '#notices')}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-white bg-emerald-900/60 hover:bg-emerald-800/80 px-2.5 py-1 rounded-md border border-emerald-700/50 transition whitespace-nowrap"
            >
              <span>View All</span>
              <ChevronDown className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-primary-50/60 via-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Official National Digital MSP Procurement Portal
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.15]">
              Smarter Mandi Slots.{' '}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Zero Waiting Lines.
              </span>{' '}
              Guaranteed MSP.
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Eliminate overcrowded mandis and endless queues. Book your scheduled procurement slot,
              track live token calling from your mobile, and receive direct MSP payments transparently into your bank account.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                id="hero-login-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                <LogIn className="w-5 h-5" />
                <span>Login to Portal</span>
              </Link>
              <Link
                to="/register"
                id="hero-register-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-900 border-2 border-primary-200 hover:border-primary-400 rounded-2xl font-bold shadow-xs transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                <UserPlus className="w-5 h-5 text-primary-600" />
                <span>New Farmer Registration</span>
              </Link>
            </div>

            {/* Quick Dual-Portal Selector Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Farmer Portal Card */}
              <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-md hover:shadow-lg transition-all relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Wheat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Farmer Portal</h3>
                      <p className="text-xs text-emerald-700 font-medium">Mobile Number &amp; OTP Login</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Farmers
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Book your procurement slot, view your unique queue token, inspect live queue status, and track DBT bank payment.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Instant Access via OTP</span>
                  <Link
                    to="/login"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Farmer Login <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Officer Portal Card */}
              <div className="p-5 rounded-2xl bg-white border-2 border-blue-200 shadow-md hover:shadow-lg transition-all relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Officer &amp; Staff Portal</h3>
                      <p className="text-xs text-blue-700 font-medium">Employee ID &amp; Password Login</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Mandi Officers
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                  Manage digital queue counters, verify arriving farmers, record weight &amp; moisture grading, and process DBT releases.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Centres, Districts &amp; Admins</span>
                  <Link
                    to="/login"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Officer Login <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-gray-200">
              <div className="p-3 bg-white/70 rounded-xl border border-gray-200/80">
                <p className="text-2xl sm:text-3xl font-extrabold text-primary-700">100%</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Direct Bank MSP Transfer</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-gray-200/80">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">Zero</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Overcrowding &amp; Queues</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-gray-200/80">
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">Live</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Real-Time Token Calling</p>
              </div>
              <div className="p-3 bg-white/70 rounded-xl border border-gray-200/80">
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">24/7</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Smart Slot Reservation</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── LIVE MSP RATES TICKER BANNER ── */}
      <section id="msp-rates" className="py-8 bg-gradient-to-r from-emerald-800 via-primary-900 to-teal-900 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-emerald-200">
                Official Government Minimum Support Price (MSP) Rates
              </h2>
            </div>
            <span className="text-xs text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
              Standardized Rate Per Quintal (100 Kg)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MSP_RATES.map((crop, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center">
                <p className="text-xs font-semibold text-emerald-100 truncate">{crop.name}</p>
                <p className="text-xl font-extrabold text-white mt-1 font-mono">{crop.rate}</p>
                <p className="text-[10px] text-emerald-300 uppercase tracking-wider mt-0.5">{crop.season} Season</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 📢 DEDICATED SECTION: IMPORTANT NOTIFICATIONS & HIGHLIGHTED CIRCULARS ── */}
      <section id="notices" className="py-16 sm:py-20 bg-slate-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
                Official Announcements &amp; Circulars
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Important Notifications &amp; Highlighted Updates
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Stay updated with official MSP calendar dates, advance slot booking window openings, moisture standards, and direct DBT transfer circulars.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search updates or topics..."
                value={noticeSearch}
                onChange={(e) => setNoticeSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            {[
              { id: 'all', label: `All Updates (${HIGHLIGHTED_NOTICES.length})` },
              { id: 'msp', label: 'MSP & Rates' },
              { id: 'slot', label: 'Slot & Queue' },
              { id: 'dbt', label: 'DBT Payments' },
              { id: 'quality', label: 'Quality Norms' },
              { id: 'advisory', label: 'Farmer Advisory' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveNoticeTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeNoticeTab === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid of Highlighted Notice Cards (Every Item is an Interactive Hyperlink) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const isAnchor = notice.link.startsWith('#');
                return (
                  <div
                    key={notice.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200/90 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {notice.categoryLabel}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-500 font-medium">
                            {notice.date}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                            notice.badge === 'NEW' 
                              ? 'bg-emerald-600 text-white animate-pulse' 
                              : notice.badge === 'LIVE NOW'
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {notice.badge}
                          </span>
                        </div>
                      </div>

                      {/* Title (Hyperlink) */}
                      {isAnchor ? (
                        <a
                          href={notice.link}
                          onClick={(e) => handleSmoothScroll(e, notice.link)}
                          className="font-bold text-gray-900 group-hover:text-emerald-700 text-sm sm:text-base leading-snug line-clamp-2 transition-colors block mb-2"
                        >
                          {notice.title}
                        </a>
                      ) : (
                        <Link
                          to={notice.link}
                          className="font-bold text-gray-900 group-hover:text-emerald-700 text-sm sm:text-base leading-snug line-clamp-2 transition-colors block mb-2"
                        >
                          {notice.title}
                        </Link>
                      )}

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {notice.desc}
                      </p>
                    </div>

                    {/* Bottom Action Hyperlink */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      {isAnchor ? (
                        <a
                          href={notice.link}
                          onClick={(e) => handleSmoothScroll(e, notice.link)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          <span>{notice.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          to={notice.link}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          <span>{notice.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedNoticeModal(notice)}
                        className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 transition cursor-pointer"
                      >
                        Read Circular
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">No matching circulars or updates found</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting the search keyword or filter category.</p>
                <button
                  type="button"
                  onClick={() => { setNoticeSearch(''); setActiveNoticeTab('all'); }}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Quick Notice Action Banner */}
          <div className="mt-8 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 hidden sm:flex">
                <Bot className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">Have Questions About Mandi Circulars &amp; MSP Rates?</h3>
                <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
                  Our official AI Assistant &amp; Call Center are active 24/7 to help you navigate bookings and payments.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/farmer/ai-assistant"
                className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ask Krishi AI</span>
              </Link>
              <a
                href="tel:18001801551"
                className="px-4 py-2 bg-emerald-950/60 hover:bg-emerald-950 text-white border border-emerald-600/50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call 1800-180-1551</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS (4-STEP LIFECYCLE) ── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              Transparent 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              How Kisan Procurement Connect Works
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Designed for ease of use by every farmer, eliminating wait times and ensuring transparent payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Mandi / Centre',
                desc: 'Select your local procurement centre with active capacity and operating hours.',
                icon: MapPin,
                color: 'bg-emerald-600',
              },
              {
                step: '02',
                title: 'Select Crop & Quantity',
                desc: 'Choose your crop to see real-time MSP calculation and enter your produce quantity in quintals.',
                icon: Wheat,
                color: 'bg-primary-600',
              },
              {
                step: '03',
                title: 'Pick Date & Time Slot',
                desc: 'Select from available 1-hour time slots across the next 14 days to avoid crowded rushes.',
                icon: Calendar,
                color: 'bg-amber-600',
              },
              {
                step: '04',
                title: 'Token Slip & Direct Pay',
                desc: 'Receive your unique queue token. Track live turn calling and receive payment via direct bank transfer.',
                icon: CreditCard,
                color: 'bg-blue-600',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200/90 hover:shadow-md hover:border-primary-300 transition-all relative group"
              >
                <div className={`w-12 h-12 ${card.color} text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4 shadow-md`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-gray-300 group-hover:text-primary-400 transition-colors">
                  Step {card.step}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">{card.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Call to action within how it works */}
          <div className="mt-12 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 text-sm"
            >
              <span>Start Your Slot Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES GRID ── */}
      <section id="features" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Enterprise Grade Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              Built for Farmers, Mandi Officers &amp; State Administration
            </h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              A comprehensive procurement system reducing mandi wait times by up to 70%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Queue Token Calling',
                desc: 'No more waiting at crowded gates. Tokens are called automatically per counter with live status updates on your mobile.',
                icon: Smartphone,
              },
              {
                title: 'Direct Benefit Transfer (DBT)',
                desc: 'Integrated with PFMS and bank validation. Once quality is verified, MSP payment is initialized directly into your account.',
                icon: CreditCard,
              },
              {
                title: 'Multi-Role Governance Suite',
                desc: 'Granular permissions from gate staff, quality assessment, centre head to state nodal officers ensuring zero pilferage.',
                icon: ShieldCheck,
              },
              {
                title: 'Live Moisture & Quality Tracking',
                desc: 'Digital moisture testing recording with transparent MSP deductions or incentives conforming to government norms.',
                icon: Award,
              },
              {
                title: 'SMS & Regional Language Support',
                desc: 'Automatic SMS updates in Hindi, Punjabi, and English for token confirmations, gate entry notices, and payment receipts.',
                icon: BellRing,
              },
              {
                title: 'Procurement Slip PDF Generation',
                desc: 'Digitally signed official receipt with QR verification, weight breakdown, and officer credentials for complete peace of mind.',
                icon: FileText,
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200/90 hover:border-emerald-300 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl overflow-hidden transition-all bg-white hover:border-gray-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 px-6 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-bold text-gray-900 hover:text-primary-700 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 border-t border-gray-100 leading-relaxed animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-primary-700 via-emerald-700 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to Schedule Your Produce Procurement?
          </h2>
          <p className="mt-3 text-primary-100 text-sm sm:text-base max-w-xl mx-auto">
            Experience smooth, dignified, and guaranteed mandi procurement with Kisan Procurement Connect.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              id="footer-cta-login-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary-800 hover:bg-primary-50 rounded-xl font-bold shadow-lg transition-all active:scale-95 text-base flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Login to Portal</span>
            </Link>
            <Link
              to="/register"
              id="footer-cta-register-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary-900/40 hover:bg-primary-900/60 text-white border border-white/30 rounded-xl font-bold shadow-sm transition-all active:scale-95 text-base flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register as New Farmer</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── OFFICIAL FOOTER ── */}
      <footer className="bg-gray-950 text-gray-400 text-xs py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
                <Wheat className="w-5 h-5 text-emerald-400" />
                <span>Kisan Connect</span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                National Digital Agriculture Initiative ensuring guaranteed MSP, automated slot booking, and queue management.
              </p>
            </div>
            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Quick Links</p>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition">Login to Portal</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Farmer Registration</Link></li>
                <li><a href="#notices" onClick={(e) => handleSmoothScroll(e, '#notices')} className="hover:text-white transition">Latest Updates</a></li>
                <li><a href="#msp-rates" onClick={(e) => handleSmoothScroll(e, '#msp-rates')} className="hover:text-white transition">2026 MSP Rates</a></li>
                <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, '#how-it-works')} className="hover:text-white transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Portals</p>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition">Farmer Slot Booking</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Officer Counter Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Admin &amp; Analytics Dashboard</Link></li>
                <li><Link to="/login" className="hover:text-white transition">DBT Payment Tracking</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Government Helpline</p>
              <p className="text-gray-300 font-medium">Toll-Free Kisan Call Centre:</p>
              <p className="text-white font-bold font-mono text-base mt-1">1800-180-1551</p>
              <p className="text-gray-500 mt-2">Department of Agriculture &amp; Farmers Welfare, Krishi Bhawan, New Delhi.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500">
            <p>© {new Date().getFullYear()} Kisan Procurement Connect • Government of India. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-gray-300 transition">Privacy Policy</Link>
              <span>•</span>
              <Link to="/login" className="hover:text-gray-300 transition">Terms of Service</Link>
              <span>•</span>
              <Link to="/login" className="hover:text-gray-300 transition">Portal Login</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── DETAIL MODAL FOR CIRCULARS ── */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative">
            <button
              type="button"
              onClick={() => setSelectedNoticeModal(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {selectedNoticeModal.categoryLabel}
              </span>
              <span className="text-xs text-gray-500">
                {selectedNoticeModal.date}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3">
              {selectedNoticeModal.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {selectedNoticeModal.desc}
            </p>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              {selectedNoticeModal.link.startsWith('#') ? (
                <a
                  href={selectedNoticeModal.link}
                  onClick={(e) => {
                    handleSmoothScroll(e, selectedNoticeModal.link);
                    setSelectedNoticeModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>{selectedNoticeModal.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  to={selectedNoticeModal.link}
                  onClick={() => setSelectedNoticeModal(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <span>{selectedNoticeModal.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setSelectedNoticeModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Wheat, 
  ArrowRight, 
  BadgeCheck, 
  Users, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Clock, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Home, 
  Video, 
  Bot, 
  CheckCircle2,
  Menu,
  X,
  Phone,
  Lock,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import { extractError } from '../../utils/constants';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'pt', label: 'Português' },
];

const DEMO_CATEGORIES = [
  { id: 'farmer', label: '🌾 Farmer' },
  { id: 'admin', label: '👑 Admin & State' },
  { id: 'district', label: '🏢 District & Centre' },
  { id: 'staff', label: '📋 Mandi Staff' },
];

const DEMO_CREDENTIALS = {
  farmer: [
    { label: 'Farmer (Ram Singh)', mobile: '9751000001', otp: '123456', pwd: 'Farmer@123', sub: 'OTP: 123456 / Pass: Farmer@123', tag: 'Farmer' }
  ],
  admin: [
    { label: 'Central Admin', id: 'CPO-001', pwd: 'Admin@123', sub: 'Dr. Ramesh Kumar (Central Head)', tag: 'Central Admin' },
    { label: 'State Officer (Punjab)', id: 'SPO-PUN-001', pwd: 'Kisan@123', sub: 'Sardar Jaspreet Singh (Punjab)', tag: 'State Admin' },
    { label: 'State Officer (MP)', id: 'SPO-MP-001', pwd: 'Kisan@123', sub: 'Shri Dinesh Verma (Madhya Pradesh)', tag: 'State Admin' },
  ],
  district: [
    { label: 'District Officer (Ludhiana)', id: 'DNO-LDH-001', pwd: 'Kisan@123', sub: 'District Procurement Oversight', tag: 'District' },
    { label: 'Centre Head (Ludhiana)', id: 'PCH-LDH-001', pwd: 'Kisan@123', sub: 'Centre Operations Supervisor', tag: 'Centre Head' },
  ],
  staff: [
    { label: 'Procurement Officer', id: 'PO-LDH-001', pwd: 'Kisan@123', sub: 'Slot & Paddy Verification', tag: 'Officer' },
    { label: 'Quality Staff', id: 'QWS-LDH-001', pwd: 'Kisan@123', sub: 'Moisture & Quality Assessment', tag: 'QC Staff' },
    { label: 'Gate Staff', id: 'GVS-LDH-001', pwd: 'Kisan@123', sub: 'Vehicle Entry & Token Issuance', tag: 'Gate Staff' },
  ]
};

const LoginPage = () => {
  // Navigation tabs: 'login' | 'reset'
  const [activeTab, setActiveTab] = useState('login');
  // Persona type: 'farmer' (OTP/Password) | 'officer' (Password)
  const [loginMode, setLoginMode] = useState('farmer');
  const [farmerAuthType, setFarmerAuthType] = useState('otp'); // 'otp' | 'password'
  const [selectedLang, setSelectedLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form states
  const [form, setForm] = useState({ mobile: '', otp: '', employeeId: '', password: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentDemoOtp, setCurrentDemoOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDemoDrawer, setShowDemoDrawer] = useState(true);
  const [activeDemoCategory, setActiveDemoCategory] = useState('farmer');

  // Reset password states
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap = {
        farmer: '/farmer/dashboard',
        procurement_officer: '/officer/dashboard',
        quality_staff: '/officer/dashboard',
        data_staff: '/officer/dashboard',
        gate_staff: '/officer/gate-entry',
        centre_head: '/officer/dashboard',
        district_officer: '/admin/dashboard',
        state_officer: '/admin/dashboard',
        central_admin: '/admin/dashboard',
        admin: '/admin/dashboard',
        officer: '/officer/dashboard',
      };
      navigate(from || redirectMap[user.role] || '/farmer/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setErrors({ mobile: 'Enter a valid 10-digit Indian mobile number' });
      return;
    }
    setSendingOtp(true);
    setErrors({});
    try {
      const res = await authService.sendOtp({ mobile: form.mobile });
      setOtpSent(true);
      const demo = res.data?.data?.demoOtp;
      if (demo) {
        setCurrentDemoOtp(demo);
        setForm((prev) => ({ ...prev, otp: demo }));
      }
      toast.success(res.data?.message || `OTP dispatched to +91 ${form.mobile}`);
      setCountdown(res.data?.data?.resendCooldown || 60);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSendingOtp(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (loginMode === 'farmer') {
      if (!/^[6-9]\d{9}$/.test(form.mobile)) {
        errs.mobile = 'Enter a valid 10-digit Indian mobile number';
      }
      if (farmerAuthType === 'otp') {
        if (!form.otp.trim()) {
          errs.otp = 'Please enter the 6-digit OTP';
        } else if (!/^\d{6}$/.test(form.otp.trim())) {
          errs.otp = 'OTP must be exactly 6 digits';
        }
      } else {
        if (!form.password) {
          errs.password = 'Password is required for password login';
        }
      }
    } else {
      if (!form.employeeId.trim()) {
        errs.employeeId = 'Official Employee ID is required (e.g. CPO-001)';
      }
      if (!form.password) {
        errs.password = 'Password is required';
      }
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const credentials =
        loginMode === 'farmer'
          ? (farmerAuthType === 'otp'
              ? { mobile: form.mobile.trim(), otp: form.otp.trim() }
              : { mobile: form.mobile.trim(), password: form.password })
          : { employeeId: form.employeeId.toUpperCase().trim(), password: form.password };

      const loggedUser = await login(credentials);
      toast.success(`Welcome back, ${loggedUser.name ? loggedUser.name.split(' ')[0] : 'User'}!`);

      if (loggedUser.mustChangePassword) {
        toast('Please update your default password in Profile settings.', { icon: '🔐', duration: 5000 });
      }

      if (from) {
        navigate(from, { replace: true });
      } else {
        const redirectMap = {
          farmer: '/farmer/dashboard',
          procurement_officer: '/officer/dashboard',
          quality_staff: '/officer/dashboard',
          data_staff: '/officer/dashboard',
          gate_staff: '/officer/gate-entry',
          centre_head: '/officer/dashboard',
          district_officer: '/admin/dashboard',
          state_officer: '/admin/dashboard',
          central_admin: '/admin/dashboard',
        };
        navigate(redirectMap[loggedUser.role] || '/');
      }
    } catch (err) {
      toast.error(extractError(err));
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (credentials) => {
    setActiveTab('login');
    setErrors({});
    if (credentials.mobile) {
      setLoginMode('farmer');
      setFarmerAuthType('otp');
      setActiveDemoCategory('farmer');
      setForm({
        mobile: credentials.mobile,
        otp: credentials.otp || '123456',
        employeeId: '',
        password: credentials.pwd || 'Farmer@123'
      });
      setOtpSent(true);
      setCurrentDemoOtp(credentials.otp || '123456');
      toast.success(`Farmer credentials loaded (${credentials.mobile})`, { icon: '🌾' });
    } else {
      setLoginMode('officer');
      setForm({ mobile: '', otp: '', employeeId: credentials.id, password: credentials.pwd });
      toast.success(`Officer ID loaded: ${credentials.id}`, { icon: '🔑' });
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      toast.error('Please enter your mobile number or Employee ID');
      return;
    }
    setResetSubmitted(true);
    toast.success('Password reset instructions / OTP sent if account exists.');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col justify-between overflow-x-hidden">
      
      {/* ── 1. TOP RESPONSIVE DARK BAR (LANGUAGES + LOGIN | REGISTER) ── */}
      <header className="w-full bg-[#2c2d30] text-gray-200 text-xs sm:text-[13px] py-2 px-3 sm:px-6 md:px-8 border-b border-[#222]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          {/* Scrollable Language Selector on Mobile */}
          <div className="w-full sm:w-auto flex items-center gap-x-3 overflow-x-auto scrollbar-none whitespace-nowrap py-0.5 text-gray-300 font-normal">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`transition-colors shrink-0 hover:text-white ${
                  selectedLang === lang.code
                    ? 'text-[#5ca130] font-semibold underline underline-offset-4 decoration-2'
                    : 'text-gray-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Right Status Links */}
          <div className="flex items-center gap-2.5 text-xs text-gray-300 self-end sm:self-auto shrink-0">
            <button 
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-[#5ca130] font-semibold hover:underline"
            >
              Log In
            </button>
            <span className="text-gray-500">|</span>
            <Link to="/register" className="hover:text-white transition">
              Register
            </Link>
          </div>

        </div>
      </header>

      {/* ── 2. BRAND NAVIGATION BAR (RESPONSIVE WITH MOBILE HAMBURGER) ── */}
      <nav className="w-full bg-white border-b border-gray-200 py-3 px-3 sm:px-6 md:px-8 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo & Mascot Button */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-lime-600 flex items-center justify-center p-0.5 shadow-xs">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <Wheat className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-800 leading-none">
                  Kisan<span className="text-emerald-700">Connect</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
                  Digital Agriculture Portal
                </span>
              </div>
            </Link>

            {/* Mascot: "Ask Agi / Krishi AI" */}
            <Link
              to="/farmer/ai-assistant"
              className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-lime-50 hover:bg-lime-100 border border-lime-200 text-lime-900 transition"
              title="Click to chat with Krishi AI Assistant"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-slate-900 shadow-xs relative">
                <Bot className="w-3.5 h-3.5 text-white" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-800">
                <Sparkles className="w-3 h-3 text-lime-600" />
                <span>Ask Agi</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-x-5 text-sm font-medium text-slate-700">
            <Link to="/" className="flex items-center gap-1 hover:text-emerald-700 transition">
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home</span>
            </Link>
            <span className="hover:text-emerald-700 cursor-pointer flex items-center gap-1">
              Mandi Rates <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="hover:text-emerald-700 cursor-pointer flex items-center gap-1">
              About Us <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="hover:text-emerald-700 cursor-pointer flex items-center gap-1">
              How To... <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="hover:text-emerald-700 cursor-pointer flex items-center gap-1">
              Resources <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <span className="hover:text-emerald-700 cursor-pointer flex items-center gap-1">
              Impact <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <a
              href="tel:18001801551"
              className="text-[#4da622] font-bold hover:text-emerald-800 transition"
            >
              » Helpline
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/farmer/ai-assistant"
              className="xs:hidden p-2 rounded-lg bg-lime-50 text-emerald-700 border border-lime-200"
              title="Ask Agi AI"
            >
              <Bot className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-gray-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2.5 text-sm font-medium text-slate-700 animate-fade-in bg-white">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>Home</span>
            </Link>
            <Link to="/farmer/book-slot" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded hover:bg-gray-50">
              Mandi Rates &amp; Slot Booking
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="py-1.5 px-2 rounded hover:bg-gray-50">
              Farmer New Registration
            </Link>
            <Link to="/farmer/ai-assistant" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 py-1.5 px-2 rounded text-emerald-700 bg-lime-50 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Ask Agi / Krishi AI Assistant</span>
            </Link>
            <a href="tel:18001801551" className="py-1.5 px-2 text-[#4da622] font-bold">
              » Toll-Free Kisan Helpline (1800-180-1551)
            </a>
          </div>
        )}
      </nav>

      {/* ── 3. RESPONSIVE KEY STATS RIBBON (2x2 on Mobile, 4-col on Desktop) ── */}
      <section className="w-full bg-[#f6f8f6] border-b border-gray-200/90 py-3 px-3 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-[13px] text-slate-700 font-medium">
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#5ca130] shrink-0" />
            <span className="leading-tight"><strong className="text-slate-900 font-bold block sm:inline">12.5M+</strong> farmers connected</span>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#5ca130] shrink-0" />
            <span className="leading-tight"><strong className="text-slate-900 font-bold block sm:inline">840+</strong> mandis in 28 states</span>
          </div>

          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#5ca130] shrink-0" />
            <span className="leading-tight"><strong className="text-slate-900 font-bold block sm:inline">6,529+</strong> daily MSP trades</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#5ca130] shrink-0" />
            <span className="leading-tight"><strong className="text-slate-900 font-bold block sm:inline">12+</strong> languages supported</span>
          </div>

        </div>
      </section>

      {/* ── 4. MAIN RESPONSIVE FORM CARD CONTAINER ── */}
      <main className="flex-1 py-8 sm:py-12 md:py-14 px-3 sm:px-6 bg-white flex flex-col justify-center">
        <div className="w-full max-w-xl mx-auto">
          
          {/* TAB HEADERS: [ Log in ]  [ Create new account ]  [ Reset your password ] */}
          <div className="flex items-center gap-4 sm:gap-8 border-b border-gray-200 text-sm sm:text-base font-normal pb-1 mb-6 sm:mb-8 overflow-x-auto scrollbar-none whitespace-nowrap">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`pb-2 font-medium transition-colors relative shrink-0 ${
                activeTab === 'login'
                  ? 'text-[#5ca130] border-b-2 border-[#5ca130] font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log in
            </button>

            <Link
              to="/register"
              className="pb-2 text-slate-600 hover:text-[#5ca130] hover:underline transition-colors shrink-0"
            >
              Create new account
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab('reset')}
              className={`pb-2 transition-colors shrink-0 ${
                activeTab === 'reset'
                  ? 'text-[#5ca130] border-b-2 border-[#5ca130] font-semibold'
                  : 'text-slate-600 hover:text-[#5ca130] hover:underline'
              }`}
            >
              Reset your password
            </button>
          </div>

          {/* TAB CONTENT: 1. LOG IN */}
          {activeTab === 'login' && (
            <div className="w-full">
              
              {/* Persona Switcher Tabs (Farmer vs Mandi Officer) */}
              <div className="mb-5 sm:mb-6 p-1 bg-gray-100 rounded-xl grid grid-cols-2 gap-1 text-xs sm:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => { setLoginMode('farmer'); setErrors({}); }}
                  className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg transition ${
                    loginMode === 'farmer'
                      ? 'bg-[#5ca130] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wheat className="w-4 h-4" />
                  <span>Farmer Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setLoginMode('officer'); setErrors({}); }}
                  className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg transition ${
                    loginMode === 'officer'
                      ? 'bg-[#026cb6] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Officer &amp; Staff</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                {/* ── A) FARMER MODE (Mobile + OTP / Password) ── */}
                {loginMode === 'farmer' ? (
                  <div className="space-y-4">
                    
                    {/* Method Toggle: OTP vs Password */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                      <span>Login method for farmers:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setFarmerAuthType('otp'); setErrors({}); }}
                          className={`font-semibold underline-offset-2 ${
                            farmerAuthType === 'otp' ? 'text-emerald-700 underline font-bold' : 'hover:text-slate-800'
                          }`}
                        >
                          OTP Verification
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => { setFarmerAuthType('password'); setErrors({}); }}
                          className={`font-semibold underline-offset-2 ${
                            farmerAuthType === 'password' ? 'text-emerald-700 underline font-bold' : 'hover:text-slate-800'
                          }`}
                        >
                          Password
                        </button>
                      </div>
                    </div>

                    {/* Mobile Number Field with Get OTP Button */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-normal text-slate-700 mb-1">
                        Registered Mobile number <span className="text-red-500 font-bold">*</span>
                      </label>
                      
                      <div className="flex flex-col xs:flex-row gap-2">
                        <div className="relative flex-1">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-500 border-r border-gray-300 pr-2 pointer-events-none">
                            <span className="text-xs font-semibold text-slate-600">+91</span>
                          </div>
                          <input
                            id="mobile"
                            type="tel"
                            placeholder="9751000001"
                            value={form.mobile}
                            onChange={(e) => {
                              setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') });
                              setErrors({ ...errors, mobile: '' });
                            }}
                            maxLength={10}
                            inputMode="numeric"
                            autoComplete="tel"
                            className={`w-full bg-white border text-slate-900 placeholder-slate-400 rounded-md py-2.5 pl-14 pr-3 text-base sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition ${
                              errors.mobile ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>

                        {/* Send / Resend OTP button */}
                        {farmerAuthType === 'otp' && (
                          <button
                            type="button"
                            disabled={sendingOtp || countdown > 0 || !/^[6-9]\d{9}$/.test(form.mobile)}
                            onClick={handleSendOtp}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 border border-gray-300 disabled:border-gray-200 text-slate-700 disabled:text-gray-400 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
                          >
                            {sendingOtp ? (
                              <span className="animate-pulse">Sending...</span>
                            ) : countdown > 0 ? (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {countdown}s
                              </span>
                            ) : otpSent ? (
                              'Resend OTP'
                            ) : (
                              'Get OTP'
                            )}
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        Enter your 10-digit mobile number linked to your PM-Kisan / Aadhaar registration.
                      </p>
                      {errors.mobile && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{errors.mobile}</p>
                      )}
                    </div>

                    {/* Conditional: OTP Input */}
                    {farmerAuthType === 'otp' && (
                      <div className="space-y-2 pt-1">
                        <label htmlFor="otp" className="block text-sm font-normal text-slate-700">
                          Verification OTP <span className="text-red-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP (e.g. 123456)"
                            value={form.otp}
                            onChange={(e) => {
                              setForm({ ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) });
                              setErrors({ ...errors, otp: '' });
                            }}
                            maxLength={6}
                            inputMode="numeric"
                            className={`w-full bg-white border text-slate-900 placeholder-slate-400 rounded-md py-2.5 px-3 text-base sm:text-sm font-semibold tracking-widest focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition ${
                              errors.otp ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>

                        {/* Interactive Sandbox OTP Auto-Fill Badge */}
                        {currentDemoOtp && (
                          <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 p-2.5 rounded-md text-xs text-emerald-900">
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                              <span>Test OTP: <strong className="font-mono text-emerald-950 font-bold">{currentDemoOtp}</strong></span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setForm({ ...form, otp: currentDemoOtp });
                                setErrors({ ...errors, otp: '' });
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] transition shadow-xs"
                            >
                              Auto Fill
                            </button>
                          </div>
                        )}

                        <p className="text-xs text-slate-500">
                          Enter the 6-digit OTP received via SMS (or use test OTP <strong>123456</strong>).
                        </p>
                        {errors.otp && (
                          <p className="text-xs text-red-600 font-medium">{errors.otp}</p>
                        )}
                      </div>
                    )}

                    {/* Conditional: Farmer Password Input */}
                    {farmerAuthType === 'password' && (
                      <div className="space-y-1 pt-1">
                        <label htmlFor="farmerPassword" className="block text-sm font-normal text-slate-700">
                          Account Password <span className="text-red-500 font-bold">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="farmerPassword"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password (e.g. Farmer@123)"
                            value={form.password}
                            onChange={(e) => {
                              setForm({ ...form, password: e.target.value });
                              setErrors({ ...errors, password: '' });
                            }}
                            className={`w-full bg-white border text-slate-900 placeholder-slate-400 rounded-md py-2.5 pl-3 pr-10 text-base sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition ${
                              errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-red-600 font-medium">{errors.password}</p>
                        )}
                      </div>
                    )}

                  </div>
                ) : (
                  /* ── B) OFFICER & STAFF MODE (Employee ID + Password) ── */
                  <div className="space-y-4">
                    {/* Employee ID */}
                    <div>
                      <label htmlFor="employeeId" className="block text-sm font-normal text-slate-700 mb-1">
                        Username or Employee ID <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        id="employeeId"
                        type="text"
                        placeholder="e.g. CPO-001 or SPO-PUN-001"
                        value={form.employeeId}
                        onChange={(e) => {
                          setForm({ ...form, employeeId: e.target.value.toUpperCase() });
                          setErrors({ ...errors, employeeId: '' });
                        }}
                        autoComplete="username"
                        className={`w-full bg-white border text-slate-900 placeholder-slate-400 rounded-md py-2.5 px-3.5 text-base sm:text-sm uppercase focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition ${
                          errors.employeeId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Enter your official government Employee ID issued by administration.
                      </p>
                      {errors.employeeId && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{errors.employeeId}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-normal text-slate-700 mb-1">
                        Password <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your account password"
                          value={form.password}
                          onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                            setErrors({ ...errors, password: '' });
                          }}
                          autoComplete="current-password"
                          className={`w-full bg-white border text-slate-900 placeholder-slate-400 rounded-md py-2.5 pl-3.5 pr-10 text-base sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Enter your confidential portal password (default: Admin@123 or Kisan@123).
                      </p>
                      {errors.password && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{errors.password}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Blue Submit Action Button (Matching Screenshot) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto min-w-[120px] px-8 py-2.5 bg-[#026cb6] hover:bg-[#005599] active:bg-[#004480] text-white font-medium text-sm rounded-md shadow-xs transition-colors duration-150 inline-flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Log in</span>
                    )}
                  </button>
                </div>

              </form>

              {/* ── 1-CLICK INTERACTIVE DEMO PERSONAS TOOLBAR ── */}
              <div className="mt-8 border border-gray-200 rounded-xl bg-gray-50/80 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setShowDemoDrawer(!showDemoDrawer)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 bg-gray-100 border-b border-gray-200 hover:bg-gray-200/80 transition"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Interactive Demo Persona Quick-Fill (One-Click Testing)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <span>{showDemoDrawer ? 'Collapse' : 'Expand'}</span>
                    {showDemoDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {showDemoDrawer && (
                  <div className="p-3 sm:p-4 space-y-3">
                    {/* Category Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {DEMO_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveDemoCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                            activeDemoCategory === cat.id
                              ? 'bg-[#5ca130] text-white shadow-xs'
                              : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Persona Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {DEMO_CREDENTIALS[activeDemoCategory]?.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => fillDemo(item)}
                          className="text-left p-3 rounded-lg bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900 group-hover:text-emerald-800">
                                {item.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              ID: {item.mobile || item.id}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {item.sub}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 opacity-80 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-2">
                            Fill <ArrowRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB CONTENT: 2. RESET PASSWORD */}
          {activeTab === 'reset' && (
            <div className="w-full space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Reset Your Password / Recover Account</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Enter your registered mobile number or official Employee ID to receive reset instructions.
                </p>
              </div>

              {resetSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Request Processed Successfully</span>
                  </div>
                  <p>
                    Verification instructions have been dispatched for <strong>{resetIdentifier}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setResetSubmitted(false); setActiveTab('login'); }}
                    className="text-xs font-bold text-emerald-800 hover:underline pt-1 inline-block"
                  >
                    ← Return to Log in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="resetId" className="block text-sm font-normal text-slate-700 mb-1">
                      Registered Mobile or Employee ID <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="resetId"
                      type="text"
                      placeholder="e.g. 9751000001 or CPO-001"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-3.5 text-base sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      For farmers, an OTP will be dispatched to your phone. For staff, credentials can be reset by department admin.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#026cb6] hover:bg-[#005599] text-white font-medium text-sm rounded-md shadow-xs transition"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ── 5. RESPONSIVE "WITH THANKS TO OUR FINANCIAL PARTNERS" FOOTER ── */}
      <footer className="w-full bg-white border-t border-gray-200 py-8 sm:py-10 px-3 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Centered Heading */}
          <h2 className="text-center text-lg sm:text-2xl font-normal text-slate-800 tracking-tight">
            With thanks to our financial partners
          </h2>

          {/* Partner Badges Strip (Responsive grid: 2 on mobile, 3 on tablet, 6 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center opacity-90 hover:opacity-100 transition-opacity">
            
            {/* 1. European Commission */}
            <div className="flex flex-col items-center justify-center p-2 text-center group cursor-default">
              <div className="w-14 h-10 sm:w-16 sm:h-11 bg-[#003399] rounded flex items-center justify-center relative p-1 shadow-xs border border-blue-900/20">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="4" r="1.2" />
                  <circle cx="16" cy="5" r="1.2" />
                  <circle cx="19" cy="8" r="1.2" />
                  <circle cx="20" cy="12" r="1.2" />
                  <circle cx="19" cy="16" r="1.2" />
                  <circle cx="16" cy="19" r="1.2" />
                  <circle cx="12" cy="20" r="1.2" />
                  <circle cx="8" cy="19" r="1.2" />
                  <circle cx="5" cy="16" r="1.2" />
                  <circle cx="4" cy="12" r="1.2" />
                  <circle cx="5" cy="8" r="1.2" />
                  <circle cx="8" cy="5" r="1.2" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold text-slate-700 mt-1.5 leading-tight">
                European<br />Commission
              </span>
            </div>

            {/* 2. German Cooperation */}
            <div className="flex flex-col items-center justify-center p-2 text-center cursor-default">
              <div className="w-14 h-9 sm:w-16 sm:h-10 flex flex-col justify-center items-start pl-1">
                <div className="h-1.5 sm:h-2 w-12 sm:w-14 bg-black rounded-t-xs" />
                <div className="h-1.5 sm:h-2 w-12 sm:w-14 bg-[#dd0000]" />
                <div className="h-1.5 sm:h-2 w-12 sm:w-14 bg-[#ffce00] rounded-b-xs" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">
                german<br />cooperation
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-tighter">
                DEUTSCHE ZUSAMMENARBEIT
              </span>
            </div>

            {/* 3. Swiss Agency for Development (SDC) */}
            <div className="flex flex-col items-center justify-center p-2 text-center cursor-default">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#d52b1e] rounded flex items-center justify-center text-white shadow-xs">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  <div className="w-4 sm:w-5 h-1 sm:h-1.5 bg-white rounded-xs absolute" />
                  <div className="w-1 sm:w-1.5 h-4 sm:h-5 bg-white rounded-xs absolute" />
                </div>
              </div>
              <span className="text-[9px] font-semibold text-slate-700 mt-1.5 leading-tight">
                Swiss Agency for Development<br />and Cooperation SDC
              </span>
            </div>

            {/* 4. FAO */}
            <div className="flex flex-col items-center justify-center p-2 text-center cursor-default">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0072bc] flex items-center justify-center text-[#0072bc]">
                <Wheat className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[9px] font-semibold text-slate-700 mt-1 leading-tight">
                Food and Agriculture Organization<br />of the United Nations
              </span>
            </div>

            {/* 5. LED Liechtenstein */}
            <div className="flex flex-col items-center justify-center p-2 text-center cursor-default">
              <div className="w-11 h-9 sm:w-12 sm:h-10 border border-slate-300 rounded flex items-center justify-center text-emerald-800">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[#006699]" />
              </div>
              <span className="text-[9px] font-bold text-slate-800 mt-1 leading-tight">
                LED LIECHTENSTEIN<br />DEVELOPMENT SERVICE
              </span>
            </div>

            {/* 6. Enabel */}
            <div className="flex flex-col items-center justify-center p-2 text-center cursor-default">
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Enabel</span>
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 inline-block animate-pulse" />
              </div>
              <span className="text-[9px] text-slate-500 font-medium">
                Belgian Development Agency
              </span>
            </div>

          </div>

          {/* Bottom Copyright & Gov Strip */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>National Agricultural Digital Procurement Network • Ministry of Agriculture &amp; Farmers Welfare</span>
            </div>
            <span>© {new Date().getFullYear()} KisanConnect Portal. All rights reserved.</span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LoginPage;

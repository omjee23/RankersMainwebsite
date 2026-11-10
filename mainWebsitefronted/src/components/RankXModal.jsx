import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  MapPin,
  CheckCircle2,
  Printer,
  Calendar,
  Clock,
  AlertCircle,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  UserCheck,
  Mail,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { openCashfreeCheckout } from '../utils/cashfree';
import { DYNAMIC_CLASS_OPTIONS, ALL_CLASSES } from './RSATPaymentModal';

const ONLINE_CBT_CENTRE = {
  id: 'cbt-online',
  name: 'Rankers All-India Online CBT Exam Hall',
  address: 'Online CBT Examination Hall (Exam Link active in Student Dashboard)',
  city: 'Online'
};

export default function RankXModal({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onLogout,
  onRequireLogin,
  onLaunchOnlineExam,
  onOpenRankXDashboard
}) {
  const [step, setStep] = useState('FORM'); // 'FORM', 'PAYMENT', 'ADMIT_CARD'
  const [loading, setLoading] = useState(false);
  const [admitCard, setAdmitCard] = useState(null);
  const [selectedGateway] = useState('CASHFREE'); // Exclusive PG: Cashfree Payments PG v3
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING'
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [feeConfig, setFeeConfig] = useState(null);

  // Load Admin-configured fee structure
  useEffect(() => {
    if (isOpen) {
      api.getFeeConfig().then(res => {
        if (res && res.data) setFeeConfig(res.data);
      }).catch(err => console.warn('Could not fetch fee config in RankXModal:', err));
    }
  }, [isOpen]);

  const rankxFeeAmount = feeConfig?.rankxFee !== undefined ? feeConfig.rankxFee : 100;

  // Direct In-Modal Authentication state
  const [authMode, setAuthMode] = useState('SIGNIN'); // 'SIGNIN' or 'SIGNUP'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentName: user?.fullName || '',
    fatherName: '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    targetClass: '11th',
    stream: user?.targetStream || 'IIT_JEE',
    schoolName: '',
    examMode: 'ONLINE',
    centreId: ONLINE_CBT_CENTRE.id,
    centreName: ONLINE_CBT_CENTRE.name,
    centreAddress: ONLINE_CBT_CENTRE.address,
    city: 'Online'
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData(prev => ({
          ...prev,
          studentName: user.fullName || prev.studentName,
          mobile: user.mobile || prev.mobile,
          email: user.email || prev.email,
          stream: user.targetStream || prev.stream
        }));
        if (user.email) setAuthEmail(user.email);
      }

      // Check if student already has a registered RANKEX admit card
      api.getMyRankX().then(res => {
        if (res.data) {
          setAdmitCard(res.data);
          setStep('ADMIT_CARD');
        }
      }).catch(e => console.warn('getMyRankX error:', e));
    } else {
      setStep('FORM');
      setAuthError('');
      setLoading(false);
    }
  }, [isOpen, user]);

  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both registered email/mobile and password');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await api.studentRankXLogin({
        email: authEmail.trim(),
        password: authPassword.trim()
      });
      if (res.success && res.data?.user) {
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        setFormData(prev => ({
          ...prev,
          studentName: res.data.user.fullName || prev.studentName,
          email: res.data.user.email || authEmail.trim(),
          mobile: res.data.user.mobile || prev.mobile,
          stream: res.data.user.targetStream || prev.stream,
          targetClass: res.data.user.targetClass || prev.targetClass
        }));
        // If user already has an admit card or completed registration, offer dashboard
        if (res.data.registration) {
          setAdmitCard(res.data.registration);
          setStep('ADMIT_CARD');
          return;
        }
        setStep('PAYMENT');
      } else {
        setAuthError(res.message || 'Invalid email or password. Please try again or create an account.');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check network connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStudentSignup = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!formData.studentName.trim()) {
      setAuthError('Please enter student full name');
      return;
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await api.studentRankXSignup({
        fullName: formData.studentName.trim(),
        email: authEmail.trim(),
        mobile: formData.mobile.trim(),
        password: authPassword.trim(),
        targetStream: formData.stream,
        targetClass: formData.targetClass
      });
      if (res.success && res.data?.user) {
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        setFormData(prev => ({
          ...prev,
          studentName: res.data.user.fullName,
          email: res.data.user.email,
          mobile: res.data.user.mobile
        }));
        setStep('PAYMENT');
      } else {
        setAuthError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setAuthError(err.message || 'Registration request failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!isOpen) return null;

  // Stream change handler
  const handleStreamChange = (newStream) => {
    const classList = DYNAMIC_CLASS_OPTIONS[newStream] || ALL_CLASSES;
    setFormData(prev => ({
      ...prev,
      stream: newStream,
      targetClass: classList[0] || '11th'
    }));
  };

  // Step 1: Form Validation & Transition to Payment (For logged in user)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.studentName.trim()) {
      alert('Please enter student full name');
      return;
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    setStep('PAYMENT');
  };

  const handleProcessCashfreePayment = async () => {
    setLoading(true);
    try {
      const studentName = formData.studentName || user?.fullName || 'RANKEX Aspirant';
      const studentMobile = formData.mobile || user?.mobile || '';
      const studentEmail = formData.email || user?.email || authEmail || `${studentMobile}@student.rankerspath.in`;

      // 1. Create Cashfree PG v3 Order
      const orderRes = await api.createCashfreeOrder({
        amount: rankxFeeAmount,
        currency: 'INR',
        studentName,
        mobile: studentMobile,
        email: studentEmail,
        purpose: 'RANKEX_EXAM_FEE',
        customerNotes: {
          stream: formData.stream,
          targetClass: formData.targetClass,
          examMode: 'ONLINE',
          centre: ONLINE_CBT_CENTRE.name
        }
      });

      const paymentSessionId = orderRes.paymentSessionId || orderRes.payment_session_id;
      const orderId = orderRes.orderId || orderRes.order_id;

      if (!paymentSessionId) {
        throw new Error(orderRes.message || 'Failed to initialize Cashfree payment session');
      }

      // 2. Open Cashfree Checkout Modal
      const checkoutResult = await openCashfreeCheckout({
        paymentSessionId,
        redirectTarget: '_modal',
        returnUrl: `${window.location.origin}/payment-status?order_id={order_id}`
      });

      if (!checkoutResult || checkoutResult.cancelled) {
        setLoading(false);
        return;
      }

      // 3. Verify Cashfree Payment
      const verifyRes = await api.verifyCashfreePayment({
        orderId,
        paymentSessionId,
        orderAmount: rankxFeeAmount
      });

      // 4. Complete RANKEX registration with verified payment
      const res = await api.registerRankX({
        ...formData,
        examMode: 'ONLINE',
        centreId: ONLINE_CBT_CENTRE.id,
        centreName: ONLINE_CBT_CENTRE.name,
        centreAddress: ONLINE_CBT_CENTRE.address,
        paymentMode: 'CASHFREE',
        transactionId: verifyRes.data?.paymentId || orderId,
        orderId: orderId,
        gateway: 'CASHFREE'
      });

      setLoading(false);

      if (res.success && res.data) {
        setAdmitCard(res.data);
        setStep('ADMIT_CARD');
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (e) {
          // ignore
        }
      } else {
        alert(res.message || 'Registration recording failed.');
      }
    } catch (err) {
      console.error('Cashfree payment failed:', err);
      alert('Cashfree Payment failed: ' + (err.message || 'Please try again'));
      setLoading(false);
    }
  };

  // Step 2B: Instant Demo / Test Payment (For quick evaluation without actual banking)
  const handleInstantTestPayment = async (mode = 'UPI_TEST') => {
    setLoading(true);
    const fakeTxnId = `TXN_TEST_${Date.now()}`;

    try {
      const res = await api.registerRankX({
        ...formData,
        examMode: 'ONLINE',
        centreId: ONLINE_CBT_CENTRE.id,
        centreName: ONLINE_CBT_CENTRE.name,
        centreAddress: ONLINE_CBT_CENTRE.address,
        paymentMode: mode,
        transactionId: fakeTxnId,
        orderId: `order_test_${Date.now()}`
      });

      setLoading(false);

      if (res.success && res.data) {
        setAdmitCard(res.data);
        setStep('ADMIT_CARD');
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        alert(res.message || 'Registration failed');
      }
    } catch (e) {
      setLoading(false);
      alert('Registration error: ' + e.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navyCard p-5 sm:p-6 text-white flex items-center justify-between border-b border-brand-yellow/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-brand-yellow bg-white/10 px-2.5 py-0.5 rounded-full">
                  Scholarship Entrance Exam &bull; Online &amp; Offline
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                RANKEX 2027 Examination Registration
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* ======================================================== */}
          {/* STEP 1: AUTHENTICATION & CANDIDATE REGISTRATION          */}
          {/* ======================================================== */}
          {step === 'FORM' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Highlight Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold">
                    RANKEX 2027: Talent &amp; Excellence ka Mahasangram (160 Marks, 40 Qs, 1 Hr)
                  </p>
                  <p className="text-slate-600">
                    All-India <strong>Online CBT Scholarship Entrance Exam</strong> (Appear from Home via Smartphone / Laptop). Registration fee: <strong className="text-emerald-700">₹{rankxFeeAmount}</strong>.
                  </p>
                </div>
              </div>

              {/* USER ALREADY LOGGED IN */}
              {user ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Verified Student Session Card */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-emerald-900 font-semibold">
                        Logged in as: <strong className="font-bold text-slate-900">{user.fullName || formData.studentName}</strong> ({user.email || user.mobile})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('rp_rankx_token');
                        localStorage.removeItem('rp_rankx_user');
                        if (onLogout) onLogout();
                        else if (onLoginSuccess) onLoginSuccess(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      title="Logout from RANKEX"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Logout Account</span>
                    </button>
                  </div>

                  {/* Student Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Candidate name"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength="10"
                        placeholder="10-digit mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Target Stream & Class */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Stream *</label>
                      <select
                        value={formData.stream}
                        onChange={(e) => handleStreamChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      >
                        <option value="IIT_JEE">IIT-JEE (JEE Main &amp; Advanced)</option>
                        <option value="NEET">Pre-Medical (NEET-UG)</option>
                        <option value="FOUNDATION">Foundation (Class 9th &amp; 10th)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class *</label>
                      <select
                        value={formData.targetClass}
                        onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      >
                        {(DYNAMIC_CLASS_OPTIONS[formData.stream] || ALL_CLASSES).map(opt => (
                          <option key={opt} value={opt}>Class {opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Online CBT Exam Mode Badge */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-700 block">Exam Mode:</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">💻 All-India Online CBT (From Home / Mobile / Laptop)</p>
                    </div>
                    <span className="text-[10px] font-black uppercase text-brand-navy bg-brand-yellow/40 px-2.5 py-1 rounded-full">
                      Online CBT
                    </span>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>₹{rankxFeeAmount} Fee 100% Adjustable Against Course Admission</span>
                    </span>

                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                      <span>Proceed to Pay ₹{rankxFeeAmount}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* USER NOT LOGGED IN: DIRECT EMAIL & PASSWORD AUTHENTICATION */
                <div className="space-y-4">
                  {/* Mode Switcher Tabs */}
                  <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('SIGNIN');
                        setAuthError('');
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                        authMode === 'SIGNIN'
                          ? 'bg-white text-brand-navy shadow-sm border border-slate-200/60'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LogIn className="w-4 h-4 text-brand-navy" />
                      <span>Log In (Registered Student)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('SIGNUP');
                        setAuthError('');
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
                        authMode === 'SIGNUP'
                          ? 'bg-white text-brand-navy shadow-sm border border-slate-200/60'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserPlus className="w-4 h-4 text-brand-navy" />
                      <span>New Student? Register for RANKEX</span>
                    </button>
                  </div>

                  {/* Auth Error Banner */}
                  {authError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* TAB 1: SIGN IN */}
                  {authMode === 'SIGNIN' ? (
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-900 mb-1">
                            Registered Email Address *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              placeholder="student@example.com"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-900 mb-1">
                            Student Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                        💡 <strong>Direct Access:</strong> Logging in restores your RANKEX candidate profile and instantly loads your generated Admit Card.
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('SIGNUP');
                            setAuthError('');
                          }}
                          className="text-xs text-brand-navy font-bold hover:underline"
                        >
                          New Candidate? Register
                        </button>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="px-6 py-3 bg-brand-navy text-brand-yellow hover:bg-slate-800 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {authLoading ? (
                            <span>Logging in...</span>
                          ) : (
                            <>
                              <span>Log In &amp; Continue</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* TAB 2: SIGN UP */
                    <form onSubmit={handleStudentSignup} className="space-y-4">
                      {/* 1. Full Name & Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Student Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.studentName}
                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Mobile Number *</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-mono text-xs font-bold">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength="10"
                              placeholder="98XXXXXXXX"
                              value={formData.mobile}
                              onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                              className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 font-mono focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Target (NEET / JEE) & Class */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Target (NEET / JEE) *</label>
                          <select
                            value={formData.stream}
                            onChange={(e) => handleStreamChange(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold text-slate-800"
                          >
                            <option value="IIT_JEE">IIT-JEE (JEE Main &amp; Advanced)</option>
                            <option value="NEET">Pre-Medical (NEET-UG)</option>
                            <option value="FOUNDATION">Foundation (Class 9th &amp; 10th)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Class *</label>
                          <select
                            value={formData.targetClass}
                            onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold text-slate-800"
                          >
                            {(DYNAMIC_CLASS_OPTIONS[formData.stream] || ALL_CLASSES).map(opt => (
                              <option key={opt} value={opt}>Class {opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 3. Email & Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Email Address *</label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              placeholder="student@example.com"
                              value={authEmail}
                              onChange={(e) => {
                                setAuthEmail(e.target.value);
                                setFormData(prev => ({ ...prev, email: e.target.value }));
                              }}
                              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Password (Min 6 chars) *</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              minLength={6}
                              placeholder="Create strong password"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none text-xs"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900">
                        🔒 Creating an account logs your candidate profile directly into the Director &amp; Admin report sheet, and unlocks the ₹{rankxFeeAmount} Cashfree fee payment.
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('SIGNIN');
                            setAuthError('');
                          }}
                          className="text-xs text-brand-navy font-bold hover:underline"
                        >
                          Already have an account? Log In
                        </button>

                        <button
                          type="submit"
                          disabled={authLoading}
                          className="px-6 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {authLoading ? (
                            <span>Registering Candidate...</span>
                          ) : (
                            <>
                              <span>Register &amp; Proceed to Pay ₹{rankxFeeAmount}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: PROFESSIONAL PAYMENT GATEWAY SCREEN              */}
          {/* ======================================================== */}
          {step === 'PAYMENT' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Order Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-amber-50/40 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Exam Fee Summary</span>
                  <h4 className="font-black text-base text-slate-900">
                    RANKEX 2027 Scholarship Registration &amp; Admit Card
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Candidate: <strong>{formData.studentName}</strong> (+91-{formData.mobile}) &bull; Stream: <strong>{formData.stream}</strong> &bull; Mode: <strong>{formData.examMode}</strong>
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-600">₹{rankxFeeAmount}</span>
                </div>
              </div>

              {/* Exclusive Payment Gateway Partner: Cashfree Payments PG v3 */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500/40 flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900">Cashfree Payments PG v3</span>
                      <span className="text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Official PG Partner &bull; RBI Authorized
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Instant Dynamic UPI QR, Google Pay, PhonePe, Cards &amp; NetBanking
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL</span>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                  Select Payment Method (Cards, UPI, Netbanking):
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'UPI'
                        ? 'border-brand-navy bg-brand-yellow/15 text-brand-navy shadow-xs ring-2 ring-brand-navy/20'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'CARD'
                        ? 'border-brand-navy bg-brand-yellow/15 text-brand-navy shadow-xs ring-2 ring-brand-navy/20'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-brand-navy bg-brand-yellow/15 text-brand-navy shadow-xs ring-2 ring-brand-navy/20'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Building className="w-5 h-5 text-purple-600" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Method Detail View: UPI */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-white space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center space-y-1">
                      <div className="w-32 h-32 mx-auto p-2 bg-white rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=rankerspath@icici&pn=RankersPathIndore&am=${rankxFeeAmount}&cu=INR`}
                          alt="UPI QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Scan QR with GPay / PhonePe / Paytm to Pay ₹{rankxFeeAmount}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 w-full text-xs">
                      <span className="font-bold text-slate-700 block">Supported UPI Apps:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                          <div
                            key={app}
                            onClick={() => setSelectedUpiApp(app)}
                            className={`p-2 rounded-xl border cursor-pointer font-bold flex items-center justify-between ${
                              selectedUpiApp === app ? 'border-brand-navy bg-slate-50 text-brand-navy' : 'border-slate-200'
                            }`}
                          >
                            <span>{app}</span>
                            {selectedUpiApp === app && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Clicking the button below opens the secure Cashfree Checkout with instant Dynamic UPI QR, Google Pay, PhonePe, Paytm, and BHIM.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Method Detail View: CARD */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-white space-y-3 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700">Supported Cards:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">Visa</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">MasterCard</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">RuPay</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">Maestro</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    You can pay using any Indian or International Debit / Credit Card via 3D Secure OTP verification powered by Cashfree Payments.
                  </p>
                </div>
              )}

              {/* Method Detail View: NETBANKING */}
              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-200 bg-white space-y-3 text-xs">
                  <span className="font-bold text-slate-700 block">Popular Banks Supported:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map(bank => (
                      <div
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-xl border cursor-pointer font-bold text-center ${
                          selectedBank === bank ? 'border-brand-navy bg-slate-50 text-brand-navy' : 'border-slate-200'
                        }`}
                      >
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Cashfree PG v3 Checkout + Demo Bypass */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('FORM')}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold"
                  >
                    &larr; Back to Form
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleProcessCashfreePayment}
                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Connecting Cashfree PG v3...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ₹{rankxFeeAmount} via Cashfree PG v3 (UPI / Cards)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Evaluation / Test Payment Button */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Testing or Reviewing? Skip payment simulation:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInstantTestPayment('DEMO_TEST_BYPASS')}
                    className="px-3.5 py-1.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs rounded-xl shadow-xs transition"
                  >
                    ⚡ Test Pay (1-Click Approve)
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: OFFICIAL CANDIDATE ADMIT CARD                     */}
          {/* ======================================================== */}
          {step === 'ADMIT_CARD' && admitCard && (
            <div className="space-y-5 animate-in zoom-in-95">
              
              <div className="border-4 border-brand-navy rounded-3xl p-5 sm:p-7 bg-white shadow-xl relative overflow-hidden print:border-2">
                
                {/* Admit Card Top Header */}
                <div className="flex items-center justify-between border-b-2 border-brand-navy pb-4 mb-5">
                  <div>
                    <img
                      src="/assets/web/logo-header.png"
                      alt="Rankers Path"
                      className="h-9 w-auto object-contain"
                    />
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
                      Official Candidate Admit Card &bull; RANKEX 2027
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Roll Number</span>
                    <p className="text-xl sm:text-2xl font-black text-brand-navy font-mono">{admitCard.rollNumber}</p>
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Candidate Name</span>
                    <strong className="text-slate-900 font-bold">{admitCard.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Father's Name</span>
                    <strong className="text-slate-900 font-bold">{admitCard.fatherName || 'Guardian'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Stream &amp; Program</span>
                    <strong className="text-brand-navy font-bold">{admitCard.stream} ({admitCard.targetClass})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Exam Date</span>
                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-yellowDark" /> {admitCard.examDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Exam Timing</span>
                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-yellowDark" /> {admitCard.examTiming}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Exam Mode</span>
                    <strong className="text-emerald-700 font-bold uppercase">{admitCard.examMode || 'OFFLINE'}</strong>
                  </div>
                </div>

                {/* Centre Venue Bar */}
                <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Allotted Examination Venue
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                    {admitCard.centreName || ONLINE_CBT_CENTRE.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {admitCard.centreAddress || ONLINE_CBT_CENTRE.address}
                  </p>
                </div>

                {/* QR Code & Instructions */}
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-4">
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">Important Instructions for Candidate:</p>
                    <p>&bull; This exam is conducted Online CBT: Appear from home via Mobile or Laptop.</p>
                    <p>&bull; Keep your Roll Number and login credentials handy for the test portal.</p>
                    <p>&bull; Click "Launch CBT Exam Hall" to begin your test or use your student dashboard.</p>
                  </div>

                  {admitCard.qrCodeDataUrl ? (
                    <div className="p-2 border-2 border-brand-navy rounded-2xl bg-white shadow-sm flex flex-col items-center">
                      <img
                        src={admitCard.qrCodeDataUrl}
                        alt="Admit Card QR"
                        className="w-20 h-20 object-contain"
                      />
                      <span className="text-[9px] font-extrabold text-brand-navy uppercase tracking-widest mt-1">
                        Scan at Venue
                      </span>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400">
                      QR Generated
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:flex-1 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-brand-yellow" />
                  <span>Print / Save Admit Card PDF</span>
                </button>

                {onLaunchOnlineExam && (
                  <button
                    type="button"
                    onClick={() => onLaunchOnlineExam('test-rankex-2027-class11')}
                    className="w-full sm:flex-1 py-3.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-black text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-brand-navy" />
                    <span>Launch CBT Exam Hall</span>
                  </button>
                )}

                {onOpenRankXDashboard && (
                  <button
                    type="button"
                    onClick={onOpenRankXDashboard}
                    className="w-full sm:flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
                  >
                    <span>Open RANKEX Dashboard 📊</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100"
                >
                  Close Window
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

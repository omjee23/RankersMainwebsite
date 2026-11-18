import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  Zap,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Calendar,
  Bell,
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

const UPI_APPS = [
  { name: 'Google Pay', color: 'bg-white text-slate-800 border-slate-200' },
  { name: 'PhonePe', color: 'bg-[#5f259f] text-white border-transparent' },
  { name: 'Paytm UPI', color: 'bg-[#00baf2] text-white border-transparent' },
  { name: 'BHIM UPI', color: 'bg-[#005a9c] text-white border-transparent' }
];

const POPULAR_BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank'];

const TIME_SLOTS = [
  '10:00 AM – 10:45 AM',
  '02:00 PM – 02:45 PM',
  '05:00 PM – 05:45 PM',
  '08:00 PM – 08:45 PM'
];

export const DYNAMIC_CLASS_OPTIONS = {
  IIT_JEE: ['11th', '12th', '12th Pass'],
  NEET: ['11th', '12th', '12th Pass'],
  FOUNDATION: ['9th', '10th']
};
export const ALL_CLASSES = ['9th', '10th', '11th', '12th', '12th Pass'];

export default function RSATPaymentModal({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onLogout,
  onExamUnlocked,
  onOpenRsatDashboard
}) {
  const [step, setStep] = useState('FORM'); // 'FORM', 'PAYMENT', 'TIME_SELECT', 'SUCCESS'
  const [loading, setLoading] = useState(false);
  const [selectedGateway] = useState('CASHFREE'); // Exclusive PG: Cashfree Payments PG v3
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING'
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [transactionData, setTransactionData] = useState(null);
  const [autoRedirectTimer, setAutoRedirectTimer] = useState(3);
  const [feeConfig, setFeeConfig] = useState(null);

  // Direct In-Modal Authentication state
  const [authMode, setAuthMode] = useState('SIGNIN'); // 'SIGNIN' or 'SIGNUP'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Load Admin-configured fee structure
  useEffect(() => {
    if (isOpen) {
      api.getFeeConfig().then(res => {
        if (res && res.data) setFeeConfig(res.data);
      }).catch(err => console.warn('Could not fetch fee config in RSAT:', err));
    }
  }, [isOpen]);

  const rsatFeeAmount = feeConfig?.rsatFee !== undefined ? feeConfig.rsatFee : 100;

  // Time Slot Selection state
  const [timingChoice, setTimingChoice] = useState('NOW'); // 'NOW' or 'LATER'
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);

  // Form State
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    stream: user?.targetStream || 'NEET',
    targetClass: user?.targetClass || '11th',
    schoolName: user?.schoolName || '',
    examMode: 'ONLINE',
    preferredCentre: 'Online CBT Examination'
  });

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        mobile: user.mobile || prev.mobile,
        email: user.email || prev.email,
        stream: user.targetStream || prev.stream,
        targetClass: user.targetClass || prev.targetClass
      }));
      if (user.email) setAuthEmail(user.email);
    }
  }, [user]);

  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both student email and password');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await api.studentEmailLogin({
        email: authEmail.trim(),
        password: authPassword.trim(),
        originExam: 'RSAT'
      });
      if (res.success && res.data?.user) {
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        setForm(prev => ({
          ...prev,
          fullName: res.data.user.fullName || prev.fullName,
          email: res.data.user.email || authEmail.trim(),
          mobile: res.data.user.mobile || prev.mobile,
          stream: res.data.user.targetStream || prev.stream,
          targetClass: res.data.user.targetClass || prev.targetClass
        }));
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
    if (!form.fullName.trim()) {
      setAuthError('Please enter student full name');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (!form.mobile || form.mobile.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!authPassword || authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await api.studentEmailSignup({
        fullName: form.fullName.trim(),
        email: authEmail.trim(),
        mobile: form.mobile.trim(),
        password: authPassword.trim(),
        targetStream: form.stream,
        targetClass: form.targetClass,
        schoolName: form.schoolName,
        examMode: form.examMode,
        originExam: 'RSAT'
      });
      if (res.success && res.data?.user) {
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        setForm(prev => ({
          ...prev,
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          mobile: res.data.user.mobile
        }));
        setStep('PAYMENT');
      } else {
        setAuthError(res.message || 'Sign up failed. Please try again.');
      }
    } catch (err) {
      setAuthError(err.message || 'Sign up request failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Intelligent initial step routing
  useEffect(() => {
    if (isOpen) {
      const mobileToCheck = user?.mobile || form.mobile;
      if (mobileToCheck) {
        const localPaid = localStorage.getItem(`rp_rsat_paid_${mobileToCheck}`);
        if (localPaid) {
          // Already paid ₹100! Move directly to exam timing options
          setStep('TIME_SELECT');
          setTransactionData({
            rollNumber: localPaid,
            studentName: user?.fullName || form.fullName || 'Registered Student',
            feePaid: rsatFeeAmount,
            transactionId: `TXN-RSAT-PREV-${mobileToCheck.slice(-4)}`
          });
          return;
        }
      }

      // If user is already logged in but not paid ₹100, go straight to payment step
      if (user && user.mobile) {
        setStep('PAYMENT');
      } else {
        setStep('FORM');
      }
    } else {
      // Reset state on close
      setStep('FORM');
      setLoading(false);
    }
  }, [isOpen, user]);

  // Countdown timer in SUCCESS state if immediate launch
  useEffect(() => {
    let interval = null;
    if (step === 'SUCCESS' && autoRedirectTimer > 0 && timingChoice === 'NOW') {
      interval = setInterval(() => {
        setAutoRedirectTimer(t => t - 1);
      }, 1000);
    } else if (step === 'SUCCESS' && autoRedirectTimer === 0 && timingChoice === 'NOW') {
      handleLaunchExam();
    }
    return () => clearInterval(interval);
  }, [step, autoRedirectTimer, timingChoice]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile || form.mobile.length < 10) {
      alert('Please enter valid student name and 10-digit mobile number');
      return;
    }
    setStep('PAYMENT');
  };



  const handleProcessCashfreePayment = async () => {
    setLoading(true);
    try {
      const studentName = form.fullName || user?.fullName || 'RSAT Aspirant';
      const studentMobile = form.mobile || user?.mobile || '';
      const studentEmail = form.email || user?.email || `${studentMobile}@student.rankerspath.in`;

      // 1. Create Cashfree PG v3 Order
      const orderRes = await api.createCashfreeOrder({
        amount: rsatFeeAmount,
        currency: 'INR',
        studentName,
        mobile: studentMobile,
        email: studentEmail,
        purpose: 'RSAT_EXAM_FEE',
        customerNotes: {
          stream: form.stream,
          targetClass: form.targetClass,
          centre: form.preferredCentre
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
        orderAmount: rsatFeeAmount
      });

      // 4. Register RSAT
      const res = await api.registerRSAT({
        fullName: studentName,
        mobile: studentMobile,
        stream: form.stream,
        targetClass: form.targetClass,
        schoolName: form.schoolName,
        preferredCentre: form.preferredCentre,
        paymentMode: 'CASHFREE',
        transactionId: verifyRes.data?.paymentId || orderId,
        orderId: orderId,
        gateway: 'CASHFREE'
      });

      setLoading(false);

      if (res.success && res.data) {
        const rollNumber = res.data.registration?.rollNumber || `RSAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        if (studentMobile) {
          localStorage.setItem(`rp_rsat_paid_${studentMobile}`, rollNumber);
        }

        setTransactionData({
          rollNumber: rollNumber,
          studentName: studentName,
          feePaid: rsatFeeAmount,
          transactionId: verifyRes.data?.paymentId || orderId,
          orderId: orderId,
          gateway: 'CASHFREE',
          examId: res.data.examId || 'test-rsat-scholarship'
        });

        setStep('TIME_SELECT');
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      } else {
        alert(res.message || 'Registration recording failed. Please try again.');
      }
    } catch (err) {
      console.error('Cashfree payment failed:', err);
      alert('Cashfree Payment failed: ' + (err.message || 'Please try again'));
      setLoading(false);
    }
  };

  const handleDemoPayment = async (mode = 'UPI_DEMO') => {
    setLoading(true);
    const studentName = form.fullName || user?.fullName || 'RSAT Aspirant';
    const studentMobile = form.mobile || user?.mobile || '9826012345';
    const fakeTxnId = `DEMO_RSAT_${Date.now()}`;

    try {
      const res = await api.registerRSAT({
        fullName: studentName,
        mobile: studentMobile,
        stream: form.stream,
        targetClass: form.targetClass,
        schoolName: form.schoolName,
        preferredCentre: 'Vijay Nagar Main Campus',
        paymentMode: mode,
        transactionId: fakeTxnId,
        orderId: `order_demo_${Date.now()}`
      });

      setLoading(false);

      if (res.success && res.data) {
        const rollNumber = res.data.registration?.rollNumber || `RSAT-2027-${Math.floor(1000 + Math.random() * 9000)}`;
        if (studentMobile) {
          localStorage.setItem(`rp_rsat_paid_${studentMobile}`, rollNumber);
        }
        setTransactionData({
          rollNumber: rollNumber,
          studentName: studentName,
          feePaid: rsatFeeAmount,
          transactionId: fakeTxnId,
          orderId: `order_demo_${Date.now()}`,
          examId: res.data.examId || 'test-rsat-scholarship'
        });
        setStep('TIME_SELECT');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        alert(res.message || 'Registration failed');
      }
    } catch (e) {
      setLoading(false);
      alert('Payment simulation error: ' + e.message);
    }
  };

  const handleSaveTimingAndProceed = async () => {
    const studentMobile = user?.mobile || form.mobile;

    if (timingChoice === 'NOW') {
      // Immediately start the test
      if (studentMobile) {
        api.scheduleRsatSlot({
          mobile: studentMobile,
          scheduledDate: 'Today',
          scheduledTimeSlot: 'Immediate (Now)',
          mode: 'NOW'
        });
      }
      setStep('SUCCESS');
      setAutoRedirectTimer(3);
    } else {
      // Schedule for later
      setLoading(true);
      const slotPayload = {
        mobile: studentMobile,
        scheduledDate,
        scheduledTimeSlot: selectedSlot,
        mode: 'LATER'
      };

      try {
        await api.scheduleRsatSlot(slotPayload);
        localStorage.setItem(`rp_rsat_slot_${studentMobile}`, JSON.stringify({
          mode: 'LATER',
          date: scheduledDate,
          timeSlot: selectedSlot,
          scheduledAt: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('Error saving slot:', e);
      }

      setLoading(false);
      onClose();

      // Redirect student to their dedicated RSAT Dashboard
      if (onOpenRsatDashboard) {
        onOpenRsatDashboard({
          date: scheduledDate,
          timeSlot: selectedSlot,
          rollNumber: transactionData?.rollNumber
        });
      }
    }
  };

  const handleLaunchExam = () => {
    onClose();
    if (onExamUnlocked) {
      onExamUnlocked(transactionData?.examId || 'test-rsat-scholarship');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Modal Header */}
        <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white px-6 py-4 flex items-center justify-between border-b border-brand-yellow/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-brand-yellow text-brand-navy font-black shadow-inner">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-yellow bg-white/10 px-2 py-0.5 rounded-full">
                  RSAT 2026-27 Scholarship
                </span>
                <span className="text-[11px] font-extrabold text-emerald-400">
                  Fee: ₹{rsatFeeAmount} Only
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {step === 'FORM' && 'RSAT Scholarship Test Registration'}
                {step === 'PAYMENT' && `Secure Checkout: RSAT Exam Fee ₹${rsatFeeAmount}`}
                {step === 'TIME_SELECT' && 'Choose Your RSAT Exam Timing'}
                {step === 'SUCCESS' && 'Payment Verified! Exam Hall Activated'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="bg-slate-100 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between text-[11px] sm:text-xs font-bold border-b border-slate-200 flex-shrink-0 overflow-x-auto">
          <div className={`flex items-center gap-1.5 ${step === 'FORM' ? 'text-brand-navy' : 'text-emerald-700'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'FORM' ? 'bg-brand-navy text-white' : 'bg-emerald-600 text-white'
            }`}>
              1
            </span>
            <span>{user ? 'Candidate Info' : 'Login / Register'}</span>
          </div>

          <span className="text-slate-300">&bull;&bull;&bull;</span>

          <div className={`flex items-center gap-1.5 ${
            step === 'PAYMENT' ? 'text-brand-navy' : (step === 'TIME_SELECT' || step === 'SUCCESS') ? 'text-emerald-700' : 'text-slate-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'PAYMENT' ? 'bg-brand-navy text-white' : (step === 'TIME_SELECT' || step === 'SUCCESS') ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span>Pay ₹{rsatFeeAmount}</span>
          </div>

          <span className="text-slate-300">&bull;&bull;&bull;</span>

          <div className={`flex items-center gap-1.5 ${step === 'TIME_SELECT' ? 'text-brand-navy' : step === 'SUCCESS' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'TIME_SELECT' ? 'bg-brand-navy text-white' : step === 'SUCCESS' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span>Set Timing</span>
          </div>

          <span className="text-slate-300">&bull;&bull;&bull;</span>

          <div className={`flex items-center gap-1.5 ${step === 'SUCCESS' ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'SUCCESS' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              4
            </span>
            <span>Test Hall</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 space-y-5 sm:space-y-6">

          {/* ========================================================= */}
          {/* STEP 1: AUTHENTICATION & CANDIDATE DETAILS               */}
          {/* ========================================================= */}
          {step === 'FORM' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Fee & Scholarship Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-brand-yellow/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-brand-yellow/40 px-2 py-0.5 rounded">
                    All-India Diagnostic Scholarship
                  </span>
                  <h4 className="font-extrabold text-sm sm:text-base text-brand-navy">
                    Win Up to 100% Tuition Fee Scholarship
                  </h4>
                  <p className="text-xs text-slate-600">
                    JEE / NEET Pattern CBT &bull; Instant Result &amp; Scholarship Card &bull; Starts Immediately or Schedule
                  </p>
                </div>

                <div className="text-right flex-shrink-0 bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Registration Fee</span>
                  <span className="text-2xl font-black text-emerald-600">₹{rsatFeeAmount}</span>
                </div>
              </div>

              {/* USER ALREADY LOGGED IN */}
              {user ? (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Verified Student Session Card */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-emerald-900 font-semibold">
                        Logged in as: <strong className="font-bold text-slate-900">{user.fullName || form.fullName}</strong> ({user.email || user.mobile})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('rp_rsat_token');
                        localStorage.removeItem('rp_rsat_user');
                        if (onLogout) onLogout();
                        else if (onLoginSuccess) onLoginSuccess(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                      title="Logout from RSAT"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Logout Account</span>
                    </button>
                  </div>

                  {/* Form Inputs for Logged In User */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <label className="block mb-1 text-slate-900 font-bold">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-900 font-bold">Mobile Number (For Roll No / Result) *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-mono text-xs font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength="10"
                          placeholder="98XXXXXXXX"
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 font-mono focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <label className="block mb-1 text-slate-900 font-bold">Target Stream *</label>
                      <select
                        value={form.stream}
                        onChange={(e) => {
                          const newStream = e.target.value;
                          const defaultClass = DYNAMIC_CLASS_OPTIONS[newStream]?.[0] || '11th';
                          setForm({ ...form, stream: newStream, targetClass: defaultClass });
                        }}
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
                        value={form.targetClass}
                        onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold text-slate-800"
                      >
                        {(DYNAMIC_CLASS_OPTIONS[form.stream] || ALL_CLASSES).map((cls) => (
                          <option key={cls} value={cls}>
                            Class {cls}
                          </option>
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
                      Online Exam
                    </span>
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>256-Bit SSL Encrypted &bull; 100% Refundable against Admission</span>
                    </span>

                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                      <span>Proceed to Pay ₹{rsatFeeAmount}</span>
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
                      <span>New Student? Sign Up</span>
                    </button>
                  </div>

                  {/* Auth Error Banner */}
                  {authError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* TAB 1: SIGN IN WITH EMAIL & PASSWORD */}
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
                        💡 <strong>Direct Access:</strong> Logging in will restore your previous RSAT candidate profile, fee records, and scheduled test slots.
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
                          Need an account? Sign Up
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
                    <form onSubmit={handleStudentSignup} className="space-y-4">
                      {/* 1. Full Name & Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                        <div>
                          <label className="block mb-1 text-slate-900 font-bold">Student Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                              value={form.mobile}
                              onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
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
                            value={form.stream}
                            onChange={(e) => {
                              const newStream = e.target.value;
                              const defaultClass = DYNAMIC_CLASS_OPTIONS[newStream]?.[0] || '11th';
                              setForm({ ...form, stream: newStream, targetClass: defaultClass });
                            }}
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
                            value={form.targetClass}
                            onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold text-slate-800"
                          >
                            {(DYNAMIC_CLASS_OPTIONS[form.stream] || ALL_CLASSES).map((cls) => (
                              <option key={cls} value={cls}>
                                Class {cls}
                              </option>
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
                                setForm(prev => ({ ...prev, email: e.target.value }));
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
                              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
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
                        🔒 Creating an account saves your candidate record directly for the Director &amp; Admin report funnel, and unlocks the ₹{rsatFeeAmount} Cashfree fee payment.
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
                              <span>Sign Up &amp; Proceed to Pay ₹{rsatFeeAmount}</span>
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

          {/* ========================================================= */}
          {/* STEP 2: PAYMENT GATEWAY (FEE: ₹100) */}
          {/* ========================================================= */}
          {step === 'PAYMENT' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Order Bill Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Order Summary</span>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    RSAT 2026 Online Scholarship Test Registration
                  </h4>
                  <p className="text-xs text-slate-500">
                    Student: <strong>{form.fullName}</strong> (+91-{form.mobile}) &bull; Stream: <strong>{form.stream}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-600">₹{rsatFeeAmount}</span>
                </div>
              </div>

              {/* Official Payment Gateway Partner Card (Cashfree PG v3 Exclusive) */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-600/80 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
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

              {/* Study & Explore Dashboard First Option */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                    📚
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-blue-950">Want to revise formulas &amp; study mock papers first?</h5>
                    <p className="text-[11px] text-blue-700">
                      You can explore the RSAT Dashboard, review Kota formula handbooks, and pay the ₹{rsatFeeAmount} fee right before entering the exam hall.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenRsatDashboard) {
                      onOpenRsatDashboard();
                    }
                  }}
                  className="px-4 py-2 bg-white hover:bg-blue-600 hover:text-white text-blue-900 border border-blue-300 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs whitespace-nowrap self-end sm:self-center"
                >
                  <span>Explore Dashboard &amp; Study First &rarr;</span>
                </button>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase text-slate-700">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'UPI'
                        ? 'border-brand-navy bg-brand-yellow/10 text-brand-navy shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>Instant UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'CARD'
                        ? 'border-brand-navy bg-brand-yellow/10 text-brand-navy shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Debit / Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-3 rounded-2xl border-2 text-xs font-black transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-brand-navy bg-brand-yellow/10 text-brand-navy shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building className="w-5 h-5" />
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
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=rankerspath@icici&pn=RankersPathIndore&am=${rsatFeeAmount}&cu=INR`}
                          alt="UPI QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Scan QR with GPay / PhonePe / Paytm to Pay ₹{rsatFeeAmount}
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

              {/* Security badge and Pay button */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('FORM')}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
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
                        <span>Connecting Cashfree PG...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-brand-yellow" />
                        <span>Pay ₹{rsatFeeAmount} via Cashfree Payments (UPI / Cards)</span>
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
                    onClick={() => handleDemoPayment('TEST_BYPASS')}
                    className="px-3.5 py-1.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs rounded-xl shadow-xs transition"
                  >
                    ⚡ Test Pay (1-Click Approve)
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: EXAM TIMING SELECTION (Start Now vs Schedule Slot) */}
          {/* ========================================================= */}
          {step === 'TIME_SELECT' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Payment Success Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    Registration Verified &bull; Fee ₹{rsatFeeAmount} Paid
                  </span>
                  <h4 className="text-sm font-black text-emerald-950">
                    Roll No: {transactionData?.rollNumber || 'RSAT-CONFIRMED'}
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Please choose when you want to appear for the 45-minute online test:
                  </p>
                </div>
              </div>

              {/* Timing Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* OPTION A: START RIGHT NOW */}
                <div
                  onClick={() => setTimingChoice('NOW')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                    timingChoice === 'NOW'
                      ? 'border-brand-navy bg-brand-yellow/10 ring-2 ring-brand-yellow shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-brand-navy text-brand-yellow font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-brand-yellow" />
                        <span>Instant CBT</span>
                      </span>
                      <input
                        type="radio"
                        checked={timingChoice === 'NOW'}
                        onChange={() => setTimingChoice('NOW')}
                        className="w-4 h-4 text-brand-navy"
                      />
                    </div>

                    <div>
                      <h4 className="font-black text-base text-brand-navy">
                        Start Exam Right Now (तुरंत दें)
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Appear immediately for the 45-minute CBT exam hall on this device. Instant evaluation and scholarship certificate.
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>30 Questions (PCM/PCB)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instant Scorecard &amp; Waiver Award</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-brand-navy">
                      ⚡ Ready to start now
                    </span>
                  </div>
                </div>

                {/* OPTION B: SCHEDULE FOR LATER */}
                <div
                  onClick={() => setTimingChoice('LATER')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative flex flex-col justify-between ${
                    timingChoice === 'LATER'
                      ? 'border-brand-navy bg-brand-yellow/10 ring-2 ring-brand-yellow shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Book Slot</span>
                      </span>
                      <input
                        type="radio"
                        checked={timingChoice === 'LATER'}
                        onChange={() => setTimingChoice('LATER')}
                        className="w-4 h-4 text-brand-navy"
                      />
                    </div>

                    <div>
                      <h4 className="font-black text-base text-brand-navy">
                        Schedule Exam for Later (समय सेट करें)
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Select a date &amp; slot. You will see a live countdown timer and notification alert on your RSAT Student Dashboard.
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-blue-600" />
                        <span>Notification Bell reminder on portal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Practice with Sample Papers first</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <span className="text-xs font-black text-blue-700">
                      📅 Pick convenient date &amp; time below
                    </span>
                  </div>
                </div>

              </div>

              {/* Slot Picker Details if 'LATER' is selected */}
              {timingChoice === 'LATER' && (
                <div className="p-5 rounded-2xl border-2 border-blue-200 bg-blue-50/50 space-y-4 animate-in slide-in-from-top-2">
                  <h5 className="font-black text-xs uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Select Exam Date &amp; Time Slot:</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exam Date *</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      >
                        {TIME_SLOTS.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs text-blue-900 font-medium flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600 flex-shrink-0 animate-bounce" />
                    <span>
                      Confirmed slot will show in the <strong>Notification Bell</strong> of your dedicated RSAT Student Portal with a live countdown timer.
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  Close &amp; Decide Later
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSaveTimingAndProceed}
                  className="px-8 py-4 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition flex items-center gap-2 transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {timingChoice === 'NOW' ? (
                    <>
                      <Zap className="w-4 h-4 fill-brand-yellow" />
                      <span>Start RSAT Exam Right Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm Slot &amp; Open RSAT Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: PAYMENT SUCCESS & AUTO-LAUNCH CBT */}
          {/* ========================================================= */}
          {step === 'SUCCESS' && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
              
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg border-4 border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
                  Payment Verified (₹{transactionData?.feePaid || rsatFeeAmount} Paid)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  RSAT Scholarship Hall Activated!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  Your registration fee of <strong>₹{transactionData?.feePaid || rsatFeeAmount}</strong> has been confirmed. Your test hall is ready for immediate assessment.
                </p>
              </div>

              {/* Receipt Summary Card */}
              {transactionData && (
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-500">Student Name:</span>
                    <span className="font-black text-slate-900">{transactionData.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-500">Roll Number:</span>
                    <span className="font-mono font-black text-brand-navy">{transactionData.rollNumber}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-500">Transaction ID:</span>
                    <span className="font-mono text-slate-700">{transactionData.transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-slate-500">Amount Paid:</span>
                    <span className="font-black text-emerald-600 text-sm">₹{transactionData.feePaid || rsatFeeAmount} (Success)</span>
                  </div>
                </div>
              )}

              {/* Auto Redirect Banner */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold max-w-md mx-auto">
                Opening RSAT Computer Based Test hall in {autoRedirectTimer} seconds...
              </div>

              {/* Enter Exam Now Button */}
              <button
                type="button"
                onClick={handleLaunchExam}
                className="w-full max-w-md mx-auto px-8 py-4 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl transition flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <Zap className="w-5 h-5 text-brand-yellow" />
                <span>Enter RSAT Exam Hall Now</span>
                <ArrowRight className="w-4 h-4 text-brand-yellow" />
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

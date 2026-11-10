import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Lock,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  AlertCircle,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { openCashfreeCheckout } from '../utils/cashfree';

export default function CashfreePaymentPortalModal({ isOpen, onClose, initialPurpose = null, user = null }) {
  const [selectedCategory, setSelectedCategory] = useState(initialPurpose || 'RSAT_EXAM_FEE');
  const [customAmount, setCustomAmount] = useState('5000');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [feeConfig, setFeeConfig] = useState(null);

  // Load dynamic fee configuration decided by Admin
  useEffect(() => {
    if (isOpen) {
      api.getFeeConfig().then(res => {
        if (res && res.data) setFeeConfig(res.data);
      }).catch(err => console.warn('Could not fetch dynamic fee config:', err));

      // Auto-detect return from Cashfree PG redirect (cf_order_id in URL)
      try {
        const params = new URLSearchParams(window.location.search);
        const redirectedOrderId = params.get('cf_order_id') || params.get('order_id');
        if (redirectedOrderId && !receiptData) {
          setLoading(true);
          api.verifyCashfreePayment({ order_id: redirectedOrderId }).then(verifyRes => {
            setLoading(false);
            if (verifyRes && verifyRes.success) {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              const p = verifyRes.data?.payment;
              setReceiptData({
                orderId: redirectedOrderId,
                cfPaymentId: verifyRes.data?.cf_payment_id || `CF-${redirectedOrderId}`,
                receiptNumber: verifyRes.data?.receipt_number || p?.receiptNumber || 'RPX-REC-2026',
                amount: p?.amount || 1,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                studentName: p?.studentName || formData.studentName || 'Student Aspirant',
                mobile: p?.mobile || formData.mobile || '',
                email: p?.email || formData.email || '',
                stream: formData.stream,
                targetClass: formData.targetClass,
                rollNumber: p?.receiptNumber || 'RPX-2026-FEE',
                purposeTitle: p?.purpose || 'Online Fee Payment',
                paymentMethod: verifyRes.data?.payment_method || 'Cashfree PG'
              });
            }
          }).catch(err => {
            setLoading(false);
            console.warn('Auto verification error:', err);
          });
        }
      } catch (e) {}
    }
  }, [isOpen]);

  // Dynamically compute categories from Admin-decided fee config
  const feeCategories = useMemo(() => {
    const rsat = feeConfig?.rsatFee !== undefined ? feeConfig.rsatFee : 100;
    const rankx = feeConfig?.rankxFee !== undefined ? feeConfig.rankxFee : 100;
    const token = feeConfig?.classroomTokenFee !== undefined ? feeConfig.classroomTokenFee : 5000;
    const testSeries = feeConfig?.testSeriesFee !== undefined ? feeConfig.testSeriesFee : 1500;

    return [
      {
        id: 'REAL_GATEWAY_TEST',
        title: '⚡ Live Cashfree Gateway Test (₹1.00)',
        desc: 'Official minimum ₹1.00 transaction to verify live UPI QR, Google Pay, PhonePe & Cards',
        amount: 1,
        isCustom: false
      },
      {
        id: 'RSAT_EXAM_FEE',
        title: '🎓 RSAT 2026-27 Scholarship Registration',
        desc: 'Tuition fee scholarship test for JEE, NEET & Foundation (Up to 100% Scholarship)',
        amount: rsat,
        isCustom: false
      },
      {
        id: 'RANKEX_REGISTRATION',
        title: '🏆 RANKEX 2027 Mahasangram Registration',
        desc: 'National Level Excellence Exam registration fee for Kota batch selection',
        amount: rankx,
        isCustom: false
      },
      {
        id: 'COURSE_TOKEN_FEE',
        title: '🏫 Classroom Course Admission / Seat Booking',
        desc: 'Token fee to lock your seat in Diamond, Platinum, or Achiever batches',
        amount: token,
        isCustom: false,
        presetOptions: [token, token * 2, token * 5]
      },
      {
        id: 'TEST_SERIES_FEE',
        title: '📚 All-India CBT Test Series & Material Package',
        desc: 'Access complete online test series, NAT Range exams & printed Kota modules',
        amount: testSeries,
        isCustom: false,
        presetOptions: [testSeries, Math.round(testSeries * 1.8)]
      },
      {
        id: 'BALANCE_TUITION_FEE',
        title: '✍️ Custom / Balance Tuition Fee Payment',
        desc: 'Pay custom installment, balance fees, or hostel fee with your Roll Number',
        amount: '',
        isCustom: true
      }
    ];
  }, [feeConfig]);

  // Form State
  const [formData, setFormData] = useState({
    studentName: user?.fullName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    stream: user?.targetStream || 'JEE',
    targetClass: user?.targetClass || 'Class 11',
    rollNumber: user?.rollNumber || ''
  });

  // Receipt & Success State
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen) return null;

  const activeCategory = feeCategories.find(c => c.id === selectedCategory) || feeCategories[0];
  const payableAmount = activeCategory.isCustom ? parseFloat(customAmount || '0') : activeCategory.amount;

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setErrorMsg('');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleInitiateCashfreePayment = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.studentName.trim()) {
      setErrorMsg('Please enter student full name');
      return;
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!payableAmount || payableAmount < 1) {
      setErrorMsg('Payment amount must be at least ₹1.00');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend via Cashfree PG API
      const orderPayload = {
        amount: payableAmount,
        currency: 'INR',
        purpose: selectedCategory,
        orderNote: `${activeCategory.title} - ${formData.studentName}`,
        studentId: user?.id || null,
        customerDetails: {
          name: formData.studentName.trim(),
          phone: formData.mobile.trim(),
          email: formData.email.trim() || 'student@rankerspath.in'
        }
      };

      const orderRes = await api.createCashfreeOrder(orderPayload);

      if (!orderRes.success || !orderRes.data?.payment_session_id) {
        setLoading(false);
        setErrorMsg(orderRes.message || 'Failed to initialize Cashfree payment session. Please try again.');
        return;
      }

      const { payment_session_id, order_id, receipt_number, environment } = orderRes.data;

      // 2. Open Cashfree Web Checkout Modal
      await openCashfreeCheckout({
        paymentSessionId: payment_session_id,
        environment: environment || 'TEST',
        returnUrl: window.location.href,
        onSuccess: async (paymentDetails) => {
          try {
            // 3. Verify payment on backend
            const verifyRes = await api.verifyCashfreePayment({
              order_id: order_id
            });

            setLoading(false);

            // Confetti celebration
            confetti({
              particleCount: 120,
              spread: 75,
              origin: { y: 0.6 }
            });

            // Set Receipt Data for display and printing
            setReceiptData({
              orderId: order_id,
              cfPaymentId: verifyRes.data?.cf_payment_id || paymentDetails?.cf_payment_id || `CF-${Date.now()}`,
              receiptNumber: verifyRes.data?.receipt_number || receipt_number,
              amount: payableAmount,
              date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              studentName: formData.studentName,
              mobile: formData.mobile,
              email: formData.email,
              stream: formData.stream,
              targetClass: formData.targetClass,
              rollNumber: formData.rollNumber || 'RPX-2026-REG',
              purposeTitle: activeCategory.title,
              paymentMethod: paymentDetails?.payment_method || 'UPI / Cashfree PG'
            });
          } catch (verErr) {
            setLoading(false);
            console.error('Verification error:', verErr);
          }
        },
        onFailure: (err) => {
          setLoading(false);
          setErrorMsg(err.message || 'Payment declined or transaction cancelled.');
        },
        onDismiss: () => {
          setLoading(false);
        }
      });
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Error communicating with Cashfree payment gateway.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-brand-navy text-white px-6 py-5 flex items-center justify-between flex-shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-yellow/20 flex items-center justify-center border border-brand-yellow/40">
              <CreditCard className="w-5 h-5 text-brand-yellow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wide">
                  Official Online Fee Portal
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Cashfree PG Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Rankers Path Institute &bull; Vijay Nagar, Indore &bull; 256-Bit SSL Encrypted
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* VIEW 1: PAYMENT SUCCESS RECEIPT */}
          {receiptData ? (
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-emerald-950">
                    Payment Successful &amp; Confirmed!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Your fee payment has been verified via Cashfree PG. Official fee tax receipt generated below.
                  </p>
                </div>
              </div>

              {/* Printable Official Fee Receipt Card */}
              <div id="cashfree-print-receipt" className="p-6 sm:p-8 bg-slate-50 border-2 border-slate-300 rounded-3xl space-y-6 shadow-sm">
                {/* Receipt Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-brand-navy uppercase tracking-wider">
                      RANKERS PATH
                    </h2>
                    <p className="text-xs font-semibold text-slate-600">
                      Premier Institute for JEE (Main &amp; Adv), NEET-UG &amp; Foundation PNCF
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Scheme No. 54, PU-4, Behind C21 Mall, Vijay Nagar, Indore (M.P.) - 452010
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Helpline: +91 91114 55554 &bull; Email: admissions@rankerspath.in
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-lg bg-brand-navy text-brand-yellow font-black text-xs uppercase block">
                      OFFICIAL RECEIPT
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 mt-1 block">
                      No: {receiptData.receiptNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Date: {receiptData.date} {receiptData.time}
                    </span>
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Student Name</span>
                    <strong className="text-slate-900 font-black text-sm">{receiptData.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Mobile Number</span>
                    <strong className="text-slate-900 font-bold">{receiptData.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Roll Number / ID</span>
                    <strong className="text-brand-navy font-bold">{receiptData.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Target Stream</span>
                    <strong className="text-slate-900 font-bold">{receiptData.stream} ({receiptData.targetClass})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Payment Gateway</span>
                    <strong className="text-emerald-700 font-bold">Cashfree Payments PG</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase text-[10px]">Payment Ref ID</span>
                    <strong className="text-slate-800 font-mono text-[11px]">{receiptData.cfPaymentId}</strong>
                  </div>
                </div>

                {/* Particulars Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="bg-slate-200 px-4 py-2 font-black text-slate-800 grid grid-cols-4">
                    <span className="col-span-3">Particulars &amp; Purpose</span>
                    <span className="text-right">Amount (₹)</span>
                  </div>
                  <div className="p-4 bg-white space-y-2 border-b border-slate-200">
                    <div className="grid grid-cols-4 font-bold text-slate-800">
                      <span className="col-span-3">{receiptData.purposeTitle}</span>
                      <span className="text-right">₹{receiptData.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Electronic transaction confirmed through Cashfree Order ID: {receiptData.orderId}
                    </p>
                  </div>
                  <div className="bg-amber-50/60 px-4 py-2.5 font-black text-slate-900 grid grid-cols-4 text-sm border-t border-amber-200">
                    <span className="col-span-3 uppercase">Total Amount Received</span>
                    <span className="text-right text-brand-navy font-black text-base">
                      ₹{receiptData.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Footer Notes & Digital Stamp */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Digitally signed &amp; computer generated. No physical signature required.</span>
                  </div>
                  <div className="text-right font-bold text-slate-700">
                    Rankers Path Accounts Dept.
                  </div>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-6 py-2.5 bg-brand-navy text-white hover:bg-brand-navyLight font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReceiptData(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl transition shadow"
                >
                  Close &amp; Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* VIEW 2: FEE PAYMENT FORM */
            <form onSubmit={handleInitiateCashfreePayment} className="space-y-6">

              {/* Step 1: Select Fee Purpose */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Step 1: Choose Fee Purpose / Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {feeCategories.map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'border-brand-navy bg-brand-yellow/10 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-900 leading-snug">
                              {cat.title}
                            </h4>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-brand-navy bg-brand-navy' : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {cat.desc}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">Fee Amount:</span>
                          <span className="text-sm font-black text-brand-navy">
                            {cat.isCustom ? 'Custom Amount' : `₹${cat.amount.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amount Customizer if Custom / Presets */}
              {activeCategory.presetOptions && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Installment / Token Amount:
                  </label>
                  <div className="flex items-center gap-2">
                    {activeCategory.presetOptions.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          activeCategory.amount = amt;
                          setSelectedCategory({ ...selectedCategory });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                          payableAmount === amt
                            ? 'bg-brand-navy text-brand-yellow shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeCategory.isCustom && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                  <label className="block text-xs font-black text-amber-950 uppercase">
                    Enter Custom Tuition / Installment Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 font-bold text-slate-500">₹</span>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 15000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-amber-400 text-base font-black text-brand-navy bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-amber-800 block">
                    You can pay any installment amount mutually agreed with our admissions counselors.
                  </span>
                </div>
              )}

              {/* Step 2: Student & Parent Details */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Step 2: Student &amp; Parent Details *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Parent / Student Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Email Address (for Tax Receipt)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="student@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Target Stream / Program
                    </label>
                    <select
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                    >
                      <option value="JEE">IIT-JEE (Mains &amp; Advanced)</option>
                      <option value="NEET">NEET-UG (Medical)</option>
                      <option value="FOUNDATION">Foundation PNCF (9th &amp; 10th)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Class Level
                    </label>
                    <select
                      value={formData.targetClass}
                      onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                    >
                      <option value="Class 11">Class 11th</option>
                      <option value="Class 12">Class 12th</option>
                      <option value="Dropper">Dropper / Repeater</option>
                      <option value="Class 9">Class 9th PNCF</option>
                      <option value="Class 10">Class 10th PNCF</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Student Roll No / Application ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RPX-2026-001"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Payment Summary & Checkout CTA */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-brand-navy rounded-3xl text-white space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
                      Total Payable Amount
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-brand-yellow">
                      ₹{payableAmount.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-300">(All Taxes Incl.)</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Cashfree PG 256-Bit SSL</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                    <span>Supports UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking, and Wallets.</span>
                  </p>

                  <button
                    type="submit"
                    disabled={loading || payableAmount <= 0}
                    className="w-full sm:w-auto px-8 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></span>
                        Connecting to Cashfree...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Pay ₹{payableAmount.toLocaleString('en-IN')} via Cashfree</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
          <span>Rankers Path Institute &bull; Powered by Cashfree Payments India</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Official Merchant ID:</span>
            <span className="font-mono text-slate-600">RPX-CASHFREE-INDORE</span>
          </div>
        </div>

      </div>
    </div>
  );
}

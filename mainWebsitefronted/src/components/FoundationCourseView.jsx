import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Award,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  Percent,
  AlertCircle,
  Check,
  ChevronRight,
  GraduationCap,
  MapPin,
  X
} from 'lucide-react';

export default function FoundationCourseView({
  onBack,
  onOpenAdmission,
  onOpenRSAT,
  onOpenRankX,
  onOpenRefundPolicy
}) {
  const [applyDiscount, setApplyDiscount] = useState(true);
  const [showAdmissionBanner, setShowAdmissionBanner] = useState(true);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Exact handwritten fee figures for Foundation:
  const feeMatrix = [
    {
      targetClass: 'Class 9th (1-Year Junior Foundation Program)',
      code: 'PNCF-9',
      oneTimeFee: 40000,
      installments: {
        total: 45000,
        inst1: 30000,
        inst1Label: 'At Admission',
        inst2: 15000,
        inst2Label: 'Within 45 Days'
      },
      discount30: {
        oneTime: 28000, // 40,000 * 0.70
        savings: 12000,
        instTotal: 31500,
        inst1: 21000,
        inst2: 10500
      },
      recommendedFor: 'Class 9th students building scientific curiosity, logical IQ, and Olympiad foundations'
    },
    {
      targetClass: 'Class 10th (1-Year Board + Competitive Foundation Program)',
      code: 'PNCF-10',
      oneTimeFee: 47000,
      installments: {
        total: 52000,
        inst1: 35000,
        inst1Label: 'At Admission',
        inst2: 17000,
        inst2Label: 'Within 45 Days'
      },
      discount30: {
        oneTime: 32900, // 47,000 * 0.70
        savings: 14100,
        instTotal: 36400,
        inst1: 24500,
        inst2: 11900
      },
      recommendedFor: 'Class 10th students targeting 95%+ in school board exams & early IIT/NEET launchpad'
    }
  ];

  const highlights = [
    { title: 'Interactive Visual STEM Concepts', desc: 'Conceptual physics experiments, chemistry reactions, and advanced mathematics' },
    { title: 'Mental Ability & IQ Modules', desc: 'Logical reasoning, spatial intelligence, and speed math for NTSE' },
    { title: 'Olympiad Training (IOQM & SOF)', desc: 'Special workshops and practice for National and International Olympiad medals' },
    { title: 'School Board Perfection (CBSE / MP)', desc: 'Systematic answer-writing practice ensuring 95%+ marks in Class 10 Board exams' },
    { title: 'Gentle Step-Up to IIT/NEET', desc: 'Smooth conceptual transition so students excel effortlessly in Class 11 & 12' },
    { title: 'Regular Parent-Teacher Connect', desc: 'Monthly personal feedback and developmental progress tracking' }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800">

      {/* 1. ADMISSION POP-UP ALERT BANNER */}
      {showAdmissionBanner && (
        <div className="bg-gradient-to-r from-brand-navy via-[#6D28D9] to-brand-navy border-b-2 border-brand-yellow text-white py-2.5 px-4 shadow-md relative z-30 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-yellow"></span>
              </span>
              <p className="font-semibold text-slate-100">
                <strong className="text-brand-yellow font-extrabold uppercase tracking-wide">
                  Foundation (9th &amp; 10th) 2026–27 Admissions Open:
                </strong>{' '}
                Board + Olympiad batches starting soon! Flat 30% early scholarship benefit available.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenAdmission}
                className="px-3.5 py-1 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider rounded-md shadow transition transform hover:scale-105 active:scale-95"
              >
                Apply for Admission
              </button>
              <button
                onClick={() => setShowAdmissionBanner(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEDICATED HERO HEADER */}
      <section className="bg-gradient-to-br from-[#0B1B3D] via-[#2E1065] to-[#0A1633] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-4 border-brand-yellow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumbs & Back Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition shadow-sm backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 text-brand-yellow" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20enquire%20about%20Foundation%20course."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="tel:+919131435511"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5 text-brand-yellow" />
                <span>9131435511</span>
              </a>
            </div>
          </div>

          {/* Course Title & Intro */}
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-sm">
                JUNIOR CHAMPIONS
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-slate-200 font-bold text-xs">
                FOUNDATION DIVISION (PNCF)
              </span>
              <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 font-extrabold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Session 2026–27</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Foundation (Class 9th &amp; 10th)
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
              Pre-Nurture &amp; Career Foundation (PNCF) Program. Strong Groundwork in Science &amp; Mathematics, Olympiad Medals, NTSE, and 95%+ Board Exam Scores without Academic Stress.
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs text-slate-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Target Exams</span>
                <span className="font-semibold text-white mt-0.5 block">Boards, NTSE &amp; Olympiads (IOQM/SOF)</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Eligible Classes</span>
                <span className="font-semibold text-white mt-0.5 block">Class 9th &amp; Class 10th Students</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Program Duration</span>
                <span className="font-semibold text-white mt-0.5 block">1 Academic Year (Synchronized with School)</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Batches Commencing</span>
                <span className="font-semibold text-white mt-0.5 block">10th April 2026 &amp; 25th April 2026</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAdmission}
                className="px-6 py-3 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-sm uppercase tracking-wider transition shadow-lg transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Apply for Admission 2026–27</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenRSAT}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wide transition shadow flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-brand-yellow" />
                <span>Win up to 100% Scholarship (RSAT)</span>
              </button>

              <button
                onClick={onOpenRefundPolicy}
                className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs tracking-wide transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                <span>View Refund Policy</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. DEDICATED FEES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        <section id="fee-structure">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-black text-xs uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5 text-purple-700" />
                <span>OFFICIAL INSTITUTIONAL FEE CHART 2026–27</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Foundation (Class 9th &amp; 10th) Fee Structure
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Classroom tuition fees from official institutional chart. Choose between single one-time lum-sum settlement or 2 easy installments.
              </p>
            </div>

            {/* 30% DISCOUNT SWITCH */}
            <div className="bg-[#111827] text-white p-3 sm:p-4 rounded-2xl shadow-md border border-slate-800 flex items-center justify-between gap-4 flex-shrink-0">
              <div>
                <div className="flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white">
                    Early Bird / 30% Scholarship Discount
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {applyDiscount ? '30% Discount Active: Live savings applied!' : 'Toggle on to view 30% reduced fee'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setApplyDiscount(!applyDiscount)}
                className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  applyDiscount ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
                role="switch"
                aria-checked={applyDiscount}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    applyDiscount ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {applyDiscount && (
            <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-bold">
                  Special 30% Early Bird Scholarship benefit applied on Foundation program fees!
                </span>
              </div>
              <button
                onClick={onOpenRSAT}
                className="text-emerald-700 underline font-black hover:text-emerald-900 ml-auto"
              >
                Want up to 100% waiver? Take RSAT Exam &rarr;
              </button>
            </div>
          )}

          {/* Fee Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
            {feeMatrix.map((item, idx) => {
              const originalOneTime = item.oneTimeFee;
              const discountedOneTime = item.discount30.oneTime;
              const savings = item.discount30.savings;

              const activeOneTime = applyDiscount ? discountedOneTime : originalOneTime;
              const activeInstTotal = applyDiscount ? item.discount30.instTotal : item.installments.total;
              const activeInst1 = applyDiscount ? item.discount30.inst1 : item.installments.inst1;
              const activeInst2 = applyDiscount ? item.discount30.inst2 : item.installments.inst2;

              return (
                <div
                  key={item.code || idx}
                  className="bg-white rounded-3xl border-2 border-slate-200 hover:border-purple-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 to-purple-50/40 border-b border-slate-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-md">
                        {item.code}
                      </span>
                      {applyDiscount && (
                        <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          <span>Save {formatCurrency(savings)}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {item.targetClass}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.recommendedFor}
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5 flex-1">
                    {/* Option A: One-Time */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                          Option A: One-Time Settlement
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
                          Best Value
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black text-slate-950">
                          {formatCurrency(activeOneTime)}
                        </span>
                        {applyDiscount && (
                          <span className="text-sm font-bold text-slate-400 line-through">
                            {formatCurrency(originalOneTime)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Complete academic year fee paid at the time of admission.
                      </p>
                    </div>

                    {/* Option B: 2-Installments */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                          Option B: 2 Installments
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Total: {formatCurrency(activeInstTotal)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">1st Installment</span>
                          <span className="font-black text-slate-900 text-sm block mt-0.5">{formatCurrency(activeInst1)}</span>
                          <span className="text-[10px] text-slate-500 block">At Admission</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">2nd Installment</span>
                          <span className="font-black text-slate-900 text-sm block mt-0.5">{formatCurrency(activeInst2)}</span>
                          <span className="text-[10px] text-slate-500 block">Within 45 Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>All Printed Workbooks, School Modules &amp; Daily Worksheets Included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Olympiad Mock Test Series &amp; School Board Test Drills</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Dedicated 1-on-1 Faculty Doubt Clinic Access</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      onClick={onOpenAdmission}
                      className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-1.5"
                    >
                      <span>Direct Admission &bull; {item.code}</span>
                      <ChevronRight className="w-4 h-4 text-brand-yellow" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={onOpenRSAT}
                        className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-200 transition text-center flex items-center justify-center gap-1"
                        title="RSAT Scholarship Exam"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>RSAT Exam</span>
                      </button>
                      <button
                        onClick={onOpenRankX}
                        className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-[11px] border border-amber-200 transition text-center flex items-center justify-center gap-1"
                        title="RANKEX Scholarship Exam"
                      >
                        <Award className="w-3.5 h-3.5 text-brand-yellowDark flex-shrink-0" />
                        <span>RANKEX Exam</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. PEDAGOGY HIGHLIGHTS */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-black text-xs uppercase tracking-wider">
              FOUNDATION PEDAGOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Nurturing Analytical Minds Without School Stress
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Synchronized with school hours to boost school grades and prepare students for competitive examinations early.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-700 text-brand-yellow flex items-center justify-center font-black text-sm mb-3 shadow-xs">
                  0{i + 1}
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-1">{h.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INTEGRATED REFUND POLICY SECTION */}
        <section className="bg-gradient-to-br from-slate-900 to-[#0A1633] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border-2 border-brand-yellow/40 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow font-extrabold text-xs uppercase tracking-wider border border-brand-yellow/30">
                  <ShieldCheck className="w-4 h-4" />
                  <span>TRANSPARENT INSTITUTIONAL NORMS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                  Foundation (PNCF) Refund &amp; Withdrawal Policy
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Rankerspath Educational Pvt. Ltd. operates with total transparency. Course refund applications are processed smoothly according to the batch commencement date.
                </p>
              </div>

              <button
                onClick={onOpenRefundPolicy}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-yellow font-bold text-xs uppercase tracking-wider border border-brand-yellow/30 transition flex items-center gap-2 flex-shrink-0"
              >
                <span>Read Full 7-Page Policy</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Stage 1</span>
                <h5 className="text-lg font-black text-emerald-400 mt-1">100% Course Fee Refund</h5>
                <p className="text-xs text-slate-300 mt-1">Application before batch commencement date (less ₹5k registration/admin fee).</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Stage 2</span>
                <h5 className="text-lg font-black text-teal-300 mt-1">80% Course Fee Refund</h5>
                <p className="text-xs text-slate-300 mt-1">Application within 10 days from the batch commencement date.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Stage 3</span>
                <h5 className="text-lg font-black text-amber-300 mt-1">50% Course Fee Refund</h5>
                <p className="text-xs text-slate-300 mt-1">Application between 11 to 20 days from batch commencement date.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-[11px] font-bold text-brand-yellow uppercase tracking-wider block">Stage 4</span>
                <h5 className="text-lg font-black text-rose-400 mt-1">No Refund Post 30 Days</h5>
                <p className="text-xs text-slate-300 mt-1">25% between days 21–30. 0% refund after 30 calendar days of batch start.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

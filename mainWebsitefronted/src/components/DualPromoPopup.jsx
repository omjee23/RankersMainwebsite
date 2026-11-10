import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Sparkles,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  Trophy,
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function DualPromoPopup({
  user,
  onOpenRSAT,
  onOpenRankX
}) {
  const [activePopup, setActivePopup] = useState(null); // 'RSAT' | 'RANKEX' | null
  const [timeLeft, setTimeLeft] = useState(10);
  const [floatingBadge, setFloatingBadge] = useState(null); // 'RSAT' | 'RANKEX'

  const timerRef = useRef(null);
  const nextIntervalRef = useRef(null);

  // Helper to get session counts
  const getCounts = () => {
    try {
      const rsat = parseInt(sessionStorage.getItem('rp_promo_rsat_count') || '0', 10);
      const rankex = parseInt(sessionStorage.getItem('rp_promo_rankex_count') || '0', 10);
      return { rsat, rankex };
    } catch (e) {
      return { rsat: 0, rankex: 0 };
    }
  };

  const incrementCount = (type) => {
    try {
      const { rsat, rankex } = getCounts();
      if (type === 'RSAT') {
        sessionStorage.setItem('rp_promo_rsat_count', String(rsat + 1));
      } else if (type === 'RANKEX') {
        sessionStorage.setItem('rp_promo_rankex_count', String(rankex + 1));
      }
    } catch (e) {}
  };

  // Schedule next popup
  const scheduleNext = (delayMs = 60000) => {
    if (nextIntervalRef.current) clearTimeout(nextIntervalRef.current);
    nextIntervalRef.current = setTimeout(() => {
      triggerNextPopup();
    }, delayMs);
  };

  const triggerNextPopup = () => {
    const { rsat, rankex } = getCounts();
    
    // Stop if both shown 2 times each (max 4 displays)
    if (rsat >= 2 && rankex >= 2) return;

    // Decide which popup to show: Alternate
    let nextType = 'RSAT';
    if (rsat > rankex && rankex < 2) {
      nextType = 'RANKEX';
    } else if (rsat >= 2 && rankex < 2) {
      nextType = 'RANKEX';
    } else if (rankex >= 2 && rsat < 2) {
      nextType = 'RSAT';
    } else if (rsat <= rankex && rsat < 2) {
      nextType = 'RSAT';
    }

    incrementCount(nextType);
    setActivePopup(nextType);
    setFloatingBadge(nextType);
    setTimeLeft(10);
  };

  // Initial trigger after 6 seconds of landing on page
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      const { rsat, rankex } = getCounts();
      if (rsat < 2 || rankex < 2) {
        triggerNextPopup();
      }
    }, 6000);

    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearInterval(timerRef.current);
      if (nextIntervalRef.current) clearTimeout(nextIntervalRef.current);
    };
  }, []);

  // 10-Second Countdown when activePopup is shown
  useEffect(() => {
    if (!activePopup) return;

    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleClosePopup();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePopup]);

  const handleClosePopup = () => {
    setActivePopup(null);
    if (timerRef.current) clearInterval(timerRef.current);
    // Schedule next popup after 2.5 minutes (or 90s)
    scheduleNext(90000);
  };

  const handleAction = (type) => {
    handleClosePopup();
    if (type === 'RSAT' && onOpenRSAT) {
      onOpenRSAT();
    } else if (type === 'RANKEX' && onOpenRankX) {
      onOpenRankX();
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. TIMED POPUP MODAL (10-Second Auto Dismiss with Countdown) */}
      {/* ========================================================= */}
      {activePopup && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-brand-yellow transform animate-in zoom-in-95 duration-200">
            
            {/* Top Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Countdown Timer Visual Bar (10s progress) */}
            <div className="w-full bg-black/20 h-1.5 relative overflow-hidden">
              <div
                className="h-full bg-brand-yellow transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>

            {/* --- RSAT POPUP DESIGN --- */}
            {activePopup === 'RSAT' && (
              <>
                <div className="relative bg-gradient-to-br from-[#0B1B3D] via-[#064e3b] to-[#0B1B3D] p-6 sm:p-7 text-white text-center overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                        <span>RSAT 2026-27 Scholarship</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-bold text-amber-300">
                        ⏳ {timeLeft}s
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      Win Up to <span className="text-brand-yellow underline decoration-emerald-400 decoration-wavy">100% Scholarship</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium max-w-sm">
                      Rankers Scholarship Admission Test (Online CBT). Get complete tuition fee waiver on NEET &amp; IIT-JEE batches!
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                        ₹
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-sm leading-tight">Fee: ₹100 Only</span>
                        <span className="text-[11px] text-slate-600">Online test token</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-sm leading-tight">30 Minutes</span>
                        <span className="text-[11px] text-slate-600">Quick CBT Exam</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Instant AI Scorecard &amp; Personalized Performance Matrix</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Appear from your Phone or Laptop anywhere in India</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleAction('RSAT')}
                      className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <span>Apply for RSAT Exam Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="px-4 py-3.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-2xl text-xs font-bold transition"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* --- RANKEX POPUP DESIGN --- */}
            {activePopup === 'RANKEX' && (
              <>
                <div className="relative bg-gradient-to-br from-[#0B1B3D] via-[#102A5C] to-[#0B1B3D] p-6 sm:p-7 text-white text-center overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow/20 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/50 text-amber-300 font-black text-[11px] uppercase tracking-wider">
                        <Trophy className="w-3.5 h-3.5 text-brand-yellow" />
                        <span>RANKEX 2027 Talent Mahasangram</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-bold text-amber-300">
                        ⏳ {timeLeft}s
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      Win <span className="text-brand-yellow underline decoration-amber-400 decoration-wavy">100% Tuition Waiver</span> + Cash Awards
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium max-w-sm">
                      All-India Talent &amp; Excellence Exam. Win fee waivers, merit cash awards, medals, and free hostel facility in Indore!
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-brand-navy flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                        <Star className="w-4 h-4 fill-brand-navy" />
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-sm leading-tight">AIR 1–100</span>
                        <span className="text-[11px] text-slate-600">Merit Cash Prizes</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 text-sm leading-tight">Class 9th–12th</span>
                        <span className="text-[11px] text-slate-600">&amp; Droppers</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Appear Offline at Vijay Nagar Main Campus or Online CBT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Direct Mentorship under 25+ Yrs Kota Legend Founders</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleAction('RANKEX')}
                      className="flex-1 py-3.5 px-4 bg-brand-navy hover:bg-[#152a55] text-brand-yellow font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <span>Register for RANKEX 2027</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="px-4 py-3.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-2xl text-xs font-bold transition"
                    >
                      Later
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FLOATING QUICK ACCESS BADGES (Bottom Left)            */}
      {/* ========================================================= */}
      {!activePopup && (
        <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
          {/* RSAT Pill */}
          <button
            onClick={() => onOpenRSAT && onOpenRSAT()}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 transform hover:scale-105"
            title="Open RSAT Scholarship Exam"
          >
            <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-brand-yellow animate-pulse" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-200 leading-tight">
                Scholarship
              </span>
              <span className="block text-xs font-black leading-tight">
                Apply for RSAT (100%)
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition" />
          </button>

          {/* RANKEX Pill */}
          <button
            onClick={() => onOpenRankX && onOpenRankX()}
            className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#0B1B3D] hover:bg-[#152a55] text-brand-yellow shadow-xl hover:shadow-2xl border border-brand-yellow/30 transition-all duration-300 transform hover:scale-105"
            title="Open RANKEX 2027 Talent Exam"
          >
            <div className="w-6 h-6 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black text-xs">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-300 leading-tight">
                Talent Exam
              </span>
              <span className="block text-xs font-black text-white leading-tight">
                Apply for RANKEX 2027
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-brand-yellow group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      )}
    </>
  );
}

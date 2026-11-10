import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Gift
} from 'lucide-react';

export default function RsatPromoPopup({
  user,
  onOpenFunnel
}) {
  const [showEntranceModal, setShowEntranceModal] = useState(false);
  const [widgetMinimized, setWidgetMinimized] = useState(false);

  useEffect(() => {
    // Show entrance modal 1.5 seconds after page load if not closed in this session
    const hasSeenModal = sessionStorage.getItem('rp_rsat_modal_dismissed');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setShowEntranceModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissEntrance = () => {
    setShowEntranceModal(false);
    sessionStorage.setItem('rp_rsat_modal_dismissed', 'true');
  };

  const handleClickPopup = () => {
    setShowEntranceModal(false);
    sessionStorage.setItem('rp_rsat_modal_dismissed', 'true');
    if (onOpenFunnel) {
      onOpenFunnel();
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. ENTRANCE POPUP MODAL (Appears on Search / Site Visit)   */}
      {/* ========================================================= */}
      {showEntranceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-brand-yellow/80 transform animate-in zoom-in-95 duration-300">
            
            {/* Top Close Button */}
            <button
              onClick={handleDismissEntrance}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Gradient Header Banner */}
            <div className="relative bg-gradient-to-br from-brand-navy via-[#172554] to-brand-navy p-6 sm:p-7 text-white text-center overflow-hidden">
              {/* Background ambient glow circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-yellow/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow font-black text-[11px] uppercase tracking-wider mb-2.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-yellow animate-pulse" />
                  <span>RSAT 2026-27 All-India Scholarship</span>
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Win Up to <span className="text-brand-yellow underline decoration-wavy decoration-emerald-400">100% Scholarship</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium max-w-sm">
                  Rankers Scholarship Admission Test (Online CBT). Get complete tuition fee waiver on NEET &amp; IIT-JEE batches!
                </p>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 sm:p-7 space-y-4">
              
              {/* Highlights Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                    ₹
                  </div>
                  <div>
                    <span className="block font-black text-slate-900 text-sm leading-tight">Fee: ₹100 Only</span>
                    <span className="text-[11px] text-slate-600">Online test fee</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-black text-emerald-950 text-sm leading-tight">Instant or Later</span>
                    <span className="text-[11px] text-emerald-700">Choose exam time</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-black text-blue-950 text-sm leading-tight">100% Waiver</span>
                    <span className="text-[11px] text-blue-700">For 90%+ scores</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-black shadow-xs">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-black text-purple-950 text-sm leading-tight">Prep Material</span>
                    <span className="text-[11px] text-purple-700">Free sample papers</span>
                  </div>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleClickPopup}
                  className="w-full py-4 px-6 bg-gradient-to-r from-brand-yellow via-[#ffcd1a] to-brand-yellow hover:from-[#e6a500] hover:to-[#e6a500] text-brand-navy rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-brand-navy fill-brand-navy" />
                  <span>Register &amp; Claim 100% Scholarship</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDismissEntrance}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition text-center"
                >
                  I'll explore later &rarr;
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-400 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Safe &bull; Instant CBT Result &bull; 100% Transparent Scholarship Matrix
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PERSISTENT RIGHT-SIDE FLOATING WIDGET (All Pages)      */}
      {/* ========================================================= */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300">
        
        {widgetMinimized ? (
          /* Minimized Pill Button */
          <button
            onClick={() => setWidgetMinimized(false)}
            className="flex items-center gap-2 bg-gradient-to-l from-brand-navy to-brand-navyCard text-white py-3 px-2 rounded-l-2xl shadow-2xl border-y border-l border-brand-yellow hover:bg-brand-navy transition group"
            title="Open RSAT 100% Scholarship Offer"
          >
            <ChevronLeft className="w-4 h-4 text-brand-yellow group-hover:-translate-x-0.5 transition" />
            <div className="flex flex-col items-center">
              <Award className="w-5 h-5 text-brand-yellow animate-bounce" />
              <span className="text-[10px] font-black [writing-mode:vertical-rl] rotate-180 uppercase tracking-widest text-brand-yellow mt-1">
                100% SCHOLARSHIP
              </span>
            </div>
          </button>
        ) : (
          /* Expanded Floating Banner Card */
          <div className="relative group mr-2 sm:mr-3">
            
            {/* Subtle glow border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow to-emerald-400 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 pointer-events-none" />

            <div className="relative bg-gradient-to-br from-brand-navy via-[#0d183f] to-brand-navy border-2 border-brand-yellow text-white rounded-3xl p-3.5 sm:p-4 shadow-2xl w-60 sm:w-64 cursor-pointer"
                 onClick={handleClickPopup}
            >
              
              {/* Close / Minimize button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setWidgetMinimized(true);
                }}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
                title="Minimize banner"
                aria-label="Minimize"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Card Header & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black shadow-inner flex-shrink-0">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-black text-brand-yellow uppercase tracking-wider block">
                    RSAT 2026-27
                  </span>
                  <span className="text-[10px] text-emerald-400 font-extrabold block">
                    Fee: ₹100 Only
                  </span>
                </div>
              </div>

              {/* Catchy Title */}
              <div className="space-y-0.5 my-2">
                <h4 className="text-sm font-black text-white leading-tight">
                  Win Up to <span className="text-brand-yellow">100% Scholarship</span>
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  Instant Test OR Schedule your preferred time slot!
                </p>
              </div>

              {/* Features bullet preview */}
              <div className="bg-white/5 rounded-xl p-2 my-2 border border-white/10 text-[10px] space-y-1 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-brand-yellow flex-shrink-0" />
                  <span>90%+ score = 100% Tuition Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>Free Diagnostic Sample Papers</span>
                </div>
              </div>

              {/* Main Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickPopup();
                }}
                className="w-full mt-1 py-2.5 px-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 transform hover:scale-[1.03] active:scale-[0.97]"
              >
                <span>Take RSAT Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

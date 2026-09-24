import React from 'react';
import { GraduationCap, Compass, Dna, Target, Calendar, ArrowRight } from 'lucide-react';

const courses = [
  {
    icon: GraduationCap,
    title: 'IIT-JEE / NEET Integrated',
    tag: 'Comprehensive Batches',
    desc: 'Dual preparation foundation for students targeting top medical colleges (AIIMS) and engineering institutes (IITs/NITs).',
    features: ['Board + Competitive Integration', 'Daily Practice Problems (DPP)', 'Regular Testing Cycle']
  },
  {
    icon: Compass,
    title: 'IIT-JEE (Mains + Advanced)',
    tag: '11th, 12th & Dropper',
    desc: 'Rigorous conceptual depth in Physics, Chemistry, and Advanced Mathematics. Specially tailored for JEE Advanced and Olympiads (IOQM, RMO, INMO).',
    features: ['Advanced Problem Workshops', 'Speed & Accuracy Drill', 'Personalized Rank Improvement']
  },
  {
    icon: Dna,
    title: 'NEET (Medical UG)',
    tag: '11th, 12th & Dropper',
    desc: 'NCERT line-by-line mastery in Biology, Chemistry, and Physics. Designed to secure 680+ marks for Government Medical Colleges and AIIMS.',
    features: ['NCERT Line-by-Line Decode', 'Weekly OMR Speed Tests', 'Doctor Mentorship Support']
  },
  {
    icon: Target,
    title: '9th & 10th Foundation',
    tag: 'Early Edge Programme',
    desc: 'Strong foundational roots in Science & Mathematics, preparing school students early for NTSE, SOF, NMTC, and early Olympiad readiness.',
    features: ['Conceptual Foundation', 'Mental Ability & Logic', 'Stress-free Learning Environment']
  }
];

export default function CoursesSection({ onOpenEnquiry, onOpenRSAT }) {
  return (
    <section id="courses" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-navy font-extrabold text-xs uppercase tracking-wider mb-3">
            Academic Courses
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Course for NEET &amp; JEE
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Tailored learning modules designed to build crystal-clear concepts from fundamentals to advanced rank mastery.
          </p>
        </div>

        {/* 4 Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-yellow transition-all duration-300 flex flex-col group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-navy flex items-center justify-center mb-5 group-hover:bg-brand-yellow transition duration-300">
                  <Icon className="w-6 h-6 text-brand-navy" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-yellowDark">
                  {c.tag}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 mb-2 group-hover:text-brand-navy transition">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1 mb-4">
                  {c.desc}
                </p>
                
                <ul className="space-y-2 border-t border-slate-100 pt-4 mb-5 text-xs text-slate-700 font-medium">
                  {c.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellowDark"></span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onOpenEnquiry}
                  className="w-full py-2.5 rounded-xl border border-brand-navy text-brand-navy font-bold text-xs uppercase hover:bg-brand-navy hover:text-white transition flex items-center justify-center gap-1"
                >
                  <span>Enquire for Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Batch Alert Banner (Dynamic) */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-yellow shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 text-brand-navy flex-shrink-0 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-brand-navy" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[11px] uppercase tracking-wider">
                  Upcoming Batch Alert
                </span>
                <span className="text-xs text-slate-500 font-semibold">Vijay Nagar Campus</span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                24 June 2026 — NEET Dropper Batch Starting Soon
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Small batch size (strictly 30 students) for intensive 1-on-1 mentorship. Limited seats remaining!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20enquire%20about%20the%20NEET%20Dropper%20Batch%20starting%2024%20June."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-6 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-extrabold text-sm shadow transition text-center whitespace-nowrap"
            >
              Enquire on WhatsApp
            </a>
            <button
              onClick={onOpenRSAT}
              className="flex-1 md:flex-none px-5 py-3 bg-brand-navy hover:bg-brand-navyLight text-white rounded-xl font-bold text-sm shadow transition text-center whitespace-nowrap"
            >
              Check Scholarship
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

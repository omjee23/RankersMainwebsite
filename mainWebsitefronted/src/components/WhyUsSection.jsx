import React from 'react';
import { Users, Clock, BookOpen, Check, X, Shield, Sparkles } from 'lucide-react';

const stats = [
  { num: '30–40', label: 'Students per batch', desc: 'Optimal batch size for personal interaction' },
  { num: '1:10', label: 'Teacher-to-student ratio', desc: 'Continuous close-knit guidance' },
  { num: '1 hr', label: 'Daily doubt clearing', desc: 'Solved by the same senior faculty' },
  { num: '8–2', label: 'Class timing (AM–PM)', desc: 'Optimized morning learning hours' },
  { num: '2–8', label: 'Library access (PM–PM)', desc: 'Peaceful air-conditioned study hall' },
  { num: '₹', label: 'Affordable fee structure', desc: 'Transparent fees with merit scholarships' }
];

const comparisons = [
  {
    criteria: 'Faculty Profile',
    rp: 'Founding faculty mentorship — each founder brings 25+ years of classroom experience.',
    ci: 'Employee-based faculty; classes frequently taken by junior trainees or temporary staff.'
  },
  {
    criteria: 'Faculty Stability',
    rp: 'Dedicated core team stays throughout the year ensuring consistent teaching continuity.',
    ci: 'Frequent teacher turnover mid-session disrupts student learning pace and rhythm.'
  },
  {
    criteria: 'Batch Size',
    rp: 'Limited to 30–40 students for individual eye-contact and continuous monitoring.',
    ci: '100+ to 250+ students packed in massive auditoriums where individual doubts get ignored.'
  },
  {
    criteria: 'Doubt Resolution',
    rp: 'Doubts cleared 1-on-1 every day by the same senior faculty who teach the class.',
    ci: 'Separate doubt counters managed by junior freshers or outsourced part-time tutors.'
  },
  {
    criteria: 'Study Material',
    rp: 'Proprietary, updated research content created directly by veteran expert teachers.',
    ci: 'Outsourced generic modules bought from third-party vendors with dated questions.'
  },
  {
    criteria: 'Syllabus Execution',
    rp: 'Deep conceptual mastery with timely syllabus completion and 3 rounds of revision.',
    ci: 'Deadline-driven rushed syllabus at year-end leading to severe learning gaps.'
  },
  {
    criteria: 'Result Focus',
    rp: 'Targeted focus on Top 1–100 Rank mastery, making every student feel special.',
    ci: 'Mass marketing model focused on hoarding toppers while average students lag behind.'
  }
];

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-navy font-extrabold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-brand-yellowDark" /> Why Choose Rankers Path
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Focus on Results, Not Rumours
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Everything in our system is calibrated to ensure that every student receives the attention required to crack NEET and IIT-JEE.
          </p>
        </div>

        {/* 6 Key Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-5 text-center hover:border-brand-yellow hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-black text-brand-navy font-sans tracking-tight">
                <span className="text-brand-yellowDark">{s.num}</span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 mt-2 leading-snug">
                {s.label}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-[#0B1B3D] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-brand-yellow/30">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-brand-yellow font-extrabold text-xs uppercase tracking-widest">Honest Academic Comparison</span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              Rankers Path vs. Conventional Institutes
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              See why serious medical and engineering aspirants choose our founder-mentored small batches.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/20 text-xs sm:text-sm uppercase tracking-wider text-slate-300">
                  <th className="py-4 px-4 font-bold w-1/4">Criteria</th>
                  <th className="py-4 px-4 font-extrabold text-brand-yellow w-3/8 bg-white/5 rounded-t-xl">
                    Rankers Path (Vijay Nagar)
                  </th>
                  <th className="py-4 px-4 font-semibold text-slate-400 w-3/8">
                    Conventional Mass Coaching
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-4 px-4 font-bold text-slate-200">
                      {row.criteria}
                    </td>
                    <td className="py-4 px-4 text-emerald-300 bg-white/5 font-medium leading-relaxed">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{row.rp}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-normal leading-relaxed">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{row.ci}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

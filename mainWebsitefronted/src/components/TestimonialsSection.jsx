import React, { useState, useEffect } from 'react';
import {
  Star,
  Quote,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function TestimonialsSection({ onOpenRSAT, onOpenRankX, onOpenEnquiry }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'CURRENT', 'ALUMNI', 'NEET', 'JEE'

  useEffect(() => {
    let isMounted = true;
    api.getTestimonials({ activeOnly: 'true' })
      .then(res => {
        if (isMounted && res && res.data && res.data.length > 0) {
          setTestimonials(res.data);
        }
      })
      .catch(err => {
        console.warn('Could not fetch testimonials:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filteredTestimonials = testimonials.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CURRENT') return item.studentType === 'CURRENT' || !item.studentType;
    if (activeFilter === 'ALUMNI') return item.studentType === 'ALUMNI';
    if (activeFilter === 'NEET') return item.targetStream === 'NEET';
    if (activeFilter === 'JEE') return item.targetStream === 'JEE';
    return true;
  });

  const filterButtons = [
    { id: 'ALL', label: 'All Reviews', icon: Users },
    { id: 'CURRENT', label: '🟢 Currently Studying', icon: BookOpen },
    { id: 'ALUMNI', label: '🎓 Old Students / Alumni', icon: GraduationCap },
    { id: 'NEET', label: '🩺 NEET Aspirants' },
    { id: 'JEE', label: '⚙️ JEE Aspirants' }
  ];

  return (
    <section id="testimonials" className="py-14 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 border-t border-slate-200/80 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-brand-navy/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-navy text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellowDark" />
            <span>Student Voices &bull; Real Experiences</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy tracking-tight">
            What Our Students Say About <span className="text-brand-yellowDark">Rankers Path</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Honest feedback from students currently preparing for NEET &amp; JEE, and alumni mentored by our senior faculty team at Vijay Nagar Indore.
          </p>

          {/* Filter Pills */}
          <div className="pt-2 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
            {filterButtons.map(pill => {
              const Icon = pill.icon;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all transform active:scale-95 flex items-center gap-1.5 ${
                    activeFilter === pill.id
                      ? 'bg-brand-navy text-brand-yellow shadow-sm ring-2 ring-brand-navy/15'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTestimonials.map((item) => {
            const isAlumni = item.studentType === 'ALUMNI';
            const stream = (item.targetStream || 'NEET').toUpperCase();

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5 relative"
              >
                <div>
                  {/* Student Header: Small Photo + Name + Type Tag */}
                  <div className="flex items-center gap-3 mb-3">
                    {/* Small Circular Avatar (w-12 h-12) */}
                    <div className="relative flex-shrink-0">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.studentName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-brand-yellow/60 shadow-xs group-hover:border-brand-yellow transition"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.studentName)}&background=071126&color=ffb800&bold=true`;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-navy text-brand-yellow font-black text-sm flex items-center justify-center border-2 border-brand-yellow/60 shadow-xs">
                          {item.studentName?.charAt(0) || 'S'}
                        </div>
                      )}
                      
                      <div
                        className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white"
                        title="Verified Student"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-brand-navy transition-colors">
                          {item.studentName}
                        </h3>
                        {/* Target Stream Pill */}
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          stream === 'JEE'
                            ? 'bg-blue-100 text-blue-800'
                            : stream === 'FOUNDATION'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stream === 'JEE' ? 'JEE' : stream === 'FOUNDATION' ? 'Foundation' : 'NEET'}
                        </span>
                      </div>

                      {/* Status Tag: Currently Studying vs Alumni */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isAlumni ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            <GraduationCap className="w-2.5 h-2.5" />
                            <span>Old Student / Alumni</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Currently Studying</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {item.batch || 'Classroom Preparation'}
                      </p>
                    </div>
                  </div>

                  {/* Compact 5-Star Rating */}
                  <div className="flex items-center gap-1 mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (item.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-400 ml-1">
                      {item.rating || 5}.0
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="relative">
                    <Quote className="w-5 h-5 text-slate-200 absolute -top-1 -left-1 rotate-180 pointer-events-none" />
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed pl-5 font-normal">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact Bottom Banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand-navy to-brand-navyCard p-5 sm:p-6 text-white border border-brand-yellow/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Start Your Preparation with Central India&apos;s Best Mentors
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Target NEET &amp; JEE Advanced with personalized doubt sessions and weekly CBT test series.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <button
              onClick={onOpenRSAT}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
            >
              <span>Apply for RSAT (100% Scholarship)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenRankX}
              className="px-3.5 py-2 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy text-xs font-black uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
            >
              <span>Register for RANKEX</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

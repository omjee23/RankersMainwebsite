import React from 'react';
import { ArrowRight, CheckCircle2, Award, Zap, Phone, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Hero({ onOpenRankX, onOpenRSAT }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1B3D] via-[#0D244F] to-[#0B1B3D] text-white pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Decorative Background Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              <span>SAFALTA KA SANKALP &bull; VIJAY NAGAR, INDORE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              NEET &amp; IIT-JEE Coaching <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-amber-300 to-yellow-400">
                Led by Founding Mentors
              </span>
            </h1>

            {/* Sub-headline & Tagline */}
            <p className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
              <span className="text-brand-yellow font-bold">Student aur parents ka vishwas —</span> Rankers Path banaye har baccha khaas. 
              No junior substitute teachers. Every single batch is taught personally by senior faculty with <strong>25+ years of proven results</strong>.
            </p>

            {/* Micro Highlights Pill Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-brand-yellow" /> Strictly 30 Students/Batch
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-brand-yellow" /> 1:10 Personal Mentorship
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-brand-yellow" /> 1 Hour Daily Doubt Clearing
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenRankX}
                className="w-full sm:w-auto px-8 py-4 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-base shadow-xl shadow-brand-yellow/20 hover:shadow-brand-yellow/40 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <Award className="w-5 h-5 text-brand-navy" />
                <span>Register for RankX 2026</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenRSAT}
                className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl font-extrabold text-base transition flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-brand-yellow" />
                <span>Take Online RSAT Test</span>
              </button>
            </div>

            {/* Quick Contact Line */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-sm text-slate-400">
              <a href="tel:+919131435511" className="hover:text-white flex items-center gap-1.5 transition">
                <Phone className="w-4 h-4 text-brand-yellow" /> 9131435511
              </a>
              <span>&bull;</span>
              <a
                href="https://wa.me/919131435511?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Rankers%20Path."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 flex items-center gap-1.5 transition"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Hero Media & Trust Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Card Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-yellow/40 bg-brand-navyCard">
                <img
                  src="/assets/web/hero.jpg"
                  alt="Rankers Path students and faculty in Indore"
                  className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80"></div>
                
                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-brand-navy/90 backdrop-blur-md border border-white/15 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-yellow font-extrabold">Next Batch Starting</p>
                      <h4 className="text-lg font-bold text-white">NEET Dropper Batch: 24 June</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy font-black text-xs">
                      Limited Seats
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Top Badge */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 bg-white text-brand-navy p-3.5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center font-black text-xl text-brand-navy shadow-inner">
                  25+
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">Years Experience</p>
                  <p className="text-sm font-extrabold text-brand-navy">Core Founding Faculty</p>
                </div>
              </div>

              {/* Floating Right Badge */}
              <div className="absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-6 bg-brand-yellow text-brand-navy p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <Award className="w-8 h-8 text-brand-navy" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Top 1–100 AIR Ranks</p>
                  <p className="text-xs font-extrabold text-slate-900">NEET &bull; JEE &bull; Olympiads</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3 Quick Action Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 pt-8 border-t border-white/10">
          
          {/* Card 1: RankX Offline Exam */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/50 rounded-2xl p-6 transition duration-300 group cursor-pointer" onClick={onOpenRankX}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-brand-yellow text-brand-navy font-bold text-xs uppercase">Offline Exam</span>
              <span className="text-xs text-brand-yellow font-semibold">Venue Booking Open</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-brand-yellow transition">RankX Scholarship 2026</h3>
            <p className="text-slate-300 text-sm mt-1">Appear at selected Indore test centres. Get up to 100% scholarship on tuition fees.</p>
            <div className="mt-4 flex items-center text-sm font-bold text-brand-yellow group-hover:translate-x-1 transition">
              Select Exam Centre &amp; Register &rarr;
            </div>
          </div>

          {/* Card 2: RSAT Online CBT */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/50 rounded-2xl p-6 transition duration-300 group cursor-pointer" onClick={onOpenRSAT}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-blue-500 text-white font-bold text-xs uppercase">Online CBT</span>
              <span className="text-xs text-blue-300 font-semibold">Immediate Result</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-brand-yellow transition">RSAT Online Scholarship Test</h3>
            <p className="text-slate-300 text-sm mt-1">45-minute computer-based MCQ test. Real NTA pattern with automatic score analysis.</p>
            <div className="mt-4 flex items-center text-sm font-bold text-blue-300 group-hover:translate-x-1 transition">
              Start Online Test Now &rarr;
            </div>
          </div>

          {/* Card 3: Year-Long Test Series */}
          <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/50 rounded-2xl p-6 transition duration-300 group cursor-pointer" onClick={onOpenRSAT}>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-white font-bold text-xs uppercase">20 Scheduled Tests</span>
              <span className="text-xs text-emerald-300 font-semibold">NEET &amp; IIT-JEE</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-brand-yellow transition">Comprehensive Test Series</h3>
            <p className="text-slate-300 text-sm mt-1">Full syllabus &amp; part syllabus mock tests with negative marking and question explanations.</p>
            <div className="mt-4 flex items-center text-sm font-bold text-emerald-300 group-hover:translate-x-1 transition">
              Explore Test Series &rarr;
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

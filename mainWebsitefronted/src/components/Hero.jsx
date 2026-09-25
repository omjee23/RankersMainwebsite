import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Download,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function Hero({ onOpenRankX, onOpenRSAT, onOpenEnquiry }) {
  // Tabs: 'jee', 'neet', 'foundation', 'rankx', 'rsat'
  const [activeCourseTab, setActiveCourseTab] = useState('jee');

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1B3D] via-[#0D244F] to-[#0B1B3D] text-white pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Decorative Background Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

        {/* 1. TOP HEADER BAND (Coaching Name, Quote & Helpline Box) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          
          {/* Left: Coaching Name - Indore & Quote */}
          <div className="text-center md:text-left space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs sm:text-sm font-extrabold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              <span>Rankers Path — Indore</span>
            </div>
            
            {/* Institute Quote */}
            <p className="text-sm sm:text-base text-slate-200 italic font-medium">
              &ldquo;Student aur parents ka vishwas — Rankers Path banaye har baccha khaas&rdquo;
            </p>
          </div>

          {/* Right: Helpline Box (Direct from User's Sketch) */}
          <div className="bg-brand-navyCard/90 border-2 border-brand-yellow rounded-2xl p-4 sm:px-6 sm:py-3.5 shadow-xl shadow-brand-yellow/10 flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="w-11 h-11 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-navy shadow-inner flex-shrink-0">
              <Phone className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-brand-yellow font-extrabold leading-none">
                Admission Helpline
              </p>
              <a
                href="tel:+919131435511"
                className="text-base sm:text-lg font-black text-white hover:text-brand-yellow transition"
              >
                +91 9131435511
              </a>
              <p className="text-[11px] text-slate-300">Indore Campuses &bull; 9 AM - 8 PM</p>
            </div>
            <a
              href="https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20know%20about%20Rankers%20Path%20Indore%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition flex items-center justify-center flex-shrink-0 shadow-md"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

        </div>

        {/* 2. CORE HEADLINE & TRUST BADGE */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-yellow text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-yellow inline" />
            1st Best Coaching for JEE / NEET-UG / Foundation / Olympiads
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Led by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-amber-300 to-yellow-400">25+ Yr. Exp.</span> Top Faculties Group
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Personal mentorship by senior champions: <strong>Chauhan Sir</strong>, <strong>Jaivir Sir</strong>, <strong>Ashlesha Ma&apos;am</strong> &amp; <strong>Chaurasia Sir</strong>. Strictly 30 students per batch — no junior substitute teachers.
          </p>
        </div>

        {/* 3. IMAGE OF FACULTIES (Centerpiece from User's Sketch) */}
        <div className="relative max-w-5xl mx-auto">
          {/* Framed Glowing Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-yellow/50 bg-brand-navyCard group">
            <img
              src="/assets/web/faculty-team-full.png"
              alt="Rankers Path 25+ Years Experienced Faculty Team Indore"
              className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition duration-700 max-h-[460px] object-top"
            />

            {/* Gradient Overlay for Caption Bar */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-90 pointer-events-none"></div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-2xl bg-brand-navy/95 backdrop-blur-md border border-white/20 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-center sm:text-left">
                <span className="text-xs uppercase tracking-wider text-brand-yellow font-extrabold flex items-center justify-center sm:justify-start gap-1.5">
                  <Award className="w-4 h-4 text-brand-yellow" /> Founding Mentors &bull; Central India Dream Team
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
                  Chauhan Sir (Chem) &bull; Jaivir Sir (Phys) &bull; Ashlesha Ma&apos;am (Bio) &bull; Chaurasia Sir (Maths) &amp; Team
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy font-black text-xs uppercase tracking-wider">
                  Strictly 30/Batch
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-slate-200 font-extrabold text-xs">
                  Daily 1 Hr Doubt Clinic
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. COURSES / FEE SECTION (Interactive Tabs from User's Sketch) */}
        <div className="pt-4 max-w-5xl mx-auto">
          
          {/* Section Heading */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase inline-flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-brand-yellow" />
              Courses / FEE
            </h2>
            <div className="w-24 h-1 bg-brand-yellow mx-auto mt-2 rounded-full"></div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Click on any category below to inspect complete syllabus, batch start dates, and transparent fee structures.
            </p>
          </div>

          {/* Interactive Clickable Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/15">
            
            {/* Tab: JEE */}
            <button
              onClick={() => setActiveCourseTab('jee')}
              className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex flex-col items-center justify-center gap-1 ${
                activeCourseTab === 'jee'
                  ? 'bg-brand-yellow text-brand-navy shadow-lg shadow-brand-yellow/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
              }`}
            >
              <span className="uppercase tracking-wider">JEE</span>
              <span className="text-[10px] font-semibold opacity-85">(Main + Adv)</span>
            </button>

            {/* Tab: NEET */}
            <button
              onClick={() => setActiveCourseTab('neet')}
              className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex flex-col items-center justify-center gap-1 ${
                activeCourseTab === 'neet'
                  ? 'bg-brand-yellow text-brand-navy shadow-lg shadow-brand-yellow/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
              }`}
            >
              <span className="uppercase tracking-wider">NEET</span>
              <span className="text-[10px] font-semibold opacity-85">(Medical UG)</span>
            </button>

            {/* Tab: Foundation */}
            <button
              onClick={() => setActiveCourseTab('foundation')}
              className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex flex-col items-center justify-center gap-1 ${
                activeCourseTab === 'foundation'
                  ? 'bg-brand-yellow text-brand-navy shadow-lg shadow-brand-yellow/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
              }`}
            >
              <span className="uppercase tracking-wider">Foundation</span>
              <span className="text-[10px] font-semibold opacity-85">(8th, 9th &amp; 10th)</span>
            </button>

            {/* Tab: Scholarship Test RANKX */}
            <button
              onClick={() => setActiveCourseTab('rankx')}
              className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex flex-col items-center justify-center gap-1 ${
                activeCourseTab === 'rankx'
                  ? 'bg-brand-yellow text-brand-navy shadow-lg shadow-brand-yellow/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
              }`}
            >
              <span className="uppercase tracking-wider">Scholarship</span>
              <span className="text-[10px] font-black text-amber-300 bg-black/25 px-2 py-0.5 rounded-full">
                RANKX (Offline)
              </span>
            </button>

            {/* Tab: RSAT (Online CBT) */}
            <button
              onClick={() => setActiveCourseTab('rsat')}
              className={`col-span-2 sm:col-span-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition flex flex-col items-center justify-center gap-1 ${
                activeCourseTab === 'rsat'
                  ? 'bg-brand-yellow text-brand-navy shadow-lg shadow-brand-yellow/25 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10'
              }`}
            >
              <span className="uppercase tracking-wider">RSAT</span>
              <span className="text-[10px] font-semibold opacity-85">(Online CBT)</span>
            </button>

          </div>

          {/* DYNAMIC CONTENT AREA BASED ON TAB CLICK */}
          <div className="mt-6">
            
            {/* 1. JEE TAB CONTENT */}
            {activeCourseTab === 'jee' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {/* Course 1: JEE 2-Year Program */}
                <div className="bg-brand-navyCard/90 border border-brand-yellow/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-yellow transition shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow font-extrabold text-xs uppercase tracking-wider">
                        Class 11th &amp; 12th
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Batch: 24 June 2026
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      IIT-JEE (Main + Advanced) 2-Yr Program
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Comprehensive Kota-pattern curriculum covering Physics, Chemistry &amp; Advanced Mathematics with daily DPPs and 1-on-1 doubt clinic.
                    </p>

                    {/* Fee Structure Box */}
                    <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Course Fee</p>
                        <p className="text-2xl font-black text-brand-yellow">₹1,10,000 <span className="text-xs font-semibold text-slate-300">/ Year</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Installment Available
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Up to 100% Scholarship via RankX</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Strictly 30 Students per Batch</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>All India Computer-Based Test (CBT) Series</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Free Printed Modules &amp; Daily Practice Sheets</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onOpenEnquiry}
                      className="flex-1 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenRankX}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition text-center"
                    >
                      Check Fee Waiver
                    </button>
                  </div>
                </div>

                {/* Course 2: JEE Dropper / Target Batch */}
                <div className="bg-brand-navyCard/90 border border-brand-yellow/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-yellow transition shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-xs uppercase tracking-wider">
                        12th Passed / Dropper
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Batch: 24 June 2026
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      JEE 1-Yr Intensive Dropper Batch
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      High-tempo rank acceleration program. Focus on advanced problem solving, high-weightage topics, and eliminating negative marking.
                    </p>

                    {/* Fee Structure Box */}
                    <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Course Fee</p>
                        <p className="text-2xl font-black text-brand-yellow">₹95,000 <span className="text-xs font-semibold text-slate-300">/ Year</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-yellow/20 text-brand-yellow font-bold border border-brand-yellow/30">
                          600+ Hours Intensive
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">20 All-India Mock Tests</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Daily 1 Hour Special Doubt Solving Clinic</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Weekly Speed &amp; Accuracy Tests (+4 / -1 Marking)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Direct Guidance by Chauhan Sir &amp; Jaivir Sir</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onOpenEnquiry}
                      className="flex-1 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenRSAT}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition text-center"
                    >
                      Instant RSAT Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. NEET TAB CONTENT */}
            {activeCourseTab === 'neet' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {/* Course 1: NEET 2-Year Program */}
                <div className="bg-brand-navyCard/90 border border-brand-yellow/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-yellow transition shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                        Class 11th &amp; 12th
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Batch: 24 June 2026
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      NEET-UG 2-Year Medical Masterclass
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      NCERT Line-by-Line dissection in Biology, Chemistry &amp; Physics. Built specifically for students aiming for 680+ score for Govt. Medical Colleges and AIIMS.
                    </p>

                    {/* Fee Structure Box */}
                    <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Course Fee</p>
                        <p className="text-2xl font-black text-brand-yellow">₹1,05,000 <span className="text-xs font-semibold text-slate-300">/ Year</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          2 Installments
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Scholarships up to 100%</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>NCERT Line-by-Line Decoded by Ashlesha Ma&apos;am</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Weekly OMR Sheet Speed Drills &amp; Error Analysis</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Strictly 30 Students Batch for 1:1 Attention</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onOpenEnquiry}
                      className="flex-1 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenRankX}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition text-center"
                    >
                      RankX Scholarship
                    </button>
                  </div>
                </div>

                {/* Course 2: NEET Dropper / Alpha Batch */}
                <div className="bg-brand-navyCard/90 border border-brand-yellow/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-yellow transition shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow font-extrabold text-xs uppercase tracking-wider">
                        12th Passed / Repeater
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Batch: 24 June 2026
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      NEET Alpha Achiever (Dropper Batch)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Designed for ambitious repeaters who want to transform a 450–550 score into a 650–700+ rank. Zero distraction, personalized mistake ledger, and rigorous tests.
                    </p>

                    {/* Fee Structure Box */}
                    <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Course Fee</p>
                        <p className="text-2xl font-black text-brand-yellow">₹88,000 <span className="text-xs font-semibold text-slate-300">/ Year</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-yellow text-brand-navy font-black">
                          Limited 30 Seats
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">20 Full Syllabus Mock Tests</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Daily 1 Hour Individual Mentor Doubt Clinic</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Full Physics Numericals Mastery by Jaivir Sir</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Organic &amp; Physical Chemistry by Chauhan Sir</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onOpenEnquiry}
                      className="flex-1 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenRSAT}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition text-center"
                    >
                      Instant RSAT Test
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FOUNDATION TAB CONTENT */}
            {activeCourseTab === 'foundation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {/* Foundation 1: 9th & 10th Integrated */}
                <div className="bg-brand-navyCard/90 border border-brand-yellow/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-yellow transition shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs uppercase tracking-wider">
                        Class 9th &amp; 10th
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Batch: 15 July 2026
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      Pre-Nurture &amp; Career Foundation
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Solid foundational base for NTSE, SOF, NMTC and early JEE/NEET temperament alongside 95%+ guarantee in CBSE/ICSE Board exams.
                    </p>

                    {/* Fee Structure Box */}
                    <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Course Fee</p>
                        <p className="text-2xl font-black text-brand-yellow">₹55,000 <span className="text-xs font-semibold text-slate-300">/ Year</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                          Board + Olympiad
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Easy Quarterly Installments</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Mental Ability, Science &amp; Advanced Mathematics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Special Guidance for International Olympiads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Personal Mentor for School Exam Score Maximization</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onOpenEnquiry}
                      className="flex-1 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenRankX}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition text-center"
                    >
                      RankX Scholarship
                    </button>
                  </div>
                </div>

                {/* Foundation 2: Class 8th Early Edge */}
                <div className="bg-brand-navyCard/90 border border-brand-yellow/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-yellow transition shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-xs uppercase tracking-wider">
                        Class 8th Early Edge
                      </span>
                      <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-yellow" /> Batch: 15 July 2026
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white">
                      Junior Science &amp; Maths Olympiad Edge
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      Fosters analytical curiosity, scientific thinking, and logical deduction in young minds without academic pressure.
                    </p>

                    {/* Fee Structure Box */}
                    <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Course Fee</p>
                        <p className="text-2xl font-black text-brand-yellow">₹45,000 <span className="text-xs font-semibold text-slate-300">/ Year</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                          Stress-Free
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">Activity-based Learning</p>
                      </div>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Interactive Problem-solving Workshops</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Logical Reasoning &amp; Mental Math Shortcuts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                        <span>Regular Parent-Teacher Monthly Connect</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onOpenEnquiry}
                      className="flex-1 py-3 px-5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition text-center shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Enquire for Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenRSAT}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition text-center"
                    >
                      Check Aptitude Online
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SCHOLARSHIP TEST - RANKX CONTENT */}
            {activeCourseTab === 'rankx' && (
              <div className="bg-gradient-to-r from-brand-navyCard via-[#132c5f] to-brand-navyCard border-2 border-brand-yellow rounded-3xl p-6 sm:p-9 shadow-2xl animate-fadeIn">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow text-brand-navy font-black text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4 text-brand-navy" />
                      Offline Talent Search Exam &bull; Indore Centres
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white">
                      RankX 2026 Scholarship Exam
                    </h3>

                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                      Appear physically at our authentic Indore test centres (<strong>Vijay Nagar</strong>, <strong>Old Palasia</strong>, or <strong>Bhawarkua</strong>). Win up to <strong className="text-brand-yellow">100% Scholarship on Tuition Fees</strong> + Cash awards &amp; personalized mentor roadmap.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Scholarship</p>
                        <p className="text-lg font-black text-white">Up to 100%</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Exam Fee</p>
                        <p className="text-lg font-black text-emerald-400">₹0 (FREE)</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Centers</p>
                        <p className="text-lg font-black text-white">3 in Indore</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Admit Card</p>
                        <p className="text-lg font-black text-white">Instant QR</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <button
                      onClick={onOpenRankX}
                      className="px-8 py-4 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-base shadow-xl shadow-brand-yellow/20 hover:shadow-brand-yellow/40 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                      <Award className="w-5 h-5 text-brand-navy" />
                      <span>Register for RankX &amp; Get Admit Card</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>

                    <a
                      href="https://wa.me/919131435511?text=Hi%2C%20please%20send%20me%20the%20RankX%20syllabus%20and%20sample%20papers."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
                    >
                      <Download className="w-4 h-4 text-brand-yellow" />
                      <span>Download Syllabus &amp; Sample Papers</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 5. RSAT TAB CONTENT */}
            {activeCourseTab === 'rsat' && (
              <div className="bg-gradient-to-r from-brand-navyCard via-[#122852] to-brand-navyCard border-2 border-brand-yellow rounded-3xl p-6 sm:p-9 shadow-2xl animate-fadeIn">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500 text-white font-black text-xs uppercase tracking-wider">
                      <Zap className="w-4 h-4 text-white" />
                      Instant Online Computer-Based Test (CBT)
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-black text-white">
                      RSAT Online Scholarship Test
                    </h3>

                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                      Take our timed online CBT exam right from your mobile or laptop. Immediate auto-grading, +4/-1 NEET/JEE marking, detailed explanation for every question, and instant scholarship coupon generation.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Duration</p>
                        <p className="text-lg font-black text-white">15-30 Mins</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Format</p>
                        <p className="text-lg font-black text-white">NTA Pattern</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Result</p>
                        <p className="text-lg font-black text-emerald-400">Instant Score</p>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-brand-yellow font-extrabold">Platform</p>
                        <p className="text-lg font-black text-white">Mobile/PC</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <button
                      onClick={onOpenRSAT}
                      className="px-8 py-4 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-base shadow-xl shadow-brand-yellow/20 hover:shadow-brand-yellow/40 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                      <Zap className="w-5 h-5 text-brand-navy" />
                      <span>Start Online RSAT Exam Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>

                    <button
                      onClick={onOpenRankX}
                      className="px-6 py-3 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/20 rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 text-center"
                    >
                      <span>Prefer Offline Exam? Register for RankX</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

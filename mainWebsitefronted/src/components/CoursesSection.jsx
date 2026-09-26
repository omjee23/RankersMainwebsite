import React, { useState } from 'react';
import { Calendar, X, CheckCircle2, ArrowRight, Sparkles, BookOpen, Clock, Users, ShieldCheck, Phone, HelpCircle } from 'lucide-react';

/* ==========================================================================
   AUTHENTIC SVG ILLUSTRATIONS MATCHING REFERENCE SCREENSHOT
   ========================================================================== */

function JeeAdvancedIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      {/* Background blueprint grid circle */}
      <circle cx="100" cy="65" r="50" fill="url(#jeeGrad)" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3"/>
      {/* Construction buildings skyline */}
      <rect x="62" y="52" width="16" height="48" rx="2" fill="#CBD5E1"/>
      <rect x="80" y="40" width="22" height="60" rx="2" fill="#94A3B8"/>
      <rect x="104" y="46" width="18" height="54" rx="2" fill="#CBD5E1"/>
      <rect x="124" y="56" width="14" height="44" rx="2" fill="#E2E8F0"/>
      {/* Windows on buildings */}
      <circle cx="91" cy="48" r="1.5" fill="#FFFFFF"/>
      <circle cx="91" cy="56" r="1.5" fill="#FFFFFF"/>
      <circle cx="91" cy="64" r="1.5" fill="#FFFFFF"/>
      {/* Crane arm */}
      <path d="M55 45 L78 32 L88 32" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="68" y1="38" x2="68" y2="50" stroke="#F59E0B" strokeWidth="1.5"/>
      {/* Engineer Body in Blue Uniform */}
      <ellipse cx="100" cy="112" rx="28" ry="16" fill="#0284C7"/>
      <path d="M84 108 L100 124 L116 108" fill="#FBBF24"/>
      {/* Neck & Face */}
      <rect x="95" y="78" width="10" height="12" rx="3" fill="#FCD34D"/>
      <circle cx="100" cy="68" r="15" fill="#FCD34D"/>
      {/* Yellow Safety Hardhat */}
      <path d="M82 62 C82 48 118 48 118 62 Z" fill="#FFB800"/>
      <rect x="78" y="60" width="44" height="5" rx="2.5" fill="#D97706"/>
      <circle cx="100" cy="53" r="2.5" fill="#FFFFFF"/>
      {/* Blueprint roll */}
      <rect x="74" y="100" width="52" height="7" rx="3.5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5"/>
      {/* Accent gear */}
      <circle cx="142" cy="42" r="8" stroke="#FFB800" strokeWidth="2" strokeDasharray="3 3"/>
      <line x1="142" y1="38" x2="142" y2="46" stroke="#FFB800" strokeWidth="2"/>
    </svg>
  );
}

function NeetUgIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FB923C"/>
          <stop offset="100%" stopColor="#EA580C"/>
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="100" cy="65" r="50" fill="#FEF3C7" fillOpacity="0.4"/>
      
      {/* Microscope (Left) */}
      <path d="M60 110 L102 110" stroke="#334155" strokeWidth="4.5" strokeLinecap="round"/>
      <rect x="68" y="85" width="8" height="25" rx="3" fill="#475569"/>
      <path d="M72 85 C72 63 94 63 94 80" stroke="#334155" strokeWidth="4.5" fill="none"/>
      <rect x="88" y="44" width="11" height="30" rx="3" transform="rotate(22 88 44)" fill="#0284C7"/>
      <rect x="83" y="68" width="15" height="7" rx="2" transform="rotate(22 83 68)" fill="#0369A1"/>
      <circle cx="68" cy="92" r="4.5" fill="#FFB800"/>
      
      {/* Chemical Flask (Right) */}
      <path d="M124 64 L134 64 L134 76 L150 105 C153 110 149 115 143 115 L115 115 C109 115 105 110 108 105 L124 76 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5"/>
      {/* Liquid in flask */}
      <path d="M112 100 L146 100 L142 112 L116 112 Z" fill="url(#flaskGrad)"/>
      <circle cx="125" cy="92" r="3" fill="#F97316"/>
      <circle cx="134" cy="86" r="2" fill="#FBBF24"/>
      <circle cx="122" cy="84" r="1.5" fill="#FB923C"/>
      
      {/* Floating DNA double-helix (Top Center) */}
      <path d="M118 24 Q128 34 138 24 T158 24" stroke="#3B82F6" strokeWidth="2.5" fill="none"/>
      <path d="M118 34 Q128 24 138 34 T158 34" stroke="#10B981" strokeWidth="2.5" fill="none"/>
      <line x1="124" y1="27" x2="124" y2="31" stroke="#64748B" strokeWidth="1.5"/>
      <line x1="136" y1="27" x2="136" y2="31" stroke="#64748B" strokeWidth="1.5"/>
      <line x1="148" y1="27" x2="148" y2="31" stroke="#64748B" strokeWidth="1.5"/>
      
      {/* Medical Cross Badge */}
      <circle cx="48" cy="42" r="9" fill="#FEE2E2"/>
      <path d="M45 42 H51 M48 39 V45" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function JeeMainIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="65" r="50" fill="#E0F2FE" fillOpacity="0.4"/>
      
      {/* Isometric 3D Math Cube (Center) */}
      <polygon points="100,36 125,49 100,62 75,49" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5"/>
      <polygon points="75,49 100,62 100,92 75,79" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5"/>
      <polygon points="100,62 125,49 125,79 100,92" fill="#1E40AF" stroke="#1D4ED8" strokeWidth="1.5"/>
      
      {/* Coordinate Parabola curve */}
      <path d="M50 105 Q90 114 150 97" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M60 86 L60 110 L145 110" stroke="#94A3B8" strokeWidth="1.5"/>
      
      {/* Math symbols floating */}
      <text x="68" y="34" fill="#0284C7" fontSize="12" fontWeight="900" fontFamily="sans-serif">a+b</text>
      <text x="134" y="55" fill="#F59E0B" fontSize="14" fontWeight="900" fontFamily="sans-serif">∑</text>
      <text x="52" y="75" fill="#10B981" fontSize="13" fontWeight="bold" fontFamily="sans-serif">π</text>
      <text x="130" y="94" fill="#6366F1" fontSize="12" fontWeight="bold" fontFamily="sans-serif">√x</text>
      <text x="86" y="118" fill="#0F172A" fontSize="13" fontWeight="900" fontFamily="sans-serif">5</text>
      
      {/* Compass divider */}
      <path d="M120 26 L128 46 L136 26" stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="128" cy="26" r="2.5" fill="#D97706"/>
    </svg>
  );
}

function PncfIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="65" r="50" fill="#FEF3C7" fillOpacity="0.45"/>
      
      {/* Cheerful School Student (Center) */}
      <path d="M82 100 C82 90 118 90 118 100 L122 120 L78 120 Z" fill="#EF4444"/>
      <polygon points="95,94 100,102 105,94" fill="#FFFFFF"/>
      
      {/* Raised cheering hands */}
      <path d="M82 98 C70 86 64 68 67 60" stroke="#FBBF24" strokeWidth="5.5" strokeLinecap="round"/>
      <circle cx="67" cy="58" r="4" fill="#FBBF24"/>
      <path d="M118 98 C130 86 136 68 133 60" stroke="#FBBF24" strokeWidth="5.5" strokeLinecap="round"/>
      <circle cx="133" cy="58" r="4" fill="#FBBF24"/>
      
      {/* Happy Face */}
      <circle cx="100" cy="72" r="17" fill="#FCD34D"/>
      {/* Hair */}
      <path d="M83 68 C83 48 117 48 117 68 C111 58 89 58 83 68 Z" fill="#1E293B"/>
      {/* Big Smile */}
      <path d="M94 75 Q100 83 106 75" stroke="#991B1B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="94" cy="69" r="2" fill="#1E293B"/>
      <circle cx="106" cy="69" r="2" fill="#1E293B"/>
      
      {/* Idea Lightbulb */}
      <circle cx="140" cy="38" r="9" fill="#FEF08A"/>
      <path d="M136 45 H144" stroke="#CA8A04" strokeWidth="2"/>
      
      {/* Pencil Rocket */}
      <rect x="52" y="30" width="6" height="16" rx="2" transform="rotate(-30 52 30)" fill="#3B82F6"/>
      <polygon points="56,20 51,30 60,26" fill="#F97316"/>
      
      {/* Golden Star */}
      <polygon points="100,30 102,35 107,35 103,39 105,44 100,41 95,44 97,39 93,35 98,35" fill="#FFB800"/>
    </svg>
  );
}

function OnlineProgramIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-28 sm:h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="100" cy="65" r="50" fill="#DCFCE7" fillOpacity="0.4"/>
      
      {/* Study Desk */}
      <rect x="46" y="106" width="108" height="6" rx="3" fill="#E2E8F0"/>
      <line x1="60" y1="112" x2="60" y2="122" stroke="#94A3B8" strokeWidth="3"/>
      <line x1="140" y1="112" x2="140" y2="122" stroke="#94A3B8" strokeWidth="3"/>
      
      {/* Laptop Screen */}
      <rect x="66" y="52" width="44" height="32" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2"/>
      <rect x="69" y="55" width="38" height="26" rx="2" fill="#0284C7"/>
      {/* Online teacher graph on laptop screen */}
      <circle cx="76" cy="63" r="3.5" fill="#FDE047"/>
      <rect x="73" y="69" width="6" height="7" rx="1" fill="#FFFFFF"/>
      <line x1="84" y1="61" x2="101" y2="61" stroke="#FFFFFF" strokeWidth="1.5"/>
      <path d="M84 72 L89 67 L94 70 L102 63" stroke="#FDE047" strokeWidth="2" fill="none"/>
      {/* Laptop Base */}
      <path d="M59 84 L117 84 L113 89 L63 89 Z" fill="#94A3B8"/>
      
      {/* Student Studying at Desk (Right side) */}
      <circle cx="132" cy="72" r="13" fill="#FCD34D"/>
      <path d="M125 68 C125 55 144 57 144 70 C147 72 149 78 143 82" fill="#0F172A" stroke="#0F172A" strokeWidth="1.5"/>
      <path d="M120 87 C120 82 144 82 144 87 L145 106 L119 106 Z" fill="#10B981"/>
      
      {/* Desk Succulent Plant */}
      <rect x="148" y="93" width="9" height="11" rx="2" fill="#EA580C"/>
      <path d="M152 93 Q148 82 152 80 Q156 88 152 93" fill="#22C55E"/>
      
      {/* Stream wifi waves */}
      <path d="M78 42 Q88 35 98 42" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M82 46 Q88 41 94 46" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="88" cy="49" r="1.5" fill="#10B981"/>
    </svg>
  );
}

/* ==========================================================================
   COURSES DATA MATCHING USER'S REFERENCE SCREENSHOT
   ========================================================================== */

const COURSE_CARDS = [
  {
    id: 'jee-adv',
    title: 'JEE (Main+Advanced)/IIT-JEE',
    desc: 'JEE (Main+Advanced) Courses builds strong subject knowledge and problem-solving skills to help aspirants ace the exams to get enrolled into IITs.',
    illustration: JeeAdvancedIllustration,
    badge: 'ENGINEERING',
    target: 'IIT-JEE 2026 / 2027 Aspirants',
    eligibility: 'Class 10th to 11th moving, 12th appearing & 12th Pass (Dropper)',
    duration: '1 Year / 2 Years Comprehensive Classroom Programme',
    tuitionFee: '₹1,15,000 / year',
    scholarshipWaiver: 'Up to 90% (Save up to ₹1,03,500 via RSAT)',
    startingFee: '₹11,500',
    keyFeatures: [
      'Personal teaching by Senior Kota/Indore Faculty Directors',
      'Daily 4.5 hours core classroom lectures + Daily Practice Problems (DPP)',
      'Computer Based Test (CBT) mock exam series matching exact IIT pattern',
      'Dedicated 1-on-1 Doubt Clinic open 8:00 AM to 8:00 PM daily'
    ]
  },
  {
    id: 'neet-ug',
    title: 'Pre-Medical/NEET UG',
    desc: 'NEET-UG Courses sharpen skills essential for medical entrance exams, ensuring students are well-prepared for success in the competitive medical field.',
    illustration: NeetUgIllustration,
    badge: 'MEDICAL',
    target: 'NEET-UG 2026 / 2027 Aspirants',
    eligibility: 'Class 10th to 11th moving, 12th appearing & 12th Pass (Dropper)',
    duration: '1 Year / 2 Years Medical Classroom Programme',
    tuitionFee: '₹1,10,000 / year',
    scholarshipWaiver: 'Up to 90% (Save up to ₹99,000 via RSAT)',
    startingFee: '₹11,000',
    keyFeatures: [
      'Line-by-line NCERT Biology & Chemistry mastery with conceptual maps',
      'Weekly OMR Speed Tests designed to hit 680+ marks for AIIMS & GMC',
      'Senior faculty mentor support led by Dr. Sanjay Chauhan (Gold Medalist)',
      'Proven track record of producing Top 10 and Top 100 AIRs'
    ]
  },
  {
    id: 'jee-main',
    title: 'JEE (Main)',
    desc: 'JEE (Main) courses are designed to provide students with a significant competitive edge for achieving success for their path to NITs, IIITs and equivalent colleges.',
    illustration: JeeMainIllustration,
    badge: 'ENGINEERING',
    target: 'JEE Main (NTA) 2026 / 2027',
    eligibility: 'Class 11th, 12th & 12th Pass (Targeting Top NITs/IIITs)',
    duration: '1 Year / 2 Years Fast-Track Prep',
    tuitionFee: '₹95,000 / year',
    scholarshipWaiver: 'Up to 90% (Save up to ₹85,500 via RSAT)',
    startingFee: '₹9,500',
    keyFeatures: [
      'Laser focus on NTA speed, accuracy & 99+ percentile boost',
      'Rigorous coverage of Physics, Chemistry & Higher Mathematics',
      'Curated 10,000+ question bank with detailed video explanations',
      'Live online computer lab simulation for error-free CBT testing'
    ]
  },
  {
    id: 'pncf',
    title: 'Pre-Nurture & Career Foundation',
    desc: 'PNCF Courses for class 6th to 10th nurtures students, establishing a robust groundwork for excelling in competitive exams and Olympiads.',
    illustration: PncfIllustration,
    badge: 'FOUNDATION',
    target: 'Class 6th, 7th, 8th, 9th & 10th Students',
    eligibility: 'School Students targeting NTSE, Olympiads & Early IIT/NEET Foundation',
    duration: '1 Academic Year (Parallel with School)',
    tuitionFee: '₹65,000 / year',
    scholarshipWaiver: 'Up to 90% (Save up to ₹58,500 via RSAT)',
    startingFee: '₹6,500',
    keyFeatures: [
      'Strong conceptual foundation in Science & Mathematics without stress',
      'Mental Ability, Logic & IQ building modules',
      'Preparation for IOQM, NSTSE, SOF Olympiads & NTSE',
      'School board examination excellence with 95%+ board scores'
    ]
  },
  {
    id: 'online',
    title: 'Rankers Path Online Programs',
    desc: 'New LIVE courses for classes 6-10 and Online Test Series for classes 11, 12 & 12+ to level up JEE & NEET preparation.',
    illustration: OnlineProgramIllustration,
    badge: 'DIGITAL & HYBRID',
    target: 'All-India Distance & Hybrid Learners',
    eligibility: 'Students anywhere in India from Class 6th to 12th Pass',
    duration: 'Flexible Full Academic Year Access',
    tuitionFee: '₹35,000 / year',
    scholarshipWaiver: 'Up to 90% (Save up to ₹31,500 via RSAT)',
    startingFee: '₹3,500',
    keyFeatures: [
      'Live two-way interactive classes by Kota/Indore senior faculty',
      'All-India Test Series (AIOTS) with predictive AIR percentile rank',
      'Complete printed modules delivered to your home + digital eBooks',
      'Recorded lecture repository for unlimited revision anytime, anywhere'
    ]
  }
];

export default function CoursesSection({ onOpenEnquiry, onOpenRSAT }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <section id="courses" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Courses &amp; Fee
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Top-ranked classroom and digital learning programs for JEE, NEET, and Olympiads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-brand-navy bg-brand-yellow/20 px-3.5 py-1 rounded-full border border-brand-yellow/40">
              🎓 Up to 90% Fee Waiver via RSAT
            </span>
          </div>
        </div>

        {/* 5 Cards Row matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {COURSE_CARDS.map((course) => {
            const Illustration = course.illustration;
            return (
              <div
                key={course.id}
                className="bg-[#EDF3FA] rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-brand-yellow/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Illustration */}
                  <div className="flex items-center justify-center pt-2 pb-3">
                    <Illustration />
                  </div>

                  {/* Title matching screenshot */}
                  <h3 className="text-[15px] sm:text-base font-black text-slate-900 leading-snug mt-3 mb-2 group-hover:text-brand-navy transition">
                    {course.title}
                  </h3>

                  {/* Description matching screenshot */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                    {course.desc}
                  </p>
                </div>

                {/* Bottom Yellow "Click Here" Button matching screenshot */}
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-4 py-2 bg-[#FFB800] hover:bg-[#F59E0B] text-slate-900 font-extrabold text-xs rounded-md shadow-sm transition duration-200 inline-flex items-center gap-1.5"
                  >
                    <span>Click Here</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Batch Alert Banner (Dynamic) */}
        <div className="mt-12 bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 text-brand-navy flex-shrink-0 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-brand-navy" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[11px] uppercase tracking-wider">
                  Upcoming Batch Alert
                </span>
                <span className="text-xs text-slate-500 font-semibold">Vijay Nagar Campus, Indore</span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                New Target &amp; Dropper Batches Starting Next Monday
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Small batch size (strictly 30 students per class) for intensive 1-on-1 mentorship. Limited seats remaining!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20enquire%20about%20the%20Upcoming%20Batches%20and%20Fee%20Structure."
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
              Apply for Scholarship (RSAT)
            </button>
          </div>
        </div>

      </div>

      {/* ==========================================================================
          INTERACTIVE COURSE & FEE BREAKDOWN MODAL (Opens on "Click Here")
          ========================================================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 pr-8">
              <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-navy font-extrabold text-[11px] uppercase tracking-wider">
                {selectedCourse.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {selectedCourse.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {selectedCourse.target} • {selectedCourse.eligibility}
              </p>
            </div>

            {/* Transparent Fee & Scholarship Card */}
            <div className="bg-gradient-to-br from-brand-navy to-[#132c63] text-white rounded-2xl p-5 sm:p-6 mb-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
                  Academic Fee Structure (2026–27)
                </span>
                <span className="text-[11px] font-extrabold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                  RSAT Waiver Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                <div>
                  <span className="text-[11px] text-slate-300 font-medium">Standard Tuition Fee</span>
                  <p className="text-xl font-black text-white mt-0.5">{selectedCourse.tuitionFee}</p>
                </div>
                <div>
                  <span className="text-[11px] text-amber-300 font-semibold">Scholarship Waiver</span>
                  <p className="text-xl font-black text-brand-yellow mt-0.5">{selectedCourse.scholarshipWaiver.split(' ')[0]} {selectedCourse.scholarshipWaiver.split(' ')[1]}</p>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300 font-semibold">Net Effective Fee</span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">{selectedCourse.startingFee}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span>💳 0% Interest EMI &amp; 2/3 Installments Available</span>
                <span className="text-amber-300 font-semibold">5% Extra Rebate on Full Payment</span>
              </div>
            </div>

            {/* Course Features & Schedule */}
            <div className="mb-6">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
                Course Highlights &amp; Inclusions:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedCourse.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
              <a
                href={`https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(selectedCourse.title)}%20fees%20and%20admission.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition text-center"
              >
                Chat on WhatsApp
              </a>
              
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  if (onOpenRSAT) onOpenRSAT();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-[#F59E0B] text-slate-900 text-xs font-black shadow transition text-center"
              >
                Register for RSAT (Get up to 90% Scholarship) →
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

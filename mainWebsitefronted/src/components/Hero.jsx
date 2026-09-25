import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  X,
  ArrowRight,
  Download,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Clock,
  BookOpen
} from 'lucide-react';

export default function Hero({ onOpenRankX, onOpenRSAT, onOpenEnquiry }) {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Selected Course for Modal (when 'Click Here' is clicked)
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 4 Panoramic Slides (Exact Allen Style Banner Carousel)
  const slides = [
    {
      id: 1,
      bgGradient: 'from-[#FFB800] via-[#FBBF24] to-[#F59E0B]',
      badge: 'SAFALTA KA SANKALP • INDORE CAMPUSES',
      titleHighlight: 'RANKERS PATH',
      titleSub: 'NOW IN',
      cityName: 'Indore',
      subtitle: 'Excellence in JEE and NEET preparation is closer than ever.',
      features: ['Vijay Nagar & Palasia Campuses', '25+ Yrs Exp. Core Founding Mentors', 'Strictly 30 Students per Batch'],
      ctaText: 'Register for RankX 2026',
      ctaAction: onOpenRankX,
      secondaryText: 'Explore Indore Campuses',
      secondaryLink: '#centres'
    },
    {
      id: 2,
      bgGradient: 'from-[#0B1B3D] via-[#102A5C] to-[#0B1B3D]',
      isDark: true,
      badge: 'OFFLINE SCHOLARSHIP EXAM',
      titleHighlight: 'RankX 2026',
      titleSub: 'WIN UP TO',
      cityName: '100% Scholarship',
      subtitle: 'Appear physically at Indore test centres. Win tuition fee waivers and merit cash awards.',
      features: ['Vijay Nagar, Palasia & Bhawarkua Centres', 'Digital Admit Card with QR', 'Zero Registration Fee'],
      ctaText: 'Download Admit Card',
      ctaAction: onOpenRankX,
      secondaryText: 'Take Online RSAT Test',
      secondaryAction: onOpenRSAT
    },
    {
      id: 3,
      bgGradient: 'from-[#0284C7] via-[#0369A1] to-[#075985]',
      isDark: true,
      badge: 'INSTANT ONLINE CBT',
      titleHighlight: 'RSAT 2026',
      titleSub: 'ONLINE TEST',
      cityName: 'Immediate Score',
      subtitle: '30-minute Computer-Based Test right from your mobile or PC. Instant score analysis and scholarship coupons.',
      features: ['NTA Pattern & +4/-1 Marking', 'Anti-Cheat Protected', 'Detailed Answer Explanations'],
      ctaText: 'Start RSAT Online Exam',
      ctaAction: onOpenRSAT,
      secondaryText: 'Check Offline Dates',
      secondaryAction: onOpenRankX
    },
    {
      id: 4,
      bgGradient: 'from-[#FFB800] via-[#F59E0B] to-[#D97706]',
      badge: 'UPCOMING BATCH ALERT',
      titleHighlight: 'NEET & JEE',
      titleSub: 'DROPPER BATCH',
      cityName: '24 June 2026',
      subtitle: 'Zero distraction, dedicated 1:1 doubt clinics, and personalized rank mentoring by senior Kota legends.',
      features: ['Led by Chauhan Sir & Jaivir Sir', 'Daily 1 Hr Doubt Resolution', 'Limited 30 Seats Remaining'],
      ctaText: 'Enquire for Dropper Batch',
      ctaAction: onOpenEnquiry,
      secondaryText: 'Download Syllabus',
      secondaryAction: () => {
        window.open('https://wa.me/919131435511?text=Hi%2C%20please%20send%20me%20the%20Dropper%20Batch%20syllabus%20and%20fee%20structure.', '_blank');
      }
    }
  ];

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // 5 Courses & Fee Cards (Exact 5 Categories as shown in user's Allen screenshot)
  const coursesData = [
    {
      id: 'jee-adv',
      title: 'JEE (Main+Advanced)/IIT-JEE',
      desc: 'JEE (Main+Advanced) Courses builds strong subject knowledge and problem-solving skills to help aspirants ace the exams to get enrolled into IITs.',
      tag: 'Class 11th, 12th & Droppers',
      fee: '₹1,10,000 / Year',
      installments: '2 Installments of ₹58,000 available',
      batchStart: '24 June 2026',
      mode: 'Offline Classroom (Indore)',
      highlights: [
        'Strictly 30 Students per Batch',
        'Advanced Mathematics by Chaurasia Sir',
        'Physics Mechanics & Electrodynamics by Jaivir Sir',
        'Physical & Organic Chemistry by Chauhan Sir',
        'Weekly CBT Pattern Mock Tests & In-depth Analytics'
      ],
      iconType: 'engineer'
    },
    {
      id: 'neet-ug',
      title: 'Pre-Medical/NEET UG',
      desc: 'NEET-UG Courses sharpen skills essential for medical entrance exams, ensuring students are well-prepared for success in the competitive medical field.',
      tag: 'Class 11th, 12th & Droppers',
      fee: '₹1,05,000 / Year',
      installments: '2 Installments of ₹55,000 available',
      batchStart: '24 June 2026',
      mode: 'Offline Classroom (Indore)',
      highlights: [
        'NCERT Line-by-Line Decoded by Ashlesha Ma’am',
        'Weekly OMR Sheet Speed Tests (+4 / -1 Marking)',
        'Zero Substitute Teachers — 100% Senior Mentorship',
        '1-on-1 Doctor Mentorship for 680+ Score Strategy',
        'Free Complete Study Material & Question Modules'
      ],
      iconType: 'doctor'
    },
    {
      id: 'jee-main',
      title: 'JEE (Main)',
      desc: 'JEE (Main) courses are designed to provide students with a significant competitive edge for achieving success for their path to NITs, IIITs and equivalent colleges.',
      tag: 'Target NITs, IIITs & State Engineering',
      fee: '₹95,000 / Year',
      installments: 'Easy Installments Available',
      batchStart: '24 June 2026',
      mode: 'Offline Classroom (Indore)',
      highlights: [
        'High-Yield Formulae & Short-Cut Techniques',
        'Daily Practice Problems (DPP) with Solutions',
        'Daily 1 Hour Dedicated Doubt Clinic',
        'Speed & Accuracy Drills for 99+ Percentile',
        'Past 10 Years JEE Main PYQ Breakdown'
      ],
      iconType: 'math'
    },
    {
      id: 'pncf',
      title: 'Pre-Nurture & Career Foundation',
      desc: 'PNCF Courses for class 6th to 10th nurtures students, establishing a robust groundwork for excelling in competitive exams and Olympiads.',
      tag: 'Classes 6th to 10th',
      fee: '₹48,000 – ₹55,000 / Year',
      installments: 'Quarterly Installments Available',
      batchStart: '15 July 2026',
      mode: 'Offline Classroom (Indore)',
      highlights: [
        'NTSE, Olympiads (IMO, NSO, IJSO) & NMTC Training',
        'Strengthening Analytical Logic & Mental Ability',
        'Board Exam 95%+ Marks Guarantee Mentoring',
        'Interactive Science Experiments & Stress-free Learning',
        'Monthly Parent-Teacher Progress Meetings'
      ],
      iconType: 'student'
    },
    {
      id: 'online-cbt',
      title: 'Rankers Online Programs & CBT',
      desc: 'New LIVE courses for classes 6-10 and Online Test Series for classes 11, 12 & 12th+ to level up JEE & NEET preparation from home.',
      tag: 'Online Live + CBT Test Series',
      fee: '₹4,999 onwards',
      installments: 'Instant Online Access',
      batchStart: 'Immediate / Scheduled',
      mode: 'Online (Mobile / PC)',
      highlights: [
        '20 NTA Pattern All-India CBT Mock Tests',
        'Real-time Score, Accuracy & Percentile Predictor',
        'Instant Solutions with Step-by-Step Video Explanations',
        'RSAT Online Scholarship Test Integration',
        'Accessible Anytime on Mobile, Tablet or Laptop'
      ],
      iconType: 'laptop'
    }
  ];

  return (
    <div className="w-full bg-[#FCFCFC]" id="courses-fee">

      {/* ============================================================== */}
      {/* 1. HERO PANORAMIC BANNER CAROUSEL (Exact Allen Screenshot Style) */}
      {/* ============================================================== */}
      <div className="relative w-full overflow-hidden bg-slate-900 select-none">
        
        {/* Slides Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`min-w-full relative flex items-center justify-between py-12 sm:py-16 lg:py-20 px-6 sm:px-12 lg:px-20 bg-gradient-to-r ${slide.bgGradient}`}
            >
              {/* Decorative Subtle Patterns */}
              <div className="absolute inset-0 bg-white/5 opacity-40 pointer-events-none"></div>

              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left Text & Big Headline */}
                <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                  {/* Eyebrow Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    slide.isDark ? 'bg-white/15 text-brand-yellow border border-white/20' : 'bg-brand-navy text-brand-yellow shadow-sm'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Main Banner Headline with Stylish "Indore" */}
                  <div className="space-y-1">
                    <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase ${
                      slide.isDark ? 'text-white' : 'text-brand-navy'
                    }`}>
                      {slide.titleHighlight}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                      <span className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${
                        slide.isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {slide.titleSub}
                      </span>
                      <span className="font-serif italic text-3xl sm:text-5xl font-black text-[#0B1B3D] underline decoration-brand-yellow decoration-4 underline-offset-4">
                        {slide.cityName}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className={`text-base sm:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-snug ${
                    slide.isDark ? 'text-slate-200' : 'text-slate-900'
                  }`}>
                    {slide.subtitle}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                    {slide.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                          slide.isDark ? 'bg-white/10 text-white border border-white/10' : 'bg-white/70 text-brand-navy border border-black/10'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                    <button
                      onClick={slide.ctaAction}
                      className="px-6 py-3 bg-[#0B1B3D] hover:bg-[#142B5C] text-brand-yellow rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {slide.secondaryLink ? (
                      <a
                        href={slide.secondaryLink}
                        className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition border ${
                          slide.isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-white/40 hover:bg-white/60 text-brand-navy border-black/20'
                        }`}
                      >
                        {slide.secondaryText}
                      </a>
                    ) : (
                      <button
                        onClick={slide.secondaryAction}
                        className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition border ${
                          slide.isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-white/40 hover:bg-white/60 text-brand-navy border-black/20'
                        }`}
                      >
                        {slide.secondaryText}
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Authentic Faculty & Student Visual Spotlight */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative max-w-md w-full">
                    {/* Glowing Photo Card Frame */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-white group">
                      <img
                        src="/assets/web/faculty-team-full.png"
                        alt="Rankers Path Faculty & Students Indore"
                        className="w-full h-auto object-cover max-h-[300px] sm:max-h-[340px] transform group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Caption Badge */}
                      <div className="p-3 bg-brand-navy text-white text-center">
                        <p className="text-xs font-black uppercase text-brand-yellow tracking-wider">
                          25+ Yrs Exp. Top Founding Faculty
                        </p>
                        <p className="text-[11px] text-slate-300">
                          Chauhan Sir &bull; Jaivir Sir &bull; Ashlesha Ma&apos;am &bull; Chaurasia Sir
                        </p>
                      </div>
                    </div>

                    {/* Floating Corner Badge */}
                    <div className="absolute -top-3 -right-3 bg-white text-brand-navy px-3.5 py-1.5 rounded-full shadow-xl font-black text-xs uppercase tracking-wider border-2 border-brand-yellow flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-brand-yellow" />
                      <span>AIR 1–100 Top Ranks</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Carousel Arrow Controls (Left & Right Buttons from Screenshot) */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentSlide(dotIdx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === dotIdx ? 'w-8 bg-brand-navy border border-brand-yellow' : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>


      {/* ============================================================== */}
      {/* 2. COURSES & FEE SECTION (Exact 5 Cards as in Allen Screenshot) */}
      {/* ============================================================== */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching screenshot */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Courses &amp; Fee
          </h2>
          <div className="w-20 h-1 bg-brand-yellow mt-2 rounded-full"></div>
        </div>

        {/* 5-Column Responsive Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-yellow/80 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Card Illustration / Visual Header */}
                <div className="w-full h-36 bg-gradient-to-br from-slate-50 via-amber-50/30 to-blue-50/30 rounded-xl border border-slate-100 mb-4 flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-[1.02] transition duration-300">
                  
                  {/* SVG Illustration 1: Engineer (JEE Advanced) */}
                  {course.iconType === 'engineer' && (
                    <svg viewBox="0 0 200 140" className="w-full h-full max-h-32" fill="none">
                      <circle cx="100" cy="50" r="28" fill="#FBBF24" />
                      {/* Safety Helmet */}
                      <path d="M72 45 C72 25, 128 25, 128 45 Z" fill="#F59E0B" />
                      <rect x="68" y="44" width="64" height="6" rx="3" fill="#D97706" />
                      {/* Face & Goggles */}
                      <circle cx="90" cy="54" r="4" fill="#0B1B3D" />
                      <circle cx="110" cy="54" r="4" fill="#0B1B3D" />
                      <path d="M92 64 Q100 70 108 64" stroke="#0B1B3D" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Body & Vest */}
                      <path d="M60 120 C60 85, 140 85, 140 120 Z" fill="#0B1B3D" />
                      <path d="M85 86 L85 120 M115 86 L115 120" stroke="#FBBF24" strokeWidth="6" />
                      {/* Gears / Technical Blueprint */}
                      <circle cx="160" cy="35" r="14" stroke="#0284C7" strokeWidth="3" strokeDasharray="4 2" />
                      <circle cx="40" cy="90" r="18" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 3" />
                      <rect x="135" y="85" width="40" height="28" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                      <line x1="142" y1="94" x2="168" y2="94" stroke="#0284C7" strokeWidth="2" />
                      <line x1="142" y1="102" x2="162" y2="102" stroke="#0284C7" strokeWidth="2" />
                    </svg>
                  )}

                  {/* SVG Illustration 2: Medical / Doctor (NEET UG) */}
                  {course.iconType === 'doctor' && (
                    <svg viewBox="0 0 200 140" className="w-full h-full max-h-32" fill="none">
                      {/* Microscope */}
                      <rect x="45" y="105" width="45" height="8" rx="2" fill="#0B1B3D" />
                      <path d="M65 105 L65 65 Q65 45 85 45 L95 45" stroke="#0B1B3D" strokeWidth="6" strokeLinecap="round" />
                      <rect x="75" y="35" width="30" height="12" rx="3" fill="#0284C7" transform="rotate(-30 75 35)" />
                      <circle cx="68" cy="85" r="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                      {/* Chemical Flask with Bubbles */}
                      <path d="M130 50 L140 50 L140 65 L160 105 C165 115, 125 120, 115 105 L130 65 Z" fill="#DCFCE7" stroke="#16A34A" strokeWidth="3" />
                      <circle cx="138" cy="95" r="4" fill="#16A34A" />
                      <circle cx="145" cy="85" r="3" fill="#16A34A" />
                      {/* Stethoscope Accent */}
                      <path d="M90 120 Q105 135 120 120" stroke="#DC2626" strokeWidth="3" fill="none" />
                      <circle cx="105" cy="132" r="5" fill="#DC2626" />
                      {/* Caduceus / Plus */}
                      <rect x="155" y="25" width="6" height="18" rx="2" fill="#DC2626" />
                      <rect x="149" y="31" width="18" height="6" rx="2" fill="#DC2626" />
                    </svg>
                  )}

                  {/* SVG Illustration 3: Mathematics / Charts (JEE Main) */}
                  {course.iconType === 'math' && (
                    <svg viewBox="0 0 200 140" className="w-full h-full max-h-32" fill="none">
                      {/* 3D Isometric Books */}
                      <path d="M60 85 L100 65 L140 85 L100 105 Z" fill="#3B82F6" />
                      <path d="M60 85 L60 97 L100 117 L100 105 Z" fill="#1D4ED8" />
                      <path d="M140 85 L140 97 L100 117 L100 105 Z" fill="#2563EB" />
                      {/* Upper Book */}
                      <path d="M70 70 L100 55 L130 70 L100 85 Z" fill="#FBBF24" />
                      <path d="M70 70 L70 78 L100 93 L100 85 Z" fill="#D97706" />
                      <path d="M130 70 L130 78 L100 93 L100 85 Z" fill="#F59E0B" />
                      {/* Math Symbols: Pi, Sum, Integral, Alpha */}
                      <text x="40" y="45" fill="#0B1B3D" fontSize="18" fontWeight="bold" fontFamily="sans-serif">&pi;</text>
                      <text x="145" y="40" fill="#0284C7" fontSize="18" fontWeight="bold" fontFamily="sans-serif">&sum;</text>
                      <text x="95" y="32" fill="#D97706" fontSize="20" fontWeight="bold" fontFamily="sans-serif">&int;</text>
                      <text x="155" y="80" fill="#16A34A" fontSize="16" fontWeight="bold" fontFamily="sans-serif">&alpha;</text>
                      {/* Growth Trend Graph */}
                      <path d="M45 110 L75 80 L105 90 L145 50" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="145" cy="50" r="4" fill="#EF4444" />
                    </svg>
                  )}

                  {/* SVG Illustration 4: School Student / Olympiad (PNCF) */}
                  {course.iconType === 'student' && (
                    <svg viewBox="0 0 200 140" className="w-full h-full max-h-32" fill="none">
                      {/* Kid Face & Big Smile */}
                      <circle cx="100" cy="55" r="26" fill="#FED7AA" />
                      <path d="M74 48 C74 25, 126 25, 126 48 Z" fill="#9A3412" />
                      <circle cx="92" cy="54" r="3.5" fill="#431407" />
                      <circle cx="108" cy="54" r="3.5" fill="#431407" />
                      <path d="M92 65 Q100 75 108 65" stroke="#DC2626" strokeWidth="2.5" fill="#FECDD3" strokeLinecap="round" />
                      {/* Shoulders */}
                      <path d="M65 120 C65 92, 135 92, 135 120 Z" fill="#EA580C" />
                      {/* Magnifying Glass examining Atom */}
                      <circle cx="145" cy="55" r="16" stroke="#0B1B3D" strokeWidth="3" fill="#E0F2FE" fillOpacity="0.5" />
                      <line x1="156" y1="67" x2="175" y2="86" stroke="#0B1B3D" strokeWidth="4" strokeLinecap="round" />
                      {/* Atom Rings */}
                      <ellipse cx="145" cy="55" rx="10" ry="4" stroke="#0284C7" strokeWidth="1.5" transform="rotate(30 145 55)" />
                      <ellipse cx="145" cy="55" rx="10" ry="4" stroke="#0284C7" strokeWidth="1.5" transform="rotate(-30 145 55)" />
                      <circle cx="145" cy="55" r="2.5" fill="#FBBF24" />
                      {/* Medal / Star */}
                      <path d="M45 40 L50 48 L60 49 L52 56 L55 65 L45 60 L35 65 L38 56 L30 49 L40 48 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                    </svg>
                  )}

                  {/* SVG Illustration 5: Laptop Online Learning (Rankers Online / CBT) */}
                  {course.iconType === 'laptop' && (
                    <svg viewBox="0 0 200 140" className="w-full h-full max-h-32" fill="none">
                      {/* Desk */}
                      <rect x="30" y="112" width="140" height="6" rx="2" fill="#E2E8F0" />
                      {/* Laptop Screen & Keyboard */}
                      <rect x="65" y="50" width="70" height="48" rx="4" fill="#0B1B3D" stroke="#334155" strokeWidth="2" />
                      <rect x="70" y="55" width="60" height="38" rx="2" fill="#0284C7" />
                      {/* Video Call Teacher on Screen */}
                      <circle cx="100" cy="68" r="8" fill="#FBBF24" />
                      <path d="M88 88 C88 80, 112 80, 112 88 Z" fill="#FFFFFF" />
                      {/* Laptop Base */}
                      <path d="M55 98 L145 98 L140 106 L60 106 Z" fill="#94A3B8" />
                      {/* Desk Lamp */}
                      <path d="M45 112 L45 75 Q45 60 55 60 L60 60" stroke="#F59E0B" strokeWidth="3" fill="none" />
                      <path d="M56 55 L70 65 L54 68 Z" fill="#F59E0B" />
                      {/* Wifi waves */}
                      <path d="M145 45 Q155 35 165 45" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path d="M149 50 Q155 43 161 50" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <circle cx="155" cy="55" r="2" fill="#10B981" />
                    </svg>
                  )}

                </div>

                {/* Course Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-brand-navy transition min-h-[48px]">
                  {course.title}
                </h3>

                {/* Clean Description matching screenshot style */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-2 min-h-[95px]">
                  {course.desc}
                </p>

                {/* Quick Fee Badge */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-brand-navy">{course.fee}</span>
                  <span className="text-[11px] font-semibold text-slate-500">{course.tag.split(' ')[0]}</span>
                </div>
              </div>

              {/* Yellow Click Here Button (Exact Allen Button Style from Screenshot) */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full py-2.5 px-4 bg-[#FFB800] hover:bg-[#e6a500] text-slate-950 font-black text-xs uppercase tracking-wider rounded-md text-center shadow-sm transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Click Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>


      {/* ============================================================== */}
      {/* 3. COURSE & FEE DETAILS MODAL (Opens on 'Click Here')           */}
      {/* ============================================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-navy font-black text-xs uppercase tracking-wider">
                {selectedCourse.tag}
              </span>
              <span className="text-xs font-semibold text-slate-500">Indore Campus</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              {selectedCourse.title}
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {selectedCourse.desc}
            </p>

            {/* Fee & Batch Matrix */}
            <div className="my-5 p-4 rounded-2xl bg-amber-50/50 border border-brand-yellow/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Standard Course Fee</p>
                <p className="text-2xl font-black text-brand-navy">{selectedCourse.fee}</p>
                <p className="text-xs text-slate-600 mt-0.5">{selectedCourse.installments}</p>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-200 w-full sm:w-auto">
                <span className="inline-block px-2.5 py-1 rounded bg-brand-navy text-brand-yellow font-bold text-xs uppercase tracking-wider">
                  Batch: {selectedCourse.batchStart}
                </span>
                <p className="text-[11px] text-slate-600 mt-1 font-semibold">Strictly 30 Students/Batch</p>
              </div>
            </div>

            {/* Course Features / Highlights */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-black uppercase text-slate-900 tracking-wider">Key Course Inclusions:</p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {selectedCourse.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200">
              <a
                href={`https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20enroll%20for%20${encodeURIComponent(selectedCourse.title)}%20at%20Rankers%20Path%20Indore.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs uppercase tracking-wider text-center shadow flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSelectedCourse(null);
                  if (selectedCourse.id === 'online-cbt') onOpenRSAT();
                  else onOpenRankX();
                }}
                className="py-3 px-4 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider text-center shadow flex items-center justify-center gap-1.5 transition"
              >
                <Award className="w-4 h-4" />
                <span>{selectedCourse.id === 'online-cbt' ? 'Start Online CBT Test' : 'Apply for RankX Scholarship'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

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

  return (
    <div className="w-full bg-[#FCFCFC]" id="hero">

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

    </div>
  );
}


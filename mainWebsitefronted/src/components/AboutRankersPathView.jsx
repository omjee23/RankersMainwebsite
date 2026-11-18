import React from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  Home,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  Compass,
  Star,
  ChevronRight
} from 'lucide-react';
import RankersPathLogo from './RankersPathLogo';

export default function AboutRankersPathView({
  onBack,
  onOpenTeam,
  onOpenRSAT,
  onOpenRankX,
  onOpenAdmission,
  onOpenEnquiry
}) {
  const CORE_DIRECTORS = [
    {
      name: 'Sanjay Chauhan',
      role: 'Director & Biology Faculty',
      exp: '28+ Years Experience',
      degree: 'M.Sc Zoology (Gold Medalist)',
      photo: '/assets/web/founder-chauhan.jpg',
      highlight: 'Mentored Rank 1-2 & Top 100 in NEET / AIIMS'
    },
    {
      name: 'Jaivir Singh',
      role: 'Academic Head & Physics Faculty',
      exp: '23+ Years Experience',
      degree: 'B.Tech',
      photo: '/assets/web/founder-jaivir.jpg',
      highlight: 'Pioneer of Concept-First Physics in IIT-JEE'
    },
    {
      name: 'Ashlesha Phadnis',
      role: 'Senior Chemistry Faculty',
      exp: '30+ Years Experience',
      degree: 'M.Sc Chemistry, B.Ed',
      photo: '/assets/web/founder-ashlesha.jpg',
      highlight: '30,000+ Students Mentored for IIT & Medical'
    },
    {
      name: 'Sanjay Chaurasia',
      role: 'Senior Mathematics Faculty & JEE Head',
      exp: '30+ Years Experience',
      degree: 'B.Sc, B.Ed, MPA',
      photo: '/assets/web/founder-chaurasia.jpg',
      highlight: 'Renowned for Speed & Shortcut Tactics'
    }
  ];

  const PILLARS = [
    {
      icon: Users,
      title: '30–40 Student Focused Batches',
      desc: 'No crowded auditoriums of 200+ students. We cap batches at 30–40 students so our senior teachers maintain direct eye contact and know every student by name.',
      badge: 'Focused Batch Model'
    },
    {
      icon: GraduationCap,
      title: 'Direct Founding-Faculty Mentorship',
      desc: 'No trainees or temporary freshers. From the first introductory lecture to the final revision sprint, our senior directors with 25+ years experience teach every class.',
      badge: 'Senior Ex-Kota Mentors'
    },
    {
      icon: Clock,
      title: 'Daily 1-on-1 Dedicated Doubt Counters',
      desc: 'Every afternoon between 1:00 PM – 2:00 PM, senior faculty sit with students individually to clear doubts from DPPs, module exercises, and mock tests.',
      badge: 'Zero Doubt Backlog'
    },
    {
      icon: BookOpen,
      title: 'Exhaustive Kota Pedagogy & Research Material',
      desc: 'Systematic curriculum matching latest competitive exam trends with 3 rounds of revision, daily practice papers (DPPs), and weekly Computer-Based Tests (CBT).',
      badge: 'NCERT & Advanced Aligned'
    },
    {
      icon: Award,
      title: 'Super-30 Merit Culture & 100% Scholarships',
      desc: 'Through our flagship RSAT and RANKEX talent exams, deserving and underprivileged aspirants receive up to 100% tuition fee waivers.',
      badge: 'Merit-First Ethics'
    },
    {
      icon: Compass,
      title: 'Holistic Student Mentorship & Care',
      desc: 'Bi-weekly psychological wellness checks, test-anxiety counselling, disciplined morning study schedules (8 AM–2 PM), and evening library access.',
      badge: 'Mental Resilience'
    }
  ];

  const INSTITUTION_STATS = [
    { value: '28+ Yrs', label: 'Average Faculty Experience', sub: 'Kota & National Hubs' },
    { value: '30–40', label: 'Batch Size Limit', sub: 'Guaranteed Personalized Focus' },
    { value: '1:10', label: 'Teacher-to-Student Ratio', sub: 'Continuous 1-on-1 Monitoring' },
    { value: '100%', label: 'Tuition Scholarship Slabs', sub: 'Via RSAT & RANKEX 2027' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Breadcrumb & Back Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-brand-navy bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition"
          >
            <Home className="w-4 h-4 text-brand-yellowDark" />
            <span>&larr; Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Home</span>
            <span>/</span>
            <span>About Us</span>
            <span>/</span>
            <span className="text-brand-navy font-extrabold">About RankersPath</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-navy via-slate-900 to-brand-navy text-white py-16 lg:py-24 relative overflow-hidden">
        {/* Ambient Decorative Blurs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Safalta Ka Sankalp &bull; About RankersPath</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              Shaping Central India’s Future <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-amber-300 to-yellow-200">
                IITians &amp; Medical Leaders
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              RankersPath was established with a clear, singular pledge: to bring genuine Kota-pedigree coaching to Indore without the impersonal chaos of massive commercial coaching factories. Here, mentorship is a sacred bond, batches are capped at 30–40 students, and every single class is taken by founding directors with over 25 years of proven results.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenAdmission}
                className="px-6 py-3 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Enroll for 2026-27</span>
                <ArrowRight className="w-4 h-4 text-brand-navy" />
              </button>

              <button
                onClick={onOpenTeam}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-brand-yellow" />
                <span>Meet Faculty Team &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers Bar */}
      <section className="bg-white border-b border-slate-200 py-8 relative -mt-6 sm:-mt-8 max-w-6xl mx-auto rounded-3xl shadow-xl px-6 sm:px-10 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {INSTITUTION_STATS.map((stat, idx) => (
            <div key={idx} className={`pt-4 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''}`}>
              <div className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The RankersPath Story & Philosophy */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              <span>Our Genesis &amp; Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              Why We Rejected the "Factory Coaching" Model
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              For decades, premier coaching in India transformed into an assembly line. Students with bright dreams found themselves in auditoriums packed with 150 to 250 students, where questioning was discouraged, doubts were offloaded to junior trainees, and only a chosen few received genuine attention.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              At <strong>RankersPath</strong>, four veteran educators who spent over 25 years teaching top ranks across premier national institutes joined hands in Indore. Our philosophy is rooted in the timeless <em>Guru-Shishya</em> tradition combined with rigorous Kota methodology:
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 font-semibold">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Every student possesses latent genius when given individualized attention and conceptual clarity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Senior teachers must remain accessible to the student for daily doubts, not just during scheduled stage lectures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Financial constraints should never deny an ambitious child quality guidance — hence our generous RSAT and RANKEX scholarship initiatives.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative p-6 sm:p-8 bg-gradient-to-tr from-brand-navy to-slate-900 text-white rounded-3xl shadow-xl overflow-hidden border border-slate-800">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 flex items-center justify-center border border-brand-yellow/40">
                    <Award className="w-6 h-6 text-brand-yellow" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">The RankersPath Creed</h4>
                    <p className="text-xs text-brand-yellow font-bold uppercase tracking-wider">Safalta Ka Sankalp</p>
                  </div>
                </div>

                <blockquote className="text-sm italic text-slate-200 leading-relaxed border-l-2 border-brand-yellow pl-4">
                  "We do not measure our pride by the thousands who enroll, but by the confidence in every single student who walks out of our 30-seater classroom ready to conquer IIT-JEE and NEET-UG."
                </blockquote>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs font-black text-brand-yellow block">Vision</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      To be Central India's most trusted, result-oriented, and ethical preparation institute for JEE, NEET &amp; Olympiads.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs font-black text-emerald-400 block">Mission</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      To deliver personal mentoring, Kota-grade study material, and psychological strength for 100% academic potential.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                  <span>📍 Vijay Nagar Main Campus, Indore</span>
                  <span className="text-brand-yellow font-bold">Admissions 2026-27</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* The 6 Pillars of Excellence */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-navy font-black text-xs uppercase tracking-wider">
              Institutional Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              The 6 Pillars of RankersPath Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Engineered systematically to ensure every student transitions from rote learning to Top-Rank competitive mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-brand-yellow/60 hover:shadow-xl transition-all duration-300 group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-navy text-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-navy transition flex items-center justify-center shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 group-hover:bg-brand-yellow/20 group-hover:text-brand-navy transition">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-navy transition">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Directorate Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
              Founding Mentors
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Guided Directly by Senior Directors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Each faculty member brings over two decades of classroom mastery and All India Top 10 results.
            </p>
          </div>

          <button
            onClick={onOpenTeam}
            className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <span>View Full Faculty Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_DIRECTORS.map((dir, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition space-y-3 flex flex-col"
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-100 relative">
                <img
                  src={dir.photo}
                  alt={dir.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.src = '/assets/web/faculty-team-full.png';
                  }}
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-brand-navy/90 text-brand-yellow font-black text-[10px] tracking-wide">
                  {dir.exp}
                </span>
              </div>

              <div className="space-y-1 flex-1">
                <h4 className="font-extrabold text-base text-slate-900">{dir.name}</h4>
                <p className="text-xs font-bold text-brand-navy">{dir.role}</p>
                <p className="text-[11px] text-slate-500 font-mono">{dir.degree}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 text-emerald-600 fill-emerald-600 flex-shrink-0" />
                  <span>{dir.highlight}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Indore Campus & Infrastructure Highlights */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow font-black text-xs uppercase tracking-wider">
                Indore Learning Campus
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                Modern Campus Ecosystem in the Heart of Vijay Nagar
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                RankersPath is centrally located at BCM Heights, Scheme 54 PU-4, Vijay Nagar, Indore. Our campus is designed to provide a distraction-free, air-conditioned, and technologically empowered preparation atmosphere.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 font-semibold pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                  <span>4K Interactive Digital Smartboards in all lecture rooms.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                  <span>Dedicated Online CBT Computer Test Hall for real exam simulation.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                  <span>Silent Air-Conditioned Library access (2:00 PM – 8:00 PM).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                  <span>Comprehensive CCTV surveillance and biometric attendance.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenEnquiry}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Schedule Campus Visit &rarr;</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden h-44 sm:h-56 bg-slate-800 border border-slate-700">
                <img
                  src="/assets/web/gallery-1.jpg"
                  alt="Rankers Path Classroom"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/assets/web/hero.jpg'; }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44 sm:h-56 bg-slate-800 border border-slate-700">
                <img
                  src="/assets/web/gallery-2.jpg"
                  alt="Rankers Path Mentorship"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/assets/web/hero.jpg'; }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44 sm:h-56 bg-slate-800 border border-slate-700">
                <img
                  src="/assets/web/gallery-3.jpg"
                  alt="Rankers Path Library"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/assets/web/hero.jpg'; }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44 sm:h-56 bg-slate-800 border border-slate-700">
                <img
                  src="/assets/web/gallery-4.jpg"
                  alt="Rankers Path Doubt Sessions"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/assets/web/hero.jpg'; }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-gradient-to-tr from-brand-navy to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-yellow/20 text-brand-yellow mx-auto flex items-center justify-center border border-brand-yellow/40">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Begin Your Top-Rank Journey with RankersPath
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience the life-changing impact of 30-student micro-batches mentored by India’s veteran Kota faculties. Register today for scholarship assessment or visit our Vijay Nagar campus.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRSAT}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              Take RSAT Scholarship Test (₹100)
            </button>

            <button
              onClick={onOpenRankX}
              className="px-6 py-3.5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider shadow-lg transition transform hover:scale-105 active:scale-95"
            >
              Apply for RANKEX 2027
            </button>

            <button
              onClick={onOpenAdmission}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-wider transition"
            >
              Direct Admission Form
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

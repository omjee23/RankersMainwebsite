import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Star,
  ArrowLeft,
  MessageCircle,
  Award,
  BookOpen,
  Sparkles,
  Phone,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { resolvePhotoUrl } from '../utils/imageUtils';

const FALLBACK_FACULTY = [
  {
    id: 'fac-chauhan',
    name: 'Sanjay Chauhan',
    degree: 'M.Sc Biology (Zoo.), Gold Medalist',
    role: 'Biology Faculty & Director',
    subject: 'Biology',
    exp: '28+ Years Experience',
    photo: '/assets/web/founder-chauhan.jpg',
    bio: 'Has taught 30,000+ students across premier national institutes. Produced Rank 1–2, Top 10, and Top 100 results in NEET, AIIMS, AFMC, and state PMTs.',
    showOnHome: true,
    order: 1
  },
  {
    id: 'fac-jaivir',
    name: 'Jaivir Singh',
    degree: 'B.Tech',
    role: 'Physics Faculty & Academic Head',
    subject: 'Physics',
    exp: '23+ Years Experience',
    photo: '/assets/web/founder-jaivir.jpg',
    bio: 'Has taught 20,000+ students across top institutes in Indore and Bhopal. Mentored Top 10 and Top 100 ranks in IIT-JEE, NEET, and the Physics Olympiad.',
    showOnHome: true,
    order: 2
  },
  {
    id: 'fac-ashlesha',
    name: 'Ashlesha Phadnis',
    degree: 'M.Sc Chemistry, B.Ed',
    role: 'Chemistry Faculty & Senior Mentor',
    subject: 'Chemistry',
    exp: '30+ Years Experience',
    photo: '/assets/web/founder-ashlesha.jpg',
    bio: 'Veteran educator who has guided 30,000+ students over 3 decades, producing numerous Top 10 and Top 100 rank IITians and leading doctors across India.',
    showOnHome: true,
    order: 3
  },
  {
    id: 'fac-chaurasia',
    name: 'Sanjay Chaurasia',
    degree: 'B.Sc, B.Ed, MPA',
    role: 'Mathematics Faculty & JEE Head',
    subject: 'Mathematics',
    exp: '30+ Years Experience',
    photo: '/assets/web/founder-chaurasia.jpg',
    bio: 'Former senior faculty at FIITJEE and Allen. Master of competitive problem solving, guiding students to qualify NTSE, IMO, JSO, IQMO, and Olympiads.',
    showOnHome: true,
    order: 4
  },
  {
    id: 'fac-sandeep',
    name: 'Sandeep Bamnia',
    degree: 'M.Tech / B.Tech',
    role: 'Senior Physics Mentor',
    subject: 'Physics',
    exp: '18+ Years Experience',
    photo: '/assets/web/faculty-team-full.png',
    bio: 'Specialist in Mechanics and Modern Physics with a track record of top IIT-JEE Advanced qualifiers in Central India.',
    showOnHome: false,
    order: 5
  },
  {
    id: 'fac-ramakant',
    name: 'Ramakant Deshmukh',
    degree: 'M.Sc Botany',
    role: 'Senior Botany Faculty',
    subject: 'Biology',
    exp: '20+ Years Experience',
    photo: '/assets/web/faculty-team-full.png',
    bio: 'Renowned expert in Plant Physiology and Genetics, simplifying complex NCERT concepts for maximum NEET scoring.',
    showOnHome: false,
    order: 6
  },
  {
    id: 'fac-bhaskar',
    name: 'Bhaskar Sharma',
    degree: 'M.Sc Inorganic Chemistry',
    role: 'Senior Chemistry Faculty',
    subject: 'Chemistry',
    exp: '19+ Years Experience',
    photo: '/assets/web/faculty-team-full.png',
    bio: 'Pioneer of memory retention frameworks for Inorganic Chemistry and Coordination Compounds.',
    showOnHome: false,
    order: 7
  },
  {
    id: 'fac-abhishek',
    name: 'Abhishek Jaiswal',
    degree: 'M.Sc Mathematics',
    role: 'Senior Maths Educator',
    subject: 'Mathematics',
    exp: '17+ Years Experience',
    photo: '/assets/web/faculty-team-full.png',
    bio: 'Specialist in Calculus and Coordinate Geometry for JEE Advanced and International Mathematical Olympiads.',
    showOnHome: false,
    order: 8
  }
];

export default function TeamPageView({ onBack, onOpenEnquiry }) {
  const [facultyList, setFacultyList] = useState(FALLBACK_FACULTY);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/faculty');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setFacultyList(json.data);
      }
    } catch (err) {
      console.warn('Using default faculty list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = selectedSubject === 'All'
    ? facultyList
    : facultyList.filter(f => f.subject && f.subject.toLowerCase() === selectedSubject.toLowerCase());

  const subjects = ['All', 'Biology', 'Physics', 'Chemistry', 'Mathematics'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-b from-[#0B1B3D] via-[#0D244F] to-[#0B1B3D] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Central India&apos;s Most Trusted Academic Team</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Meet Our Complete Faculty Team &amp; Mentors
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every educator at Rankers Path carries a minimum of 15–30 years of verified classroom teaching experience. 
              No junior substitute teachers — you learn directly from the master educators.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-brand-yellow">25+ Yrs</p>
              <p className="text-xs text-slate-300 font-semibold uppercase mt-0.5">Average Experience</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-white">30 Students</p>
              <p className="text-xs text-slate-300 font-semibold uppercase mt-0.5">Strict Batch Limit</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-brand-yellow">1:10</p>
              <p className="text-xs text-slate-300 font-semibold uppercase mt-0.5">Personal Ratio</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-black text-white">Daily 1 Hr</p>
              <p className="text-xs text-slate-300 font-semibold uppercase mt-0.5">Doubt Clinic</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs & Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Subject Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                selectedSubject === sub
                  ? 'bg-brand-navy text-brand-yellow shadow-md scale-105'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {sub === 'All' ? 'All Faculties' : sub}
            </button>
          ))}
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFaculty.map((f, i) => (
            <div
              key={f.id || i}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-brand-yellow/80 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Role Badge */}
                <div className="relative mx-auto mb-5">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md group-hover:border-brand-yellow transition duration-300 bg-slate-50">
                    <img
                      src={resolvePhotoUrl(f.photo)}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-brand-navy text-brand-yellow text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow border border-brand-yellow/30">
                    {f.subject || 'Faculty'}
                  </span>
                </div>

                {/* Name & Credentials */}
                <div className="text-center">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-navy transition">
                    {f.name}
                  </h3>
                  
                  {f.degree && (
                    <p className="text-xs text-brand-yellowDark font-bold mt-0.5">
                      {f.degree}
                    </p>
                  )}

                  <div className="inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-500 mt-1">
                    <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                    <span>{f.exp}</span>
                  </div>

                  {f.role && (
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold mt-1">
                      {f.role}
                    </p>
                  )}

                  {/* Bio */}
                  <p className="mt-4 text-xs sm:text-[13px] text-slate-600 leading-relaxed text-left border-t border-slate-100 pt-3">
                    {f.bio}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20enquire%20about%20classes%20and%20mentorship%20with%20${encodeURIComponent(f.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-brand-yellow/15 hover:bg-brand-yellow text-brand-navy font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 border border-brand-yellow/40 group-hover:bg-brand-yellow"
                >
                  <MessageCircle className="w-4 h-4 text-brand-navy" />
                  <span>Connect with Mentor</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 8-Member Team Banner Photo */}
        <div className="mt-16 bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy rounded-3xl p-8 sm:p-10 text-white shadow-xl border-2 border-brand-yellow/40">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-brand-yellow font-extrabold text-xs uppercase tracking-widest">
              Indore&apos;s Premier Teaching Force
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 text-white">
              The Complete Rankers Path Academic Powerhouse
            </h3>
            <p className="text-slate-300 text-sm mt-2">
              Sandeep Bamnia (Physics), Ramakant Deshmukh (Botany), Bhaskar Sharma (Chemistry), Sanjay Chauhan (Zoology), 
              Jaivir Singh (Physics), Ashlesha Phadnis (Chemistry), Sanjay Chaurasia (Maths), Abhishek Jaiswal (Maths).
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-inner border border-white/20 bg-white/5 p-2 sm:p-4">
            <img
              src="/assets/web/faculty-team-full.png"
              alt="Rankers Path Complete Faculty Team Indore"
              className="w-full h-auto object-contain mx-auto rounded-xl"
            />
          </div>
        </div>

      </div>

    </div>
  );
}

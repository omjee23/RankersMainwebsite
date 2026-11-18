import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Star, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { resolvePhotoUrl } from '../utils/imageUtils';
import { API_BASE_URL } from '../services/api';

const DEFAULT_FOUNDERS = [
  {
    id: 'fac-chauhan',
    name: 'Sanjay Chauhan',
    degree: 'M.Sc Biology (Zoo.), Gold Medalist',
    role: 'Biology Faculty',
    subject: 'Biology',
    exp: '28+ Years Experience',
    photo: '/assets/web/founder-chauhan.jpg',
    bio: 'Has taught 30,000+ students across premier national institutes. Produced Rank 1–2, Top 10, and Top 100 results in NEET, AIIMS, AFMC, and state PMTs.'
  },
  {
    id: 'fac-jaivir',
    name: 'Jaivir Singh',
    degree: 'B.Tech',
    role: 'Physics Faculty',
    subject: 'Physics',
    exp: '23+ Years Experience',
    photo: '/assets/web/founder-jaivir.jpg',
    bio: 'Has taught 20,000+ students across top institutes in Indore and Bhopal. Mentored Top 10 and Top 100 ranks in IIT-JEE, NEET, and the Physics Olympiad.'
  },
  {
    id: 'fac-ashlesha',
    name: 'Ashlesha Phadnis',
    degree: 'M.Sc Chemistry, B.Ed',
    role: 'Chemistry Faculty',
    subject: 'Chemistry',
    exp: '30+ Years Experience',
    photo: '/assets/web/founder-ashlesha.jpg',
    bio: 'Veteran educator who has guided 30,000+ students over 3 decades, producing numerous Top 10 and Top 100 rank IITians and leading doctors across India.'
  },
  {
    id: 'fac-chaurasia',
    name: 'Sanjay Chaurasia',
    degree: 'B.Sc, B.Ed, MPA',
    role: 'Mathematics Faculty',
    subject: 'Mathematics',
    exp: '30+ Years Experience',
    photo: '/assets/web/founder-chaurasia.jpg',
    bio: 'Former senior faculty at premier national institutes. Master of competitive problem solving, guiding students to qualify NTSE, IMO, JSO, IQMO, and Olympiads.'
  },
  {
    id: 'fac-ramakant',
    name: 'Ramakant Deshmukh',
    degree: 'M.Sc Botany',
    role: 'Senior Botany Faculty',
    subject: 'Biology',
    exp: '32+ Years Experience',
    photo: '/assets/web/founder-ramakant.jpg',
    bio: 'Renowned expert in Plant Physiology and Genetics, simplifying complex NCERT concepts for maximum NEET scoring.'
  },
  {
    id: 'fac-coming-soon',
    name: 'Senior Faculty Mentor',
    degree: 'Premier Institute Pedigree',
    role: 'Founding Mentor',
    subject: 'Coming Soon',
    exp: 'Announcement Coming Soon',
    photo: '/assets/web/faculty-coming-soon.svg',
    bio: 'Distinguished senior faculty mentor joining Rankers Path founding team. Official announcement coming soon.',
    isComingSoon: true
  }
];

export default function FacultySection({ onOpenTeam }) {
  const [faculty, setFaculty] = useState(DEFAULT_FOUNDERS);

  useEffect(() => {
    fetchHomeFaculty();
  }, []);

  const fetchHomeFaculty = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/faculty?home=true`);
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setFaculty(json.data);
      }
    } catch (err) {
      console.warn('Using default founders on home:', err.message);
    }
  };

  return (
    <section id="faculty" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-yellow/15 text-brand-navy font-extrabold text-xs uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-brand-yellowDark" />
            <span>CENTRAL INDIA&apos;S BEST FACULTY TEAM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meet Our Founding Faculty Mentors
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Unlike conventional coaching giants where classes are handed over to junior trainee teachers, 
            at Rankers Path, <strong className="text-brand-navy font-bold">our senior educators teach every single batch personally.</strong>
          </p>
        </div>

        {/* Founding Mentors Grid (3, 3 ka pair: 3 on top, 3 on bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {faculty.map((f, i) => (
            <div
              key={f.id || i}
              className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group"
            >
              {/* Photo */}
              <div className="relative mx-auto mb-5">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:border-brand-yellow transition duration-300 bg-slate-100">
                  <img
                    src={resolvePhotoUrl(f.photo)}
                    alt={`${f.name} — ${f.role || f.subject} Faculty Mentor at Rankers Path Indore`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow border ${
                  f.isComingSoon || f.id === 'fac-coming-soon'
                    ? 'bg-amber-400 text-brand-navy border-amber-300 font-black'
                    : 'bg-brand-navy text-brand-yellow border-brand-yellow/30'
                }`}>
                  {f.isComingSoon || f.id === 'fac-coming-soon' ? 'COMING SOON' : f.subject ? f.subject.toUpperCase() : f.role ? f.role.split(' ')[0].toUpperCase() : 'MENTOR'}
                </span>
              </div>

              {/* Title & Degrees */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-navyLight transition">
                  {f.name}
                </h3>
                
                {f.degree && (
                  <p className="text-xs text-brand-yellowDark font-bold mt-0.5">
                    {f.degree}
                  </p>
                )}

                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 mt-1">
                  <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                  <span>{f.exp}</span>
                </div>

                <p className="mt-4 text-xs sm:text-[13px] text-slate-600 leading-relaxed text-left flex-1 border-t border-slate-200/60 pt-3">
                  {f.bio}
                </p>

                {(f.isComingSoon || f.id === 'fac-coming-soon') && (
                  <div className="mt-3 text-center">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-[11px] rounded-full uppercase tracking-wider border border-amber-300/60">
                      ✨ Coming Soon / घोषणा जल्द
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 'See More Faculty Members' Button as Requested by User */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenTeam}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-sm uppercase tracking-wider shadow-xl shadow-brand-navy/15 hover:shadow-brand-navy/30 transition transform hover:-translate-y-0.5 group border-2 border-brand-yellow/30"
          >
            <GraduationCap className="w-5 h-5 text-brand-yellow" />
            <span>See More Faculty Members &amp; Mentors</span>
            <ArrowRight className="w-4 h-4 text-brand-yellow group-hover:translate-x-1.5 transition" />
          </button>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Explore complete faculty team, subject specializations, and direct 1:1 mentorship
          </p>
        </div>

        {/* Full Faculty Team Banner */}
        <div className="mt-16 bg-gradient-to-r from-brand-navy to-brand-navyCard rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-brand-yellow/30">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-brand-yellow font-extrabold text-xs uppercase tracking-widest">
              Complete Academic Powerhouse
            </span>
            <h3 className="text-2xl sm:text-3xl font-black mt-1">Central India&apos;s Most Experienced Faculty Team</h3>
            <p className="text-slate-300 text-sm mt-2">
              Ramakant Deshmukh (Botany), Bhaskar Sharma (Chemistry), Sanjay Chauhan (Zoology), 
              Jaivir Singh (Physics), Ashlesha Phadnis (Chemistry), Sanjay Chaurasia (Maths), Abhishek Jaiswal (Maths) &amp; Distinguished Senior Mentors.
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-inner border border-white/20 bg-white/5 p-2 sm:p-4 cursor-pointer hover:border-brand-yellow/50 transition" onClick={onOpenTeam}>
            <img
              src="/assets/web/faculty-team-full.png"
              alt="Rankers Path Full Faculty Team"
              className="w-full h-auto object-contain mx-auto rounded-xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

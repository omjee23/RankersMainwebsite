import React from 'react';
import { Award, BookOpen, Star, GraduationCap } from 'lucide-react';

const founders = [
  {
    name: 'Sanjay Chauhan',
    degree: 'M.Sc Biology (Zoo.), Gold Medalist',
    role: 'Biology Faculty',
    exp: '28+ Years Experience',
    photo: '/assets/web/founder-chauhan.jpg',
    bio: 'Has taught 30,000+ students across premier national institutes. Produced Rank 1–2, Top 10, and Top 100 results in NEET, AIIMS, AFMC, and state PMTs.'
  },
  {
    name: 'Jaivir Singh',
    degree: 'B.Tech',
    role: 'Physics Faculty',
    exp: '23+ Years Experience',
    photo: '/assets/web/founder-jaivir.jpg',
    bio: 'Has taught 20,000+ students across top institutes in Indore and Bhopal. Mentored Top 10 and Top 100 ranks in IIT-JEE, NEET, and the Physics Olympiad.'
  },
  {
    name: 'Ashlesha Phadnis',
    degree: 'M.Sc Chemistry, B.Ed',
    role: 'Chemistry Faculty',
    exp: '30+ Years Experience',
    photo: '/assets/web/founder-ashlesha.jpg',
    bio: 'Veteran educator who has guided 30,000+ students over 3 decades, producing numerous Top 10 and Top 100 rank IITians and leading doctors across India.'
  },
  {
    name: 'Sanjay Chaurasia',
    degree: 'B.Sc, B.Ed, MPA',
    role: 'Mathematics Faculty',
    exp: '30+ Years Experience',
    photo: '/assets/web/founder-chaurasia.jpg',
    bio: 'Former senior faculty at FIITJEE and Allen. Master of competitive problem solving, guiding students to qualify NTSE, IMO, JSO, IQMO, and Olympiads.'
  }
];

export default function FacultySection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-navy font-extrabold text-xs uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4 text-brand-yellowDark" /> Central India's Best Faculty Team
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Founding Faculty Mentors
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Unlike conventional coaching giants where classes are handed over to junior trainee teachers, 
            at Rankers Path, <strong className="text-brand-navy font-bold">our 4 founding educators teach every single batch personally.</strong>
          </p>
        </div>

        {/* 4 Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {founders.map((f, i) => (
            <div
              key={i}
              className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group"
            >
              {/* Photo */}
              <div className="relative mx-auto mb-5">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white shadow-md group-hover:border-brand-yellow transition duration-300">
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-brand-navy text-brand-yellow text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow">
                  {f.role.split(' ')[0]}
                </span>
              </div>

              {/* Title & Degrees */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-navyLight transition">
                  {f.name}
                </h3>
                <p className="text-xs text-brand-yellowDark font-bold mt-0.5">
                  {f.degree}
                </p>
                <div className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 mt-1">
                  <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                  <span>{f.exp}</span>
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed text-left flex-1 border-t border-slate-200/60 pt-3">
                  {f.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Full Faculty Team Banner */}
        <div className="mt-16 bg-gradient-to-r from-brand-navy to-brand-navyCard rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-brand-yellow/30">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-brand-yellow font-extrabold text-xs uppercase tracking-widest">Complete Academic Powerhouse</span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-1">Central India's Most Experienced Faculty Team</h3>
            <p className="text-slate-300 text-sm mt-2">
              Sandeep Bamnia (Physics), Ramakant Deshmukh (Botany), Bhaskar Sharma (Chemistry), Sanjay Chauhan (Zoology), 
              Jaivir Singh (Physics), Ashlesha Phadnis (Chemistry), Sanjay Chaurasia (Maths), Abhishek Jaiswal (Maths).
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-inner border border-white/20 bg-white/5 p-2 sm:p-4">
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

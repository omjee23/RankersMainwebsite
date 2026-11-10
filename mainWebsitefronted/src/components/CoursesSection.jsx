import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Award, Sparkles, PhoneCall } from 'lucide-react';
import { api } from '../services/api';

/* ==========================================================================
   AUTHENTIC SVG ILLUSTRATIONS MATCHING USER REFERENCE IMAGE
   ========================================================================== */

function JeeAdvancedIllustration() {
  return (
    <svg viewBox="0 0 200 135" className="w-full h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grey Skyline Buildings in Background */}
      <rect x="52" y="48" width="16" height="52" rx="1" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1"/>
      <rect x="56" y="54" width="3" height="4" fill="#94A3B8"/>
      <rect x="62" y="54" width="3" height="4" fill="#94A3B8"/>
      <rect x="56" y="62" width="3" height="4" fill="#94A3B8"/>
      <rect x="62" y="62" width="3" height="4" fill="#94A3B8"/>
      
      <rect x="70" y="36" width="22" height="64" rx="1" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1"/>
      <rect x="74" y="42" width="4" height="4" fill="#64748B"/>
      <rect x="82" y="42" width="4" height="4" fill="#64748B"/>
      <rect x="74" y="50" width="4" height="4" fill="#64748B"/>
      <rect x="82" y="50" width="4" height="4" fill="#64748B"/>
      <rect x="74" y="58" width="4" height="4" fill="#64748B"/>
      <rect x="82" y="58" width="4" height="4" fill="#64748B"/>

      <rect x="126" y="42" width="20" height="58" rx="1" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1"/>
      <rect x="130" y="48" width="3" height="4" fill="#94A3B8"/>
      <rect x="138" y="48" width="3" height="4" fill="#94A3B8"/>
      <rect x="130" y="56" width="3" height="4" fill="#94A3B8"/>
      <rect x="138" y="56" width="3" height="4" fill="#94A3B8"/>

      {/* Engineer Body / Shoulders */}
      <path d="M78 106 C78 90 122 90 122 106 L126 120 L74 120 Z" fill="#0284C7"/>
      {/* Yellow Safety Vest & Collar */}
      <path d="M82 104 L92 120 L108 120 L118 104 Z" fill="#FBBF24"/>
      <polygon points="96,96 100,102 104,96" fill="#FFFFFF"/>
      <polygon points="98,102 100,114 102,102" fill="#0369A1"/>

      {/* Neck */}
      <rect x="95" y="80" width="10" height="12" fill="#FDE68A"/>
      {/* Head */}
      <circle cx="100" cy="68" r="18" fill="#FDE68A"/>
      {/* Glasses & Smile */}
      <circle cx="94" cy="66" r="4.5" stroke="#0F172A" strokeWidth="1.5" fill="none"/>
      <circle cx="106" cy="66" r="4.5" stroke="#0F172A" strokeWidth="1.5" fill="none"/>
      <line x1="98.5" y1="66" x2="101.5" y2="66" stroke="#0F172A" strokeWidth="1.5"/>
      <circle cx="94" cy="66" r="1.8" fill="#0F172A"/>
      <circle cx="106" cy="66" r="1.8" fill="#0F172A"/>
      <path d="M96 73 Q100 78 104 73" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

      {/* Yellow Safety Construction Helmet */}
      <path d="M79 62 C79 42 121 42 121 62 Z" fill="#F59E0B"/>
      <rect x="74" y="60" width="52" height="5" rx="2.5" fill="#D97706"/>
      <rect x="94" y="44" width="12" height="14" rx="2" fill="#FBBF24"/>

      {/* Yellow Construction Vehicles in Foreground */}
      {/* Bulldozer Left */}
      <rect x="42" y="112" width="18" height="10" rx="1" fill="#F59E0B"/>
      <rect x="46" y="106" width="10" height="7" rx="1" fill="#FDE68A" stroke="#B45309" strokeWidth="0.8"/>
      <circle cx="47" cy="122" r="3" fill="#334155"/>
      <circle cx="56" cy="122" r="3" fill="#334155"/>
      <path d="M38 116 L43 116 L41 122 Z" fill="#94A3B8"/>

      {/* Dump Truck Right */}
      <rect x="142" y="110" width="22" height="12" rx="1" fill="#F59E0B"/>
      <rect x="156" y="104" width="10" height="8" rx="1" fill="#FDE68A" stroke="#B45309" strokeWidth="0.8"/>
      <circle cx="147" cy="122" r="3" fill="#334155"/>
      <circle cx="160" cy="122" r="3" fill="#334155"/>

      {/* Ground baseline */}
      <line x1="28" y1="124" x2="172" y2="124" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function NeetUgIllustration() {
  return (
    <svg viewBox="0 0 200 135" className="w-full h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orange DNA Helix in Background */}
      <g stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round">
        <path d="M124 24 Q136 34 124 44 T124 64 T124 84" fill="none"/>
        <path d="M136 24 Q124 34 136 44 T136 64 T136 84" fill="none"/>
        <line x1="126" y1="28" x2="134" y2="28" stroke="#FBBF24"/>
        <line x1="125" y1="44" x2="135" y2="44" stroke="#FBBF24"/>
        <line x1="126" y1="60" x2="134" y2="60" stroke="#FBBF24"/>
        <line x1="125" y1="76" x2="135" y2="76" stroke="#FBBF24"/>
      </g>

      {/* Floating Red Cross in Top Corner */}
      <path d="M158 26 H166 M162 22 V30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Dark Navy Microscope (Center-Left) */}
      <ellipse cx="78" cy="116" rx="26" ry="6" fill="#1E293B"/>
      {/* Stage */}
      <rect x="68" y="92" width="28" height="5" rx="1.5" fill="#334155"/>
      <rect x="74" y="97" width="14" height="19" fill="#1E293B"/>
      {/* Curved Arm */}
      <path d="M68 92 C56 78 60 52 78 52" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Eyepiece / Objective Body */}
      <rect x="78" y="44" width="10" height="26" rx="2" transform="rotate(25 78 44)" fill="#0284C7"/>
      <rect x="72" y="66" width="14" height="6" rx="1.5" transform="rotate(25 72 66)" fill="#0369A1"/>
      <circle cx="58" cy="74" r="4.5" fill="#F59E0B"/>

      {/* Amber/Orange Laboratory Flask with Liquid & Bubbles (Right) */}
      <path d="M136 68 L144 68 L144 80 L162 108 C165 113 161 117 155 117 L127 117 C121 117 117 113 120 108 L136 80 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2"/>
      {/* Amber liquid in flask */}
      <path d="M123 102 L159 102 L155 115 L127 115 Z" fill="#F59E0B"/>
      <circle cx="134" cy="95" r="2.5" fill="#FBBF24"/>
      <circle cx="145" cy="89" r="2" fill="#FBBF24"/>
      <circle cx="138" cy="85" r="1.5" fill="#FBBF24"/>

      {/* Small molecular dots */}
      <circle cx="50" cy="46" r="2" fill="#0284C7"/>
      <circle cx="44" cy="54" r="1.5" fill="#38BDF8"/>
      <line x1="50" y1="46" x2="44" y2="54" stroke="#94A3B8" strokeWidth="0.8"/>
    </svg>
  );
}

function JeeMainIllustration() {
  return (
    <svg viewBox="0 0 200 135" className="w-full h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 3D Circular Pie Chart with Slices */}
      <ellipse cx="78" cy="62" rx="24" ry="14" fill="#F59E0B"/>
      {/* Pie Slices */}
      <path d="M78 62 L96 52 A24 14 0 0 1 100 64 L78 62 Z" fill="#FBBF24"/>
      <path d="M78 62 L60 70 A24 14 0 0 1 54 62 L78 62 Z" fill="#0284C7"/>
      <path d="M78 62 L78 76 A24 14 0 0 1 60 70 L78 62 Z" fill="#1E3A8A"/>
      <path d="M78 62 L100 64 A24 14 0 0 1 78 76 L78 62 Z" fill="#EA580C"/>

      {/* Formula a+b */}
      <text x="84" y="32" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="sans-serif">a+b</text>

      {/* Clear 3D Drafting Triangle / Ruler */}
      <polygon points="112,28 112,68 138,68" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5"/>
      <polygon points="116,42 116,64 128,64" fill="#FFFFFF"/>
      <line x1="112" y1="36" x2="114" y2="36" stroke="#0284C7" strokeWidth="1"/>
      <line x1="112" y1="44" x2="115" y2="44" stroke="#0284C7" strokeWidth="1"/>
      <line x1="112" y1="52" x2="114" y2="52" stroke="#0284C7" strokeWidth="1"/>
      <line x1="112" y1="60" x2="115" y2="60" stroke="#0284C7" strokeWidth="1"/>

      {/* 3D Dark Blue Book / Binder Lying Flat */}
      <polygon points="106,78 142,66 164,80 128,92" fill="#1E3A8A"/>
      <polygon points="128,92 164,80 164,88 128,100" fill="#0F172A"/>
      <polygon points="106,78 128,92 128,100 106,86" fill="#1E293B"/>
      {/* White pages edge */}
      <polygon points="130,90 162,79 162,85 130,96" fill="#F8FAFC"/>
      {/* Orange bookmark ribbon */}
      <path d="M142 80 L146 94 L142 92 L138 94 Z" fill="#F59E0B"/>

      {/* 3D Number 5 (Left Foreground) */}
      <text x="64" y="104" fill="#0284C7" fontSize="22" fontWeight="900" fontFamily="sans-serif">5</text>

      {/* 3D Small Cube (Golden Yellow) */}
      <polygon points="76,112 84,107 92,112 84,117" fill="#FBBF24"/>
      <polygon points="76,112 84,117 84,124 76,119" fill="#F59E0B"/>
      <polygon points="84,117 92,112 92,119 84,124" fill="#D97706"/>

      {/* Drafting Pencil */}
      <line x1="136" y1="104" x2="158" y2="94" stroke="#0F172A" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="133,105 137,102 137,106" fill="#F59E0B"/>
    </svg>
  );
}

function PncfIllustration() {
  return (
    <svg viewBox="0 0 200 135" className="w-full h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grounding Base Line */}
      <line x1="58" y1="122" x2="142" y2="122" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Creative Mind Burst / Doodles from Magnifying Glass */}
      <circle cx="82" cy="34" r="5" fill="#0284C7"/>
      <circle cx="82" cy="34" r="2" fill="#FFFFFF"/>

      <circle cx="120" cy="32" r="6" fill="#EF4444"/>
      <circle cx="120" cy="32" r="2.5" fill="#FFFFFF"/>

      <circle cx="102" cy="24" r="4.5" fill="#F59E0B"/>
      <polygon points="102,18 103,21 106,21 104,23 105,26 102,24 99,26 100,23 98,21 101,21" fill="#FBBF24"/>

      {/* Atom Orbit Doodles */}
      <ellipse cx="132" cy="44" rx="8" ry="3" stroke="#10B981" strokeWidth="1" fill="none" transform="rotate(30 132 44)"/>
      <ellipse cx="132" cy="44" rx="8" ry="3" stroke="#10B981" strokeWidth="1" fill="none" transform="rotate(-30 132 44)"/>
      <circle cx="132" cy="44" r="1.5" fill="#10B981"/>

      {/* Chemistry flask doodle */}
      <path d="M68 38 L72 38 L72 42 L76 48 L64 48 L68 42 Z" fill="#38BDF8"/>

      {/* Magnifying Glass sitting on Kid's Head */}
      <circle cx="100" cy="52" r="16" stroke="#0F172A" strokeWidth="3" fill="#F8FAFC" fillOpacity="0.4"/>
      <path d="M84 52 L68 46" stroke="#0F172A" strokeWidth="4" strokeLinecap="round"/>

      {/* Cheerful Student Face */}
      <circle cx="100" cy="80" r="17" fill="#FDE68A"/>
      {/* Black Hair */}
      <path d="M83 74 C83 62 117 62 117 74 C112 68 88 68 83 74 Z" fill="#0F172A"/>
      {/* Cheerful Big Eyes */}
      <circle cx="94" cy="78" r="2.5" fill="#0F172A"/>
      <circle cx="106" cy="78" r="2.5" fill="#0F172A"/>
      <circle cx="95" cy="77" r="0.8" fill="#FFFFFF"/>
      <circle cx="107" cy="77" r="0.8" fill="#FFFFFF"/>
      {/* Rosy Cheeks */}
      <circle cx="91" cy="83" r="2" fill="#FCA5A5" fillOpacity="0.8"/>
      <circle cx="109" cy="83" r="2" fill="#FCA5A5" fillOpacity="0.8"/>
      {/* Wide Happy Smile */}
      <path d="M94 82 Q100 90 106 82" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" fill="#EF4444"/>

      {/* Kid's Red Shirt Body with Arms Raised Cheerfully */}
      <path d="M85 96 C85 92 115 92 115 96 L118 122 L82 122 Z" fill="#EF4444"/>
      <polygon points="96,96 100,102 104,96" fill="#FFFFFF"/>
      {/* Arms spread up */}
      <path d="M83 100 L70 86" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round"/>
      <path d="M117 100 L130 86" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

function OnlineProgramIllustration() {
  return (
    <svg viewBox="0 0 200 135" className="w-full h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Study Desk Mat / Surface */}
      <ellipse cx="104" cy="106" rx="46" ry="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"/>

      {/* Desk Lamp on Right */}
      <path d="M148 42 L138 64 L158 64 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1"/>
      <path d="M148 64 L148 88 L142 90" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="142" cy="91" rx="5" ry="2" fill="#64748B"/>

      {/* White Modern Laptop */}
      <rect x="74" y="60" width="44" height="30" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5"/>
      <rect x="77" y="63" width="38" height="24" rx="1.5" fill="#38BDF8"/>
      {/* Person / Teacher on video call screen */}
      <circle cx="96" cy="72" r="4.5" fill="#FFFFFF"/>
      <path d="M89 84 C89 79 103 79 103 84 Z" fill="#0284C7"/>
      {/* Laptop Base */}
      <path d="M68 90 L124 90 L120 95 L72 95 Z" fill="#CBD5E1"/>

      {/* Student Studying on the Right (Green Top, Dark Hair) */}
      <circle cx="132" cy="80" r="10" fill="#0F172A"/>
      <path d="M122 108 C122 94 146 94 146 108 Z" fill="#10B981"/>
      {/* Arm holding phone/stylus */}
      <path d="M124 98 L114 96" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round"/>
      <rect x="110" y="93" width="5" height="8" rx="1" fill="#0F172A"/>

      {/* Sticky Notepad on Desk */}
      <polygon points="74,104 86,101 88,111 76,114" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.8"/>
      <line x1="77" y1="105" x2="84" y2="103" stroke="#D97706" strokeWidth="0.8"/>
      <line x1="77" y1="108" x2="85" y2="106" stroke="#D97706" strokeWidth="0.8"/>
    </svg>
  );
}

function CustomCourseIllustration() {
  return (
    <svg viewBox="0 0 200 135" className="w-full h-32 object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="112" rx="42" ry="12" fill="#E2E8F0"/>
      {/* Open Book */}
      <path d="M64 96 C76 90 94 92 100 96 C106 92 124 90 136 96 L134 110 C122 104 106 106 100 110 C94 106 78 104 66 110 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5"/>
      <line x1="100" y1="96" x2="100" y2="110" stroke="#0284C7" strokeWidth="1.5"/>
      {/* Graduation Cap Floating */}
      <polygon points="100,52 142,65 100,78 58,65" fill="#0F172A"/>
      <polygon points="100,52 142,65 100,72 58,65" fill="#1E293B"/>
      <rect x="76" y="74" width="48" height="14" rx="2" fill="#0F172A"/>
      <circle cx="100" cy="65" r="2.5" fill="#F59E0B"/>
      <path d="M100 65 L132 74 L134 86" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="134" cy="87" r="2" fill="#F59E0B"/>
    </svg>
  );
}

const ILLUSTRATION_MAP = {
  'jee-adv': JeeAdvancedIllustration,
  'neet-ug': NeetUgIllustration,
  'jee-main': JeeMainIllustration,
  'pncf': PncfIllustration,
  'online': OnlineProgramIllustration,
  'custom': CustomCourseIllustration
};

/* ==========================================================================
   DEFAULT INITIAL COURSES DATA (FALLBACK IF OFFLINE)
   ========================================================================== */

const COURSE_CARDS_DEFAULT = [
  {
    id: 'course-jee-adv',
    domainKey: 'jee-adv',
    title: 'JEE (Main+Advanced)/IIT-JEE',
    desc: 'JEE (Main+Advanced) Courses builds strong subject knowledge and problem-solving skills to help aspirants ace the exams to get enrolled into IITs.',
    tuitionFee: '₹85,000 – ₹90,000 / Year',
    badge: 'Class',
    category: 'ENGINEERING',
    target: 'IIT-JEE 2026 / 2027 Aspirants',
    eligibility: 'Class 10th to 11th moving, 12th appearing & 12th Pass (Dropper)',
    duration: '1 Year / 2 Years Comprehensive Classroom Programme',
    scholarshipWaiver: 'Flat 30% Early Bird (Save ₹25,500+) | Up to 100% via RSAT',
    startingFee: '₹59,500',
    keyFeatures: [
      'Personal teaching by Senior Kota/Indore Faculty Directors',
      'Daily 4.5 hours core classroom lectures + Daily Practice Problems (DPP)',
      'Computer Based Test (CBT) mock exam series matching exact IIT pattern',
      'Dedicated 1-on-1 Doubt Clinic open 8:00 AM to 8:00 PM daily'
    ],
    order: 1,
    active: true
  },
  {
    id: 'course-neet-ug',
    domainKey: 'neet-ug',
    title: 'Pre-Medical/NEET UG',
    desc: 'NEET-UG Courses sharpen skills essential for medical entrance exams, ensuring students are well-prepared for success in the competitive medical field.',
    tuitionFee: '₹80,000 – ₹90,000 / Year',
    badge: 'Class',
    category: 'MEDICAL',
    target: 'NEET-UG 2026 / 2027 Aspirants',
    eligibility: 'Class 10th to 11th moving, 12th appearing & 12th Pass (Dropper)',
    duration: '1 Year / 2 Years Medical Classroom Programme',
    scholarshipWaiver: 'Flat 30% Early Bird (Save ₹24,000+) | Up to 100% via RSAT',
    startingFee: '₹56,000',
    keyFeatures: [
      'Line-by-line NCERT Biology & Chemistry mastery with conceptual maps',
      'Weekly OMR Speed Tests designed to hit 680+ marks for AIIMS & GMC',
      'Senior faculty mentor support led by Dr. Sanjay Chauhan (Gold Medalist)',
      'Proven track record of producing Top 10 and Top 100 AIRs'
    ],
    order: 2,
    active: true
  },
  {
    id: 'course-jee-main',
    domainKey: 'jee-main',
    title: 'JEE (Main)',
    desc: 'JEE (Main) courses are designed to provide students with a significant competitive edge for achieving success for their path to NITs, IIITs and equivalent colleges.',
    tuitionFee: '₹75,000 – ₹80,000 / Year',
    badge: 'Target',
    category: 'ENGINEERING',
    target: 'JEE Main (NTA) 2026 / 2027',
    eligibility: 'Class 11th, 12th & 12th Pass (Targeting Top NITs/IIITs)',
    duration: '1 Year / 2 Years Fast-Track Prep',
    scholarshipWaiver: 'Flat 30% Early Bird (Save ₹22,500+) | Up to 100% via RSAT',
    startingFee: '₹52,500',
    keyFeatures: [
      'Laser focus on NTA speed, accuracy & 99+ percentile boost',
      'Rigorous coverage of Physics, Chemistry & Higher Mathematics',
      'Curated 10,000+ question bank with detailed video explanations',
      'Live online computer lab simulation for error-free CBT testing'
    ],
    order: 3,
    active: true
  },
  {
    id: 'course-pncf',
    domainKey: 'pncf',
    title: 'Pre-Nurture & Career Foundation',
    desc: 'PNCF Courses for class 6th to 10th nurtures students, establishing a robust groundwork for excelling in competitive exams and Olympiads.',
    tuitionFee: '₹40,000 – ₹47,000 / Year',
    badge: 'Classes',
    category: 'FOUNDATION',
    target: 'Class 6th, 7th, 8th, 9th & 10th Students',
    eligibility: 'School Students targeting NTSE, Olympiads & Early IIT/NEET Foundation',
    duration: '1 Academic Year (Parallel with School)',
    scholarshipWaiver: 'Flat 30% Early Bird (Save ₹12,000+) | Up to 100% via RSAT',
    startingFee: '₹28,000',
    keyFeatures: [
      'Strong conceptual foundation in Science & Mathematics without stress',
      'Mental Ability, Logic & IQ building modules',
      'Preparation for IOQM, NSTSE, SOF Olympiads & NTSE',
      'School board examination excellence with 95%+ board scores'
    ],
    order: 4,
    active: true
  },
  {
    id: 'course-online',
    domainKey: 'online',
    title: 'RankersPath Online Programs',
    desc: 'New LIVE courses for classes 6-10 and Online Test Series for classes 11, 12 & 12+ to level up JEE & NEET preparation.',
    tuitionFee: '₹4,999 onwards',
    badge: 'Online',
    category: 'DIGITAL & HYBRID',
    target: 'All-India Distance & Hybrid Learners',
    eligibility: 'Students anywhere in India from Class 6th to 12th Pass',
    duration: 'Flexible Full Academic Year Access',
    scholarshipWaiver: 'Up to 90% (Save via RSAT)',
    startingFee: '₹999',
    keyFeatures: [
      'Live two-way interactive classes by Kota/Indore senior faculty',
      'All-India Test Series (AIOTS) with predictive AIR percentile rank',
      'Complete printed modules delivered to your home + digital eBooks',
      'Recorded lecture repository for unlimited revision anytime, anywhere'
    ],
    order: 5,
    active: true
  }
];

export default function CoursesSection({ onOpenEnquiry, onOpenRSAT, onOpenRankX, onOpenCoursePage }) {
  const [courses, setCourses] = useState(COURSE_CARDS_DEFAULT);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Dynamically fetch active courses from the backend CMS
  useEffect(() => {
    let isMounted = true;
    api.getCourses()
      .then((res) => {
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        console.warn('Courses dynamic fetch fallback to defaults:', err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (course) => {
    // If course has dedicated page (jee-adv, neet-ug, jee-main, pncf), open its page directly
    if (onOpenCoursePage && ['jee-adv', 'neet-ug', 'jee-main', 'pncf'].includes(course.domainKey)) {
      onOpenCoursePage(course.domainKey);
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <section id="courses" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Anchor alias for courses-fee */}
        <div id="courses-fee" className="-mt-12 pt-12"></div>
      
        {/* Section Heading matching reference image exactly (no underline) */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Courses &amp; Fee
          </h2>
        </div>

        {/* 5 Cards Row matching reference image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {courses.map((course) => {
            const Illustration = ILLUSTRATION_MAP[course.domainKey] || CustomCourseIllustration;
            return (
              <div
                key={course.id || course.title}
                onClick={() => handleCardClick(course)}
                className="bg-[#EEF4FA] rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-md border border-[#DCE7F2]/60 cursor-pointer group"
              >
                <div>
                  {/* Top Illustration */}
                  <div className="h-32 sm:h-36 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Illustration />
                  </div>

                  {/* Title matching screenshot */}
                  <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug mb-2.5 min-h-[44px] group-hover:text-brand-navy">
                    {course.title}
                  </h3>

                  {/* Description matching screenshot */}
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5 line-clamp-4">
                    {course.desc}
                  </p>
                </div>

                {/* Left-Aligned Yellow "Click Here" Button matching screenshot */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(course);
                    }}
                    className="px-5 py-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs sm:text-[13px] rounded-md shadow-xs transition duration-200 cursor-pointer"
                  >
                    Click Here
                  </button>
                  {['jee-adv', 'neet-ug', 'jee-main', 'pncf'].includes(course.domainKey) && (
                    <span className="text-[11px] text-slate-400 group-hover:text-brand-navy font-bold transition">
                      View Page &rarr;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-10 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-navy font-black text-xs uppercase tracking-wider">
                  {selectedCourse.category || 'PROGRAM'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedCourse.target || 'Target Aspirants'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {selectedCourse.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {selectedCourse.desc}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Eligibility Criteria</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedCourse.eligibility || 'Class 10th to 12th Pass'}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Program Duration</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedCourse.duration || '1 Year / 2 Years'}</p>
              </div>
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
                  <p className="text-xl font-black text-white mt-0.5">{selectedCourse.tuitionFee || 'Contact for Fee'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-amber-300 font-semibold">Scholarship Waiver</span>
                  <p className="text-xl font-black text-brand-yellow mt-0.5">
                    {selectedCourse.scholarshipWaiver || 'Up to 90% via RSAT'}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300 font-semibold">Net Effective Starting Fee</span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">{selectedCourse.startingFee || 'From ₹999'}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span>💳 0% Interest EMI &amp; 2/3 Installments Available</span>
                <span className="text-amber-300 font-semibold">5% Extra Rebate on Full Payment</span>
              </div>
            </div>

            {/* Course Features & Schedule */}
            {selectedCourse.keyFeatures && (
              <div className="mb-6">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
                  Course Highlights &amp; Inclusions:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Array.isArray(selectedCourse.keyFeatures) ? selectedCourse.keyFeatures : [selectedCourse.keyFeatures]).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {['jee-adv', 'neet-ug', 'jee-main', 'pncf'].includes(selectedCourse.domainKey) && onOpenCoursePage ? (
                <button
                  onClick={() => {
                    const slug = selectedCourse.domainKey;
                    setSelectedCourse(null);
                    onOpenCoursePage(slug);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-[#172554] text-brand-yellow text-xs font-black transition text-center shadow"
                >
                  View Full Course &amp; Fee Page &rarr;
                </button>
              ) : <div />}

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(selectedCourse.title)}%20fees%20and%20admission.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition text-center"
                >
                  WhatsApp Enquiry
                </a>
                
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    if (onOpenRSAT) onOpenRSAT();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-yellow hover:bg-[#F59E0B] text-slate-900 text-xs font-black shadow transition text-center"
                >
                  RSAT Scholarship &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

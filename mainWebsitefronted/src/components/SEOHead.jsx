import { useEffect } from 'react';

const SEO_MAP = {
  home: {
    title: 'Rankers Path — Best NEET & IIT-JEE Coaching Institute in Indore | Vijay Nagar Campus',
    description: 'Rankers Path Indore offers Kota-pedigree classroom coaching for NEET-UG, IIT-JEE (Main & Advanced), and Foundation (9th-10th). Mentored by ex-Kota HODs at Vijay Nagar Main Campus. Up to 100% scholarship via RSAT & RANKEX.',
    keywords: 'NEET coaching in Indore, IIT JEE coaching Indore, best NEET institute Vijay Nagar Indore, JEE Advanced coaching Vijay Nagar, RSAT scholarship, RANKEX 2027, Rankers Path Indore, Kota faculty in Indore, medical coaching Indore',
    canonical: 'https://rankerspath.co.in/',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  },
  'course-jee-adv': {
    title: 'IIT-JEE Advanced Coaching in Indore — Ex-Kota HOD Mentors | Rankers Path',
    description: 'Premier 2-Year and 1-Year Dropper IIT-JEE Advanced classroom program in Vijay Nagar, Indore. Concept-driven Kota methodology, daily DPPs, doubt clearance, and rigorous CBT test series.',
    keywords: 'IIT JEE Advanced coaching Indore, JEE Advanced Vijay Nagar, best JEE institute Indore, Kota JEE faculty Indore, IIT coaching Central India',
    canonical: 'https://rankerspath.co.in/courses/jee-advanced',
    ogImage: 'https://rankerspath.co.in/assets/web/founder-abhishek.jpg'
  },
  'course-jee-main': {
    title: 'JEE Main 2026-27 Coaching in Indore — Top Percentile Batch | Rankers Path',
    description: 'Targeted JEE Main coaching in Indore with systematic NCERT coverage, PYQ drill sessions, computer-based mock tests, and personalized performance analytics.',
    keywords: 'JEE Main coaching Indore, JEE Main dropper batch Indore, NTA JEE Main prep Vijay Nagar, Rankers Path JEE Main',
    canonical: 'https://rankerspath.co.in/courses/jee-main',
    ogImage: 'https://rankerspath.co.in/assets/web/founder-ramakant.jpg'
  },
  'course-neet-ug': {
    title: 'NEET-UG Medical Entrance Coaching in Indore — 700+ Score Strategy | Rankers Path',
    description: 'Top NEET-UG medical coaching at Vijay Nagar Indore. NCERT line-by-line mastery in Botany, Zoology, Physics & Chemistry with experienced doctors and Kota faculties.',
    keywords: 'NEET coaching Indore, best medical coaching Vijay Nagar, NEET dropper batch Indore, AIIMS faculty Indore, NEET test series Indore',
    canonical: 'https://rankerspath.co.in/courses/neet-ug',
    ogImage: 'https://rankerspath.co.in/assets/web/founder-bhaskar.jpg'
  },
  'course-foundation': {
    title: 'PNCF Pre-Foundation (Classes 9th & 10th + NTSE / Olympiad) | Rankers Path Indore',
    description: 'Early edge foundation program for Classes 9th & 10th in Indore. Strong conceptual mastery in Science, Mathematics & Mental Ability (MAT) for NTSE, IJSO, and Olympiads.',
    keywords: 'Foundation coaching Indore, class 9 coaching Indore, class 10 IIT foundation Indore, NTSE coaching Vijay Nagar, Olympiad coaching Indore',
    canonical: 'https://rankerspath.co.in/courses/foundation',
    ogImage: 'https://rankerspath.co.in/assets/web/founder-sandeep.jpg'
  },
  'about': {
    title: 'About Rankers Path — Safalta Ka Sankalp | Premier JEE & NEET Coaching Indore',
    description: 'Rankers Path Indore is founded by senior Kota directors with 25+ years experience. Strict 30-student micro-batches, personal mentorship, and Super-30 scholarship programs.',
    keywords: 'about Rankers Path, Kota coaching Indore, Vijay Nagar coaching institute, medical IIT coaching founders Indore',
    canonical: 'https://rankerspath.co.in/about',
    ogImage: 'https://rankerspath.co.in/assets/web/hero.jpg'
  },
  'team': {
    title: 'Kota Pedigree Academic Mentors & Faculty Team | Rankers Path Indore',
    description: 'Meet the founding mentors of Rankers Path Indore: Sanjay Chauhan (Biology), Jaivir Singh (Physics), Ashlesha Phadnis (Chemistry), and Sanjay Chaurasia (Maths) with 25+ years experience.',
    keywords: 'Kota teachers in Indore, Sanjay Chauhan biology, Jaivir Singh physics, Ashlesha Phadnis chemistry, Sanjay Chaurasia maths, Rankers Path faculty',
    canonical: 'https://rankerspath.co.in/faculty',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  },
  'admission': {
    title: 'Classroom Admissions Open 2026-27 — Apply Online / Offline | Rankers Path Indore',
    description: 'Direct admissions and scholarship seats open for NEET-UG, IIT-JEE, and Foundation 2026-27 at Rankers Path Vijay Nagar Main Campus. Apply online or visit campus today.',
    keywords: 'Rankers Path admission, coaching admission Indore, Vijay Nagar coaching admission 2026, NEET admission Indore, JEE registration Indore',
    canonical: 'https://rankerspath.co.in/admissions',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  },
  'refund-policy': {
    title: 'Official Fee, Transfer & Refund Policy | Rankers Path Indore',
    description: 'Transparent fee structures, scholarship adjustments, and official refund/batch transfer guidelines for students of Rankers Path Educational Institute, Indore.',
    keywords: 'Rankers Path refund policy, fee terms Indore coaching, coaching transfer policy Indore',
    canonical: 'https://rankerspath.co.in/refund-policy',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  },
  'dashboard': {
    title: 'Student LMS Learning Portal | Rankers Path Indore',
    description: 'Access study materials, recorded video lectures, live class links, biometric attendance and test analytics.',
    keywords: 'Rankers Path student portal, student LMS, online test results Indore',
    canonical: 'https://rankerspath.co.in/student-dashboard',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  },
  'rsat-dashboard': {
    title: 'RSAT 2026-27 Online Scholarship Test Portal | Rankers Path Indore',
    description: 'Take the Rankers Scholarship cum Admission Test (RSAT) online. 30-minute CBT exam with immediate score, national percentile rank, and up to 100% tuition waiver.',
    keywords: 'RSAT scholarship test, Rankers Path scholarship test, online test series Indore, scholarship test for NEET JEE Indore',
    canonical: 'https://rankerspath.co.in/rsat-portal',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  },
  'rankx-dashboard': {
    title: 'RANKEX 2027 All-India Talent Scholarship Exam Portal | Rankers Path Indore',
    description: 'Access your RANKEX 2027 candidate dashboard. Download digital admit card with QR, select offline examination slots, and view result analytics.',
    keywords: 'RANKEX 2027, Rankers Path scholarship test, RANKEX admit card, RANKEX exam dashboard Indore',
    canonical: 'https://rankerspath.co.in/rankex-portal',
    ogImage: 'https://rankerspath.co.in/assets/web/hero-campus.jpg'
  }
};

export default function SEOHead({ activeTab = 'home' }) {
  useEffect(() => {
    const meta = SEO_MAP[activeTab] || SEO_MAP.home;

    // 1. Document Title
    document.title = meta.title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (nameAttr, nameValue, content) => {
      let tag = document.querySelector(`meta[${nameAttr}="${nameValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameAttr, nameValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 3. Primary Meta Tags
    setMetaTag('name', 'title', meta.title);
    setMetaTag('name', 'description', meta.description);
    setMetaTag('name', 'keywords', meta.keywords);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:url', meta.canonical);
    setMetaTag('property', 'og:image', meta.ogImage);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);
    setMetaTag('name', 'twitter:image', meta.ogImage);

    // 6. Canonical Link Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', meta.canonical);

  }, [activeTab]);

  return null; // Side-effect only component
}

const fs = require('fs');
const path = require('path');

const materialsPath = path.join(__dirname, '../data/study_materials.json');
const lecturesPath = path.join(__dirname, '../data/recorded_lectures.json');

// Read existing materials
let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));

// Enrich existing materials if missing chapter/part
materials = materials.map(m => ({
  ...m,
  chapter: m.chapter || 'Foundational Topics',
  part: m.part || 'Part 1',
  partTitle: m.partTitle || m.title
}));

// Foundation seed items
const foundationMaterials = [
  {
    id: "mat-fnd-001",
    createdAt: "2026-10-05T10:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Light: Spherical Mirrors, Reflection Rules & Ray Diagrams Master Module",
    category: "PDF",
    subject: "Physics",
    stream: "FOUNDATION",
    chapter: "Light - Reflection and Refraction",
    part: "Part 1",
    partTitle: "Concave & Convex Mirror Ray Diagrams",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-light-part1.pdf",
    fileSize: "3.8 MB",
    description: "Detailed NCERT line-by-line breakdown of reflection laws, concave/convex mirrors, and standard ray diagrams.",
    downloadCount: 420
  },
  {
    id: "mat-fnd-002",
    createdAt: "2026-10-06T11:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Light: Mirror Formula, Magnification & Kota Numericals Sheet",
    category: "SHEET",
    subject: "Physics",
    stream: "FOUNDATION",
    chapter: "Light - Reflection and Refraction",
    part: "Part 2",
    partTitle: "Mirror Formula & High-Scoring Numericals",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-light-part2.pdf",
    fileSize: "2.1 MB",
    description: "30 graded numericals on 1/f = 1/v + 1/u, sign convention pitfalls, and magnification analysis with step solutions.",
    downloadCount: 380
  },
  {
    id: "mat-fnd-003",
    createdAt: "2026-10-07T09:30:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Light: Refraction of Light, Snell's Law & Lens Ray Diagrams",
    category: "NOTES",
    subject: "Physics",
    stream: "FOUNDATION",
    chapter: "Light - Reflection and Refraction",
    part: "Part 3",
    partTitle: "Refraction Index & Thin Lens Diagrams",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-light-part3.pdf",
    fileSize: "4.5 MB",
    description: "Kota classroom handwritten notes on refractive index, apparent depth, Snell's law, and convex/concave lens image formations.",
    downloadCount: 510
  },
  {
    id: "mat-fnd-004",
    createdAt: "2026-10-08T14:15:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Light: Power of Lens, Combinations & NTSE/Olympiad PYQs",
    category: "PYQ",
    subject: "Physics",
    stream: "FOUNDATION",
    chapter: "Light - Reflection and Refraction",
    part: "Part 4",
    partTitle: "Power of Lens & Board/NTSE PYQs",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-light-part4.pdf",
    fileSize: "3.2 MB",
    description: "10-year previous questions from CBSE Class 10 Board + NTSE Stage 1 & 2 physics papers.",
    downloadCount: 620
  },
  {
    id: "mat-fnd-005",
    createdAt: "2026-10-09T10:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Chemical Reactions & Equations: Balancing & Classification",
    category: "NOTES",
    subject: "Chemistry",
    stream: "FOUNDATION",
    chapter: "Chemical Reactions & Equations",
    part: "Part 1",
    partTitle: "Combination, Decomposition & Displacement Reactions",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-chem-part1.pdf",
    fileSize: "3.4 MB",
    description: "Comprehensive notes covering precipitation reactions, exothermic vs endothermic, and step-by-step algebraic balancing.",
    downloadCount: 460
  },
  {
    id: "mat-fnd-006",
    createdAt: "2026-10-10T12:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Real Numbers: Euclid's Lemma, Fundamental Theorem & Irrational Proofs",
    category: "PDF",
    subject: "Mathematics",
    stream: "FOUNDATION",
    chapter: "Real Numbers & Polynomials",
    part: "Part 1",
    partTitle: "Euclid's Division & Fundamental Theorem",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-maths-part1.pdf",
    fileSize: "2.9 MB",
    description: "Complete textbook concept notes with proof templates for proving irrationality of sqrt(2), sqrt(3), and 3+2sqrt(5).",
    downloadCount: 540
  },
  {
    id: "mat-fnd-007",
    createdAt: "2026-10-11T15:30:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Mental Ability (MAT): Number Series, Missing Terms & Letter Coding",
    category: "SHEET",
    subject: "Mental Ability (MAT)",
    stream: "FOUNDATION",
    chapter: "Logical & Analytical Reasoning",
    part: "Part 1",
    partTitle: "Series Completion & Missing Number Puzzles",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-mat-part1.pdf",
    fileSize: "1.9 MB",
    description: "Essential for NTSE, RSAT, and Olympiads: 50 practice questions on arithmetic series, square/cube patterns, and letter matrices.",
    downloadCount: 710
  },
  {
    id: "mat-fnd-008",
    createdAt: "2026-10-12T16:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Mental Ability (MAT): Direction Sense, Blood Relations & Venn Diagrams",
    category: "NOTES",
    subject: "Mental Ability (MAT)",
    stream: "FOUNDATION",
    chapter: "Logical & Analytical Reasoning",
    part: "Part 2",
    partTitle: "Direction Sense & Family Tree Logic",
    targetClass: "Class 9th & 10th (PNCF)",
    fileUrl: "/uploads/materials/foundation-mat-part2.pdf",
    fileSize: "2.2 MB",
    description: "Visual rules, shortcut compass matrices, and standard family tree decoding for rapid 30-second problem solving.",
    downloadCount: 680
  }
];

// Avoid duplicates
foundationMaterials.forEach(fm => {
  if (!materials.some(m => m.id === fm.id)) {
    materials.push(fm);
  }
});

fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2), 'utf8');
console.log('Updated study_materials.json with', materials.length, 'items');

// Read existing lectures
let lectures = JSON.parse(fs.readFileSync(lecturesPath, 'utf8'));

// Enrich existing lectures
lectures = lectures.map((l, idx) => ({
  ...l,
  part: l.part || `Part ${l.lectureNo || (idx + 1)}`,
  partTitle: l.partTitle || l.title
}));

const foundationLectures = [
  {
    id: "rec-fnd-001",
    createdAt: "2026-10-05T10:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Class 10 Light: Reflection of Light & Concave Mirror Ray Formation",
    subject: "Physics",
    chapter: "Light - Reflection and Refraction",
    lectureNo: 1,
    part: "Part 1",
    partTitle: "Concave Mirror Ray Tracing",
    stream: "FOUNDATION",
    videoId: "b5jQGz8LzC0",
    videoUrl: "https://www.youtube.com/watch?v=b5jQGz8LzC0",
    duration: "42 Mins",
    facultyName: "Er. Arvind Gupta (IIT Delhi)",
    notesUrl: "/uploads/materials/foundation-light-part1.pdf",
    dppUrl: "/uploads/materials/foundation-light-part2.pdf",
    description: "Detailed video lecture on center of curvature, focus, principal axis and image positions for concave mirrors."
  },
  {
    id: "rec-fnd-002",
    createdAt: "2026-10-06T11:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Class 10 Light: Mirror Formula & Kota Sign Convention Tricks",
    subject: "Physics",
    chapter: "Light - Reflection and Refraction",
    lectureNo: 2,
    part: "Part 2",
    partTitle: "Mirror Formula & High-Yield Numericals",
    stream: "FOUNDATION",
    videoId: "Y7z1eR8s5TQ",
    videoUrl: "https://www.youtube.com/watch?v=Y7z1eR8s5TQ",
    duration: "46 Mins",
    facultyName: "Er. Arvind Gupta (IIT Delhi)",
    notesUrl: "/uploads/materials/foundation-light-part2.pdf",
    dppUrl: "/uploads/materials/foundation-light-part2.pdf",
    description: "Step-by-step mastery of mirror formula 1/f = 1/v + 1/u and real vs virtual magnification sign conventions."
  },
  {
    id: "rec-fnd-003",
    createdAt: "2026-10-07T09:30:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Class 10 Light: Refraction, Snell's Law & Glass Slab Experiment",
    subject: "Physics",
    chapter: "Light - Reflection and Refraction",
    lectureNo: 3,
    part: "Part 3",
    partTitle: "Refraction & Lateral Displacement",
    stream: "FOUNDATION",
    videoId: "wR1j9sLk2PQ",
    videoUrl: "https://www.youtube.com/watch?v=wR1j9sLk2PQ",
    duration: "50 Mins",
    facultyName: "Er. Arvind Gupta (IIT Delhi)",
    notesUrl: "/uploads/materials/foundation-light-part3.pdf",
    dppUrl: "/uploads/materials/foundation-light-part3.pdf",
    description: "Speed of light in different optical media, Snell's law derivation, and lateral shift through a rectangular glass slab."
  },
  {
    id: "rec-fnd-004",
    createdAt: "2026-10-08T14:15:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Class 10 Light: Thin Lenses, Power of Lens & Board PYQ Discussion",
    subject: "Physics",
    chapter: "Light - Reflection and Refraction",
    lectureNo: 4,
    part: "Part 4",
    partTitle: "Convex/Concave Lenses & Lens Power",
    stream: "FOUNDATION",
    videoId: "tK8v7mN3wPQ",
    videoUrl: "https://www.youtube.com/watch?v=tK8v7mN3wPQ",
    duration: "55 Mins",
    facultyName: "Er. Arvind Gupta (IIT Delhi)",
    notesUrl: "/uploads/materials/foundation-light-part4.pdf",
    dppUrl: "/uploads/materials/foundation-light-part4.pdf",
    description: "Lens formula, image formation for convex and concave lenses, dioptre calculations and combination lenses."
  },
  {
    id: "rec-fnd-005",
    createdAt: "2026-10-09T10:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Class 10 Chemical Reactions: Types, Balancing & Precipitation",
    subject: "Chemistry",
    chapter: "Chemical Reactions & Equations",
    lectureNo: 1,
    part: "Part 1",
    partTitle: "Balancing & Types of Chemical Reactions",
    stream: "FOUNDATION",
    videoId: "mQ2w8vK9sXY",
    videoUrl: "https://www.youtube.com/watch?v=mQ2w8vK9sXY",
    duration: "48 Mins",
    facultyName: "Dr. S. K. Verma",
    notesUrl: "/uploads/materials/foundation-chem-part1.pdf",
    dppUrl: "/uploads/materials/foundation-chem-part1.pdf",
    description: "Detailed video breakdown of chemical equations, conservation of mass, and live balancing practice."
  },
  {
    id: "rec-fnd-006",
    createdAt: "2026-10-10T12:00:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Class 10 Maths: Euclid's Division Algorithm & HCF/LCM Mastery",
    subject: "Mathematics",
    chapter: "Real Numbers & Polynomials",
    lectureNo: 1,
    part: "Part 1",
    partTitle: "Euclid's Division Lemma & Prime Factorization",
    stream: "FOUNDATION",
    videoId: "pK9v3mQ7rST",
    videoUrl: "https://www.youtube.com/watch?v=pK9v3mQ7rST",
    duration: "52 Mins",
    facultyName: "Er. Nitin Agarwal",
    notesUrl: "/uploads/materials/foundation-maths-part1.pdf",
    dppUrl: "/uploads/materials/foundation-maths-part1.pdf",
    description: "Fundamental Theorem of Arithmetic, decimal expansion of rational numbers, and irrationality proofs."
  },
  {
    id: "rec-fnd-007",
    createdAt: "2026-10-11T15:30:00Z",
    updatedAt: "2026-10-15T04:00:00Z",
    title: "Mental Ability (MAT): Number & Alphabet Series Fast-Solving Techniques",
    subject: "Mental Ability (MAT)",
    chapter: "Logical & Analytical Reasoning",
    lectureNo: 1,
    part: "Part 1",
    partTitle: "Series Completion & Pattern Detection",
    stream: "FOUNDATION",
    videoId: "jR5w8kM2pUV",
    videoUrl: "https://www.youtube.com/watch?v=jR5w8kM2pUV",
    duration: "45 Mins",
    facultyName: "Kota Mental Ability Faculty",
    notesUrl: "/uploads/materials/foundation-mat-part1.pdf",
    dppUrl: "/uploads/materials/foundation-mat-part1.pdf",
    description: "Special NTSE & RSAT lecture on identifying alternating difference series, prime sequence puzzles, and alphabet reverse rank tricks."
  }
];

foundationLectures.forEach(fl => {
  if (!lectures.some(l => l.id === fl.id)) {
    lectures.push(fl);
  }
});

fs.writeFileSync(lecturesPath, JSON.stringify(lectures, null, 2), 'utf8');
console.log('Updated recorded_lectures.json with', lectures.length, 'items');

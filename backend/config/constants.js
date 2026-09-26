/**
 * System-wide constants, enums, and default configurations
 */
module.exports = {
  ROLES: {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
    SUPER_ADMIN: 'superadmin'
  },

  EXAM_TYPES: {
    RANKX_OFFLINE: 'RANKX_OFFLINE',
    RSAT_ONLINE: 'RSAT_ONLINE',
    TEST_SERIES: 'TEST_SERIES'
  },

  STREAMS: {
    NEET: 'NEET',
    IIT_JEE: 'IIT_JEE',
    FOUNDATION: 'FOUNDATION'
  },

  CLASSES: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper / Repeater'],

  MARKING_SCHEME: {
    CORRECT: 4,
    INCORRECT: -1,
    UNATTEMPTED: 0
  },

  QUESTION_STATUS: {
    NOT_VISITED: 'NOT_VISITED',
    NOT_ANSWERED: 'NOT_ANSWERED',
    ANSWERED: 'ANSWERED',
    MARKED_FOR_REVIEW: 'MARKED_FOR_REVIEW',
    ANSWERED_AND_MARKED: 'ANSWERED_AND_MARKED'
  },

  PAYMENT_STATUS: {
    INITIATED: 'INITIATED',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
  },

  DEFAULT_CENTRES: [
    {
      id: 'centre-vijay-nagar',
      name: 'Vijay Nagar Main Campus',
      address: 'HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      capacity: 600,
      registeredCount: 0,
      active: true
    },
    {
      id: 'centre-palasia',
      name: 'Old Palasia Branch',
      address: 'Near Geeta Bhawan Square, AB Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      capacity: 400,
      registeredCount: 0,
      active: true
    },
    {
      id: 'centre-bhawarkua',
      name: 'Bhawarkua Education Hub',
      address: 'Near Tower Chouraha, Bhawarkua, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      capacity: 500,
      registeredCount: 0,
      active: true
    }
  ],

  DEFAULT_FACULTY: [
    {
      id: 'fac-chauhan',
      name: 'Sanjay Chauhan',
      degree: 'M.Sc Biology (Zoo.), Gold Medalist',
      role: 'Biology Faculty',
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
      role: 'Physics Faculty',
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
      role: 'Chemistry Faculty',
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
      role: 'Mathematics Faculty',
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
  ]
};

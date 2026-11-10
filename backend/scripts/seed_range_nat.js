const fs = require('fs');
const path = require('path');

const questionsFile = path.join(__dirname, '../data/questions.json');
let questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

console.log('Original question count:', questions.length);

// 1. Update existing JEE Main Section B numerical questions to have Range NAT metadata
questions.forEach(q => {
  if (q.testId === 'test-jee-main-mock-01' && q.section === 'Section B') {
    if (q.id === 'q-jee-p-num1') {
      q.questionType = 'NAT_RANGE';
      q.rangeMin = 9.8;
      q.rangeMax = 10.2;
      q.tolerance = 0.2;
      q.questionText = '[Section B - Range NAT] A projectile is fired from the ground with speed 20 m/s at an angle of 45° with the horizontal. Calculate its maximum height (in meters). (Acceptable Range: 9.80 to 10.20 m, Take g = 10 m/s²)';
      q.explanation = 'Hmax = (u² sin² θ)/(2g) = (400 * 0.5) / 20 = 10.0 m. Evaluated with acceptable experimental tolerance [9.80 - 10.20].';
    } else if (q.id === 'q-jee-p-num2') {
      q.questionType = 'NAT_RANGE';
      q.rangeMin = 19.5;
      q.rangeMax = 20.5;
      q.tolerance = 0.5;
      q.questionText = '[Section B - Range NAT] A block of mass 2 kg rests on a frictionless horizontal plane. A horizontal force F = 8 N is applied. The velocity (in m/s) after 5 seconds is: (Acceptable Range: 19.5 to 20.5 m/s)';
      q.explanation = 'a = F/m = 4 m/s². v = u + at = 0 + 4*5 = 20.0 m/s. Range accepted: [19.5 - 20.5].';
    }
  }
});

// 2. New JEE Main Range NAT & MCQ Questions
const newJeeQuestions = [
  {
    id: 'q-jee-m-range-1',
    testId: 'test-jee-main-mock-01',
    examType: 'JEE_MAIN',
    stream: 'JEE',
    subject: 'Physics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 12.4,
    rangeMax: 12.6,
    correctAnswer: '12.5',
    questionText: '[Section B - Range NAT] In an experiment to determine effective acceleration g using a loaded pendulum, an upward magnetic damping reduces the effective downward acceleration to g_eff. A student calculates g_eff = 12.5 m/s². The admin has configured an acceptable evaluation range of 12.40 to 12.60 m/s². Enter your calculated value:',
    explanation: 'Effective value is 12.50 m/s². Acceptable evaluation range is [12.40 to 12.60]. Any answer inside this range receives full +4 marks.',
    classLevel: 'Class 11'
  },
  {
    id: 'q-jee-m-range-2',
    testId: 'test-jee-main-mock-01',
    examType: 'JEE_MAIN',
    stream: 'JEE',
    subject: 'Chemistry',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 4.70,
    rangeMax: 4.80,
    correctAnswer: '4.76',
    questionText: '[Section B - Range NAT] An acidic buffer solution is prepared by mixing 0.1 M acetic acid and 0.1 M sodium acetate. If Ka of CH3COOH is 1.74 × 10⁻⁵ (pKa = 4.76), calculate the pH of the buffer solution. (Acceptable Range: 4.70 to 4.80)',
    explanation: 'pH = pKa + log([Salt]/[Acid]) = 4.76 + log(0.1/0.1) = 4.76. Valid range is [4.70 to 4.80].',
    classLevel: 'Class 11'
  },
  {
    id: 'q-jee-m-range-3',
    testId: 'test-jee-main-mock-01',
    examType: 'JEE_MAIN',
    stream: 'JEE',
    subject: 'Mathematics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 0.32,
    rangeMax: 0.36,
    correctAnswer: '0.33',
    questionText: '[Section B - Range NAT] Find the area (in square units) bounded by the parabola y = x² and the line y = x in the first quadrant. Round your answer to 2 decimal places. (Acceptable Range: 0.32 to 0.36)',
    explanation: 'Area = ∫[0 to 1] (x - x²) dx = [x²/2 - x³/3] = 1/2 - 1/3 = 1/6 ≈ 0.333. Range accepted: [0.32 to 0.36].',
    classLevel: 'Class 12'
  },
  {
    id: 'q-jee-m-range-4',
    testId: 'test-jee-main-mock-01',
    examType: 'JEE_MAIN',
    stream: 'JEE',
    subject: 'Physics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 1.18,
    rangeMax: 1.22,
    correctAnswer: '1.20',
    questionText: '[Section B - Range NAT] In a Young\'s Double Slit Experiment, light of wavelength λ = 600 nm illuminates two slits separated by d = 1.0 mm. If the distance to the screen D = 2.0 m, calculate the fringe width β in millimeters (mm). (Acceptable Range: 1.18 to 1.22 mm)',
    explanation: 'Fringe width β = (λ * D) / d = (600 * 10^-9 * 2.0) / (1.0 * 10^-3) = 1.2 * 10^-3 m = 1.20 mm. Valid range: [1.18 - 1.22].',
    classLevel: 'Class 12'
  }
];

// 3. Foundation Class 9th Questions (Science, Maths, MAT)
const foundationClass9Questions = [
  {
    id: 'q-fnd9-p1',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Physics',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'An object travels 16 m in 4 s and then another 16 m in 2 s. What is the average speed of the object?',
    options: ['5.33 m/s', '4.00 m/s', '8.00 m/s', '6.25 m/s'],
    correctOption: 0,
    correctAnswer: 0,
    explanation: 'Average speed = Total distance / Total time = (16 + 16) / (4 + 2) = 32 / 6 = 5.33 m/s.',
    topic: 'Motion'
  },
  {
    id: 'q-fnd9-p2-range',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Physics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 9.75,
    rangeMax: 9.85,
    correctAnswer: '9.80',
    questionText: '[Section B - Range NAT] A stone of mass 1 kg is dropped from the top of a tower. Calculate the acceleration due to gravity g (in m/s²) on Earth\'s surface given G = 6.67 × 10⁻¹¹ N·m²/kg², M_earth = 5.97 × 10²⁴ kg, R_earth = 6.37 × 10⁶ m. (Acceptable Range: 9.75 to 9.85 m/s²)',
    explanation: 'g = G*M / R² = (6.67e-11 * 5.97e24) / (6.37e6)² ≈ 9.81 m/s². Valid range: [9.75 to 9.85].',
    topic: 'Gravitation'
  },
  {
    id: 'q-fnd9-c1',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Chemistry',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'Which of the following represents the correct chemical formula of Aluminium Sulphate?',
    options: ['AlSO4', 'Al2(SO4)3', 'Al3(SO4)2', 'Al(SO4)3'],
    correctOption: 1,
    correctAnswer: 1,
    explanation: 'Aluminium has valency +3 and Sulphate (SO4) has valency -2. By criss-cross method: Al2(SO4)3.',
    topic: 'Atoms and Molecules'
  },
  {
    id: 'q-fnd9-c2-range',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Chemistry',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 17.8,
    rangeMax: 18.2,
    correctAnswer: '18.0',
    questionText: '[Section B - Range NAT] What is the molar mass of water (H2O) in g/mol? (Atomic mass: H = 1.008 u, O = 16.00 u). (Acceptable Range: 17.8 to 18.2 g/mol)',
    explanation: 'Molar mass = 2*(1.008) + 16.00 = 18.016 g/mol. Valid range: [17.8 to 18.2].',
    topic: 'Mole Concept'
  },
  {
    id: 'q-fnd9-b1',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Biology',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'Which organelle is known as the "Powerhouse of the Cell"?',
    options: ['Ribosome', 'Golgi apparatus', 'Mitochondria', 'Lysosome'],
    correctOption: 2,
    correctAnswer: 2,
    explanation: 'Mitochondria produce cellular energy in the form of ATP through oxidative phosphorylation, hence known as the powerhouse of the cell.',
    topic: 'The Fundamental Unit of Life'
  },
  {
    id: 'q-fnd9-m1',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Mathematics',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'If (x + 1) is a factor of the polynomial 2x² + kx, then what is the value of k?',
    options: ['1', '2', '-2', '4'],
    correctOption: 1,
    correctAnswer: 1,
    explanation: 'By Factor Theorem, P(-1) = 0 => 2(-1)² + k(-1) = 0 => 2 - k = 0 => k = 2.',
    topic: 'Polynomials'
  },
  {
    id: 'q-fnd9-m2-range',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Mathematics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 23.5,
    rangeMax: 24.5,
    correctAnswer: '24.0',
    questionText: '[Section B - Range NAT] The sides of a triangle are 6 cm, 8 cm, and 10 cm. Calculate the area of the triangle in cm² using Heron\'s formula. (Acceptable Range: 23.5 to 24.5)',
    explanation: 'Since 6² + 8² = 10², it is a right-angled triangle. Area = (1/2)*6*8 = 24 cm². Range accepted: [23.5 to 24.5].',
    topic: 'Heron\'s Formula'
  },
  {
    id: 'q-fnd9-mat1',
    testId: 'test-foundation-class9-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 9',
    subject: 'Mental Ability',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'Find the next term in the series: 3, 7, 15, 31, 63, ?',
    options: ['95', '111', '127', '129'],
    correctOption: 2,
    correctAnswer: 2,
    explanation: 'Each term is 2n + 1: 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63, 63*2+1=127.',
    topic: 'Number Series'
  }
];

// 4. Foundation Class 10th Questions (Board Mastery & Pre-JEE/NEET)
const foundationClass10Questions = [
  {
    id: 'q-fnd10-p1',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Physics',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'A concave mirror produces three times magnified real image of an object placed at 10 cm in front of it. Where is the image located?',
    options: ['-30 cm', '+30 cm', '-15 cm', '+15 cm'],
    correctOption: 0,
    correctAnswer: 0,
    explanation: 'm = -v/u => -3 = -v/(-10) => v = -30 cm in front of the mirror.',
    topic: 'Light - Reflection and Refraction'
  },
  {
    id: 'q-fnd10-p2-range',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Physics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 4.8,
    rangeMax: 5.2,
    correctAnswer: '5.0',
    questionText: '[Section B - Range NAT] An electric lamp of resistance 20 Ω and a conductor of 4 Ω resistance are connected in series to a 6 V battery. Calculate the potential drop across the lamp (in Volts). (Acceptable Range: 4.80 to 5.20 V)',
    explanation: 'Total R = 24 Ω. Current I = 6/24 = 0.25 A. Potential drop across lamp = I * 20 = 5.0 V. Valid range: [4.80 to 5.20].',
    topic: 'Electricity'
  },
  {
    id: 'q-fnd10-c1',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Chemistry',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'What is the color of the precipitate formed when aqueous Lead Nitrate reacts with Potassium Iodide solution?',
    options: ['White', 'Yellow', 'Black', 'Blue'],
    correctOption: 1,
    correctAnswer: 1,
    explanation: 'Lead iodide (PbI2) precipitate is bright yellow in color: Pb(NO3)2 + 2KI -> PbI2 (yellow ppt) + 2KNO3.',
    topic: 'Chemical Reactions and Equations'
  },
  {
    id: 'q-fnd10-c2-range',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Chemistry',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 6.8,
    rangeMax: 7.2,
    correctAnswer: '7.0',
    questionText: '[Section B - Range NAT] Pure neutral water at 25°C has what pH value? (Acceptable Range: 6.8 to 7.2)',
    explanation: 'Pure water has [H+] = 10^-7 M, pH = -log(10^-7) = 7.00. Range allowed: [6.8 to 7.2].',
    topic: 'Acids, Bases and Salts'
  },
  {
    id: 'q-fnd10-b1',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Biology',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'In human heart, deoxygenated blood from the body is received by which chamber?',
    options: ['Left Atrium', 'Left Ventricle', 'Right Atrium', 'Right Ventricle'],
    correctOption: 2,
    correctAnswer: 2,
    explanation: 'The vena cava brings deoxygenated blood from the body into the Right Atrium of the heart.',
    topic: 'Life Processes'
  },
  {
    id: 'q-fnd10-m1',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'If the roots of the quadratic equation 2x² - 8x + k = 0 are real and equal, find the value of k.',
    options: ['4', '8', '12', '16'],
    correctOption: 1,
    correctAnswer: 1,
    explanation: 'For real and equal roots, discriminant D = b² - 4ac = 0 => (-8)² - 4(2)(k) = 0 => 64 = 8k => k = 8.',
    topic: 'Quadratic Equations'
  },
  {
    id: 'q-fnd10-m2-range',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Mathematics',
    section: 'Section B',
    questionType: 'NAT_RANGE',
    rangeMin: 14.8,
    rangeMax: 15.2,
    correctAnswer: '15.0',
    questionText: '[Section B - Range NAT] In an Arithmetic Progression (AP), the 1st term a = 3 and the 7th term a7 = 27. Find the 4th term a4. (Acceptable Range: 14.8 to 15.2)',
    explanation: 'a7 = a + 6d => 27 = 3 + 6d => 6d = 24 => d = 4. Then a4 = a + 3d = 3 + 3*4 = 15.0. Valid range: [14.8 to 15.2].',
    topic: 'Arithmetic Progressions'
  },
  {
    id: 'q-fnd10-mat1',
    testId: 'test-foundation-class10-mock',
    examType: 'FOUNDATION',
    stream: 'FOUNDATION',
    classLevel: 'Class 10',
    subject: 'Mental Ability',
    section: 'Section A',
    questionType: 'MCQ',
    questionText: 'If "RANKER" is coded as "SDOLFS", how is "TOPPER" coded in the same language with +1 shift?',
    options: ['UPQQFS', 'UQPPFS', 'UQOQFS', 'UPPQFS'],
    correctOption: 0,
    correctAnswer: 0,
    explanation: 'Each letter is shifted by +1: T->U, O->P, P->Q, P->Q, E->F, R->S => UPQQFS.',
    topic: 'Coding-Decoding'
  }
];

// Append non-duplicate questions
const allToAdd = [...newJeeQuestions, ...foundationClass9Questions, ...foundationClass10Questions];
let addedCount = 0;

allToAdd.forEach(q => {
  if (!questions.some(existing => existing.id === q.id)) {
    questions.push(q);
    addedCount++;
  }
});

fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Successfully seeded ${addedCount} new questions. Total questions now: ${questions.length}`);

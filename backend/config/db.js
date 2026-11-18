const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { DEFAULT_CENTRES, DEFAULT_FACULTY, DEFAULT_TEST_STUDENTS, DEFAULT_COURSES, DEFAULT_ADMISSIONS, DEFAULT_STUDY_MATERIALS, DEFAULT_LIVE_CLASSES, DEFAULT_RECORDED_LECTURES } = require('./constants');
const { generateAdmitCardQR } = require('../services/qrCodeService');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this._saveTimer = null;
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error(`Error loading collection ${this.name}:`, err.message);
    }
    return [];
  }

  /**
   * Atomic, debounced disk write to handle thousands of concurrent requests
   * Updates in-memory immediately, flushes to NVMe SSD in 50ms batch
   */
  _save(immediate = false) {
    if (immediate) {
      if (this._saveTimer) {
        clearTimeout(this._saveTimer);
        this._saveTimer = null;
      }
      this._flush();
      return;
    }

    if (!this._saveTimer) {
      this._saveTimer = setTimeout(() => {
        this._saveTimer = null;
        this._flush();
      }, 50); // 50ms write-coalescing window
    }
  }

  _flush() {
    try {
      const tempPath = `${this.filePath}.${process.pid}.${Date.now()}.${Math.floor(Math.random() * 1000)}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error(`Error flushing collection ${this.name}:`, err.message);
    }
  }

  find(query = {}) {
    return this.data.filter(item => {
      for (const key of Object.keys(query)) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOne(query = {}) {
    return this.data.find(item => {
      for (const key of Object.keys(query)) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  }

  findById(id) {
    return this.data.find(item => item.id === id || item._id === id) || null;
  }

  create(doc) {
    const newDoc = {
      id: doc.id || uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    this.data.push(newDoc);
    this._save();
    return newDoc;
  }

  findByIdAndUpdate(id, updates) {
    const index = this.data.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._save();
    return this.data[index];
  }

  deleteById(id) {
    const index = this.data.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return false;
    this.data.splice(index, 1);
    this._save();
    return true;
  }

  countDocuments(query = {}) {
    return this.find(query).length;
  }
}

// Global Collections Registry
const collections = {
  users: new Collection('users'),
  studentProfiles: new Collection('student_profiles'),
  rankXRegistrations: new Collection('rankx_registrations'),
  rsatRegistrations: new Collection('rsat_registrations'),
  exams: new Collection('exams'),
  questions: new Collection('questions'),
  examSubmissions: new Collection('exam_submissions'),
  centres: new Collection('centres'),
  payments: new Collection('payments'),
  smsLogs: new Collection('sms_logs'),
  cmsContent: new Collection('cms_content'),
  faculty: new Collection('faculty'),
  courses: new Collection('courses'),
  admissions: new Collection('admissions'),
  studyMaterials: new Collection('study_materials'),
  liveClasses: new Collection('live_classes'),
  recordedLectures: new Collection('recorded_lectures'),
  gallery: new Collection('gallery'),
  feeSettings: new Collection('fee_settings'),
  attendance: new Collection('attendance'),
  testimonials: new Collection('testimonials')
};

// Auto-seed initial defaults if empty
async function initializeDatabase() {
  // Seed study materials
  if (collections.studyMaterials.countDocuments() === 0 && DEFAULT_STUDY_MATERIALS) {
    DEFAULT_STUDY_MATERIALS.forEach(mat => collections.studyMaterials.create(mat));
    console.log('✅ Initial Study Materials seeded.');
  }

  // Seed live classes
  if (collections.liveClasses.countDocuments() === 0 && DEFAULT_LIVE_CLASSES) {
    DEFAULT_LIVE_CLASSES.forEach(lc => collections.liveClasses.create(lc));
    console.log('✅ Initial Live Classes & Timetable seeded.');
  }

  // Seed recorded lectures
  if (collections.recordedLectures.countDocuments() === 0 && DEFAULT_RECORDED_LECTURES) {
    DEFAULT_RECORDED_LECTURES.forEach(rec => collections.recordedLectures.create(rec));
    console.log('✅ Initial Recorded Lectures seeded.');
  }

  // Seed admissions (disabled auto-seed for clean manual testing)
  // if (collections.admissions.countDocuments() === 0 && DEFAULT_ADMISSIONS) {
  //   DEFAULT_ADMISSIONS.forEach(adm => collections.admissions.create(adm));
  //   console.log('✅ Initial Admission applications seeded.');
  // }

  // Seed centres
  if (collections.centres.countDocuments() === 0) {
    DEFAULT_CENTRES.forEach(centre => collections.centres.create(centre));
    console.log('✅ Initial Examination Centres seeded.');
  }

  // Seed default CMS content
  if (collections.cmsContent.countDocuments() === 0) {
    collections.cmsContent.create({
      id: 'default-cms',
      bannerNotice: 'Admissions Open for NEET & IIT-JEE 2026-27 | RANKEX Scholarship Test Registrations Open!',
      nextBatchDate: '24 June 2026',
      dropperBatchAlert: 'NEET Dropper Batch starting 24 June 2026. Limited seats per batch (30 students only).',
      helplinePhone: '9131435511',
      secondaryPhone: '7974546310',
      whatsappNumber: '919131435511',
      email: 'info@rankerspath.in',
      address: 'HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore - 452010'
    });
    console.log('✅ Initial CMS content seeded.');
  }

  // Seed default faculty members
  if (collections.faculty.countDocuments() === 0) {
    DEFAULT_FACULTY.forEach(fac => collections.faculty.create(fac));
    console.log('✅ Initial Faculty members seeded.');
  } else {
    // Purge legacy faculty and ensure latest ordering
    const sandeep = collections.faculty.findById('fac-sandeep');
    if (sandeep) {
      collections.faculty.deleteById('fac-sandeep');
      console.log('🧹 Purged legacy faculty member: fac-sandeep');
    }
    const ramakant = collections.faculty.findById('fac-ramakant');
    if (ramakant) {
      collections.faculty.findByIdAndUpdate('fac-ramakant', { order: 5, showOnHome: true });
    }
    const comingSoon = collections.faculty.findById('fac-coming-soon');
    if (!comingSoon) {
      const template = DEFAULT_FACULTY.find(f => f.id === 'fac-coming-soon');
      if (template) {
        collections.faculty.create(template);
        console.log('✅ Seeded Coming Soon faculty slot.');
      }
    }
  }

  // Seed default courses
  if (collections.courses.countDocuments() === 0) {
    DEFAULT_COURSES.forEach(course => collections.courses.create(course));
    console.log('✅ Initial Courses seeded.');
  } else {
    // Sync course features & targets
    DEFAULT_COURSES.forEach(def => {
      const existing = collections.courses.findById(def.id);
      if (existing) {
        collections.courses.findByIdAndUpdate(def.id, {
          target: def.target,
          keyFeatures: def.keyFeatures
        });
      }
    });
  }

  // Auto-seed/verify admin accounts
  const requiredAdmins = [
    {
      id: 'admin-rankerspath-edu',
      email: 'rankerspath.edu@gmail.com',
      fullName: 'Rankers Path Admin',
      role: 'admin',
      mobile: '9131435511',
      password: '$2b$10$tDzRRbMu4hEa4boYC0KlGO73UBtQFKQlj272Ip5Pe4duz6IjJZN96'
    },
    {
      id: 'admin-omjee-pal',
      email: 'omjeejob@gmail.com',
      fullName: 'Om Jee Pal (Super Admin)',
      role: 'admin',
      mobile: '8707258045',
      password: '$2b$10$QSMMh/23.oeOcmAholmYFu8jNUJYpqoo9ObseuzCcrSNxY2/PBAI6'
    },
    {
      id: 'admin-omjee-navgurukul',
      email: 'om22@navgurukul.org',
      fullName: 'Om Jee Pal',
      role: 'admin',
      mobile: '8707258045',
      password: '$2b$10$QSMMh/23.oeOcmAholmYFu8jNUJYpqoo9ObseuzCcrSNxY2/PBAI6'
    }
  ];

  requiredAdmins.forEach(adm => {
    const existing = collections.users.findOne({ email: adm.email });
    if (!existing) {
      collections.users.create(adm);
      console.log(`✅ Seeded admin account: ${adm.email}`);
    } else if (existing.role !== 'admin' || !existing.password) {
      collections.users.findByIdAndUpdate(existing.id, { role: 'admin', password: adm.password });
    }
  });

  // Seed default fee configuration
  if (collections.feeSettings.countDocuments() === 0) {
    collections.feeSettings.create({
      id: 'fee-config-default',
      rsatFee: 100,
      rankxFee: 100,
      classroomTokenFee: 5000,
      testSeriesFee: 1500,
      dropperBatchFee: 110000,
      foundationFee: 65000,
      twoYearJeeNeetFee: 125000,
      gstRate: 18,
      allowCustomTuitionFee: true,
      minCustomFee: 500,
      notes: 'Rankers Path Official Fee Structure decided by Admin',
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Initial Fee Settings seeded.');
  }

  // Seed test student accounts and registrations (disabled for clean manual testing)
  // if (DEFAULT_TEST_STUDENTS && DEFAULT_TEST_STUDENTS.length > 0) { ... }
}

function flushAllCollections() {
  Object.values(collections).forEach(coll => {
    if (coll && typeof coll._save === 'function') {
      coll._save(true);
    }
  });
}

// Ensure in-memory changes are immediately flushed on process shutdown
process.on('SIGINT', () => {
  flushAllCollections();
});
process.on('SIGTERM', () => {
  flushAllCollections();
});
process.on('beforeExit', () => {
  flushAllCollections();
});

module.exports = {
  collections,
  initializeDatabase,
  flushAllCollections
};

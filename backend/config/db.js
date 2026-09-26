const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { DEFAULT_CENTRES, DEFAULT_FACULTY } = require('./constants');

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
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

  _save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error saving collection ${this.name}:`, err.message);
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
  faculty: new Collection('faculty')
};

// Auto-seed initial defaults if empty
function initializeDatabase() {
  // Seed centres
  if (collections.centres.countDocuments() === 0) {
    DEFAULT_CENTRES.forEach(centre => collections.centres.create(centre));
    console.log('✅ Initial Examination Centres seeded.');
  }

  // Seed default CMS content
  if (collections.cmsContent.countDocuments() === 0) {
    collections.cmsContent.create({
      id: 'default-cms',
      bannerNotice: 'Admissions Open for NEET & IIT-JEE 2026-27 | RankX Scholarship Test Registrations Open!',
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
  }
}

module.exports = {
  collections,
  initializeDatabase
};

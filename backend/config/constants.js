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
  ]
};

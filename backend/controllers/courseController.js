const { collections } = require('../config/db');
const { DEFAULT_COURSES } = require('../config/constants');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all courses (Public or Admin)
 */
async function getAllCourses(req, res, next) {
  try {
    const isAll = req.query.all === 'true';
    let courses = isAll
      ? collections.courses.find()
      : collections.courses.find({ active: true });

    // Fallback seed if empty
    if (!courses || courses.length === 0) {
      DEFAULT_COURSES.forEach(c => collections.courses.create(c));
      courses = isAll
        ? collections.courses.find()
        : collections.courses.find({ active: true });
    }

    courses.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
    return successResponse(res, 'Courses fetched successfully', courses);
  } catch (err) {
    next(err);
  }
}

/**
 * Get single course by ID
 */
async function getCourseById(req, res, next) {
  try {
    const course = collections.courses.findById(req.params.id);
    if (!course) {
      return errorResponse(res, 'Course not found', 404);
    }
    return successResponse(res, 'Course fetched', course);
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new course
 */
async function createCourse(req, res, next) {
  try {
    const {
      title,
      domainKey,
      desc,
      tuitionFee,
      badge,
      category,
      target,
      eligibility,
      duration,
      scholarshipWaiver,
      startingFee,
      keyFeatures,
      order,
      active
    } = req.body;

    if (!title) {
      return errorResponse(res, 'Course title is required', 400);
    }

    const newCourse = collections.courses.create({
      domainKey: domainKey || 'custom',
      title,
      desc: desc || '',
      tuitionFee: tuitionFee || 'Contact for Fee',
      badge: badge || 'Class',
      category: category || 'PROGRAM',
      target: target || '',
      eligibility: eligibility || '',
      duration: duration || '1 Year Programme',
      scholarshipWaiver: scholarshipWaiver || 'Up to 90% via RSAT',
      startingFee: startingFee || '',
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : (keyFeatures ? keyFeatures.split('\n').filter(Boolean) : []),
      order: Number(order) || collections.courses.countDocuments() + 1,
      active: active !== undefined ? Boolean(active) : true
    });

    return successResponse(res, 'Course created successfully', newCourse, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing course
 */
async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.courses.findById(id);
    if (!existing) {
      return errorResponse(res, 'Course not found', 404);
    }

    const updates = { ...req.body };
    if (updates.order !== undefined) updates.order = Number(updates.order);
    if (updates.active !== undefined) updates.active = Boolean(updates.active);
    if (typeof updates.keyFeatures === 'string') {
      updates.keyFeatures = updates.keyFeatures.split('\n').map(s => s.trim()).filter(Boolean);
    }

    const updated = collections.courses.findByIdAndUpdate(id, updates);
    return successResponse(res, 'Course updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a course
 */
async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = collections.courses.deleteById(id);
    if (!deleted) {
      return errorResponse(res, 'Course not found or already deleted', 404);
    }
    return successResponse(res, 'Course deleted successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * Reset courses to defaults
 */
async function resetCourses(req, res, next) {
  try {
    const all = collections.courses.find();
    all.forEach(c => collections.courses.deleteById(c.id));
    DEFAULT_COURSES.forEach(c => collections.courses.create(c));
    const fresh = collections.courses.find();
    fresh.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
    return successResponse(res, 'Courses reset to default configuration', fresh);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  resetCourses
};

const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Public: Get all faculty members
 * Query param: ?home=true (to get only members shown on home page)
 */
async function getAllFaculty(req, res, next) {
  try {
    const { home, subject } = req.query;
    let faculty = collections.faculty.find();

    if (home === 'true') {
      faculty = faculty.filter(f => f.showOnHome === true);
    }

    if (subject && subject !== 'All') {
      faculty = faculty.filter(f => f.subject && f.subject.toLowerCase() === subject.toLowerCase());
    }

    // Sort by order or name
    faculty.sort((a, b) => (a.order || 99) - (b.order || 99));

    return successResponse(res, 'Faculty members retrieved successfully', faculty);
  } catch (err) {
    next(err);
  }
}

/**
 * Public: Get single faculty member by ID
 */
async function getFacultyById(req, res, next) {
  try {
    const { id } = req.params;
    const member = collections.faculty.findById(id);
    if (!member) {
      return errorResponse(res, 'Faculty member not found', 404);
    }
    return successResponse(res, 'Faculty member retrieved', member);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Add new faculty member
 */
async function createFaculty(req, res, next) {
  try {
    const {
      name,
      degree,
      role,
      subject,
      exp,
      photo,
      bio,
      showOnHome,
      order
    } = req.body;

    if (!name || !subject) {
      return errorResponse(res, 'Name and Subject are required', 400);
    }

    const newFaculty = collections.faculty.create({
      name: name.trim(),
      degree: degree ? degree.trim() : '',
      role: role ? role.trim() : `${subject} Faculty`,
      subject: subject.trim(),
      exp: exp ? exp.trim() : '10+ Years Experience',
      photo: photo && photo.trim() ? photo.trim() : '/assets/web/faculty-team-full.png',
      bio: bio ? bio.trim() : '',
      showOnHome: showOnHome === true || showOnHome === 'true',
      order: order ? parseInt(order, 10) : collections.faculty.countDocuments() + 1
    });

    return successResponse(res, 'Faculty member added successfully!', newFaculty, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update faculty member details
 */
async function updateFaculty(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.faculty.findById(id);
    if (!existing) {
      return errorResponse(res, 'Faculty member not found', 404);
    }

    const updates = req.body;
    if (updates.showOnHome !== undefined) {
      updates.showOnHome = updates.showOnHome === true || updates.showOnHome === 'true';
    }
    if (updates.order !== undefined) {
      updates.order = parseInt(updates.order, 10);
    }

    const updated = collections.faculty.findByIdAndUpdate(id, updates);
    return successResponse(res, 'Faculty details updated successfully!', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete faculty member
 */
async function deleteFaculty(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.faculty.findById(id);
    if (!existing) {
      return errorResponse(res, 'Faculty member not found', 404);
    }

    collections.faculty.deleteById(id);
    return successResponse(res, 'Faculty member deleted successfully!');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
};

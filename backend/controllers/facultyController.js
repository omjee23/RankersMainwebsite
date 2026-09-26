const fs = require('fs');
const path = require('path');
const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Ensures photo is stored in uploads directory if provided as base64,
 * keeping the database lightweight and small (in KB).
 */
function processPhotoField(photo) {
  if (!photo || typeof photo !== 'string') {
    return '/assets/web/faculty-team-full.png';
  }

  // If already a URL or static asset path, keep it
  if (
    photo.startsWith('/assets/') ||
    photo.startsWith('http://') ||
    photo.startsWith('https://') ||
    photo.startsWith('/uploads/')
  ) {
    return photo;
  }

  // If it's a base64 data URL, save it to disk in uploads directory
  if (photo.startsWith('data:image/')) {
    try {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const matches = photo.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const rawExt = matches[1].toLowerCase();
        const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `faculty-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved compressed faculty photo: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        return `/uploads/${filename}`;
      }
    } catch (e) {
      console.error('Failed to save base64 photo to file:', e);
      return photo;
    }
  }

  return photo;
}

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
 * Admin: Upload faculty photo directly from PC/laptop/mobile
 */
async function uploadFacultyPhoto(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, 'No photo file uploaded', 400);
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    const sizeKb = (req.file.size / 1024).toFixed(1);

    return successResponse(res, 'Photo uploaded successfully', {
      url: photoUrl,
      filename: req.file.filename,
      sizeKb: `${sizeKb} KB`
    });
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

    const processedPhoto = processPhotoField(photo);

    const newFaculty = collections.faculty.create({
      name: name.trim(),
      degree: degree ? degree.trim() : '',
      role: role ? role.trim() : `${subject} Faculty`,
      subject: subject.trim(),
      exp: exp ? exp.trim() : '10+ Years Experience',
      photo: processedPhoto,
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

    const updates = { ...req.body };
    if (updates.showOnHome !== undefined) {
      updates.showOnHome = updates.showOnHome === true || updates.showOnHome === 'true';
    }
    if (updates.order !== undefined) {
      updates.order = parseInt(updates.order, 10);
    }
    if (updates.photo !== undefined) {
      updates.photo = processPhotoField(updates.photo);
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
  uploadFacultyPhoto,
  createFaculty,
  updateFaculty,
  deleteFaculty
};


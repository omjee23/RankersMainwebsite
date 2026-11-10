const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all testimonials (Public and Admin)
 */
async function getAllTestimonials(req, res, next) {
  try {
    const { stream, activeOnly, featuredOnly } = req.query;
    let query = {};

    // By default, if activeOnly is true or not explicitly 'false', return only active
    if (activeOnly !== 'false') {
      query.active = true;
    }

    if (stream && stream !== 'ALL') {
      query.targetStream = stream.toUpperCase();
    }

    if (featuredOnly === 'true') {
      query.featured = true;
    }

    let list = collections.testimonials.find(query);

    // If query was empty or filter applied, sort by order, then date
    list.sort((a, b) => {
      const orderA = a.order !== undefined ? Number(a.order) : 999;
      const orderB = b.order !== undefined ? Number(b.order) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return successResponse(res, 'Testimonials retrieved successfully', list);
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new student testimonial (Admin)
 */
async function createTestimonial(req, res, next) {
  try {
    const {
      studentName,
      photo,
      targetStream = 'NEET',
      achievement,
      college,
      batch,
      rating = 5,
      quote,
      featured = true,
      active = true,
      order
    } = req.body;

    if (!studentName || !quote) {
      return errorResponse(res, 'Student Name and Testimonial Quote are required', 400);
    }

    const currentCount = collections.testimonials.countDocuments();
    const newRecord = collections.testimonials.create({
      studentName: String(studentName).trim(),
      studentType: req.body.studentType ? String(req.body.studentType).toUpperCase() : 'CURRENT',
      photo: photo || '',
      targetStream: String(targetStream).toUpperCase(),
      achievement: achievement || '',
      college: college || '',
      batch: batch || '',
      rating: Number(rating) || 5,
      quote: String(quote).trim(),
      featured: featured !== false,
      active: active !== false,
      order: order !== undefined ? Number(order) : currentCount + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return successResponse(res, 'Testimonial created successfully', newRecord, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Update an existing testimonial (Admin)
 */
async function updateTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.testimonials.findById(id);

    if (!existing) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    if (updates.rating !== undefined) updates.rating = Number(updates.rating);
    if (updates.order !== undefined) updates.order = Number(updates.order);
    if (updates.targetStream) updates.targetStream = String(updates.targetStream).toUpperCase();

    const updated = collections.testimonials.findByIdAndUpdate(id, updates);
    return successResponse(res, 'Testimonial updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a testimonial (Admin)
 */
async function deleteTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.testimonials.findById(id);

    if (!existing) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    collections.testimonials.deleteById(id);
    return successResponse(res, 'Testimonial deleted successfully', { id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};

const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all gallery photos (Public & Admin)
 * Supports query params: ?tag=Classroom, ?active=true
 */
async function getAllGalleryPhotos(req, res, next) {
  try {
    const { tag, active } = req.query;
    let photos = collections.gallery.find();

    if (active === 'true' || active === true) {
      photos = photos.filter(p => p.active !== false);
    }

    if (tag && tag !== 'ALL' && tag !== 'All') {
      photos = photos.filter(p => p.tag && p.tag.toLowerCase() === tag.toLowerCase());
    }

    // Sort by order ascending, then by createdAt desc
    photos.sort((a, b) => {
      const orderA = a.order !== undefined ? Number(a.order) : 999;
      const orderB = b.order !== undefined ? Number(b.order) : 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return successResponse(res, 'Gallery photos retrieved successfully', photos);
  } catch (err) {
    next(err);
  }
}

/**
 * Upload / Create a new gallery photo (Admin)
 */
async function createGalleryPhoto(req, res, next) {
  try {
    const { title, tag, src, description, order, active = true } = req.body;

    if (!title || !title.trim()) {
      return errorResponse(res, 'Photo title/caption is required', 400);
    }
    if (!src || !src.trim()) {
      return errorResponse(res, 'Image photo data or URL is required', 400);
    }

    const validTag = tag && ['Classroom', 'Celebration', 'Mentorship', 'Campus', 'Events'].includes(tag)
      ? tag
      : 'Classroom';

    const newPhoto = collections.gallery.create({
      title: title.trim(),
      tag: validTag,
      src: src.trim(),
      description: description ? description.trim() : '',
      order: order ? Number(order) : 10,
      active: Boolean(active),
      createdAt: new Date().toISOString()
    });

    return successResponse(res, 'Campus photo uploaded successfully', newPhoto, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Update gallery photo details (Admin)
 */
async function updateGalleryPhoto(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.gallery.findById(id);
    if (!existing) {
      return errorResponse(res, 'Gallery photo not found', 404);
    }

    const { title, tag, src, description, order, active } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (tag !== undefined) updates.tag = tag;
    if (src !== undefined) updates.src = src.trim();
    if (description !== undefined) updates.description = description.trim();
    if (order !== undefined) updates.order = Number(order);
    if (active !== undefined) updates.active = Boolean(active);
    updates.updatedAt = new Date().toISOString();

    const updated = collections.gallery.findByIdAndUpdate(id, updates);
    return successResponse(res, 'Gallery photo updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a gallery photo (Admin)
 */
async function deleteGalleryPhoto(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.gallery.findById(id);
    if (!existing) {
      return errorResponse(res, 'Gallery photo not found', 404);
    }

    collections.gallery.deleteById(id);
    return successResponse(res, 'Gallery photo removed successfully', { id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto
};

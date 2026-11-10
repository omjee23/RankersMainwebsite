const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Public route to fetch photos
router.get('/', galleryController.getAllGalleryPhotos);

// Admin routes to manage photos
router.post('/', galleryController.createGalleryPhoto);
router.put('/:id', galleryController.updateGalleryPhoto);
router.delete('/:id', galleryController.deleteGalleryPhoto);

module.exports = router;

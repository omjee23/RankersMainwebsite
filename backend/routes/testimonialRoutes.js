const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

// Public route to fetch testimonials
router.get('/', testimonialController.getAllTestimonials);

// Admin routes
router.post('/', testimonialController.createTestimonial);
router.put('/:id', testimonialController.updateTestimonial);
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Public endpoints
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Admin endpoints
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.post('/reset', courseController.resetCourses);

module.exports = router;

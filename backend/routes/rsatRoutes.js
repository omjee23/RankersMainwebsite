const express = require('express');
const router = express.Router();
const {
  registerRSAT,
  getMyRSAT,
  checkRsatFeeStatus,
  scheduleRsatSlot,
  getRsatNotifications,
  getRSATCommandCenterData,
  createRSATPaper,
  setActiveRSATPaper
} = require('../controllers/rsatController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', optionalAuthMiddleware, registerRSAT);
router.get('/my-status', authMiddleware, getMyRSAT);
router.get('/check-status/:mobile', checkRsatFeeStatus);
router.post('/schedule-slot', optionalAuthMiddleware, scheduleRsatSlot);
router.get('/notifications', optionalAuthMiddleware, getRsatNotifications);

// Unified RSAT Command Centre (Admin)
router.get('/command-center', optionalAuthMiddleware, getRSATCommandCenterData);
router.post('/create-paper', optionalAuthMiddleware, createRSATPaper);
router.put('/set-active-paper/:id', optionalAuthMiddleware, setActiveRSATPaper);

module.exports = router;

const express = require('express');
const router = express.Router();
const { registerRSAT, getMyRSAT } = require('../controllers/rsatController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', authMiddleware, registerRSAT);
router.get('/my-status', authMiddleware, getMyRSAT);

module.exports = router;

const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);

module.exports = router;

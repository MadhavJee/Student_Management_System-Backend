const express = require('express');
const { body } = require('express-validator');
const {
    markAttendance,
    getAttendance,
    getStudentReport,
} = require('../controllers/attendanceController');
const { validate } = require('../middlewares/validateMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAttendance);
router.get('/report/:studentId', getStudentReport);

router.post(
    '/',
    authorize('admin', 'teacher'),
    [
        body('records')
            .isArray({ min: 1 })
            .withMessage('Records must be a non-empty array'),
        body('records.*.student').notEmpty().withMessage('Student ID is required'),
        body('records.*.course').notEmpty().withMessage('Course ID is required'),
        body('records.*.status')
            .isIn(['present', 'absent', 'late'])
            .withMessage('Status must be present, absent, or late'),
    ],
    validate,
    markAttendance
);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const {
    addGrade,
    updateGrade,
    deleteGrade,
    getStudentGrades,
    getCourseGrades,
    getReportCard,
} = require('../controllers/gradeController');
const { validate } = require('../middlewares/validateMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/student/:studentId', getStudentGrades);
router.get('/course/:courseId', getCourseGrades);
router.get('/report-card/:studentId', getReportCard);

router.post(
    '/',
    authorize('admin', 'teacher'),
    [
        body('student').notEmpty().withMessage('Student ID is required'),
        body('course').notEmpty().withMessage('Course ID is required'),
        body('examType')
            .isIn(['midterm', 'final', 'assignment', 'quiz'])
            .withMessage('Exam type must be midterm, final, assignment, or quiz'),
        body('marks').isNumeric().withMessage('Marks must be a number'),
        body('totalMarks').isNumeric().withMessage('Total marks must be a number'),
    ],
    validate,
    addGrade
);

router.put('/:id', authorize('admin', 'teacher'), updateGrade);
router.delete('/:id', authorize('admin'), deleteGrade);

module.exports = router;

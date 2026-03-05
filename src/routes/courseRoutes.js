const express = require('express');
const { body } = require('express-validator');
const {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollStudent,
    unenrollStudent,
} = require('../controllers/courseController');
const { validate } = require('../middlewares/validateMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllCourses);
router.get('/:id', getCourse);

router.post(
    '/',
    authorize('admin'),
    validate([
        body('name').trim().notEmpty().withMessage('Course name is required'),
        body('code').trim().notEmpty().withMessage('Course code is required'),
    ]),
    createCourse
);

router.put('/:id', authorize('admin'), updateCourse);
router.delete('/:id', authorize('admin'), deleteCourse);

router.post(
    '/:id/enroll',
    authorize('admin', 'teacher'),
    validate([body('studentId').notEmpty().withMessage('Student ID is required')]),
    enrollStudent
);

router.post(
    '/:id/unenroll',
    authorize('admin', 'teacher'),
    validate([body('studentId').notEmpty().withMessage('Student ID is required')]),
    unenrollStudent
);

module.exports = router;

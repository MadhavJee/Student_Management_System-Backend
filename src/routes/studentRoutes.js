const express = require('express');
const { body } = require('express-validator');
const {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController');
const { validate } = require('../middlewares/validateMiddleware');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All student routes require authentication
router.use(protect);

router.get('/', getAllStudents);
router.get('/:id', getStudent);

router.post(
    '/',
    authorize('admin'),
    [
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
        body('class').trim().notEmpty().withMessage('Class is required'),
    ],
    validate,
    createStudent
);

router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;

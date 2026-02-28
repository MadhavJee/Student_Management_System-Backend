const Course = require('../models/Course');
const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');

// Get all courses
const getAllCourses = async (query) => {
    const { page = 1, limit = 10, search, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter = {};
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
        ];
    }
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, total] = await Promise.all([
        Course.find(filter)
            .populate('teacher', 'name email')
            .populate('students', 'firstName lastName rollNumber')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit)),
        Course.countDocuments(filter),
    ]);

    return {
        courses,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get single course
const getCourseById = async (id) => {
    const course = await Course.findById(id)
        .populate('teacher', 'name email')
        .populate('students', 'firstName lastName rollNumber email');

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }
    return course;
};

// Create course
const createCourse = async (data) => {
    const existingCourse = await Course.findOne({ code: data.code });
    if (existingCourse) {
        throw new ApiError(400, 'Course with this code already exists');
    }

    const course = await Course.create(data);
    return course;
};

// Update course
const updateCourse = async (id, data) => {
    const course = await Course.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }
    return course;
};

// Delete course
const deleteCourse = async (id) => {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }
    return course;
};

// Enroll a student in a course
const enrollStudent = async (courseId, studentId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    const student = await Student.findById(studentId);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    if (course.students.includes(studentId)) {
        throw new ApiError(400, 'Student is already enrolled in this course');
    }

    course.students.push(studentId);
    await course.save();

    return course;
};

// Unenroll a student from a course
const unenrollStudent = async (courseId, studentId) => {
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    const index = course.students.indexOf(studentId);
    if (index === -1) {
        throw new ApiError(400, 'Student is not enrolled in this course');
    }

    course.students.splice(index, 1);
    await course.save();

    return course;
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollStudent,
    unenrollStudent,
};

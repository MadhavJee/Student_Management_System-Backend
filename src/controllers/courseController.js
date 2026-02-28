const courseService = require('../services/courseService');
const ApiResponse = require('../utils/ApiResponse');

const getAllCourses = async (req, res, next) => {
    try {
        const result = await courseService.getAllCourses(req.query);
        const response = new ApiResponse(200, result, 'Courses fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getCourse = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(req.params.id);
        const response = new ApiResponse(200, course, 'Course fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(req.body);
        const response = new ApiResponse(201, course, 'Course created successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(req.params.id, req.body);
        const response = new ApiResponse(200, course, 'Course updated successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(req.params.id);
        const response = new ApiResponse(200, null, 'Course deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const enrollStudent = async (req, res, next) => {
    try {
        const course = await courseService.enrollStudent(req.params.id, req.body.studentId);
        const response = new ApiResponse(200, course, 'Student enrolled successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const unenrollStudent = async (req, res, next) => {
    try {
        const course = await courseService.unenrollStudent(req.params.id, req.body.studentId);
        const response = new ApiResponse(200, course, 'Student unenrolled successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollStudent,
    unenrollStudent,
};

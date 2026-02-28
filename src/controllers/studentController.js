const studentService = require('../services/studentService');
const ApiResponse = require('../utils/ApiResponse');

const getAllStudents = async (req, res, next) => {
    try {
        const result = await studentService.getAllStudents(req.query);
        const response = new ApiResponse(200, result, 'Students fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getStudent = async (req, res, next) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        const response = new ApiResponse(200, student, 'Student fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const createStudent = async (req, res, next) => {
    try {
        const student = await studentService.createStudent(req.body);
        const response = new ApiResponse(201, student, 'Student created successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const updateStudent = async (req, res, next) => {
    try {
        const student = await studentService.updateStudent(req.params.id, req.body);
        const response = new ApiResponse(200, student, 'Student updated successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteStudent = async (req, res, next) => {
    try {
        await studentService.deleteStudent(req.params.id);
        const response = new ApiResponse(200, null, 'Student deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent };

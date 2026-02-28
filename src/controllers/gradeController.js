const gradeService = require('../services/gradeService');
const ApiResponse = require('../utils/ApiResponse');

const addGrade = async (req, res, next) => {
    try {
        const grade = await gradeService.addGrade(req.body);
        const response = new ApiResponse(201, grade, 'Grade added successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const updateGrade = async (req, res, next) => {
    try {
        const grade = await gradeService.updateGrade(req.params.id, req.body);
        const response = new ApiResponse(200, grade, 'Grade updated successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteGrade = async (req, res, next) => {
    try {
        await gradeService.deleteGrade(req.params.id);
        const response = new ApiResponse(200, null, 'Grade deleted successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getStudentGrades = async (req, res, next) => {
    try {
        const grades = await gradeService.getStudentGrades(req.params.studentId);
        const response = new ApiResponse(200, grades, 'Student grades fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getCourseGrades = async (req, res, next) => {
    try {
        const grades = await gradeService.getCourseGrades(req.params.courseId, req.query.examType);
        const response = new ApiResponse(200, grades, 'Course grades fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getReportCard = async (req, res, next) => {
    try {
        const report = await gradeService.getStudentReportCard(req.params.studentId);
        const response = new ApiResponse(200, report, 'Report card fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addGrade,
    updateGrade,
    deleteGrade,
    getStudentGrades,
    getCourseGrades,
    getReportCard,
};

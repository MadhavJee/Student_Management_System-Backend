const attendanceService = require('../services/attendanceService');
const ApiResponse = require('../utils/ApiResponse');

const markAttendance = async (req, res, next) => {
    try {
        const attendance = await attendanceService.markAttendance(req.body.records);
        const response = new ApiResponse(201, attendance, 'Attendance marked successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getAttendance = async (req, res, next) => {
    try {
        const result = await attendanceService.getAttendance(req.query);
        const response = new ApiResponse(200, result, 'Attendance fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getStudentReport = async (req, res, next) => {
    try {
        const report = await attendanceService.getStudentAttendanceReport(
            req.params.studentId,
            req.query.course
        );
        const response = new ApiResponse(200, report, 'Attendance report fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = { markAttendance, getAttendance, getStudentReport };

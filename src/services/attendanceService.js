const Attendance = require('../models/Attendance');
const ApiError = require('../utils/ApiError');

// Mark attendance (bulk)
const markAttendance = async (records) => {
    // records = [{ student, course, date, status, remarks }]
    const attendance = await Attendance.insertMany(records, { ordered: false }).catch((err) => {
        if (err.code === 11000) {
            throw new ApiError(400, 'Duplicate attendance entry found for the same student, course, and date');
        }
        throw err;
    });

    return attendance;
};

// Get attendance by filters
const getAttendance = async (query) => {
    const {
        student,
        course,
        date,
        startDate,
        endDate,
        status,
        page = 1,
        limit = 50,
    } = query;

    const filter = {};
    if (student) filter.student = student;
    if (course) filter.course = course;
    if (status) filter.status = status;

    if (date) {
        const d = new Date(date);
        filter.date = {
            $gte: new Date(d.setHours(0, 0, 0, 0)),
            $lte: new Date(d.setHours(23, 59, 59, 999)),
        };
    } else if (startDate && endDate) {
        filter.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [records, total] = await Promise.all([
        Attendance.find(filter)
            .populate('student', 'firstName lastName rollNumber')
            .populate('course', 'name code')
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Attendance.countDocuments(filter),
    ]);

    return {
        records,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get attendance report for a student
const getStudentAttendanceReport = async (studentId, courseId) => {
    const filter = { student: studentId };
    if (courseId) filter.course = courseId;

    const records = await Attendance.find(filter).populate('course', 'name code');

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    const attendancePercentage = total > 0 ? ((present + late) / total) * 100 : 0;

    return {
        total,
        present,
        absent,
        late,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        records,
    };
};

module.exports = {
    markAttendance,
    getAttendance,
    getStudentAttendanceReport,
};

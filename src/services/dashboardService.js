const Student = require('../models/Student');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');

// Get dashboard statistics
const getStats = async () => {
    const [totalStudents, activeStudents, totalCourses, activeCourses] = await Promise.all([
        Student.countDocuments(),
        Student.countDocuments({ isActive: true }),
        Course.countDocuments(),
        Course.countDocuments({ isActive: true }),
    ]);

    // Get today's attendance summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.aggregate([
        { $match: { date: { $gte: today, $lt: tomorrow } } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const attendanceSummary = { present: 0, absent: 0, late: 0 };
    todayAttendance.forEach((item) => {
        attendanceSummary[item._id] = item.count;
    });

    // Recent students (last 5)
    const recentStudents = await Student.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName rollNumber class section createdAt');

    // Grade distribution
    const gradeDistribution = await Grade.aggregate([
        {
            $group: {
                _id: '$grade',
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return {
        students: { total: totalStudents, active: activeStudents },
        courses: { total: totalCourses, active: activeCourses },
        todayAttendance: attendanceSummary,
        recentStudents,
        gradeDistribution,
    };
};

module.exports = { getStats };

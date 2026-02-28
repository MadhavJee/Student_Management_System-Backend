const Grade = require('../models/Grade');
const ApiError = require('../utils/ApiError');

// Add a grade
const addGrade = async (data) => {
    const grade = await Grade.create(data);
    return grade;
};

// Update a grade
const updateGrade = async (id, data) => {
    const grade = await Grade.findById(id);
    if (!grade) {
        throw new ApiError(404, 'Grade not found');
    }

    Object.assign(grade, data);
    await grade.save(); // triggers pre-save hook to recalculate letter grade

    return grade;
};

// Delete a grade
const deleteGrade = async (id) => {
    const grade = await Grade.findByIdAndDelete(id);
    if (!grade) {
        throw new ApiError(404, 'Grade not found');
    }
    return grade;
};

// Get grades by student
const getStudentGrades = async (studentId) => {
    const grades = await Grade.find({ student: studentId })
        .populate('course', 'name code credits')
        .sort({ createdAt: -1 });

    return grades;
};

// Get grades by course
const getCourseGrades = async (courseId, examType) => {
    const filter = { course: courseId };
    if (examType) filter.examType = examType;

    const grades = await Grade.find(filter)
        .populate('student', 'firstName lastName rollNumber')
        .sort({ marks: -1 });

    return grades;
};

// Get student report card (all grades grouped by course)
const getStudentReportCard = async (studentId) => {
    const grades = await Grade.find({ student: studentId })
        .populate('course', 'name code credits')
        .sort({ 'course.name': 1, examType: 1 });

    // Group grades by course
    const reportCard = {};
    grades.forEach((grade) => {
        const courseKey = grade.course._id.toString();
        if (!reportCard[courseKey]) {
            reportCard[courseKey] = {
                course: grade.course,
                grades: [],
                totalMarks: 0,
                obtainedMarks: 0,
            };
        }
        reportCard[courseKey].grades.push(grade);
        reportCard[courseKey].totalMarks += grade.totalMarks;
        reportCard[courseKey].obtainedMarks += grade.marks;
    });

    // Calculate overall percentage per course
    const report = Object.values(reportCard).map((item) => ({
        ...item,
        percentage: Math.round((item.obtainedMarks / item.totalMarks) * 100 * 100) / 100,
    }));

    return report;
};

module.exports = {
    addGrade,
    updateGrade,
    deleteGrade,
    getStudentGrades,
    getCourseGrades,
    getStudentReportCard,
};

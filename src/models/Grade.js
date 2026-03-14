const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student is required'],
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required'],
        },
        examType: {
            type: String,
            enum: ['midterm', 'final', 'assignment', 'quiz'],
            required: [true, 'Exam type is required'],
        },
        marks: {
            type: Number,
            required: [true, 'Marks are required'],
            min: [0, 'Marks cannot be negative'],
        },
        totalMarks: {
            type: Number,
            required: [true, 'Total marks are required'],
            min: [1, 'Total marks must be at least 1'],
        },
        grade: {
            type: String,
            enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
        },
        remarks: {
            type: String,
            trim: true,
            maxlength: [200, 'Remarks cannot exceed 200 characters'],
        },
    },
    { timestamps: true }
);

// Auto-calculate grade before saving
gradeSchema.pre('save', async function () {
    const percentage = (this.marks / this.totalMarks) * 100;
    if (percentage >= 95) this.grade = 'A+';
    else if (percentage >= 85) this.grade = 'A';
    else if (percentage >= 75) this.grade = 'B+';
    else if (percentage >= 65) this.grade = 'B';
    else if (percentage >= 55) this.grade = 'C+';
    else if (percentage >= 45) this.grade = 'C';
    else if (percentage >= 35) this.grade = 'D';
    else this.grade = 'F';
});

module.exports = mongoose.model('Grade', gradeSchema);

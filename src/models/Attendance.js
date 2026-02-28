const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
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
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late'],
            required: [true, 'Status is required'],
        },
        remarks: {
            type: String,
            trim: true,
            maxlength: [200, 'Remarks cannot exceed 200 characters'],
        },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate attendance entries
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

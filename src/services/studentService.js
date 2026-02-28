const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');

// Get all students with pagination, search, and filter
const getAllStudents = async (query) => {
    const {
        page = 1,
        limit = 10,
        search,
        class: studentClass,
        section,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;

    const filter = {};

    // Search by name, email, or roll number
    if (search) {
        filter.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { rollNumber: { $regex: search, $options: 'i' } },
        ];
    }

    if (studentClass) filter.class = studentClass;
    if (section) filter.section = section;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [students, total] = await Promise.all([
        Student.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
        Student.countDocuments(filter),
    ]);

    return {
        students,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit)),
        },
    };
};

// Get single student by ID
const getStudentById = async (id) => {
    const student = await Student.findById(id);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }
    return student;
};

// Create student
const createStudent = async (data) => {
    const existingStudent = await Student.findOne({
        $or: [{ email: data.email }, { rollNumber: data.rollNumber }],
    });

    if (existingStudent) {
        throw new ApiError(400, 'Student with this email or roll number already exists');
    }

    const student = await Student.create(data);
    return student;
};

// Update student
const updateStudent = async (id, data) => {
    const student = await Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    return student;
};

// Delete student
const deleteStudent = async (id) => {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }
    return student;
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};

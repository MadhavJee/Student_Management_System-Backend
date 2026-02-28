const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        const response = new ApiResponse(201, result, 'User registered successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        const response = new ApiResponse(200, result, 'Login successful');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user._id);
        const response = new ApiResponse(200, user, 'Profile fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getProfile };

const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/ApiResponse');

const getStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getStats();
        const response = new ApiResponse(200, stats, 'Dashboard stats fetched successfully');
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = { getStats };

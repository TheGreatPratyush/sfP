const dashboardService = require("../services/dashboard.service");

// Get complete dashboard data
const getDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getDashboard();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
};
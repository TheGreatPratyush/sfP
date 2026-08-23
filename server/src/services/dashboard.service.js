const dashboardRepository = require("../repositories/dashboard.repository");

// Get complete dashboard data
const getDashboard = async () => {
    const summary = await dashboardRepository.getSummary();

    const inventory =
        await dashboardRepository.getInventoryOverview();

    const lowStockProducts =
        await dashboardRepository.getLowStockProducts();

    const categoryDistribution =
        await dashboardRepository.getCategoryDistribution();

    const recentProducts =
        await dashboardRepository.getRecentProducts();

    return {
        summary,
        inventory,
        lowStockProducts,
        categoryDistribution,
        recentProducts,
    };
};

module.exports = {
    getDashboard,
};
const express = require("express");

const dashboardController = require("../controllers/dashboard.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Get complete dashboard data
router.get("/", requireAuth, dashboardController.getDashboard);

module.exports = router;
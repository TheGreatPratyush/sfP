const express = require("express");

const dashboardController = require("../controllers/dashboard.controller");

const router = express.Router();

// Get complete dashboard data
router.get("/", dashboardController.getDashboard);

module.exports = router;
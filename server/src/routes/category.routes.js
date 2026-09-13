const express = require("express");
const categoryController = require("../controllers/category.controller");
const validateCategory = require("../validators/category.validator");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Defines category API endpoints
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", requireAuth, validateCategory, categoryController.createCategory);
router.put("/:id", requireAuth, validateCategory, categoryController.updateCategory);
router.delete("/:id", requireAuth, categoryController.deleteCategory);

module.exports = router;
const express = require("express");
const categoryController = require("../controllers/category.controller");
const validateCategory = require("../validators/category.validator");

const router = express.Router();

// Defines category API endpoints
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", validateCategory, categoryController.createCategory);
router.put("/:id", validateCategory, categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
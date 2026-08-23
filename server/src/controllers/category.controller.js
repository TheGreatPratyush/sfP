const categoryService = require("../services/category.service");

// Get all categories
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

// Get one category
const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// Create a category
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const category = await categoryService.createCategory(
            name,
            description
        );

        res.status(201).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// Update a category
const updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const category = await categoryService.updateCategory(
            req.params.id,
            name,
            description
        );

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// Delete a category
const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
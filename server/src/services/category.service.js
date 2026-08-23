// Handles category business logic and connects category.controller.js with category.repository.js

const categoryRepository = require("../repositories/category.repository");

// Get all categories
const getAllCategories = async () => {
    return await categoryRepository.getAllCategories();
};

// Get one category by ID
const getCategoryById = async (id) => {
    return await categoryRepository.getCategoryById(id);
};

// Create a category
const createCategory = async (name, description) => {
    return await categoryRepository.createCategory(name, description);
};

// Update a category
const updateCategory = async (id, name, description) => {
    return await categoryRepository.updateCategory(id, name, description);
};

// Delete a category
const deleteCategory = async (id) => {
    return await categoryRepository.deleteCategory(id);
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
const productRepository = require("../repositories/product.repository");

// Get all products
const getAllProducts = async () => {
    return await productRepository.getAllProducts();
};

// Get one product
const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

// Create a product
const createProduct = async (
    name,
    description,
    categoryId,
    price,
    discountPercentage,
    status
) => {
    return await productRepository.createProduct(
        name,
        description,
        categoryId,
        price,
        discountPercentage,
        status
    );
};

// Update a product
const updateProduct = async (
    id,
    name,
    description,
    categoryId,
    price,
    discountPercentage,
    status
) => {
    return await productRepository.updateProduct(
        id,
        name,
        description,
        categoryId,
        price,
        discountPercentage,
        status
    );
};

// Delete a product
const deleteProduct = async (id) => {
    return await productRepository.deleteProduct(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
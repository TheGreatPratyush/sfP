const productService = require("../services/product.service");

// Handles all product API operations
const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            categoryId,
            price,
            discountPercentage,
            status,
        } = req.body;

        const product = await productService.createProduct(
            name,
            description,
            categoryId,
            price,
            discountPercentage,
            status
        );

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            categoryId,
            price,
            discountPercentage,
            status,
        } = req.body;

        const product = await productService.updateProduct(
            req.params.id,
            name,
            description,
            categoryId,
            price,
            discountPercentage,
            status
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
const variantService = require("../services/variant.service");

// Handles product variant API operations
const getAllVariants = async (req, res, next) => {
    try {
        const variants = await variantService.getAllVariants();

        res.status(200).json({
            success: true,
            data: variants,
        });
    } catch (error) {
        next(error);
    }
};

const getVariantsByProductId = async (req, res, next) => {
    try {
        const variants = await variantService.getVariantsByProductId(
            req.params.productId
        );

        res.status(200).json({
            success: true,
            data: variants,
        });
    } catch (error) {
        next(error);
    }
};

const getVariantById = async (req, res, next) => {
    try {
        const variant = await variantService.getVariantById(req.params.id);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        next(error);
    }
};

const createVariant = async (req, res, next) => {
    try {
        const {
            productId,
            size,
            color,
            sku,
            price,
        } = req.body;

        const variant = await variantService.createVariant(
            productId,
            size,
            color,
            sku,
            price
        );

        res.status(201).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        next(error);
    }
};

const updateVariant = async (req, res, next) => {
    try {
        const {
            size,
            color,
            sku,
            price,
        } = req.body;

        const variant = await variantService.updateVariant(
            req.params.id,
            size,
            color,
            sku,
            price
        );

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        next(error);
    }
};

const deleteVariant = async (req, res, next) => {
    try {
        const variant = await variantService.deleteVariant(req.params.id);

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Variant not found",
            });
        }

        res.status(200).json({
            success: true,
            data: variant,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllVariants,
    getVariantsByProductId,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant,
};
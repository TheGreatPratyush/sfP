const variantRepository = require("../repositories/variant.repository");

// Get all variants
const getAllVariants = async () => {
    return await variantRepository.getAllVariants();
};

// Get variants for one product
const getVariantsByProductId = async (productId) => {
    return await variantRepository.getVariantsByProductId(productId);
};

// Get one variant
const getVariantById = async (id) => {
    return await variantRepository.getVariantById(id);
};

// Create a variant
const createVariant = async (
    productId,
    size,
    color,
    sku,
    price
) => {
    return await variantRepository.createVariant(
        productId,
        size,
        color,
        sku,
        price
    );
};

// Update a variant
const updateVariant = async (
    id,
    size,
    color,
    sku,
    price
) => {
    return await variantRepository.updateVariant(
        id,
        size,
        color,
        sku,
        price
    );
};

// Delete a variant
const deleteVariant = async (id) => {
    return await variantRepository.deleteVariant(id);
};

module.exports = {
    getAllVariants,
    getVariantsByProductId,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant,
};
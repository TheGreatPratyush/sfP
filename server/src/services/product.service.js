const path = require("path");
const fs = require("fs");

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

// Delete a product image
const deleteProductImage = async (
    productId,
    imageId
) => {
    const image =
        await productRepository.deleteProductImage(
            productId,
            imageId
        );

    if (!image) {
        return null;
    }

    // Convert /uploads/example.jpg
    // into the actual server/uploads/example.jpg path
    if (image.image_url) {
        const filename = path.basename(
            image.image_url
        );

        const uploadDirectory = path.join(
            __dirname,
            "../../uploads"
        );

        const filePath = path.join(
            uploadDirectory,
            filename
        );

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(
                "Failed to delete product image file:",
                error
            );
        }
    }

    return image;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
};
const express = require("express");

const productController = require("../controllers/product.controller");
const validateProduct = require("../validators/product.validator");
const upload = require("../middleware/upload");
const productRepository = require("../repositories/product.repository");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Defines product API endpoints
router.get(
    "/",
    productController.getAllProducts
);

router.get(
    "/:id",
    productController.getProductById
);

router.post(
    "/",
    requireAuth,
    validateProduct,
    productController.createProduct
);

router.put(
    "/:id",
    requireAuth,
    validateProduct,
    productController.updateProduct
);

router.delete(
    "/:id",
    requireAuth,
    productController.deleteProduct
);

// Uploads product image and saves image record
router.post(
    "/:id/image",
    requireAuth,
    upload.single("image"),
    async (req, res, next) => {
        try {
            const image =
                await productRepository.createProductImage(
                    req.params.id,
                    process.env.CLOUDINARY_URL ? req.file.path : `/uploads/${req.file.filename}`,
                    0,
                    true
                );

            res.status(201).json({
                success: true,
                message:
                    "Image uploaded successfully",
                data: image,
            });
        } catch (error) {
            next(error);
        }
    }
);

// Deletes a product image
router.delete(
    "/:id/image/:imageId",
    requireAuth,
    productController.deleteProductImage
);

module.exports = router;
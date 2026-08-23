// Validates product variant data before sending it to the service

const validateVariant = (req, res, next) => {
    const {
        productId,
        size,
        color,
        sku,
        price
    } = req.body;

    if (!productId || !Number.isInteger(Number(productId))) {
        return res.status(400).json({
            success: false,
            message: "Valid product ID is required",
        });
    }

    if (!sku || typeof sku !== "string" || sku.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "SKU is required",
        });
    }

    if (size !== undefined && typeof size !== "string") {
        return res.status(400).json({
            success: false,
            message: "Size must be a string",
        });
    }

    if (color !== undefined && typeof color !== "string") {
        return res.status(400).json({
            success: false,
            message: "Color must be a string",
        });
    }

    if (
        price !== undefined &&
        (isNaN(Number(price)) || Number(price) < 0)
    ) {
        return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number",
        });
    }

    req.body.productId = Number(productId);
    req.body.sku = sku.trim();

    if (size !== undefined) {
        req.body.size = size.trim();
    }

    if (color !== undefined) {
        req.body.color = color.trim();
    }

    if (price !== undefined) {
        req.body.price = Number(price);
    }

    next();
};

module.exports = validateVariant;
// Validates product data before sending it to the service

const validateProduct = (req, res, next) => {
    const {
        name,
        description,
        categoryId,
        price,
        discountPercentage,
        status
    } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Product name is required",
        });
    }

    if (!categoryId || !Number.isInteger(Number(categoryId))) {
        return res.status(400).json({
            success: false,
            message: "Valid category ID is required",
        });
    }

    if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
            success: false,
            message: "Valid price is required",
        });
    }

    if (
        discountPercentage !== undefined &&
        (isNaN(Number(discountPercentage)) ||
            Number(discountPercentage) < 0 ||
            Number(discountPercentage) > 100)
    ) {
        return res.status(400).json({
            success: false,
            message: "Discount percentage must be between 0 and 100",
        });
    }

    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({
            success: false,
            message: "Description must be a string",
        });
    }

    if (status !== undefined && !["active", "inactive"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product status",
        });
    }

    req.body.name = name.trim();
    req.body.categoryId = Number(categoryId);
    req.body.price = Number(price);
    req.body.discountPercentage = Number(discountPercentage || 0);
    req.body.status = status || "active";

    if (description !== undefined) {
        req.body.description = description.trim();
    }

    next();
};

module.exports = validateProduct;
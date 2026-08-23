// Validates inventory data before sending it to the service

const validateInventory = (req, res, next) => {
    const {
        variantId,
        quantity,
        lowStockThreshold
    } = req.body;

    if (!variantId || !Number.isInteger(Number(variantId))) {
        return res.status(400).json({
            success: false,
            message: "Valid variant ID is required",
        });
    }

    if (
        quantity === undefined ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Quantity must be a non-negative integer",
        });
    }

    if (
        lowStockThreshold !== undefined &&
        (!Number.isInteger(Number(lowStockThreshold)) ||
            Number(lowStockThreshold) < 0)
    ) {
        return res.status(400).json({
            success: false,
            message: "Low stock threshold must be a non-negative integer",
        });
    }

    req.body.variantId = Number(variantId);
    req.body.quantity = Number(quantity);
    req.body.lowStockThreshold = Number(lowStockThreshold ?? 5);

    next();
};

module.exports = validateInventory;
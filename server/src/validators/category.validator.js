// Validates category data before sending it to the service

const validateCategory = (req, res, next) => {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Category name is required",
        });
    }

    if (description !== undefined && typeof description !== "string") {
        return res.status(400).json({
            success: false,
            message: "Category description must be a string",
        });
    }

    req.body.name = name.trim();

    if (description !== undefined) {
        req.body.description = description.trim();
    }

    next();
};

module.exports = validateCategory;
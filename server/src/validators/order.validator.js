const validateOrder = (req, res, next) => {
    const { customer, items } = req.body;

    if (!customer || typeof customer !== "object") {
        return res.status(400).json({ success: false, message: "Customer information is required" });
    }

    const { name, phone, address, city, state, pincode } = customer;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ success: false, message: "Customer name is required" });
    }
    if (!phone || typeof phone !== "string" || phone.trim() === "") {
        return res.status(400).json({ success: false, message: "Customer phone is required" });
    }
    if (!address || typeof address !== "string" || address.trim() === "") {
        return res.status(400).json({ success: false, message: "Delivery address is required" });
    }
    if (!city || typeof city !== "string" || city.trim() === "") {
        return res.status(400).json({ success: false, message: "Delivery city is required" });
    }
    if (!state || typeof state !== "string" || state.trim() === "") {
        return res.status(400).json({ success: false, message: "Delivery state is required" });
    }
    if (!pincode || typeof pincode !== "string" || pincode.trim() === "") {
        return res.status(400).json({ success: false, message: "Delivery pincode is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.variant_id || !Number.isInteger(Number(item.variant_id))) {
            return res.status(400).json({ success: false, message: "Valid variant ID is required for all items" });
        }
        if (!item.quantity || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) <= 0) {
            return res.status(400).json({ success: false, message: "Valid positive quantity is required for all items" });
        }
    }

    next();
};

module.exports = validateOrder;

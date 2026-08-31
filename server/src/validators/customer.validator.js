const validateCustomer = (req, res, next) => {
    const { name, email, phone, address, city, state, pincode } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ success: false, message: "Customer name is required" });
    }

    if (!phone || typeof phone !== "string" || phone.trim() === "") {
        return res.status(400).json({ success: false, message: "Customer phone is required" });
    }

    req.body.name = name.trim();
    req.body.phone = phone.trim();
    if (email) req.body.email = email.trim();
    if (address) req.body.address = address.trim();
    if (city) req.body.city = city.trim();
    if (state) req.body.state = state.trim();
    if (pincode) req.body.pincode = pincode.trim();

    next();
};

module.exports = validateCustomer;

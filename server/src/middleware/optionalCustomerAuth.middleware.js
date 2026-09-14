const jwt = require("jsonwebtoken");
const env = require("../config/env");

const optionalCustomerAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');
        if (decoded.role === "customer") {
            req.customer = decoded;
        }
        next();
    } catch (err) {
        // Invalid token is ignored for optional auth
        next();
    }
};

module.exports = optionalCustomerAuth;

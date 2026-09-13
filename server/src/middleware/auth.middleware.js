const jwt = require("jsonwebtoken");
const env = require("../config/env");

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized. Missing or invalid token." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized. Token expired or invalid." });
    }
};

module.exports = requireAuth;

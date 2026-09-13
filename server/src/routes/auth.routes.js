const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
    const { password } = req.body;
    
    // Simplest approach: compare against env variable
    const adminPassword = process.env.OWNER_PASSWORD || "admin123";
    
    if (password === adminPassword) {
        const token = jwt.sign(
            { role: "owner" }, 
            process.env.JWT_SECRET || 'fallback-secret-for-dev', 
            { expiresIn: "7d" }
        );
        return res.json({ success: true, token });
    }
    
    return res.status(401).json({ success: false, message: "Invalid credentials" });
});

module.exports = router;

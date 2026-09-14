const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customerRepository = require("../repositories/customer.repository");
const requireCustomerAuth = require("../middleware/customerAuth.middleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "Name, email, phone, and password are required" });
        }

        const existingCustomer = await customerRepository.findCustomerByEmail(email);
        
        if (existingCustomer && existingCustomer.is_registered) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const customer = await customerRepository.registerCustomer(name, email, phone, passwordHash);

        const token = jwt.sign(
            { id: customer.id, email: customer.email, role: "customer" },
            process.env.JWT_SECRET || 'fallback-secret-for-dev',
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            }
        });

    } catch (err) {
        console.error("Customer registration error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const customer = await customerRepository.findCustomerByEmail(email);

        if (!customer || !customer.is_registered) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, customer.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: customer.id, email: customer.email, role: "customer" },
            process.env.JWT_SECRET || 'fallback-secret-for-dev',
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            }
        });

    } catch (err) {
        console.error("Customer login error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/me", requireCustomerAuth, async (req, res) => {
    try {
        const customer = await customerRepository.getCustomerById(req.customer.id);
        
        if (!customer || !customer.is_registered) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.json({
            success: true,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode
            }
        });
    } catch (err) {
        console.error("Customer me error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;

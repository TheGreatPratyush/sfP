const customerService = require("../services/customer.service");

const createCustomer = async (req, res, next) => {
    try {
        const { name, email, phone, address, city, state, pincode } = req.body;
        const customer = await customerService.createCustomer(name, email, phone, address, city, state, pincode);

        res.status(201).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

const getCustomerById = async (req, res, next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

const updateCustomer = async (req, res, next) => {
    try {
        const { name, email, phone, address, city, state, pincode } = req.body;
        const customer = await customerService.updateCustomer(req.params.id, name, email, phone, address, city, state, pincode);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

const getCustomers = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max limit 100
        const search = req.query.search ? String(req.query.search).trim() : null;

        const result = await customerService.getCustomers(search, page, limit);

        res.status(200).json({
            success: true,
            data: result.customers,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const getCustomerOrders = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max limit 100

        const result = await customerService.getCustomerOrders(req.params.id, page, limit);

        res.status(200).json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCustomer,
    getCustomerById,
    updateCustomer,
    getCustomers,
    getCustomerOrders
};

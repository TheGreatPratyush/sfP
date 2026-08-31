const orderService = require("../services/order.service");
const { emitOrderCreated } = require("../sockets/order.socket");

const createOrder = async (req, res, next) => {
    try {
        const { customer, items } = req.body;
        const order = await orderService.createOrder(customer, items);

        const io = req.app.get("io");
        if (io) {
            emitOrderCreated(io, order);
        }

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)); // Max limit 100
        const search = req.query.search ? String(req.query.search).trim() : null;
        const status = req.query.status ? String(req.query.status).trim() : null;
        
        const sortBy = req.query.sortBy ? String(req.query.sortBy).trim() : 'created_at';
        const sortOrder = req.query.sortOrder ? String(req.query.sortOrder).trim() : 'DESC';

        const result = await orderService.getOrders(search, status, sortBy, sortOrder, page, limit);

        res.status(200).json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        if (!status || typeof status !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid status is required"
            });
        }

        const order = await orderService.updateOrderStatus(req.params.id, status.trim());

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getOrders,
    updateOrderStatus
};

const orderRepository = require("../repositories/order.repository");

const getMyOrders = async (req, res, next) => {
    try {
        const customerId = req.customer.id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const orders = await orderRepository.getOrdersByCustomerId(customerId, limit, offset);
        const total = await orderRepository.countOrdersByCustomerId(customerId);

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMyOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const customerId = req.customer.id;

        const order = await orderRepository.getOrderById(orderId);
        
        // Critical IDOR protection
        if (!order || order.customer_id !== customerId) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const items = await orderRepository.getOrderItems(orderId);

        // Sanitize response to remove any sensitive backend/customer fields if necessary
        // The prompt says: "Do not reveal... another customer's name..." - the 404 handles that.
        // For the valid owner, providing the name, email, address used on the order is required.
        
        res.status(200).json({
            success: true,
            data: {
                ...order,
                items
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMyOrders,
    getMyOrderDetails
};

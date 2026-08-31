const pool = require("../config/database");
const orderRepository = require("../repositories/order.repository");
const customerRepository = require("../repositories/customer.repository");
const AppError = require("../utils/errors");

const createOrder = async (customerData, items) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const customer = await customerRepository.createCustomer(
            customerData.name,
            customerData.email,
            customerData.phone,
            customerData.address,
            customerData.city,
            customerData.state,
            customerData.pincode,
            client
        );

        let totalAmount = 0;
        const mergedItems = {};
        for (const item of items) {
            if (mergedItems[item.variant_id]) {
                mergedItems[item.variant_id].quantity += item.quantity;
            } else {
                mergedItems[item.variant_id] = { ...item };
            }
        }
        const uniqueItems = Object.values(mergedItems);

        const processedItems = [];

        for (const item of uniqueItems) {
            const variantRes = await client.query(
                `
                SELECT pv.*, p.name as product_name
                FROM product_variants pv
                JOIN products p ON pv.product_id = p.id
                WHERE pv.id = $1
                FOR UPDATE
                `,
                [item.variant_id]
            );

            if (variantRes.rows.length === 0) {
                throw new AppError(`Variant with ID ${item.variant_id} not found`, 404);
            }

            const variant = variantRes.rows[0];
            const price = Number(variant.price);
            const subtotal = price * item.quantity;
            totalAmount += subtotal;

            const invRes = await client.query(
                `
                UPDATE inventory
                SET 
                    quantity = quantity - $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE variant_id = $2 AND quantity >= $1
                RETURNING *
                `,
                [item.quantity, item.variant_id]
            );

            if (invRes.rows.length === 0) {
                throw new AppError(`Insufficient stock for variant ${variant.sku || item.variant_id}`, 400);
            }

            processedItems.push({
                variantId: variant.id,
                productName: variant.product_name,
                variantSku: variant.sku,
                variantSize: variant.size,
                variantColor: variant.color,
                quantity: item.quantity,
                priceAtPurchase: price
            });
        }

        const order = await orderRepository.createOrder(
            customer.id,
            totalAmount,
            customerData.address,
            customerData.city,
            customerData.state,
            customerData.pincode,
            client
        );

        for (const pItem of processedItems) {
            await orderRepository.createOrderItem(
                order.id,
                pItem.variantId,
                pItem.productName,
                pItem.variantSku,
                pItem.variantSize,
                pItem.variantColor,
                pItem.quantity,
                pItem.priceAtPurchase,
                client
            );
        }

        await client.query("COMMIT");

        return order;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getOrderById = async (id) => {
    const order = await orderRepository.getOrderById(id);
    if (!order) return null;

    const items = await orderRepository.getOrderItems(id);
    order.items = items;
    return order;
};

const getOrders = async (search, status, sortBy, sortOrder, page, limit) => {
    const offset = (page - 1) * limit;

    const orders = await orderRepository.getOrders(search, status, sortBy, sortOrder, limit, offset);
    const totalItems = await orderRepository.countOrders(search, status);
    const totalPages = Math.ceil(totalItems / limit);

    return {
        orders,
        pagination: {
            currentPage: page,
            limit,
            totalItems,
            totalPages
        }
    };
};

const VALID_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['completed'],
    completed: [],
    cancelled: [] // terminal
};

const updateOrderStatus = async (id, newStatus) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const orderRes = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [id]);
        if (orderRes.rows.length === 0) {
            throw new AppError("Order not found", 404);
        }

        const currentOrder = orderRes.rows[0];
        const currentStatus = currentOrder.status;

        // Transition validation
        if (currentStatus === newStatus) {
            await client.query("COMMIT");
            return currentOrder;
        }

        const allowed = VALID_TRANSITIONS[currentStatus] || [];
        if (!allowed.includes(newStatus)) {
            throw new AppError(`Cannot transition order from '${currentStatus}' to '${newStatus}'`, 400);
        }

        const updatedOrder = await orderRepository.updateOrderStatus(id, newStatus, client);

        // Inventory Restoration
        if (newStatus === "cancelled") {
            const items = await orderRepository.getOrderItems(id, client);
            for (const item of uniqueItems) {
                if (item.variant_id) {
                    await client.query(
                        `
                        UPDATE inventory
                        SET 
                            quantity = quantity + $1,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE variant_id = $2
                        `,
                        [item.quantity, item.variant_id]
                    );
                }
            }
        }

        await client.query("COMMIT");
        return updatedOrder;

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getOrders,
    updateOrderStatus
};

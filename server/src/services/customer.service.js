const customerRepository = require("../repositories/customer.repository");
const orderRepository = require("../repositories/order.repository");

const createCustomer = async (name, email, phone, address, city, state, pincode) => {
    return await customerRepository.createCustomer(name, email, phone, address, city, state, pincode);
};

const getCustomerById = async (id) => {
    return await customerRepository.getCustomerById(id);
};

const updateCustomer = async (id, name, email, phone, address, city, state, pincode) => {
    return await customerRepository.updateCustomer(id, name, email, phone, address, city, state, pincode);
};

const getCustomers = async (search, page, limit) => {
    const offset = (page - 1) * limit;
    
    const customers = await customerRepository.getCustomers(search, limit, offset);
    const totalItems = await customerRepository.countCustomers(search);
    const totalPages = Math.ceil(totalItems / limit);

    return {
        customers,
        pagination: {
            currentPage: page,
            limit,
            totalItems,
            totalPages
        }
    };
};

const getCustomerOrders = async (customerId, page, limit) => {
    const offset = (page - 1) * limit;

    const orders = await orderRepository.getOrdersByCustomerId(customerId, limit, offset);
    const totalItems = await orderRepository.countOrdersByCustomerId(customerId);
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

module.exports = {
    createCustomer,
    getCustomerById,
    updateCustomer,
    getCustomers,
    getCustomerOrders
};

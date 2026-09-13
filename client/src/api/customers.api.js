import apiClient from "./client";

export const getCustomers = async (params = {}) => {
    const query = new URLSearchParams();
    
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/customers?${queryString}` : "/customers";
    
    return await apiClient(endpoint);
};

export const getCustomerById = async (customerId) => {
    return await apiClient(`/customers/${customerId}`);
};

export const getCustomerOrders = async (customerId, params = {}) => {
    const query = new URLSearchParams();
    
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/customers/${customerId}/orders?${queryString}` : `/customers/${customerId}/orders`;
    
    return await apiClient(endpoint);
};

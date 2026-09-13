import apiClient from "./client";

export const getOrders = async (params = {}) => {
    const query = new URLSearchParams();
    
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);
    if (params.status) query.append("status", params.status);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/orders?${queryString}` : "/orders";
    
    return await apiClient(endpoint);
};

export const updateOrderStatus = async (orderId, status) => {
    return await apiClient(`/orders/${orderId}/status`, {
        method: "PUT",
        body: { status },
    });
};

export const getOrderById = async (orderId) => {
    return await apiClient(`/orders/${orderId}`);
};

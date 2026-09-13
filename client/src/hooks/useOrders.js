import { useCallback, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/orders.api";

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getOrders(params);

            setOrders(response.data || []);
            setPagination(response.pagination || {
                currentPage: 1,
                limit: 10,
                totalItems: 0,
                totalPages: 0,
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const changeStatus = async (orderId, newStatus) => {
        const response = await updateOrderStatus(orderId, newStatus);
        return response;
    };

    return {
        orders,
        pagination,
        loading,
        error,
        fetchOrders,
        changeStatus,
    };
};

export default useOrders;

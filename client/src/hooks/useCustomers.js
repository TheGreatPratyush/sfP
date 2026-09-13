import { useCallback, useState } from "react";
import { getCustomers } from "../api/customers.api";

const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomers = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getCustomers(params);

            setCustomers(response.data || []);
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

    return {
        customers,
        pagination,
        loading,
        error,
        fetchCustomers,
    };
};

export default useCustomers;

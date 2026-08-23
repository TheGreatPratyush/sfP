import { useCallback, useEffect, useState } from "react";

import { getDashboard } from "../api/dashboard.api";

const useDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getDashboard();

            setDashboard(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        dashboard,
        loading,
        error,
        refetch: fetchDashboard,
    };
};

export default useDashboard;
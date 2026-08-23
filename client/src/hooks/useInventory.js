import { useCallback, useEffect, useState } from "react";

import {
    getInventory,
    createInventory,
    updateInventoryQuantity,
    deleteInventory,
} from "../api/inventory.api";

const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getInventory();

            setInventory(response.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const addInventory = async (inventoryData) => {
        const response = await createInventory(inventoryData);

        await fetchInventory();

        return response;
    };

    const updateStock = async (
        variantId,
        quantity,
        lowStockThreshold
    ) => {
        const response = await updateInventoryQuantity(
            variantId,
            quantity,
            lowStockThreshold
        );

        await fetchInventory();

        return response;
    };

    const removeInventory = async (variantId) => {
        const response = await deleteInventory(variantId);

        await fetchInventory();

        return response;
    };

    return {
        inventory,
        loading,
        error,
        refetch: fetchInventory,
        addInventory,
        updateStock,
        removeInventory,
    };
};

export default useInventory;
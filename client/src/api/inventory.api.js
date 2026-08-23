import apiClient from "./client";

export const getInventory = async () => {
    return await apiClient("/inventory");
};

export const getInventoryByVariantId = async (variantId) => {
    return await apiClient(`/inventory/${variantId}`);
};

export const createInventory = async (inventoryData) => {
    return await apiClient("/inventory", {
        method: "POST",
        body: inventoryData,
    });
};

export const updateInventoryQuantity = async (
    variantId,
    quantity,
    lowStockThreshold
) => {
    return await apiClient(`/inventory/${variantId}`, {
        method: "PUT",
        body: {
            variantId,
            quantity,
            lowStockThreshold,
        },
    });
};

export const deleteInventory = async (variantId) => {
    return await apiClient(`/inventory/${variantId}`, {
        method: "DELETE",
    });
};
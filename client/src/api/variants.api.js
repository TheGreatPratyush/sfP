import apiClient from "./client";

export const getVariants = async () => {
    return await apiClient("/variants");
};

export const getVariantById = async (variantId) => {
    return await apiClient(`/variants/${variantId}`);
};

export const createVariant = async (variantData) => {
    return await apiClient("/variants", {
        method: "POST",
        body: variantData,
    });
};

export const updateVariant = async (variantId, variantData) => {
    return await apiClient(`/variants/${variantId}`, {
        method: "PUT",
        body: variantData,
    });
};

export const deleteVariant = async (variantId) => {
    return await apiClient(`/variants/${variantId}`, {
        method: "DELETE",
    });
};
import apiClient from "./client";

export const getProducts = async () => {
    return await apiClient("/products");
};

export const getProductById = async (productId) => {
    return await apiClient(`/products/${productId}`);
};

export const createProduct = async (productData) => {
    return await apiClient("/products", {
        method: "POST",
        body: productData,
    });
};

export const updateProduct = async (productId, productData) => {
    return await apiClient(`/products/${productId}`, {
        method: "PUT",
        body: productData,
    });
};

export const deleteProduct = async (productId) => {
    return await apiClient(`/products/${productId}`, {
        method: "DELETE",
    });
};

export const uploadProductImage = async (productId, imageFile) => {
    const formData = new FormData();

    formData.append("image", imageFile);

    return await apiClient(`/products/${productId}/image`, {
        method: "POST",
        body: formData,
    });
};
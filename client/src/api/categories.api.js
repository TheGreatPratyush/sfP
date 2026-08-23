import apiClient from "./client";

export const getCategories = async () => {
    return await apiClient("/categories");
};

export const getCategoryById = async (categoryId) => {
    return await apiClient(`/categories/${categoryId}`);
};

export const createCategory = async (categoryData) => {
    return await apiClient("/categories", {
        method: "POST",
        body: categoryData,
    });
};

export const updateCategory = async (categoryId, categoryData) => {
    return await apiClient(`/categories/${categoryId}`, {
        method: "PUT",
        body: categoryData,
    });
};

export const deleteCategory = async (categoryId) => {
    return await apiClient(`/categories/${categoryId}`, {
        method: "DELETE",
    });
};
import { useCallback, useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../api/categories.api";

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getCategories();

            setCategories(response.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (categoryData) => {
        const response = await createCategory(categoryData);

        await fetchCategories();

        return response;
    };

    const editCategory = async (
        categoryId,
        categoryData
    ) => {
        const response = await updateCategory(
            categoryId,
            categoryData
        );

        await fetchCategories();

        return response;
    };

    const removeCategory = async (categoryId) => {
        const response = await deleteCategory(categoryId);

        await fetchCategories();

        return response;
    };

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        addCategory,
        editCategory,
        removeCategory,
    };
};

export default useCategories;
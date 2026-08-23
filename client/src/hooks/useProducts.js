import { useCallback, useEffect, useState } from "react";

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../api/products.api";

const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getProducts();

            setProducts(response.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addProduct = async (productData) => {
        const response = await createProduct(productData);

        await fetchProducts();

        return response;
    };

    const editProduct = async (productId, productData) => {
        const response = await updateProduct(
            productId,
            productData
        );

        await fetchProducts();

        return response;
    };

    const removeProduct = async (productId) => {
        const response = await deleteProduct(productId);

        await fetchProducts();

        return response;
    };

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
    };
};

export default useProducts;
import { useCallback, useEffect, useState } from "react";

import {
    getVariants,
    createVariant,
    updateVariant,
    deleteVariant,
} from "../api/variants.api";

const useVariants = () => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVariants = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getVariants();

            setVariants(response.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVariants();
    }, [fetchVariants]);

    const addVariant = async (variantData) => {
        const response = await createVariant(variantData);

        await fetchVariants();

        return response;
    };

    const editVariant = async (
        variantId,
        variantData
    ) => {
        const response = await updateVariant(
            variantId,
            variantData
        );

        await fetchVariants();

        return response;
    };

    const removeVariant = async (variantId) => {
        const response = await deleteVariant(variantId);

        await fetchVariants();

        return response;
    };

    return {
        variants,
        loading,
        error,
        refetch: fetchVariants,
        addVariant,
        editVariant,
        removeVariant,
    };
};

export default useVariants;
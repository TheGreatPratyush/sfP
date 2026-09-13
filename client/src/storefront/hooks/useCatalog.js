import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"; // Fallback if API URL is relative

const adaptProduct = (p) => {
    // Map backend images to full URLs
    const imageUrls = p.images?.length > 0 
        ? p.images.map(img => img.image_url.startsWith('http') ? img.image_url : `${BACKEND_URL}${img.image_url}`)
        : ['/storefront/images/img0.jpg']; // Fallback if no image

    // Find primary image
    const primaryImage = p.images?.find(img => img.is_primary)?.image_url;
    const resolvedPrimary = primaryImage 
        ? (primaryImage.startsWith('http') ? primaryImage : `${BACKEND_URL}${primaryImage}`)
        : imageUrls[0];

    return {
        id: p.id.toString(), // Storefront uses strings for IDs in routing/cart usually
        title: p.name,
        description: p.description,
        price: parseFloat(p.price),
        image: resolvedPrimary,
        images: imageUrls,
        category: p.category_name,
        categoryId: p.category_id?.toString(),
        // mockData used collections array: ['new-arrivals', 'featured']
        collections: [p.category_name?.toLowerCase().replace(/ /g, '-')], 
        variants: p.variants?.map(v => ({
            id: v.id.toString(),
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: parseFloat(v.price), // variant overrides product price
            stock: v.stock
        })) || []
    };
};

const adaptCategory = (c) => ({
    id: c.name.toLowerCase().replace(/ /g, '-'),
    title: c.name,
    dbId: c.id.toString(),
    // Fallback images since DB categories don't have images yet
    image: '/storefront/images/img1.jpg' 
});

export const useCatalog = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCatalog = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                apiClient('/products'),
                apiClient('/categories')
            ]);
            
            setProducts((productsRes.data || []).map(adaptProduct));
            setCategories((categoriesRes.data || []).map(adaptCategory));
            setError(null);
        } catch (err) {
            console.error('Catalog fetch error:', err);
            setError(err.message || 'Failed to load catalog');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCatalog();
    }, [fetchCatalog]);

    return { products, categories, loading, error, refetch: fetchCatalog };
};

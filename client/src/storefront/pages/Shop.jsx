import React from 'react';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../hooks/useCatalog';

const Shop = () => {
    const { products, loading, error } = useCatalog();

    if (loading) {
        return <div className="storefront-loading">Loading Products...</div>;
    }

    if (error) {
        return <div className="storefront-error">Error: {error}</div>;
    }

    return (
        <div className="shop-page">
            <div className="storefront-page-header">
                <h2>All Products</h2>
            </div>
            
            <div className="product-section">
                {products.length === 0 ? (
                    <div className="empty-state">No products found.</div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;

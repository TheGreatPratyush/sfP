import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../hooks/useCatalog';

const Collection = () => {
    const { collectionId } = useParams();
    const { products, categories, loading, error } = useCatalog();

    const collection = useMemo(() => categories.find(c => c.id === collectionId), [categories, collectionId]);
    // collectionId is a string like "women-clothing". The category id in our adapter is also that string.
    const collectionProducts = useMemo(() => products.filter(p => p.categoryId === collection?.dbId), [products, collection]);

    if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading Collection...</div>;
    if (error) return <div style={{ padding: '100px 20px', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

    if (!collection) {
        return <Navigate to="/shop" replace />;
    }

    return (
        <div className="collection-page">
            <div className="storefront-page-header">
                <h2>{collection.title}</h2>
            </div>
            
            <div className="product-section">
                {collectionProducts.length === 0 ? (
                    <div className="empty-state">No products found in this collection.</div>
                ) : (
                    <div className="product-grid">
                        {collectionProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;

import React from 'react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import CollectionGrid from '../components/CollectionGrid';
import { useCatalog } from '../hooks/useCatalog';

const Home = () => {
    const { products, categories, loading, error } = useCatalog();

    if (loading) {
        return (
            <div className="home-page fade-in-animation" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h2>Loading Storefront...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-page fade-in-animation" style={{ padding: '100px 20px', textAlign: 'center', color: 'red' }}>
                <h2>Error Loading Storefront</h2>
                <p>{error}</p>
            </div>
        );
    }

    // New Arrivals: newest products based on ID (assuming higher ID = newer)
    const newArrivals = [...products].reverse().slice(0, 6);
    
    // Featured: simple deterministic selection (e.g. 6 products with lowest ID)
    const featuredProducts = products.slice(0, 6);

    // Map existing categories to the visual sections requested
    // "Women Clothing", "Girls", "Men", "kids"
    const getProductsByCatName = (nameSubstring) => 
        products.filter(p => p.category?.toLowerCase().includes(nameSubstring.toLowerCase()));

    const womenClothing = getProductsByCatName('women');
    const girlsClothing = getProductsByCatName('girls');
    const mensClothing = getProductsByCatName('men');

    // Filter out test categories for the CollectionGrid
    const displayCategories = categories.filter(c => !c.title.toLowerCase().includes('test'));

    return (
        <div className="home-page fade-in-animation">
            <Hero />
            
            <ProductCarousel 
                title="Featured Collection" 
                products={featuredProducts} 
                viewAllLink="/shop"
            />

            <ProductCarousel 
                title="New Arrivals" 
                products={newArrivals} 
                viewAllLink="/shop"
            />

            {womenClothing.length > 0 && (
                <ProductCarousel 
                    title="Women Clothing" 
                    products={womenClothing} 
                    viewAllLink={`/collections/${categories.find(c => c.title.toLowerCase().includes('women'))?.id}`}
                />
            )}

            {mensClothing.length > 0 && (
                <ProductCarousel 
                    title="Men's Collection" 
                    products={mensClothing} 
                    viewAllLink={`/collections/${categories.find(c => c.title.toLowerCase().includes('men'))?.id}`}
                />
            )}

            {girlsClothing.length > 0 && (
                <ProductCarousel 
                    title="Girls Kurti" 
                    products={girlsClothing} 
                    viewAllLink={`/collections/${categories.find(c => c.title.toLowerCase().includes('girls'))?.id}`}
                />
            )}

            <CollectionGrid 
                title="Shop by collection" 
                collections={displayCategories} 
            />
        </div>
    );
};

export default Home;

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ title, products, viewAllLink }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400; // approximate width of one card + gap
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="product-section">
            <div className="product-section__header">
                <h2 className="product-section__heading">{title}</h2>
                {viewAllLink && (
                    <Link to={viewAllLink} className="product-section__view-all">
                        View all
                    </Link>
                )}
            </div>
            
            <div className="product-carousel">
                <button 
                    className="product-carousel__arrow product-carousel__arrow--left" 
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={32} />
                </button>
                
                <div className="product-carousel__track-wrapper" ref={scrollRef}>
                    <div className="product-carousel__track">
                        {products.map(product => (
                            <div key={product.id} className="product-carousel__item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    className="product-carousel__arrow product-carousel__arrow--right" 
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    <ChevronRight size={32} />
                </button>
            </div>
        </section>
    );
};

export default ProductCarousel;

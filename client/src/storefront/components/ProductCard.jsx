import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Safety check for image
    const primaryImage = product.image || (product.images && product.images[0]) || '';
    const hoverImage = (product.images && product.images.length > 1) ? product.images[1] : primaryImage;

    return (
        <Link to={`/product/${product.id}`} className="product-card group">
            <div className="product-card__image-wrapper">
                {hoverImage && hoverImage !== primaryImage && (
                    <img 
                        src={hoverImage} 
                        alt={`${product.title} Alternate View`} 
                        className="product-card__image hover-img"
                        loading="eager"
                    />
                )}
                <img 
                    src={primaryImage} 
                    alt={product.title} 
                    className="product-card__image primary-img"
                    loading="lazy"
                />
            </div>
            <h3 className="product-card__title">{product.title}</h3>
            <p className="product-card__price">Rs. {product.price.toFixed(2)}</p>
        </Link>
    );
};

export default ProductCard;

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { productId } = useParams();
    const { products, loading, error: catalogError } = useCatalog();
    
    const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);
    const { addToCart } = useCart();

    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product && product.images?.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Loading Product...</div>;
    if (catalogError) return <div style={{ padding: '100px 20px', textAlign: 'center', color: 'red' }}>Error: {catalogError}</div>;

    if (!product) {
        return (
            <div className="product-details-page not-found">
                <h2>Product Not Found</h2>
                <Link to="/shop" className="btn-secondary">Back to Shop</Link>
            </div>
        );
    }

    const availableSizes = [...new Set(product.variants.map(v => v.size))].filter(Boolean);
    const availableColors = [...new Set(product.variants.map(v => v.color))].filter(Boolean);

    const selectedVariant = product.variants.find(
        v => (availableSizes.length === 0 || v.size === selectedSize) && 
             (availableColors.length === 0 || v.color === selectedColor)
    );

    // If variant has a price, it overrides the base product price
    const displayPrice = selectedVariant ? selectedVariant.price : product.price;

    const handleQuantityChange = (delta) => {
        setQuantity(prev => {
            const next = prev + delta;
            if (next < 1) return 1;
            if (selectedVariant && next > selectedVariant.stock) {
                return selectedVariant.stock;
            }
            return next;
        });
    };

    const handleAddToCart = () => {
        setError('');
        
        if (availableSizes.length > 0 && !selectedSize) {
            setError('Please select a size');
            return;
        }
        
        if (availableColors.length > 0 && !selectedColor) {
            setError('Please select a color');
            return;
        }

        if (!selectedVariant) {
            setError('This variant is unavailable');
            return;
        }

        if (selectedVariant.stock < 1) {
            setError('This variant is out of stock');
            return;
        }

        // Add to global cart
        addToCart(product, selectedVariant, quantity);
        
        // Reset quantity back to 1
        setQuantity(1);
    };

    return (
        <div className="product-details-page">
            <div className="breadcrumbs">
                <Link to="/">Home</Link> <span>/</span> <Link to="/shop">Shop</Link> <span>/</span> <span>{product.title}</span>
            </div>

            <div className="product-details-layout">
                <div className="product-gallery">
                    <div className="product-gallery__main">
                        <img src={mainImage || '/storefront/images/img0.jpg'} alt={product.title} />
                    </div>
                    {product.images?.length > 1 && (
                        <div className="product-gallery__thumbnails">
                            {product.images.map((img, index) => (
                                <button 
                                    key={index} 
                                    className={`product-gallery__thumb ${mainImage === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h1 className="product-info__title">{product.title}</h1>
                    <p className="product-info__price">Rs. {displayPrice.toFixed(2)}</p>
                    
                    <div className="product-info__description">
                        {product.description || 'No description available.'}
                    </div>

                    {availableSizes.length > 0 && (
                        <div className="variant-selector">
                            <h4 className="variant-selector__title">Size</h4>
                            <div className="variant-selector__options">
                                {availableSizes.map(size => (
                                    <button 
                                        key={size}
                                        className={`variant-btn ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {availableColors.length > 0 && (
                        <div className="variant-selector">
                            <h4 className="variant-selector__title">Color</h4>
                            <div className="variant-selector__options">
                                {availableColors.map(color => (
                                    <button 
                                        key={color}
                                        className={`variant-btn ${selectedColor === color ? 'selected' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-info__stock">
                        {selectedSize || selectedColor ? (
                            selectedVariant ? (
                                selectedVariant.stock > 0 ? (
                                    <span className="in-stock">In Stock ({selectedVariant.stock} available)</span>
                                ) : (
                                    <span className="out-of-stock">Out of Stock</span>
                                )
                            ) : (
                                <span className="unavailable">Variant Unavailable</span>
                            )
                        ) : null}
                    </div>

                    <div className="quantity-control">
                        <h4 className="quantity-control__title">Quantity</h4>
                        <div className="quantity-control__actions">
                            <button className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                            <span className="quantity-display">{quantity}</span>
                            <button 
                                className="quantity-btn" 
                                onClick={() => handleQuantityChange(1)}
                                disabled={selectedVariant && quantity >= selectedVariant.stock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {error && <div className="product-error">{error}</div>}

                    <button 
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={
                            product.variants.length === 0 || 
                            (selectedVariant && selectedVariant.stock < 1) || 
                            (!selectedVariant && (selectedSize || selectedColor))
                        }
                    >
                        {product.variants.length === 0 
                            ? 'Unavailable' 
                            : (selectedVariant && selectedVariant.stock < 1 
                                ? 'Out of Stock' 
                                : 'Add to Cart')
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

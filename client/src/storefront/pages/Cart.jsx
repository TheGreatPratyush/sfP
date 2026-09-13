import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page empty-state">
                <div className="storefront-page-header">
                    <h2>Your Cart</h2>
                </div>
                <div className="empty-state__content">
                    <p>Your cart is currently empty.</p>
                    <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="storefront-page-header">
                <h2>Your Cart</h2>
            </div>
            
            <div className="cart-page__layout">
                <div className="cart-page__items">
                    {cartItems.map((item) => (
                        <div key={item.variant.id} className="cart-page-item">
                            <Link to={`/product/${item.product.id}`}>
                                <img src={item.product.image} alt={item.product.title} className="cart-page-item__image" />
                            </Link>
                            <div className="cart-page-item__details">
                                <Link to={`/product/${item.product.id}`} className="cart-page-item__title">{item.product.title}</Link>
                                <p className="cart-page-item__variant">
                                    {item.variant.size && `Size: ${item.variant.size} `}
                                    {item.variant.color && `Color: ${item.variant.color}`}
                                </p>
                            </div>
                            <div className="cart-page-item__price">Rs. {item.product.price.toFixed(2)}</div>
                            <div className="cart-page-item__quantity">
                                <div className="quantity-control__actions">
                                    <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} disabled={item.quantity >= item.variant.stock}>+</button>
                                </div>
                                <button className="cart-page-item__remove" onClick={() => removeFromCart(item.variant.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="cart-page-item__subtotal">
                                Rs. {(item.product.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-page__summary">
                    <h3 className="summary-title">Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>Rs. {cartTotal.toFixed(2)}</span>
                    </div>
                    <p className="summary-note">Taxes and shipping calculated at checkout</p>
                    <button className="btn-primary summary-checkout-btn" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;

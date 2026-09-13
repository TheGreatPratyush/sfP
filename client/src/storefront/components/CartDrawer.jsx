import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
    const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        closeCart();
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop overlay */}
            <div className="cart-drawer-overlay" onClick={closeCart}></div>
            
            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-drawer__header">
                    <h3>Your Cart</h3>
                    <button className="cart-drawer__close" onClick={closeCart} aria-label="Close cart">
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-drawer__content">
                    {cartItems.length === 0 ? (
                        <div className="cart-drawer__empty">
                            <p>Your cart is currently empty.</p>
                            <button className="btn-secondary" onClick={closeCart}>Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="cart-drawer__items">
                            {cartItems.map((item) => (
                                <div key={item.variant.id} className="cart-item">
                                    <img src={item.product.image} alt={item.product.title} className="cart-item__image" />
                                    <div className="cart-item__details">
                                        <h4 className="cart-item__title">{item.product.title}</h4>
                                        <p className="cart-item__variant">
                                            {item.variant.size && `Size: ${item.variant.size} `}
                                            {item.variant.color && `Color: ${item.variant.color}`}
                                        </p>
                                        <p className="cart-item__price">Rs. {item.product.price.toFixed(2)}</p>
                                        
                                        <div className="cart-item__actions">
                                            <div className="quantity-control__actions cart-quantity">
                                                <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} disabled={item.quantity >= item.variant.stock}>+</button>
                                            </div>
                                            <button className="cart-item__remove" onClick={() => removeFromCart(item.variant.id)} aria-label="Remove item">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-drawer__footer">
                        <div className="cart-drawer__subtotal">
                            <span>Subtotal</span>
                            <span>Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="cart-drawer__note">Shipping & taxes calculated at checkout</p>
                        <button className="btn-primary cart-drawer__checkout-btn" onClick={handleCheckout}>
                            Checkout
                        </button>
                        <Link to="/cart" className="cart-drawer__view-cart-link" onClick={closeCart}>
                            View Full Cart
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;

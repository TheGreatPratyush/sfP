import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import apiClient from '../../api/client';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Prevent checkout of empty cart
    if (cartItems.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (submitError) setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required";
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Valid 10-digit phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Valid 6-digit pincode is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) return;

        if (validateForm()) {
            setIsSubmitting(true);
            setSubmitError('');

            try {
                const payload = {
                    customer: {
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode
                    },
                    items: cartItems.map(item => ({
                        variant_id: parseInt(item.variant.id, 10),
                        quantity: item.quantity
                    }))
                };

                const response = await apiClient('/orders', {
                    method: 'POST',
                    body: payload
                });

                if (response.success) {
                    clearCart();
                    navigate('/order-success', { state: { orderId: response.data.id } });
                }
            } catch (err) {
                console.error("Order submission failed:", err);
                setSubmitError(err.message || "Failed to place order. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="checkout-page">
            <div className="storefront-page-header">
                <h2>Checkout</h2>
            </div>
            
            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                    
                    <div className="checkout-section">
                        <h3>Customer Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? 'error' : ''} disabled={isSubmitting} />
                                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? 'error' : ''} disabled={isSubmitting} />
                                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'error' : ''} disabled={isSubmitting} />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'error' : ''} disabled={isSubmitting} />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="checkout-section">
                        <h3>Delivery Address</h3>
                        <div className="form-group">
                            <label>Street Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={errors.address ? 'error' : ''} disabled={isSubmitting} />
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={errors.city ? 'error' : ''} disabled={isSubmitting} />
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={errors.state ? 'error' : ''} disabled={isSubmitting} />
                                {errors.state && <span className="error-text">{errors.state}</span>}
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className={errors.pincode ? 'error' : ''} disabled={isSubmitting} />
                                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                            </div>
                        </div>
                    </div>

                    {submitError && (
                        <div className="checkout-error-message" style={{ color: '#d32f2f', padding: '10px', marginBottom: '15px', backgroundColor: '#fdecea', borderRadius: '4px', border: '1px solid #d32f2f' }}>
                            <strong>Order Failed:</strong> {submitError}
                        </div>
                    )}

                    <button type="submit" className="btn-primary checkout-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>

                <div className="checkout-summary">
                    <h3>Order Summary</h3>
                    <div className="checkout-items">
                        {cartItems.map(item => (
                            <div key={item.variant.id} className="checkout-item">
                                <div className="checkout-item__image">
                                    <img src={item.product.image} alt={item.product.title} />
                                    <span className="checkout-item__qty-badge">{item.quantity}</span>
                                </div>
                                <div className="checkout-item__info">
                                    <h5 className="checkout-item__title">{item.product.title}</h5>
                                    <p className="checkout-item__variant">
                                        {item.variant.size && `${item.variant.size} `}
                                        {item.variant.color && `/ ${item.variant.color}`}
                                    </p>
                                </div>
                                <div className="checkout-item__price">
                                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-totals">
                        <div className="checkout-total-row">
                            <span>Subtotal</span>
                            <span>Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="checkout-total-row total">
                            <span>Total</span>
                            <span>Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

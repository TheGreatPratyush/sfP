import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import apiClient from '../../api/client';
import { Check, X } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { customer } = useCustomerAuth();
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

    useEffect(() => {
        if (customer) {
            const [first, ...last] = (customer.name || '').split(' ');
            setFormData(prev => ({
                ...prev,
                firstName: first || '',
                lastName: last.join(' ') || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || '',
                city: customer.city || '',
                state: customer.state || '',
                pincode: customer.pincode || ''
            }));
        }
    }, [customer]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [successOrderId, setSuccessOrderId] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);

    if (cartItems.length === 0 && !successOrderId) {
        return <Navigate to="/cart" replace />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (submitError) setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Valid 10-digit phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Valid 6-digit pincode is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const initiateCheckout = () => {
        if (!customer) {
            navigate('/login', { state: { returnTo: '/checkout' } });
            return;
        }
        setShowAddressModal(true);
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
                        email: customer.email, // backend overrides anyway, but we send it
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
                    body: payload,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('sfp_customer_token')}`
                    }
                });

                if (response.success) {
                    setSuccessOrderId(response.data.id);
                    setShowAddressModal(false);
                    clearCart();
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
            {/* Success Modal */}
            {successOrderId && (
                <div className="order-success-modal-overlay">
                    <div className="order-success-modal">
                        <div className="order-success-icon-wrapper">
                            <Check size={40} className="order-success-icon" />
                        </div>
                        <h2 className="order-success-title">Order Placed!</h2>
                        <p className="order-success-message">
                            Your order has been placed successfully.
                        </p>
                        <div className="order-success-details">
                            <span className="order-success-label">Order #{successOrderId}</span>
                        </div>
                        <div className="order-success-actions">
                            <button onClick={() => navigate('/shop')} className="btn-primary">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Details Modal */}
            {showAddressModal && (
                <div className="address-modal-overlay">
                    <div className="address-modal">
                        <div className="address-modal-header">
                            <h3>Delivery Details</h3>
                            <button onClick={() => setShowAddressModal(false)} className="address-modal-close">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form className="checkout-form" onSubmit={handlePlaceOrder}>
                            <div className="checkout-section">
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
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'error' : ''} disabled={isSubmitting} />
                                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                                </div>
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

                            <button type="submit" className="btn-primary checkout-submit-btn" disabled={isSubmitting} style={{ width: '100%' }}>
                                {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="storefront-page-header">
                <h2>Checkout</h2>
            </div>
            
            <div className="checkout-layout" style={{ justifyContent: 'center' }}>
                <div className="checkout-summary" style={{ maxWidth: '600px', width: '100%', border: '1px solid var(--sf-color-border)', padding: '30px', borderRadius: '8px' }}>
                    <h3 style={{ marginBottom: '20px', fontFamily: 'var(--sf-font-heading)', fontSize: '24px', color: 'var(--sf-color-primary)' }}>Order Summary</h3>
                    <div className="checkout-items" style={{ marginBottom: '24px' }}>
                        {cartItems.map(item => (
                            <div key={item.variant.id} className="checkout-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                                <div className="checkout-item__image" style={{ width: '60px', height: '60px', position: 'relative', marginRight: '16px' }}>
                                    <img src={item.product.image} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    <span className="checkout-item__qty-badge" style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--sf-color-primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{item.quantity}</span>
                                </div>
                                <div className="checkout-item__info" style={{ flex: 1 }}>
                                    <h5 className="checkout-item__title" style={{ margin: 0, fontSize: '16px' }}>{item.product.title}</h5>
                                    <p className="checkout-item__variant" style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--sf-color-muted)' }}>
                                        {item.variant.size && `${item.variant.size} `}
                                        {item.variant.color && `/ ${item.variant.color}`}
                                    </p>
                                </div>
                                <div className="checkout-item__price" style={{ fontWeight: 'bold' }}>
                                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-totals" style={{ marginBottom: '30px' }}>
                        <div className="checkout-total-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '16px' }}>
                            <span>Subtotal</span>
                            <span>Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="checkout-total-row total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '2px solid #000', fontWeight: 'bold', fontSize: '20px' }}>
                            <span>Total</span>
                            <span>Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button onClick={initiateCheckout} className="btn-primary checkout-submit-btn" style={{ width: '100%', padding: '16px', fontSize: '18px' }}>
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

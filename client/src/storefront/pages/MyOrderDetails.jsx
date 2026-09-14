import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { ChevronLeft } from 'lucide-react';

const MyOrderDetails = () => {
    const { id } = useParams();
    const { customerToken } = useCustomerAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await apiClient(`/customer/orders/${id}`, {
                    headers: { 'Authorization': `Bearer ${customerToken}` }
                });
                if (response.success) {
                    setOrder(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (customerToken) {
            fetchOrderDetails();
        }
    }, [id, customerToken]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <div className="account-page"><div className="loading-state">Loading order details...</div></div>;
    if (error) return <div className="account-page"><div className="error-state">{error}<br/><br/><Link to="/account/orders" className="btn-primary">Back to Orders</Link></div></div>;
    if (!order) return null;

    return (
        <div className="account-page">
            <div className="order-details-header">
                <Link to="/account/orders" className="back-link">
                    <ChevronLeft size={20} /> Back to My Orders
                </Link>
                <h2>Order #{order.id}</h2>
                <div className="order-meta">
                    <span>Placed on {formatDate(order.created_at)}</span>
                    <span className="order-status-badge" data-status={order.status}>{order.status}</span>
                </div>
            </div>

            <div className="order-details-layout">
                <div className="order-items-section">
                    <h3>Items Ordered</h3>
                    <div className="order-items-list">
                        {order.items?.map(item => (
                            <div key={item.id} className="order-item-card">
                                <div className="order-item-info">
                                    <h4>{item.product_name}</h4>
                                    <p className="order-item-variants">
                                        {item.variant_size && `Size: ${item.variant_size} `}
                                        {item.variant_color && `| Color: ${item.variant_color}`}
                                        {item.variant_sku && ` | SKU: ${item.variant_sku}`}
                                    </p>
                                </div>
                                <div className="order-item-price-qty">
                                    <p className="item-price">Rs. {Number(item.price_at_purchase).toFixed(2)}</p>
                                    <p className="item-qty">Qty: {item.quantity}</p>
                                </div>
                                <div className="order-item-total">
                                    Rs. {(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="order-totals-section">
                        <div className="total-row grand-total">
                            <span>Total Amount</span>
                            <span>Rs. {Number(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="order-info-section">
                    <div className="info-card">
                        <h3>Shipping Address</h3>
                        <p>{order.customer_name}</p>
                        <p>{order.delivery_address}</p>
                        <p>{order.delivery_city}, {order.delivery_state}</p>
                        <p>{order.delivery_pincode}</p>
                    </div>
                    <div className="info-card">
                        <h3>Contact Information</h3>
                        <p>{order.customer_email}</p>
                        <p>{order.customer_phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrderDetails;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Package, User, LogOut, ChevronRight } from 'lucide-react';

const MyOrders = () => {
    const { logout, customerToken } = useCustomerAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient('/customer/orders', {
                    headers: { 'Authorization': `Bearer ${customerToken}` }
                });
                if (response.success) {
                    setOrders(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        if (customerToken) {
            fetchOrders();
        }
    }, [customerToken]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="account-page">
            <div className="storefront-page-header">
                <h2>My Orders</h2>
            </div>

            <div className="account-layout">
                <div className="account-sidebar">
                    <nav className="account-nav">
                        <Link to="/account" className="account-nav-link">
                            <User size={18} /> Profile Overview
                        </Link>
                        <Link to="/account/orders" className="account-nav-link active">
                            <Package size={18} /> My Orders
                        </Link>
                        <button onClick={logout} className="account-nav-link logout-btn">
                            <LogOut size={18} /> Logout
                        </button>
                    </nav>
                </div>

                <div className="account-content">
                    <div className="account-card">
                        {loading ? (
                            <div className="loading-state">Loading your orders...</div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : orders.length === 0 ? (
                            <div className="empty-orders-state">
                                <Package size={48} className="empty-icon" />
                                <h3>No Orders Yet</h3>
                                <p>You haven't placed any orders with us yet.</p>
                                <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-summary-card">
                                        <div className="order-summary-header">
                                            <div>
                                                <span className="order-label">Order</span>
                                                <span className="order-id">#{order.id}</span>
                                            </div>
                                            <div>
                                                <span className="order-label">Date</span>
                                                <span className="order-date">{formatDate(order.created_at)}</span>
                                            </div>
                                            <div>
                                                <span className="order-label">Total</span>
                                                <span className="order-total">Rs. {Number(order.total_amount).toFixed(2)}</span>
                                            </div>
                                            <div className="order-status-badge" data-status={order.status}>
                                                {order.status}
                                            </div>
                                        </div>
                                        <div className="order-summary-footer">
                                            <Link to={`/account/orders/${order.id}`} className="view-order-link">
                                                View Details <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;

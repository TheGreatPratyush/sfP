import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Package, User, LogOut } from 'lucide-react';

const Account = () => {
    const { customer, logout } = useCustomerAuth();

    return (
        <div className="account-page">
            <div className="storefront-page-header">
                <h2>My Account</h2>
                <p>Welcome back, {customer?.name}</p>
            </div>

            <div className="account-layout">
                <div className="account-sidebar">
                    <nav className="account-nav">
                        <Link to="/account" className="account-nav-link active">
                            <User size={18} /> Profile Overview
                        </Link>
                        <Link to="/account/orders" className="account-nav-link">
                            <Package size={18} /> My Orders
                        </Link>
                        <button onClick={logout} className="account-nav-link logout-btn">
                            <LogOut size={18} /> Logout
                        </button>
                    </nav>
                </div>

                <div className="account-content">
                    <div className="account-card">
                        <h3>Account Details</h3>
                        <div className="account-details-grid">
                            <div className="detail-group">
                                <label>Name</label>
                                <p>{customer?.name}</p>
                            </div>
                            <div className="detail-group">
                                <label>Email</label>
                                <p>{customer?.email}</p>
                            </div>
                            <div className="detail-group">
                                <label>Phone</label>
                                <p>{customer?.phone || 'Not provided'}</p>
                            </div>
                            {customer?.address && (
                                <div className="detail-group full-width">
                                    <label>Default Address</label>
                                    <p>
                                        {customer.address}<br />
                                        {customer.city}, {customer.state} - {customer.pincode}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;

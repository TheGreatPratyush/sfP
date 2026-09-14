import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

const CustomerProtectedRoute = () => {
    const { customer, isLoading } = useCustomerAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="storefront-page-header">
                <p>Loading account...</p>
            </div>
        );
    }

    if (!customer) {
        return <Navigate to="/login" state={{ returnTo: location.pathname }} replace />;
    }

    return <Outlet />;
};

export default CustomerProtectedRoute;

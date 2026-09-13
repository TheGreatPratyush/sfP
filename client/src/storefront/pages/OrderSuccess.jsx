import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    
    // If user navigates here directly without placing an order
    if (!location.state || !location.state.orderId) {
        return <Navigate to="/" replace />;
    }

    const { orderId } = location.state;

    return (
        <div className="order-success-page empty-state">
            <div className="empty-state__content">
                <CheckCircle size={64} color="#3ddc97" style={{ marginBottom: '20px' }} />
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase.</p>
                <p>Your order reference ID is: <strong>{orderId}</strong></p>
                <Link to="/shop" className="btn-secondary" style={{ marginTop: '20px', display: 'inline-block' }}>Continue Shopping</Link>
            </div>
        </div>
    );
};

export default OrderSuccess;

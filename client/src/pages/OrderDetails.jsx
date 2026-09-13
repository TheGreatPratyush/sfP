import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Package, Activity } from "lucide-react";

import { getOrderById, updateOrderStatus } from "../api/orders.api";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import StatusBadge from "../components/common/StatusBadge";

import "./OrderDetails.css";

const OrderDetails = () => {
    const { id: orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Status management state
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    // Cancellation confirmation state
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getOrderById(orderId);
            setOrder(response.data);
            setSelectedStatus(response.data.status);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleStatusUpdate = async () => {
        if (!selectedStatus || selectedStatus === order.status) {
            return;
        }

        if (selectedStatus === "cancelled") {
            setCancelDialogOpen(true);
            return;
        }

        await processStatusUpdate(selectedStatus);
    };

    const processStatusUpdate = async (statusToApply) => {
        try {
            setUpdatingStatus(true);
            await updateOrderStatus(orderId, statusToApply);
            
            // Refresh order after successful update
            await fetchOrder();
        } catch (err) {
            alert(err.message || "Failed to update order status");
            // Reset dropdown to current actual status on failure
            setSelectedStatus(order.status);
        } finally {
            setUpdatingStatus(false);
            setCancelDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <section className="order-details-page">
                <LoadingState message="Loading order details..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="order-details-page">
                <ErrorState
                    message={error.message || "Unable to load order details."}
                    onRetry={fetchOrder}
                />
            </section>
        );
    }

    if (!order) {
        return (
            <section className="order-details-page">
                <ErrorState
                    message="Order not found."
                    onRetry={() => navigate("/orders")}
                />
            </section>
        );
    }

    const isTerminal = order.status === "completed" || order.status === "cancelled";

    return (
        <section className="order-details-page">
            <div className="order-details-page__topbar">
                <button
                    type="button"
                    className="order-details-page__back"
                    onClick={() => navigate("/orders")}
                >
                    <ArrowLeft size={16} strokeWidth={1.8} />
                    Back to orders
                </button>
            </div>

            <div className="order-details-page__header">
                <div>
                    <h1 className="order-details-page__title">Order #{order.id}</h1>
                    <p className="order-details-page__subtitle">
                        Placed on {new Date(order.created_at).toLocaleString("en-IN")}
                    </p>
                </div>
                <div>
                    <StatusBadge status={order.status} />
                </div>
            </div>

            <div className="order-details-page__content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    
                    {/* Items Section */}
                    <div className="order-section">
                        <h2 className="order-section__title">
                            <Package className="order-section__title-icon" size={18} />
                            Order Items
                        </h2>
                        
                        <div className="order-items-wrapper">
                            <table className="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Variant</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order.items || []).map((item) => {
                                        const price = Number(item.price_at_purchase || 0);
                                        const qty = Number(item.quantity || 0);
                                        const subtotal = price * qty;
                                        
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="order-items-table__product">
                                                        {item.product_name}
                                                    </div>
                                                    <div className="order-items-table__meta">
                                                        SKU: {item.variant_sku || "N/A"}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="order-items-table__meta">
                                                        {item.variant_color && `Color: ${item.variant_color}`}
                                                        {item.variant_color && item.variant_size && ' | '}
                                                        {item.variant_size && `Size: ${item.variant_size}`}
                                                    </div>
                                                </td>
                                                <td className="order-items-table__price">
                                                    ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td>{qty}</td>
                                                <td className="order-items-table__price">
                                                    ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="order-details-page__totals">
                            <div className="order-details-page__total-row">
                                <span className="order-details-page__total-label">Total Amount:</span>
                                <span className="order-details-page__total-value">
                                    ₹{Number(order.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    
                    {/* Customer Section */}
                    <div className="order-section">
                        <h2 className="order-section__title">
                            <User className="order-section__title-icon" size={18} />
                            Customer Information
                        </h2>
                        
                        <div className="order-info-grid">
                            <div className="order-info-item">
                                <span className="order-info-item__label">Name</span>
                                <span className="order-info-item__value">{order.customer_name || "—"}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="order-info-item__label">Phone</span>
                                <span className="order-info-item__value">{order.customer_phone || "—"}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="order-info-item__label">Email</span>
                                <span className="order-info-item__value">{order.customer_email || "—"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Section */}
                    <div className="order-section">
                        <h2 className="order-section__title">
                            <MapPin className="order-section__title-icon" size={18} />
                            Delivery Information
                        </h2>
                        
                        <div className="order-info-grid">
                            <div className="order-info-item">
                                <span className="order-info-item__label">Address</span>
                                <span className="order-info-item__value">{order.delivery_address || "—"}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="order-info-item__label">City</span>
                                <span className="order-info-item__value">{order.delivery_city || "—"}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="order-info-item__label">State</span>
                                <span className="order-info-item__value">{order.delivery_state || "—"}</span>
                            </div>
                            <div className="order-info-item">
                                <span className="order-info-item__label">Pincode</span>
                                <span className="order-info-item__value">{order.delivery_pincode || "—"}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Management */}
                    <div className="order-section">
                        <h2 className="order-section__title">
                            <Activity className="order-section__title-icon" size={18} />
                            Manage Status
                        </h2>
                        
                        <div className="order-status-manager">
                            <select
                                className="order-status-manager__select"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                disabled={isTerminal || updatingStatus}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            
                            <button
                                type="button"
                                className="order-status-manager__action"
                                onClick={handleStatusUpdate}
                                disabled={isTerminal || updatingStatus || selectedStatus === order.status}
                            >
                                {updatingStatus ? "Updating..." : "Update Status"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation */}
            <ConfirmDialog
                open={cancelDialogOpen}
                title="Cancel Order?"
                message="Are you sure you want to cancel this order? This action cannot be undone and inventory will be automatically restored."
                confirmText="Yes, Cancel Order"
                cancelText="No, Keep It"
                loading={updatingStatus}
                onConfirm={() => processStatusUpdate("cancelled")}
                onCancel={() => {
                    setCancelDialogOpen(false);
                    setSelectedStatus(order.status);
                }}
            />
        </section>
    );
};

export default OrderDetails;

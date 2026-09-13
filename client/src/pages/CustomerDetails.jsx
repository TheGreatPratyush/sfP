import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Package, Eye, ChevronLeft, ChevronRight } from "lucide-react";

import { getCustomerById, getCustomerOrders } from "../api/customers.api";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";

import "./CustomerDetails.css";

const ORDERS_PER_PAGE = 5;

const CustomerDetails = () => {
    const { id: customerId } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [customerLoading, setCustomerLoading] = useState(true);
    const [customerError, setCustomerError] = useState(null);

    // Order History State
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [orderHistoryPage, setOrderHistoryPage] = useState(1);
    const [ordersPagination, setOrdersPagination] = useState({
        currentPage: 1,
        limit: ORDERS_PER_PAGE,
        totalItems: 0,
        totalPages: 0,
    });

    const fetchCustomer = useCallback(async () => {
        try {
            setCustomerLoading(true);
            setCustomerError(null);

            const response = await getCustomerById(customerId);
            setCustomer(response.data);
        } catch (err) {
            setCustomerError(err);
        } finally {
            setCustomerLoading(false);
        }
    }, [customerId]);

    const fetchOrders = useCallback(async (page) => {
        try {
            setOrdersLoading(true);
            setOrdersError(null);

            const response = await getCustomerOrders(customerId, {
                page,
                limit: ORDERS_PER_PAGE,
            });

            setOrders(response.data || []);
            setOrdersPagination(response.pagination || {
                currentPage: 1,
                limit: ORDERS_PER_PAGE,
                totalItems: 0,
                totalPages: 0,
            });
        } catch (err) {
            setOrdersError(err);
        } finally {
            setOrdersLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    useEffect(() => {
        // Only fetch orders if customer exists (avoiding unnecessary calls if customer load fails)
        if (customerId) {
            fetchOrders(orderHistoryPage);
        }
    }, [customerId, orderHistoryPage, fetchOrders]);


    if (customerLoading) {
        return (
            <section className="customer-details-page">
                <LoadingState message="Loading customer details..." />
            </section>
        );
    }

    if (customerError) {
        return (
            <section className="customer-details-page">
                <ErrorState
                    message={customerError.message || "Unable to load customer details."}
                    onRetry={fetchCustomer}
                />
            </section>
        );
    }

    if (!customer) {
        return (
            <section className="customer-details-page">
                <ErrorState
                    message="Customer not found."
                    onRetry={() => navigate("/customers")}
                />
            </section>
        );
    }

    return (
        <section className="customer-details-page">
            <div className="customer-details-page__topbar">
                <button
                    type="button"
                    className="customer-details-page__back"
                    onClick={() => navigate("/customers")}
                >
                    <ArrowLeft size={16} strokeWidth={1.8} />
                    Back to customers
                </button>
            </div>

            <div className="customer-details-page__header">
                <div>
                    <h1 className="customer-details-page__title">{customer.name}</h1>
                    <p className="customer-details-page__subtitle">
                        Customer ID #{customer.id}
                    </p>
                </div>
            </div>

            <div className="customer-details-page__content">
                
                {/* Customer Information */}
                <div className="customer-section">
                    <h2 className="customer-section__title">
                        <User className="customer-section__title-icon" size={18} />
                        Contact Information
                    </h2>
                    
                    <div className="customer-info-grid">
                        <div className="customer-info-item">
                            <span className="customer-info-item__label">Email</span>
                            <span className="customer-info-item__value">{customer.email || "—"}</span>
                        </div>
                        <div className="customer-info-item">
                            <span className="customer-info-item__label">Phone</span>
                            <span className="customer-info-item__value">{customer.phone || "—"}</span>
                        </div>
                    </div>
                </div>

                {/* Address Information */}
                <div className="customer-section">
                    <h2 className="customer-section__title">
                        <MapPin className="customer-section__title-icon" size={18} />
                        Current Address
                    </h2>
                    
                    <div className="customer-info-grid">
                        <div className="customer-info-item">
                            <span className="customer-info-item__label">Street Address</span>
                            <span className="customer-info-item__value">{customer.address || "—"}</span>
                        </div>
                        <div className="customer-info-item">
                            <span className="customer-info-item__label">City</span>
                            <span className="customer-info-item__value">{customer.city || "—"}</span>
                        </div>
                        <div className="customer-info-item">
                            <span className="customer-info-item__label">State</span>
                            <span className="customer-info-item__value">{customer.state || "—"}</span>
                        </div>
                        <div className="customer-info-item">
                            <span className="customer-info-item__label">Pincode</span>
                            <span className="customer-info-item__value">{customer.pincode || "—"}</span>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="customer-section">
                    <h2 className="customer-section__title">
                        <Package className="customer-section__title-icon" size={18} />
                        Order History
                    </h2>
                    
                    {ordersLoading && orders.length === 0 ? (
                        <LoadingState message="Loading order history..." />
                    ) : ordersError ? (
                        <ErrorState 
                            message={ordersError.message || "Unable to load order history."} 
                            onRetry={() => fetchOrders(orderHistoryPage)} 
                        />
                    ) : orders.length === 0 ? (
                        <EmptyState 
                            title="No orders found"
                            message="This customer has not placed any orders yet." 
                        />
                    ) : (
                        <>
                            <div className="owner-table-wrapper">
                                <table className="owner-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td style={{ fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                                                    #{order.id}
                                                </td>
                                                <td>
                                                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td style={{ fontVariantNumeric: "tabular-nums", fontWeight: "500" }}>
                                                    ₹{Number(order.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td>
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="customers-table__action"
                                                        title="View order details"
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                    >
                                                        <Eye size={16} strokeWidth={1.8} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {ordersPagination.totalPages > 1 && (
                                <div className="customer-history-pagination">
                                    <button
                                        type="button"
                                        className="customer-history-pagination__button"
                                        onClick={() => setOrderHistoryPage((p) => Math.max(1, p - 1))}
                                        disabled={orderHistoryPage === 1 || ordersLoading}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    <div className="customer-history-pagination__info">
                                        Page <strong>{ordersPagination.currentPage}</strong> of <strong>{ordersPagination.totalPages}</strong>
                                    </div>

                                    <button
                                        type="button"
                                        className="customer-history-pagination__button"
                                        onClick={() => setOrderHistoryPage((p) => Math.min(ordersPagination.totalPages, p + 1))}
                                        disabled={orderHistoryPage === ordersPagination.totalPages || ordersLoading}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </section>
    );
};

export default CustomerDetails;

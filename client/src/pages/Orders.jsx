import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

import useOrders from "../hooks/useOrders";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";

import "./Orders.css";

const ORDERS_PER_PAGE = 10;

const Orders = () => {
    const navigate = useNavigate();

    const {
        orders,
        pagination,
        loading,
        error,
        fetchOrders,
        changeStatus,
    } = useOrders();

    // Query State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data when parameters change
    useEffect(() => {
        fetchOrders({
            page: currentPage,
            limit: ORDERS_PER_PAGE,
            search: searchQuery || undefined,
            status: statusFilter || undefined,
            sortBy,
            sortOrder,
        });
    }, [currentPage, searchQuery, statusFilter, sortBy, sortOrder, fetchOrders]);

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1); // Reset page on search
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset page on filter
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value === "newest") {
            setSortBy("created_at");
            setSortOrder("DESC");
        } else if (value === "oldest") {
            setSortBy("created_at");
            setSortOrder("ASC");
        } else if (value === "highest_amount") {
            setSortBy("total_amount");
            setSortOrder("DESC");
        } else if (value === "lowest_amount") {
            setSortBy("total_amount");
            setSortOrder("ASC");
        }
        setCurrentPage(1); // Reset page on sort
    };

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setSortBy("created_at");
        setSortOrder("DESC");
        setCurrentPage(1);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await changeStatus(orderId, newStatus);
            // Refresh current page to see updated status
            fetchOrders({
                page: currentPage,
                limit: ORDERS_PER_PAGE,
                search: searchQuery || undefined,
                status: statusFilter || undefined,
                sortBy,
                sortOrder,
            });
        } catch (err) {
            alert(err.message || "Failed to update order status");
        }
    };

    const hasActiveFilters = Boolean(searchQuery || statusFilter || sortBy !== "created_at" || sortOrder !== "DESC");

    if (error) {
        return (
            <section className="orders-page">
                <ErrorState
                    message={error.message || "Unable to load orders."}
                    onRetry={() => fetchOrders({ page: currentPage, limit: ORDERS_PER_PAGE, search: searchQuery, status: statusFilter, sortBy, sortOrder })}
                />
            </section>
        );
    }

    const availableStatuses = ["pending", "confirmed", "processing", "shipped", "completed", "cancelled"];
    
    // Pagination helpers
    const startItem = orders.length === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1;
    const endItem = orders.length === 0 ? 0 : startItem + orders.length - 1;

    return (
        <section className="orders-page">
            <div className="orders-page__header">
                <div>
                    <p className="orders-page__eyebrow">Management</p>
                    <h1 className="orders-page__title">Orders</h1>
                    <p className="orders-page__description">
                        View and manage customer orders.
                    </p>
                </div>
            </div>

            <div className="orders-page__toolbar">
                <div className="orders-page__filters">
                    <div className="orders-page__search">
                        <SearchBar
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by Order ID, Customer Name, or Phone..."
                        />
                    </div>

                    <div className="orders-page__filter">
                        <select
                            value={statusFilter}
                            onChange={handleStatusChange}
                            aria-label="Filter by status"
                        >
                            <option value="">All Statuses</option>
                            {availableStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="orders-page__sort">
                        <select
                            value={sortBy === "created_at" && sortOrder === "DESC" ? "newest" : 
                                   sortBy === "created_at" && sortOrder === "ASC" ? "oldest" :
                                   sortBy === "total_amount" && sortOrder === "DESC" ? "highest_amount" : "lowest_amount"}
                            onChange={handleSortChange}
                            aria-label="Sort orders"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest_amount">Highest Amount</option>
                            <option value="lowest_amount">Lowest Amount</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="orders-page__clear-filters"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="orders-page__results">
                Showing <strong>{startItem}-{endItem}</strong> of <strong>{pagination.totalItems || 0}</strong> orders
            </div>

            <div className="orders-page__content">
                {loading && orders.length === 0 ? (
                    <LoadingState message="Loading orders..." />
                ) : orders.length === 0 ? (
                    <EmptyState
                        title={hasActiveFilters ? "No matches found" : "No orders yet"}
                        message={hasActiveFilters ? "Try adjusting your filters or search query." : "When customers place orders, they will appear here."}
                    />
                ) : (
                    <div className="owner-table-wrapper">
                        <table className="owner-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="orders-table__id">#{order.id}</td>
                                        <td>
                                            <span className="orders-table__date">
                                                {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="orders-table__customer">
                                                <span className="orders-table__customer-name">{order.customer_name}</span>
                                                <span className="orders-table__customer-phone">{order.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="orders-table__price">
                                                ₹{Number(order.total_amount).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <select 
                                                className="orders-table__status-select"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                disabled={order.status === 'completed' || order.status === 'cancelled'}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="orders-table__actions">
                                                <button
                                                    type="button"
                                                    className="orders-table__action"
                                                    title="View order details"
                                                    aria-label={`View order ${order.id}`}
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                >
                                                    <Eye size={16} strokeWidth={1.8} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="orders-page__pagination">
                    <button
                        type="button"
                        className="orders-page__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || loading}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="orders-page__pagination-info">
                        Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
                    </div>

                    <button
                        type="button"
                        className="orders-page__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={currentPage === pagination.totalPages || loading}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </section>
    );
};

export default Orders;

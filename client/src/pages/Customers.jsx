import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

import useCustomers from "../hooks/useCustomers";

import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SearchBar from "../components/common/SearchBar";

import "./Customers.css";

const CUSTOMERS_PER_PAGE = 10;

const Customers = () => {
    const navigate = useNavigate();

    const {
        customers,
        pagination,
        loading,
        error,
        fetchCustomers,
    } = useCustomers();

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchCustomers({
            page: currentPage,
            limit: CUSTOMERS_PER_PAGE,
            search: searchQuery || undefined,
        });
    }, [currentPage, searchQuery, fetchCustomers]);

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1); // Reset page on search
    };

    const clearFilters = () => {
        setSearchQuery("");
        setCurrentPage(1);
    };

    const hasActiveFilters = Boolean(searchQuery);

    if (error) {
        return (
            <section className="customers-page">
                <ErrorState
                    message={error.message || "Unable to load customers."}
                    onRetry={() => fetchCustomers({ page: currentPage, limit: CUSTOMERS_PER_PAGE, search: searchQuery })}
                />
            </section>
        );
    }

    const startItem = customers.length === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1;
    const endItem = customers.length === 0 ? 0 : startItem + customers.length - 1;

    return (
        <section className="customers-page">
            <div className="customers-page__header">
                <div>
                    <p className="customers-page__eyebrow">Management</p>
                    <h1 className="customers-page__title">Customers</h1>
                    <p className="customers-page__description">
                        View and manage your registered customers.
                    </p>
                </div>
            </div>

            <div className="customers-page__toolbar">
                <div className="customers-page__filters">
                    <div className="customers-page__search">
                        <SearchBar
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by name, email, or phone..."
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="customers-page__clear-filters"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="customers-page__results">
                Showing <strong>{startItem}-{endItem}</strong> of <strong>{pagination.totalItems || 0}</strong> customers
            </div>

            <div className="customers-page__content">
                {loading && customers.length === 0 ? (
                    <LoadingState message="Loading customers..." />
                ) : customers.length === 0 ? (
                    <EmptyState
                        title={hasActiveFilters ? "No matches found" : "No customers yet"}
                        message={hasActiveFilters ? "Try adjusting your search query." : "When customers register, they will appear here."}
                    />
                ) : (
                    <div className="owner-table-wrapper">
                        <table className="owner-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className="customers-table__id">#{customer.id}</td>
                                        <td>
                                            <span className="customers-table__name">{customer.name}</span>
                                        </td>
                                        <td>
                                            <span className="customers-table__contact">{customer.email || "—"}</span>
                                        </td>
                                        <td>
                                            <span className="customers-table__contact">{customer.phone || "—"}</span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="customers-table__action"
                                                title="View customer details"
                                                aria-label={`View customer ${customer.id}`}
                                                onClick={() => navigate(`/customers/${customer.id}`)}
                                            >
                                                <Eye size={16} strokeWidth={1.8} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="customers-page__pagination">
                    <button
                        type="button"
                        className="customers-page__pagination-button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || loading}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="customers-page__pagination-info">
                        Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
                    </div>

                    <button
                        type="button"
                        className="customers-page__pagination-button"
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

export default Customers;

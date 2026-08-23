import {
    Eye,
    Package,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    ChevronsUpDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./ProductTable.css";

const ProductTable = ({
    products = [],
    onEdit,
    onDelete,
    sortConfig = {
        key: null,
        direction: null,
    },
    onSort,
}) => {
    const navigate = useNavigate();

    /*
     * Sorting is handled by Products.jsx.
     *
     * ProductTable is now responsible only for:
     * - displaying products
     * - displaying sorting controls
     * - sending the selected sort back to Products.jsx
     */

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return (
                <ChevronsUpDown
                    size={13}
                    strokeWidth={1.8}
                />
            );
        }

        if (sortConfig.direction === "asc") {
            return (
                <ArrowUp
                    size={13}
                    strokeWidth={1.8}
                />
            );
        }

        return (
            <ArrowDown
                size={13}
                strokeWidth={1.8}
            />
        );
    };

    const renderSortableHeader = (
        label,
        key
    ) => {
        const isActive =
            sortConfig.key === key;

        return (
            <th>
                <button
                    type="button"
                    className={`product-table__sort-button ${
                        isActive
                            ? "product-table__sort-button--active"
                            : ""
                    }`}
                    onClick={() =>
                        onSort?.(key)
                    }
                    title={`Sort by ${label}`}
                >
                    <span>{label}</span>

                    {renderSortIcon(key)}
                </button>
            </th>
        );
    };

    if (products.length === 0) {
        return (
            <div className="product-table__empty">
                <div className="product-table__empty-icon">
                    <Package
                        size={20}
                        strokeWidth={1.8}
                    />
                </div>

                <h3 className="product-table__empty-title">
                    No products found
                </h3>

                <p className="product-table__empty-text">
                    Products you add to your store
                    will appear here.
                </p>
            </div>
        );
    }

    return (
        <section className="product-table">
            <div className="product-table__header">
                <div>
                    <p className="product-table__eyebrow">
                        Catalog
                    </p>

                    <h2 className="product-table__title">
                        Products
                    </h2>
                </div>

                <span className="product-table__count">
                    {products.length}{" "}
                    {products.length === 1
                        ? "product"
                        : "products"}
                </span>
            </div>

            <div className="product-table__wrapper">
                <table className="product-table__table">
                    <thead>
                        <tr>
                            {renderSortableHeader(
                                "Product",
                                "name"
                            )}

                            {renderSortableHeader(
                                "Category",
                                "category"
                            )}

                            {renderSortableHeader(
                                "Price",
                                "price"
                            )}

                            {renderSortableHeader(
                                "Discount",
                                "discount"
                            )}

                            {renderSortableHeader(
                                "Status",
                                "status"
                            )}

                            {renderSortableHeader(
                                "Created",
                                "created"
                            )}

                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {products.map(
                            (product) => {
                                const status =
                                    String(
                                        product.status ||
                                            "unknown"
                                    ).toLowerCase();

                                return (
                                    <tr
                                        key={
                                            product.id
                                        }
                                    >
                                        <td>
                                            <div className="product-table__product">
                                                <div className="product-table__icon">
                                                    <Package
                                                        size={
                                                            16
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </div>

                                                <div className="product-table__product-info">
                                                    <span className="product-table__name">
                                                        {product.name ||
                                                            "Unnamed Product"}
                                                    </span>

                                                    <span className="product-table__id">
                                                        Product #
                                                        {
                                                            product.id
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="product-table__category">
                                                {product.category_name ||
                                                    "Uncategorized"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="product-table__price">
                                                ₹
                                                {Number(
                                                    product.price ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="product-table__discount">
                                                {Number(
                                                    product.discount_percentage ||
                                                        0
                                                ).toFixed(
                                                    2
                                                )}
                                                %
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`product-table__status product-table__status--${status}`}
                                            >
                                                <span className="product-table__status-dot" />

                                                {product.status ||
                                                    "Unknown"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="product-table__date">
                                                {product.created_at
                                                    ? new Date(
                                                          product.created_at
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="product-table__actions">
                                                {/* View */}
                                                <button
                                                    type="button"
                                                    className="product-table__action"
                                                    title="View product"
                                                    aria-label={`View ${product.name}`}
                                                    onClick={() =>
                                                        navigate(
                                                            `/products/${product.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye
                                                        size={
                                                            14
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    className="product-table__action"
                                                    title="Edit product"
                                                    aria-label={`Edit ${product.name}`}
                                                    onClick={() =>
                                                        onEdit?.(
                                                            product
                                                        )
                                                    }
                                                >
                                                    <Pencil
                                                        size={
                                                            14
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    className="product-table__action product-table__action--danger"
                                                    title="Delete product"
                                                    aria-label={`Delete ${product.name}`}
                                                    onClick={() =>
                                                        onDelete?.(
                                                            product
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            14
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ProductTable;
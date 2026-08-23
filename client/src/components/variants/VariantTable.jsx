import { Edit3, Package, Trash2 } from "lucide-react";

import "./VariantTable.css";

const VariantTable = ({
    variants = [],
    onEdit,
    onDelete,
}) => {
    if (variants.length === 0) {
        return (
            <div className="variant-table__empty">
                <div className="variant-table__empty-icon">
                    <Package size={20} strokeWidth={1.8} />
                </div>

                <h3 className="variant-table__empty-title">
                    No variants found
                </h3>

                <p className="variant-table__empty-text">
                    Product variants will appear here once they are added.
                </p>
            </div>
        );
    }

    return (
        <section className="variant-table">
            <div className="variant-table__header">
                <div>
                    <p className="variant-table__eyebrow">
                        Product Options
                    </p>

                    <h2 className="variant-table__title">
                        Variants
                    </h2>
                </div>

                <span className="variant-table__count">
                    {variants.length}{" "}
                    {variants.length === 1
                        ? "variant"
                        : "variants"}
                </span>
            </div>

            <div className="variant-table__wrapper">
                <table className="variant-table__table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Color</th>
                            <th>SKU</th>
                            <th>Price</th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {variants.map((variant) => (
                            <tr key={variant.id}>
                                <td>
                                    <div className="variant-table__product">
                                        <div className="variant-table__icon">
                                            <Package
                                                size={16}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="variant-table__product-info">
                                            <span className="variant-table__product-name">
                                                {variant.product_name ||
                                                    "Unknown Product"}
                                            </span>

                                            <span className="variant-table__product-id">
                                                Product #
                                                {variant.product_id ??
                                                    "—"}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="variant-table__value">
                                        {variant.size || "—"}
                                    </span>
                                </td>

                                <td>
                                    <span className="variant-table__value">
                                        {variant.color || "—"}
                                    </span>
                                </td>

                                <td>
                                    <span className="variant-table__sku">
                                        {variant.sku || "—"}
                                    </span>
                                </td>

                                <td>
                                    <span className="variant-table__price">
                                        ₹
                                        {Number(
                                            variant.price || 0
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
                                    <div className="variant-table__actions">
                                        <button
                                            type="button"
                                            className="variant-table__action"
                                            title="Edit variant"
                                            aria-label={`Edit variant ${
                                                variant.sku || variant.id
                                            }`}
                                            onClick={() =>
                                                onEdit?.(variant)
                                            }
                                        >
                                            <Edit3
                                                size={14}
                                                strokeWidth={1.8}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            className="variant-table__action variant-table__action--danger"
                                            title="Delete variant"
                                            aria-label={`Delete variant ${
                                                variant.sku || variant.id
                                            }`}
                                            onClick={() =>
                                                onDelete?.(variant)
                                            }
                                        >
                                            <Trash2
                                                size={14}
                                                strokeWidth={1.8}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default VariantTable;